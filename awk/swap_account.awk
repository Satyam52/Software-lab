#! /usr/bin/awk -f
BEGIN {
    OFS=" "
}

{
   TEMP=$2 
   $2=$3
   $3=TEMP 
   print $0;
}
