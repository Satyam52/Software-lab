#include<stdio.h>
#include "customFunction.h"

int main() {
  printf("Running programEntry.c");
  int res1 = mul(7,8);
  int res2 = sum(7, 8);
  printf("%d %d\n", res2, res1);
}