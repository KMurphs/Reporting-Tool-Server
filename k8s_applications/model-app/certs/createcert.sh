#!/usr/bin/env bash

# export VARNAME="my value" 
# configure openssl
# the openssl application on this pc shipped with anaconda
export OPENSSL_CONF="C:\Users\stephane.kibonge.PARSEC\AppData\Local\Continuum\anaconda3\Library\openssl.cnf"
echo $OPENSSL_CONF

openssl req -x509 -days 365 -newkey rsa:1024 -keyout hostkey.pem -nodes -out hostcert.pem

read -p "Press enter to continue"