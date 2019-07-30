#!/bin/bash 

set -ex
# ordinal=$(mysql -h "127.0.0.1" -u tester -pTester321! -e "select count(*) from test_schema.test_summary_table;" | tail -1 | head -1)
# count=$( $res | grep -E "([0-9]+)" | sed "s/|//g")
# echo $?


#kubectl run mysql-client --image=mysql:5.7 -i -t --restart=Never --  mysql -h reporting-mysql-read -u tester -pTester321!  -e "select count(*) from test_schema.test_summary_table"


echo "Obtaining Logs from mysql client after test query"
res=$(kubectl logs mysql-client)

echo "Obtaining test result"
[[ $res =~ ([0-9]+) ]] || exit 1
count=${BASH_REMATCH[1]}
[[ $count -gt 100  ]] && exit 0