#!/bin/bash

# Write a SINGLE LINE bash command to get the IP address of your linux
# machine's eth0 interface.  The output should correspond to the
# relevant line in the output of the ifconfig command.

# hostname -I | awk '{print $1}'

RESULT=$(hostname -I)
IP=$(echo $RESULT | cut -d" " -f1)
echo $IP
