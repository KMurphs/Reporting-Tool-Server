#!/bin/bash 

set -ex
[[ "reporting-tool-10-52" =~ -([0-9]+)$ ]] || exit 1
ordinal=${BASH_REMATCH[1]}

if [[ $ordinal -eq 0  ]]
then
	test="pass"
else
	test="fail"
fi


mysql -h 127.0.0.1 -p $MYSQL_ROOT_PASSWORD -e 'SELECT 1;'