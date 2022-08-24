#!/bin/bash
# shellcheck disable=SC2125
files=`ls *.jpg | grep "^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]"`
for FILE in $files
do
#if [[ $FILE =~ ".jpg" ]]; then
#	echo $FILE 
#	echo $?
#fi
#mkdir output
cwd=`pwd`
echo "$FILE found" 
mv "${cwd}/${FILE}" "${cwd}/output"

done
