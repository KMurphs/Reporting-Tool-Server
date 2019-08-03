#!/bin/bash

# Use 
# dos2unix ./_dbinit.sh
# to prepare this file for linux consumption. (Issues with end of lines in win vs linux)
set -e
set -x



# whoami
# chmod +rwx docker-entrypoint-initdb.d
# ls -l docker-entrypoint-initdb.d
cd /docker-entrypoint-initdb.d/

echo "Listing folder content"
ls
# ls -l ./_dbinit.sql
# ls -l ./__dbinit.sh
# ls -l ./backup.sql

echo "Preparing the files"
sed -i "s/xxxtestxxx/$TESTVAR/g" ./_dbinit.sql
# sed -i 's/utf8mb4/utf8/g' ./backup.sql

# cat ./_dbinit.sql
# head -20 ./backup.sql

redis-server /etc/redis/redis.conf &

echo DONE >> temp.txt