# #! /bin/bash
# OLD=$1
# NEW=$2
# filename=$3

# # sed -E "s/([ &*+-])$OLD(\W)/\1$NEW\2/g" $3
# # sed -E "s/([ &*+-^%/])a(\W)/\1p\2/g" a.c
# sed -r "s/(\W)a(\W)/\1p\2/g; s/(\W)a(\W)/\1p\2/g; s/^a(\W)/\p\1/g;" a.c
# # sed -E "s/(\W)$OLD(\W)/\1$NEW\2/g" $3

#! /bin/bash
OLD=$1
NEW=$2
file=$3

sed -r "s/(\W)$OLD(\W)/\1$NEW\2/g; s/(\W)$OLD(\W)/\1$NEW\2/g; s/^$OLD(\W)/$NEW\1/g" $file
