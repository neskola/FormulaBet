#!/bin/bash

clear

echo "Publish data to f1kaapo.firebaseio.com." 

python firebase.py -b --url https://test-f1kaapo.firebaseio.com/$1 --file $1$2-results.json

python firebase.py -u --url https://f1kaapo.firebaseio.com/$1.json --file $1$2-results.json

#./script_scores.sh test-f1kaapo

#while true; do
#    read -p "Do you want to update production data? y/N" yn
#    case $yn in 
#	[Yy]*) echo "Transfering data."; break;;
#	[Nn]*) exit;;
#	*) echo "Please answer yes or no";;
#    esac
#done

echo "Done."


