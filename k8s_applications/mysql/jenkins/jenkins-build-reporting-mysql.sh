#!/usr/bin/env bash


# usage 
# ./k8s_applications/mysql/jenkins-build-reporting-mysql.sh "Because we can"


BUILD_CAUSE=${1?Error: no cause given}



# Details about job being triggered
JOB_NAME=reporting-mysql
JOB_TOKEN=8E584D84D78BD52CD944F69C85FF6

# Details about user triggering them
TRIGGER_USER_NAME=job_triggerer
TRIGGER_USER_TOKEN=11e8e9e79e617bf10bc5c62b70fe20437c



JENKINS_HOST=localhost:30808


echo "triggering remote job at: http://$TRIGGER_USER_NAME:$TRIGGER_USER_TOKEN@$JENKINS_HOST/job/$JOB_NAME/buildWithParameters?token=$JOB_TOKEN&cause=\"$BUILD_CAUSE\""
# curl -X POST http://$TRIGGER_USER_NAME:$TRIGGER_USER_TOKEN@$JENKINS_HOST/job/$JOB_NAME/buildWithParameters?token=$JOB_TOKEN&cause=\"$BUILD_CAUSE\"

curl http://$JENKINS_HOST/job/$JOB_NAME/buildWithParameters --user $TRIGGER_USER_NAME:$TRIGGER_USER_TOKEN --data token=$JOB_TOKEN --data cause="$BUILD_CAUSE"