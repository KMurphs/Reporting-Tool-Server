# Reporting-Tool-Server
Reporting Tool for Periseo, written as a microservice (Unit tested) and recorded in the database











## Creating, Uploading, Deploying anad Accessing application image on kubernetes (docker-for-desktop)


### Setting up image repository

A private repository has been created at cloud.canister.io. Therefore, the login credentials need to be saved to be used during image push and pull operations.

```
kubectl create secret docker-registry canister-cred --docker-server=cloud.canister.io:5000 --docker-username=kmurphs --docker-password="YourPassword" --docker-email=kibongesp@gmail.com
```

Create a repository for this app.
	-	On cloud.canister.io website, login.
	-	Create Repository and fill in comments.
	- 	After creation, Note push/pull syntax
```
docker pull cloud.canister.io:5000/kmurphs/reporting-tool-microservice
```


### Building and Pushing docker image of app

From the root folder in project folder (where the dockerfile sits):
```
docker build -t cloud.canister.io:5000/kmurphs/reporting-tool-microservice:latest -f Dockerfile .
```
and push image
```
docker push cloud.canister.io:5000/kmurphs/reporting-tool-microservice
```

#### Login in the Registry from the CLI

Before pushing the image, it might be necessary to login in the registry from the command line interface, then logout
```
docker login --username=kmurphs --password=<Your Password> cloud.canister.io:5000
docker push cloud.canister.io:5000/kmurphs/reporting-tool-microservice
docker logout cloud.canister.io:5000
```

Note that while building the image, it might be necessary to enforce that no cahe be used with the option ``--no-cache`` appended to the build instruction


### Make sure that the app is running

Note that -p indicates <The external port on which to access the server (localhost:60000)>:< the internal port specified in the application. The server listens at this port (5000)>
```
docker run -p 60000:5000 cloud.canister.io:5000/kmurphs/reporting-tool-microservice
```

Also note that it might be necessary to add the entry 
```
	"engines": {
		"node": "10.x"
	},
```
in your package.json

A .dockerignore file was created to exclude some folders when building the image. Its content looks like
```
# Node build artifacts
node_modules
npm-debug.log
```


### Creating the app deployment and exposing it on kubernetes

The folder k8s_applications\node contains the yaml file specifying the app deployment
```
kubectl apply -f k8s_applications\node\node.yml
```

Wait for the deployment to rollout
```
kubectl rollout status deployment reporting-tool
```

Now a get request at ``localhost:30000/version`` should yield:
```
{
    "version": "1.0.0",
    "name": "node application"
}
```














## Creating, Uploading, Deploying and Accessing mysql Database image on kubernetes (docker-for-desktop)


### Creating secrets for mysql use

This first secret is the normal user that will interact with the database
Before the database can be initialized, ``You need to specify one of MYSQL_ROOT_PASSWORD, MYSQL_ALLOW_EMPTY_PASSWORD and MYSQL_RANDOM_ROOT_PASSWORD``
```
kubectl create secret generic reporting-mysql-pass --from-file=./k8s/secrets/mysql_replicant_password --from-file=./k8s/secrets/mysql_root_password --from-file=./k8s/secrets/mysql_testeradmin_password --from-file=./k8s/secrets/mysql_tester_password
```


### Mysql Deployment, service, persistentVolume and persistentVolumeClaim

First of all, 
```
kubectl apply -f k8s_applications/mysql/mysql.yml
```


### Interacting with the Database

The database is located on the host identified by the `Service Name` in this case `reporting-mysql` accroding to the definition in mysql.yml

Create a database, and a table with an entry
```
kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never --  mysql -h reporting-mysql -p<YOUR MYSQL ROOT PASSWORD><<EOF
CREATE DATABASE test;
CREATE TABLE test.messages (message VARCHAR(250));
INSERT INTO test.messages VALUES ('hello');
EOF
```
The command above spins an ephemerial mysql pod/client to execute the mysql commands against our database service (reporting-mysql) and die.


