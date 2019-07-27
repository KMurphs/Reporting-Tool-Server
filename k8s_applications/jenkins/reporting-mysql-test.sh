#!/bin/bash 

# set -ex
# ordinal=$(mysql -h "127.0.0.1" -u tester -pTester321! -e "select count(*) from test_schema.test_summary_table;" | tail -1 | head -1)
# count=$( $res | grep -E "([0-9]+)" | sed "s/|//g")
# echo $?


# note that for the || operator, all expressions are performed until we see a success (a success, not a return of 1). If no success is ever encountered, the last expression is executed which is usually a "exit 1" expression
# note that for the && operator, all expressions are performed until we see a failure (a failure, not a return of 0). If no failure is ever encountered, the last expression is executed which is usually a "exit 0" expression

echo "Running a temporary mysql client pod to send a test query"
kubectl run mysql-client --image=mysql:5.7 -i -t --restart=Never --  mysql -h reporting-mysql-read -u tester -pTester321!  -e "select count(*) from test_schema.test_summary_table" || exit 1

echo "Obtaining Logs from mysql client after test query"
res=$(kubectl logs mysql-client) 

echo "Obtaining test result"
[[ $res =~ ([0-9]+) ]] || exit 1
count=${BASH_REMATCH[1]}
echo Found $count entries 

if [[ $count -gt 100  ]]
then
	echo Test Passed
	echo Removing Temporary Pod
	kubectl delete pod mysql-client
else
	echo Test Failed
	echo Removing Temporary Pod
	kubectl delete pod mysql-client
fi