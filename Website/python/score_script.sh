#!/bin/bash

clear

echo "Inserting scores to data base " + $1

python scores.py -r --gp 914 --gr=822,857,887,809,12,838 --qr=822,857,887,809,12,838 --fl 822 --fb $1

echo "Done."

