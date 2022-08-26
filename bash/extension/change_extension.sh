#!bin/bash
# old_extension=$1
# new_extension=$2
# # files=$(ls *.$old_extension)
# cwd=$(pwd)
# # echo $files
# for FILE in *.$old_extension; do
#     # FILE_NAME=$(echo $FILE | tr -d '"')
#     # echo $FILE
#     # NEW_FILE_NAME=
#     mv "${cwd}/${FILE}" "${cwd}/${FILE%.$old_extension}.${new_extension}"
# done

# old_extension=$1
# new_extension=$2
# files=$(ls *.$old_extension)
# cwd=$(pwd)
# for FILE in $files; do
#     FILE_NAME=$(echo $FILE | cut -d"." -f1)
#     mv "${cwd}/${FILE}" "${cwd}/${FILE_NAME}.${new_extension}"
# done

old_extension=$1
new_extension=$2
cwd=$(pwd)
for FILE in *.$old_extension; do # Shell glob
    mv "${cwd}/${FILE}" "${cwd}/${FILE%.$old_extension}.${new_extension}"
done