View the database created content as root user
```
kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never --  mysql -h reporting-mysql -p<YOUR MYSQL ROOT PASSWORD> -e "SELECT * FROM test.messages"
```

View the database created content as another user
```
kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never --  mysql -h reporting-mysql -u <ANOTHER ALREADY CONFIGURED USER> -p<THE USER'S PASSWORD> -e "SELECT * FROM test.messages"
```














## [Creating a mysql master, and 2 replicas](https://kubernetes.io/docs/tasks/run-application/run-replicated-stateful-application/)

The idea is to use one master for write operations, and the 2 database replicas/slaves to handle read operations.
They will be configured to sync with the master and offload the master of read operations.
This will also ensures that database transaction are successfully commited by checking its status from the replicas.

The following will be based on this [kubernetes doc](https://kubernetes.io/docs/tasks/run-application/run-replicated-stateful-application/)


### Creating a config map

Config Maps are a way to inject configuration into future pods. This config map contains configuration for the master and the node. This deployment controller will decide during the pods creation which of the two configuration to inject.

```
kubectl apply -f k8s_applications/mysql/mysql-configmap.yml
```

> ... you want the master to be able to serve replication logs to slaves and you want slaves to reject any writes that don’t come via replication

### Exposing the mysql pods 

2 services must be created, one for the read operations and one for the master

```
kubectl apply -f k8s_applications/mysql/mysql-services.yml
```

> The Headless Service provides a home for the DNS entries that the StatefulSet controller creates for each Pod that’s part of the set. Because the Headless Service is named ``reporting-mysql``, the Pods are accessible by resolving ``<pod-name>.reporting-mysql`` from within any other Pod in the same Kubernetes cluster and namespace.

> The Client Service, called ``reporting-mysql-read``, is a normal Service with its own cluster IP that distributes connections across all MySQL Pods that report being Ready. The set of potential endpoints includes the MySQL master and all slaves.

> Note that only read queries can use the load-balanced Client Service. 
> Also, because there is only one MySQL master, clients should connect directly to the MySQL master Pod (through its DNS entry within the Headless Service) to execute writes.

### StatefulSet Deployment

A more complete treatment is given in [this doc](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/). But in brief, the traditional deployment won't work for us in this case and the StatefulSet address the problems we would have the traditional deployment:

**From [stackoverflow](https://stackoverflow.com/questions/41732819/why-statefulsets-cant-a-stateless-pod-use-persistent-volumes)**
> Yes, a regular pod can use a persistent volume. However, sometimes you have multiple pods that logically form a "group". Examples of this would be database replicas, ZooKeeper hosts, Kafka nodes, etc. In all of these cases there's a bunch of servers and they work together and talk to each other. What's special about them is that each individual in the group has an identity. For example, for a database cluster one is the master and two are followers and each of the followers communicates with the master letting it know what it has and has not synced. So the followers know that "db-x-0" is the master and the master knows that "db-x-2" is a follower and has all the data up to a certain point but still needs data beyond that.

In such situations you need a few things you can't easily get from a regular pod:
1.	A predictable name: you want to start your pods telling them where to find each other so they can form a cluster, elect a leader, etc. but you need to know their names in advance to do that. Normal pod names are random so you can't know them in advance.
2.	A stable address/DNS name: you want whatever names were available in step (1) to stay the same. If a normal pod restarts (you redeploy, the host where it was running dies, etc.) on another host it'll get a new name and a new IP address.
3.	A persistent link between an individual in the group and their persistent volume: if the host where one of your database master was running dies it'll get moved to a new host but should connect to the same persistent volume as there's one and only 1 volume that contains the right data for that "individual". So, for example, if you redeploy your group of 3 database hosts you want the same individual (by DNS name and IP address) to get the same persistent volume so the master is still the master and still has the same data, replica1 gets it's data, etc.
StatefulSets solve these issues because they provide (quoting from https://kubernetes.io/docs/concepts/abstractions/controllers/statefulsets/):
	-	Stable, unique network identifiers.
	-	Stable, persistent storage.
	-	Ordered, graceful deployment and scaling.
	-	Ordered, graceful deletion and termination.

I didn't really talk about (3) and (4) but that can also help with clusters as you can tell the first one to deploy to become the master and the next one find the first and treat it as master, etc.

As some have noted, you can indeed can some of the same benefits by using regular pods and services, but its much more work. For example, if you wanted 3 database instances you could manually create 3 deployments and 3 services. Note that you must manually create 3 deployments as you can't have a service point to a single pod in a deployment. Then, to scale up you'd manually create another deployment and another service. This does work and was somewhat common practice before PetSet/PersistentSet came along. Note that it is missing some of the benefits listed above (persistent volume mapping & fixed start order for example).

#### Building Customized mysql image

Before, we can deploy the statefulset, we need to create a custom image that grabs the exisiting mysql data and injects it inot the container during its creation.
There is a ``__dbinit.sh`` provided to handle some of these operations. But since the file was created under windows, ensure that you run ``dos2unix ./_dbinit.sh`` to convert windows end of line into linux end of lines.
A Dockerfile specifying the above has been created,
```
docker build -t cloud.canister.io:5000/kmurphs/reporting-mysql:latest -f k8s_applications\mysql\mysql-image\Dockerfile k8s_applications\mysql\mysql-image\
```

Ensure that a repository has been created as ``reporting-mysql`` on cloud.canister.io under user kmurphs.
The image can then be pushed
```
docker push cloud.canister.io:5000/kmurphs/reporting-mysql
```
The image can be checked to make sure everything is alright
```
docker run -p 63306:3306 --name mysql_temp -e MYSQL_ROOT_PASSWORD=<Your Password> cloud.canister.io:5000/kmurphs/reporting-mysql
docker exec -it mysql_temp bash
```
Once in the shell, the following commands will show the current status of the database and users. Compare against ``k8s\mysql-image\_dbinit.sql`` and ``k8s\mysql-image\backup.sql``
```
mysql -uroot -p$MYSQL_ROOT_PASSWORD
SELECT host, user, select_priv, update_priv, delete_priv, insert_priv, Repl_slave_priv, Repl_client_priv FROM mysql.user;
SHOW GRANTS;
SHOW GRANTS FOR tester;
SHOW GRANTS FOR tester;
SHOW GRANTS FOR replicant@"192.168.0.0/255.255.255.0";
SHOW GRANTS schemas;
SHOW TABLES FROM test_schema;
SELECT * FROM test_schema.test_summary_table;
```


#### Deploying the stateful set
```
kubectl apply -f k8s_applications/mysql/mysql-statefulset.yml
```


##### Sending traffic to our pods

###### To the master
kubectl run mysql-client --image=mysql:5.7 -i -t --rm --restart=Never -- \
mysql -h reporting-mysql-read -u tester -p<Tester Password>  -e "select * from test_schema.test_summary_table"

###### To the slaves
kubectl run mysql-client --image=mysql:5.7 -i -t --rm --restart=Never -- \
mysql -h reporting-mysql-read -u tester -p<Tester Password> -e "select * from test_schema.test_summary_table"


#### Accessing the database from the node app

Replace the mysql host address in the node app by the service name ``reporting-mysql-read`` will solve this.
Send a get request to the node app to see all the units in the database.
The get request at ``localhost:30000/units`` should yield:
```
{
    "3": {
        "TestSum_ID": 3,
        "Serial_Number": "39120000",
        "Modification_Strike": "0",
        "Log_TimeStamp": "2018/02/16 12:29:05",
        "Final_Pass_Fail": "FAIL",
        "Product_ID": 3,
        "Client_ID": 1,
        "Repair_ID": 0,
        "Batch_ID": 0
    },
    "4": {
        "TestSum_ID": 4,
        "Serial_Number": "39121234",
        "Modification_Strike": "0",
        "Log_TimeStamp": "2018/03/19 18:31:32",
        "Final_Pass_Fail": "FAIL",
        "Product_ID": 3,
        "Client_ID": 1,
        "Repair_ID": 0,
        "Batch_ID": 0
    },
    ...
}
```










## Configuring a ci-cd with jenkins


We need a custom image based on the official jenkins with added support for docker, kubectl. A Dockerfile to create such image was built in ``k8s_applications/jenkins/jenkins-image/Dockerfile``.

Build the image with 
```
docker build -t cloud.canister.io:5000/kmurphs/reporting-jenkins:latest -f k8s_applications/jenkins/jenkins-image/Dockerfile k8s_applications/jenkins/jenkins-image
```

Ensure that a repository has been created as ``reporting-jenkins`` on cloud.canister.io under user kmurphs.
The image can then be pushed
```
docker push cloud.canister.io:5000/kmurphs/reporting-jenkins
```

Then, a jenkins pods can be instanciated on the kubernetes along with its service, persistent volumes, persistent volumes claims, and RBAC.
```
kubectl apply -f k8s_applications/jenkins/jenkins.yaml
kubectl rollout status deployment/reporting-jenkins
```

Once the pods has started, the following can be used to obtain the secret needed for the activation of the jenkins container
```
$ kubectl get pods --selector=app=reporting-jenkins --output=jsonpath={.items..metadata.name}
> reporting-jenkins-6479df7474-fbhpr

$ kubectl exec -it reporting-jenkins-6479df7474-fbhpr cat /var/jenkins_home/secrets/initialAdminPassword
> 49d7cfae032e457bb08561434adaff53
```

Install recommended plugins, and create the first administrator.


### New Job
Create a new item, with name ``reporting-mysql`` as a ``Pipeline``. Press "OK"

Configure the job, choose a build trigger (TODO: script). Set the Pipeline Definition to ``Pipeline script from SCM``, set the SCM to ``git``. Under repository, add the http address of your scm repository (git repository) and then set the ``script path`` to ``point to the Jenkins file from the root of your repository``.


### Registry Credentials

Since we will have to push and pull images against our remote registry repository at ``cloud.canister.io`` we need to upload login details as secret/credentials for use during these operations. 
In Jenkins on the left, click on ``Credentials``, select the ``Jenkins`` store, then ``Global credentials (unrestricted)``, and ``Add Credentials`` on the left menu.
Kind ``Username with Password``, scope ``Global (Jenkins, nodes, items, all child items, etc)``. Enter your username ``kmurphs``, password ``<Your Password>``, id for these credentials e.g. ``canister-credentials`` and some description.

In the jenkinsfile, these credentials can be used with
```
    environment {
        REGISTRY_CREDS = credentials('canister-credentials')
    }
```

From thereon, if the environment is set as **REGISTRY_CREDS**, then the username can be accessed under ***REGISTRY_CREDS**_USR*** and the password ***REGISTRY_CREDS**_PSW***
Note: The internal structure of ***REGISTRY_CREDS*** is ``USERNAME:PASSWORD``


### Build the Job

Navigate to Jenkins home, select the ``reporting-mysql`` job, click on "Build" (or "Build with Parameters").





#### Step12

The following values must be entered precisely as indicated:
- Kind: `Kubernetes configuration (kubeconfig)`
- ID: `kenzan_kubeconfig`
- Kubeconfig: `From a file on the Jenkins master`
- specify the file path: `/var/jenkins_home/.kube/config`





npm install -g jflint
jflint -c k8s_applications\jenkins\jflint.config k8s_applications\jenkins\Jenkinsfile


http://localhost:30808/job/reporting-mysql/30/console