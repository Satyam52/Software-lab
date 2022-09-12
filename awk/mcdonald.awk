# #! /usr/bin/awk -f
# BEGIN {
#   FS=":"
# RHYME="Old McDonald had a farm ei-ei-o\nOn that farm he had a animal ei-ei-o\nWith a sound-sound here, sound-sound there\nHere a sound there a sound, everywhere sound-sound\n"
#   }
#   {
#     for(i=1;i<=NF;i++){
#       if(i==1){
#         ANIMAL=$i
#         gsub("animal",ANIMAL,RHYME);
#       }else{
#         SOUND=$i
#         gsub("sound",SOUND,RHYME);
#         printf("%s\n",RHYME);
#         gsub(ANIMAL,"animal",RHYME);
#         gsub(SOUND,"sound",RHYME);
#       }

#     }


#   }

#   END {
# printf("%s","Old McDonald had a farm ei-ei-o\n");
#     }


#! /usr/bin/awk -f
BEGIN {
  FS=":"
}

{
  RHYME="Old McDonald had a farm ei-ei-o\nOn that farm he had a animal ei-ei-o\nWith a sound-sound here, sound-sound there\nHere a sound there a sound, everywhere sound-sound\n"

   gsub("animal",$1,RHYME);
   gsub("sound",$2,RHYME);
   printf("%s\n",RHYME);   
}

END {
	printf("%s","Old McDonald had a farm ei-ei-o\n");
 }
