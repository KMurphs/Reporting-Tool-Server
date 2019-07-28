#!/bin/bash 

# set -ex
echo Removing Temporary Pod
docker stop mysql_temp
docker rm mysql_temp