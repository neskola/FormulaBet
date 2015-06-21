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
#python scores.py -r --gp 923 --gr='809,828,865,18,30,867' --qr='18,865,809,30,857,899' --fl '867' --fb $1
#python scores.py -r --gp 924 --gr='828,865,857,6,822,30' --qr='809,822,6,840,899,828' --fl '828' --fb $1
#python scores.py -r --gp 925 --gr='809,865,828,822,30,857' --qr='809,865,18,899,857,822' --fl '828' --fb $1
#python scores.py -r --gp 926 --gr='857,30,828,809,18,12' --qr='809,822,865,857,30,18' --fl '809' --fb $1
#python scores.py -r --season 2015 --gp 936 --gr='' --qr='828,809,018,822,012,865' --fl '' --fb $1
#python scores.py -r --season 2015 --gp 939 --gr='828,809,822,012,018,865' --qr='828,809,822,018,865,012' --fl '828' --fb $1
#python scores.py -r --season 2015 --gp 938 --gr='828,012,809,865,822,857' --qr='828,822,809,012,865,018' --fl '012' --fb $1
#python scores.py -r --season 2015 --gp 940 --gr='809,828,822,865,012,018' --qr='809,828,822,865,902,915' --fl '828' --fb $1
#python scores.py -r --season 2015 --gp 941 --gr='809,822,828,906,857,012' --qr='828,809,822,857,906,012' --fl '857' --fb $1
#python scores.py -r --season 2015 --gp 942 --gr='828,809,865,012,822,018' --qr='828,809,012,865,838,869' --fl '012' --fb $1
python scores.py -r --season 2015 --gp 943 --gr='' --qr='828,809,822,018,840,865' --fl '' --fb $1

echo "Done."

echo "HAM 828, ROS 809, HUL 840, ALO 030, BUT 006, VET 822, MAG 899, BOT 865, PER 867"
echo "MAS 018, RIC 857, RAI 012, VES 915, KVY 906, GRO 838, SAI 902, MAL 869"

