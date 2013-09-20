for i in *; do (cd $i; if test -d .git; then echo -n $i-; git describe; else echo $i; fi); done
