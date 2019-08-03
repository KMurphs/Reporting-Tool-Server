FROM mysql:5.7
USER root

# https://stackoverflow.com/questions/29145370/how-can-i-initialize-a-mysql-database-with-schema-in-a-docker-container
# https://docs.docker.com/config/containers/multi-service_container/

ENV TESTVAR=BravoSteph 

ADD __dbinit.sh /docker-entrypoint-initdb.d
ADD _dbinit.sql /docker-entrypoint-initdb.d
ADD backup.sql /docker-entrypoint-initdb.d



RUN apt-get update 
RUN apt-get install redis-server --assume-yes
RUN cp /etc/redis/redis.conf /etc/redis/redis.default.conf
ADD redis.conf /etc/redis

# make the mysql user the owner of the folder content
RUN chown -R mysql: /docker-entrypoint-initdb.d
RUN chown -R mysql: /var/log/redis
RUN chown -R mysql: /etc/redis
RUN chown -R mysql: /var/lib/redis

# change access rights for mysql user
RUN chmod u+rwx /docker-entrypoint-initdb.d
RUN chmod u+rwx /var/log/redis/
RUN chmod u+rwx /etc/redis
RUN chmod u+rwx /var/lib/redis

USER mysql

EXPOSE 3306
EXPOSE 6379

# docker build -t cloud.canister.io:5000/kmurphs/reporting-mysql:latest -f k8s_applications\mysql\mysql-image\Dockerfile k8s_applications\mysql\mysql-image\
# docker run -p 63306:3306 -p 6379:6379 --name dbs_temp --net=testnetwork -e MYSQL_ROOT_PASSWORD=TestPasssword cloud.canister.io:5000/kmurphs/reporting-mysql