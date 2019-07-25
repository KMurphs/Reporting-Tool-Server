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

The folder k8s contains the yaml file specifying the app deployment
```
kubectl apply -f k8s\node.yml
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
```
kubectl create secret generic mysql-user-pass --from-file=./k8s/secrets/mysql_user --from-file=./k8s/secrets/mysql_password
```

Before the database can be initialized, ``You need to specify one of MYSQL_ROOT_PASSWORD, MYSQL_ALLOW_EMPTY_PASSWORD and MYSQL_RANDOM_ROOT_PASSWORD``
```
kubectl create secret generic mysql-root-pass --from-file=./k8s/secrets/mysql_root_password
```

### Mysql Deployment, service, persistentVolume and persistentVolumeClaim

Run
```
kubectl apply -f k8s/mysql.yml
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
The command above spins an ephemerial mysql pod/client to execute the mysql commands and die.


View the database created content as root user
```
kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never --  mysql -h reporting-mysql -p<YOUR MYSQL ROOT PASSWORD> -e "SELECT * FROM test.messages"
```

View the database created content as another user
```
kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never --  mysql -h reporting-mysql -u <ANOTHER ALREADY CONFIGURED USER> -p<THE USER'S PASSWORD> -e "SELECT * FROM test.messages"
```