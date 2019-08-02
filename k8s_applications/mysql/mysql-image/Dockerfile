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

# make the mysql user the owner of the folder content
RUN chown -R mysql: /docker-entrypoint-initdb.d

# change access rights for mysql user
RUN chmod u+rwx /docker-entrypoint-initdb.d


EXPOSE 3306
EXPOSE 6379