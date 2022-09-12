#! /usr/bin/awk -f
BEGIN {
    MAX=0;
}

{
    if($4 ~ "/bin/false"){
        print $1;
        if($1>MAX){
            MAX=$1;
        }
    }
}

END{
    print MAX;
}