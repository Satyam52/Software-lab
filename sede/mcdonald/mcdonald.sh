#! /bin/bash
para="Old McDonald had a farm ei-ei-o\nOn that farm he had a animal ei-ei-o\nWith a sound-sound here, sound-sound there\nHere a sound there a sound, everywhere sound-sound\n"
last_line="Old McDonald had a farm ei-ei-o"
while read line; do
    ANIMAL=$(echo $line | cut -d":" -f1)
    SOUND=$(echo $line | cut -d":" -f2)
    ans=$(echo $para | sed "s/animal/$ANIMAL/g; s/sound/$SOUND/g")
    echo -e $ans
done
echo $last_line
