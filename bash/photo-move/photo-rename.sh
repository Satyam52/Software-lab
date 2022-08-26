#!/bin/bash

# ________________________________________________________
# dir=$1
# #cwd=$(pwd)
# mkdir -p output
# if [[ -z $dir ]]; then
#     echo "Usage: photo-rename.sh path"
#     exit 1
# elif [[ ! -d "${dir}" ]]; then
#     echo "Directory does not exist."
#     exit 2
# else
#     # Copying File
#     files=$(ls *.jpg | grep "^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]")
#     for FILE in $files; do
#         cp "${FILE}" "output"
#     done

#     # Rename Part
#     cd output
#     cwd=$(pwd)
#     for FILE in $files; do
#         dd=${FILE:0:2}
#         mm=${FILE:2:2}
#         yyyy=${FILE:4:4}
#         name=${FILE:8:-4}
#         mv "${FILE}" "$dd-$mm-$yyyy-$name.jpg"
#     done
#     cd ..
# fi
# _________________________________________________________________________________________-

dir=$1
cwd=$(pwd)
mkdir -p output
if [[ -z $dir ]]; then
    echo "Usage: photo-rename.sh path"
    exit 1
elif [[ ! -d "${dir}" ]]; then
    echo "Directory does not exist."
    exit 2
else
    # Copying File
    cd $dir
    files=*.jpg
    for FILE in $files; do
        if [[ $FILE =~ ^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9] ]]; then
            cp "./${FILE}" "${cwd}/output"
        fi
    done

    # Rename Part
    cd $cwd/output
    cwd=$(pwd)
    for FILE in $files; do
        if [[ $FILE =~ ^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9] ]]; then
            dd=${FILE:0:2}
            mm=${FILE:2:2}
            yyyy=${FILE:4:4}
            name=${FILE:8:-4}
            ext=${FILE##*.}
            mv "./${FILE}" "./$yyyy-$mm-$dd-$name.${ext}"
        fi
    done
    cd ..
fi
