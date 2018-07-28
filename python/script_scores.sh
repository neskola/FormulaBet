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
#python scores.py -r --season 2015 --gp 943 --gr='809,828,018,822,865,840' --qr='828,809,822,018,840,865' --fl '809' --fb $1
#python scores.py -r --season 2015 --gp 944 --gr='828,809,822,018,865,906' --qr='828,809,018,865,012,822' --fl '828' --fb $1
#python scores.py -r --season 2015 --gp 946 --gr='822,906,857,915,030,828' --qr='828,809,822,857,012,865' --fl '857' --fb $1
#python scores.py -r --season 2015 --gp 947 --gr='828,809,838,906,867,018' --qr='828,809,865,838,867,857' --fl '809' --fb $1
#python scores.py -r --season 2015 --gp 948 --gr='828,822,018,865,012,867' --qr='828,012,822,809,018,865' --fl '828' --fb $1
#python scores.py -r --season 2015 --gp 949 --gr='822,857,012,809,865,906' --qr='822,857,012,906,828,809' --fl '857' --fb $1
#python scores.py -r --season 2015 --gp 950 --gr='828,809,822,012,865,840' --qr='809,828,865,822,018,012' --fl '828' --fb $1
#python scores.py -r --season 2015 --gp 951 --gr='828,822,867,018,012,906' --qr='809,828,865,822,012,840' --fl '822' --fb $1
#python scores.py -r --season 2016 --gp 955 --gr='809,828,822,857,018,838' --qr='828,809,822,012,915,018' --fl '857' --fb $1
#python scores.py -r --season 2016 --gp 957 --gr='809,012,828,857,838,915' --qr='828,809,822,012,857,865' --fl '809' --fb $1
#python scores.py -r --season 2016 --gp 958 --gr='809,822,906,857,012,018' --qr='809,857,012,822,865,906' --fl '840' --fb $1
#python scores.py -r --season 2016 --gp 959 --gr='809,828,012,865,018,030' --qr='809,822,865,012,018,857' --fl '809' --fb $1
#python scores.py -r --season 2016 --gp 960 --gr='915,012,822,857,865,902' --qr='828,809,857,915,012,822' --fl '906' --fb $1
#python scores.py -r --season 2016 --gp 961 --gr='828,857,867,822,030,840' --qr='857,809,828,822,840,012' --fl '828' --fb $1
#python scores.py -r --season 2016 --gp 962 --gr='828,822,865,915,809,012' --qr='828,809,822,857,915,012' --fl '809' --fb $1
#python scores.py -r --season 2016 --gp 963 --gr='809,822,867,012,828,865' --qr='809,867,857,822,012,018' --fl '809' --fb $1
#python scores.py -r --season 2016 --gp 964 --gr='828,915,012,809,857,006' --qr='828,809,840,822,006,012' --fl '828' --fb $1
#python scores.py -r --season 2016 --gp 965 --gr='828,809,915,857,012,867' --qr='828,809,915,857,012,822' --fl '809' --fb $1
#python scores.py -r --season 2016 --gp 966 --gr='828,809,857,822,915,012' --qr='809,828,857,915,822,902' --fl '012' --fb $1
#python scores.py -r --season 2016 --gp 967 --gr='828,857,915,809,822,012' --qr='809,828,857,915,012,822' --fl '857' --fb $1
#python scores.py -r --season 2016 --gp 968 --gr='809,857,828,840,867,822' --qr='809,915,012,822,857,867' --fl '828' --fb $1
#python scores.py -r --season 2016 --gp 969 --gr='809,828,822,012,857,865' --qr='828,809,822,012,865,857' --fl '030' --fb $1
#python scores.py -r --season 2016 --gp 970 --gr='809,857,828,012,822,915' --qr='809,857,828,915,012,902' --fl '857' --fb $1
#python scores.py -r --season 2016 --gp 971 --gr='857,915,809,012,865,867' --qr='828,809,915,857,822,012' --fl '809' --fb $1
#python scores.py -r --season 2016 --gp 972 --gr='809,915,828,822,012,857' --qr='809,828,012,822,915,857' --fl '822' --fb $1
#python scores.py -r --season 2016 --gp 973 --gr='828,809,857,822,030,902' --qr='828,809,857,915,012,822' --fl '822' --fb $1
#python scores.py -r --season 2016 --gp 974 --gr='828,809,915,822,857,012' --qr='828,809,915,857,840,012' --fl '857' --fb $1
#python scores.py -r --season 2016 --gp 975 --gr='828,809,915,867,822,902' --qr='828,809,012,915,822,857' --fl '915' --fb $1
#python scores.py -r --season 2016 --gp 976 --gr='828,809,822,915,857,012' --qr='828,809,857,012,822,915' --fl '822' --fb $1
#python scores.py -r --season 2017 --gp 1 --gr='VET,HAM,BOT,RAI,VES,MAS' --qr='HAM,VET,BOT,RAI,VES,GRO' --fl 'RAI' --fb $1
#python scores.py -r --season 2017 --gp 2 --gr='HAM,VET,VES,RIC,RAI,BOT' --qr='HAM,VET,BOT,RAI,RIC,MAS' --fl 'HAM' --fb $1
#python scores.py -r --season 2017 --gp 3 --gr='VET,HAM,BOT,RAI,RIC,MAS' --qr='BOT,HAM,VET,RIC,RAI,VES' --fl 'HAM' --fb $1
#python scores.py -r --season 2017 --gp 4 --gr='BOT,VET,RAI,HAM,VES,PER' --qr='VET,RAI,BOT,HAM,RIC,MAS' --fl 'RAI' --fb $1
#python scores.py -r --season 2017 --gp 5 --gr='HAM,VET,RIC,PER,OCO,HUL' --qr='HAM,VET,BOT,RAI,VES,RIC' --fl 'HAM' --fb $1
#python scores.py -r --season 2017 --gp 6 --gr='VET,RAI,RIC,BOT,VES,SAI' --qr='RAI,VET,BOT,VES,RIC,SAI' --fl 'PER' --fb $1
#python scores.py -r --season 2017 --gp 7 --gr='HAM,BOT,RIC,VET,PER,OCO' --qr='HAM,VET,BOT,RAI,VES,RIC' --fl 'HAM' --fb $1
#python scores.py -r --season 2017 --gp 8 --gr='RIC,BOT,STR,VET,HAM,OCO' --qr='HAM,BOT,RAI,VET,VES,PER' --fl 'VET' --fb $1
#python scores.py -r --season 2017 --gp 9 --gr='BOT,VET,RIC,HAM,RAI,GRO' --qr='BOT,VET,HAM,RAI,RIC,VES' --fl 'HAM' --fb $1
#python scores.py -r --season 2017 --gp 10 --gr='HAM,BOT,RAI,VES,RIC,HUL' --qr='HAM,RAI,VET,BOT,VES,HUL' --fl 'HAM' --fb $1
#python scores.py -r --season 2017 --gp 11 --gr='VET,RAI,BOT,HAM,VES,ALO' --qr='VET,RAI,BOT,HAM,VES,RIC' --fl 'ALO' --fb $1
#python scores.py -r --season 2017 --gp 12 --gr='HAM,VET,RIC,RAI,BOT,HUL' --qr='HAM,VET,BOT,RAI,VES,RIC' --fl 'VET' --fb $1
#python scores.py -r --season 2017 --gp 13 --gr='HAM,BOT,VET,RIC,RAI,OCO' --qr='HAM,VES,RIC,STR,OCO,BOT' --fl 'RIC' --fb $1
#python scores.py -r --season 2017 --gp 14 --gr='HAM,RIC,BOT,SAI,PER,PAL' --qr='VET,VES,RIC,RAI,HAM,BOT' --fl 'HAM' --fb $1
#python scores.py -r --season 2017 --gp 15 --gr='VES,HAM,RIC,VET,BOT,PER' --qr='HAM,RAI,VES,RIC,BOT,OCO' --fl 'VET' --fb $1
#python scores.py -r --season 2017 --gp 16 --gr='HAM,VES,RIC,BOT,RAI,OCO' --qr='HAM,BOT,VET,RIC,VES,RAI' --fl 'BOT' --fb $1
#python scores.py -r --season 2017 --gp 17 --gr='HAM,VET,VES,RAI,BOT,OCO' --qr='HAM,VET,BOT,RIC,RAI,VES' --fl 'VET' --fb $1
#python scores.py -r --season 2017 --gp 18 --gr='VES,BOT,RAI,VET,OCO,STR' --qr='VET,VES,HAM,BOT,RAI,OCO' --fl 'VET' --fb $1
#python scores.py -r --season 2017 --gp 19 --gr='VET,BOT,RAI,HAM,VES,RIC' --qr='BOT,VET,RAI,VES,RIC,PER' --fl 'VES' --fb $1
#python scores.py -r --season 2018 --gp 1 --gr='VET,HAM,RAI,RIC,ALO,VER' --qr='HAM,RAI,VET,VER,RIC,MAG' --fl 'RIC' --fb $1
#python scores.py -r --season 2018 --gp 2 --gr='VET,BOT,HAM,GAS,MAG,HUL' --qr='VET,RAI,BOT,HAM,RIC,GAS' --fl 'BOT' --fb $1
#python scores.py -r --season 2018 --gp 3 --gr='RIC,BOT,RAI,VER,HAM,HUL' --qr='VET,RAI,BOT,VER,GRO,HAM' --fl 'RIC' --fb $1
#python scores.py -r --season 2018 --gp 4 --gr='HAM,RAI,PER,VET,SAI,LEC' --qr='VET,HAM,BOT,RIC,VER,RAI' --fl 'BOT' --fb $1
#python scores.py -r --season 2018 --gp 5 --gr='HAM,BOT,VER,VET,RIC,MAG' --qr='HAM,BOT,VET,RAI,VER,RIC' --fl 'RIC' --fb $1
#python scores.py -r --season 2018 --gp 6 --gr='RIC,VET,HAM,RAI,BOT,OCO' --qr='RIC,VET,HAM,RAI,BOT,OCO' --fl 'VER' --fb $1
#python scores.py -r --season 2018 --gp 7 --gr='VET,BOT,VER,RIC,HAM,RAI' --qr='VET,BOT,VER,HAM,RAI,RIC' --fl 'VET' --fb $1
#python scores.py -r --season 2018 --gp 8 --gr='HAM,VER,RAI,RIC,VET,MAG' --qr='HAM,BOT,VET,VER,RIC,RAI' --fl 'BOT' --fb $1
#python scores.py -r --season 2018 --gp 9 --gr='VER,RAI,VET,GRO,MAG,OCO' --qr='BOT,HAM,VET,RAI,VER,GRO' --fl 'RAI' --fb $1
#python scores.py -r --season 2018 --gp 10 --gr='VET,HAM,RAI,BOT,RIC,HUL' --qr='HAM,VET,RAI,BOT,VER,RIC' --fl 'VET' --fb $1
#python scores.py -r --season 2018 --gp 11 --gr='HAM,BOT,RAI,VER,HUL,PER' --qr='VET,BOT,RAI,VER,MAG,GRO' --fl 'HAM' --fb $1
python scores.py -r --season 2018 --gp 12 --gr='' --qr='HAM,BOT,RAI,VET,SAI,GAS' --fl '' --fb $1

echo "Done."


