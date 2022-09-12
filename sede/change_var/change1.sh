#!/bin/bash
old_extension=$1
new_extension=$2
cwd=$(pwd)
for FILE in *.$old_extension; do # Shell glob
    mv "${cwd}/${FILE}" "${cwd}/${FILE%.$old_extension}.${new_extension}"
done
