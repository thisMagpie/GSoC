#!/bin/bash

for i in *; do
  if [ -d $i ]; then
    cd $i;
    if test -d .git; then
      echo -n " " $i-; git describe; echo -n;
    fi
    cd ..
  fi
done
