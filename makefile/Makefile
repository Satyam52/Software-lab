# .SILENT:programEntry addition.o multiplication.o programEntry.o clean

# addition.o : addition.c

# multiplication.o : multiplication.c

# programEntry.o : programEntry.c addition.c multiplication.c
%.o : %.c
		cc -c $< -o $@

# programEntry : addition.o multiplication.o programEntry.o

.PHONY: clean
clean : 
		rm -f *.o programEntry

# print:
# 	echo ${obj_files}