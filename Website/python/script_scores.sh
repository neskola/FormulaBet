#!/bin/bash

clear

echo "Inserting scores to data base " + $1

#python scores.py -r --gp 914 --gr=822,857,887,809,12,838 --qr=822,857,887,809,12,838 --fl 822 --fb $1
#python scores.py -r --gp 915 --gr=828,809,822,30,840,6 --qr=828,822,809,30,857,12 --fl 828 --fb $1
#python scores.py -r --gp 916 --gr='828,809,867,857,840,822' --qr=809,828,857,865,867,12 --fl '809' --fb $1
#python scores.py -r --gp 917 --gr='828,809,30,875,822,820' --qr='828,857,822,809,30,18' --fl '809' --fb $1
#python scores.py -r --gp 919 --gr='828,809,857,822,865,30' --qr='828,809,857,865,838,12' --fl '822' --fb $1
#python scores.py -r --gp 920 --gr='809,828,857,30,840,6' --qr='809,828,857,822,30,12' --fl '12' --fb $1
#python scores.py -r --gp 922 --gr='857,809,822,6,840,30' --qr='809,828,822,865,18,857' --fl '18' --fb $1
python scores.py -r --gp 923 --gr='809,828,865,18,30,867' --qr='18,865,809,30,857,899' --fl '828' --fb $1

#HAM, RIC, VET, ROS, ALO, MAS
echo "Done."

#HAM 828
#ROS 809
#HUL 840
#ALO 30
#BUT 6
#VET 822
#MAG 899
#BOT 865
#PER 867
#MAS 18
#RIC 857
#RAI 12
#VER 870
#KVY 906
#GRO 838



