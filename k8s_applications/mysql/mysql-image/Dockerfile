FROM mysql:5.7

# https://stackoverflow.com/questions/29145370/how-can-i-initialize-a-mysql-database-with-schema-in-a-docker-container
ENV TESTVAR=BravoSteph 

ADD __dbinit.sh /docker-entrypoint-initdb.d
ADD _dbinit.sql /docker-entrypoint-initdb.d
ADD backup.sql /docker-entrypoint-initdb.d

# make the mysql user the owner of the folder content
RUN chown -R mysql: /docker-entrypoint-initdb.d

# change access rights for mysql user
RUN chmod u+rwx /docker-entrypoint-initdb.d

EXPOSE 3306