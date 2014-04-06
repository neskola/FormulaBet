#!/bin/bash

clear

echo "Inserting scores to data base " + $1

#python scores.py -r --gp 914 --gr=822,857,887,809,12,838 --qr=822,857,887,809,12,838 --fl 822 --fb $1
#python scores.py -r --gp 915 --gr=828,809,822,30,840,6 --qr=828,822,809,30,857,12 --fl 828 --fb $1
python scores.py -r --gp 916 --gr='828,809,867,857,840,822' --qr=809,828,857,865,867,12 --fl '809' --fb $1

echo "Done."

