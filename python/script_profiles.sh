#!/bin/bash

clear

echo "Inserting users to data base " + $1

python profiles.py -a -i --user niki   --name "Niki Eskola"      --password n3sk0la   --email neskola@gmail.com         --bank "FI70 5790 2620 0618 86" --fb $1
python profiles.py -a -i --user ilkka  --name "Ilkka Eskola"     --password f1rengas  --email ilkka.eskola@pp4.inet.fi  --bank "FI23 5358 0640 0077 68" --fb $1
python profiles.py -a -x --user petri  --name "Petri Eskola"     --password f1kukko   --email petri.eskola.pe@gmail.com --bank "FI82 5544 0740 0216 64" --fb $1
python profiles.py -a -x --user johan  --name "Johan Harvarsson" --password f1auto    --bank "FI09 8000 2917 9525 65" --fb $1
python profiles.py -a -x --user juha   --name "Juha Suomela"     --password f1anoppi  --bank "FI95 1124 3500 0230 34" --fb $1
python profiles.py -a -x --user noppa  --name "Pasi Nykänen"     --password f1omena   --bank "FI12 8000 2306 1356 81" --fb $1
python profiles.py -a -x --user markus --name "Markus Broman"    --password f1kello   --bank "FI93 8000 2116 9595 85" --fb $1
python profiles.py -a -x --user jukka  --name "Jukka Häkkinen"   --password f1ohitus  --bank "FI93 8000 2116 9595 85" --fb $1
python profiles.py -a -x --user jouko  --name "Jouko Peltola"    --password f1hippa   --bank "FI41 5419 0120 0506 99" --fb $1
python profiles.py -a -x --user juki   --name "Juki"             --password f1varikko --fb $1
python profiles.py -a -x --user pasi   --name "Pasi Björk"       --password f1puhelin --bank "FI21 5358 5440 0206 97" --fb $1
python profiles.py -a -x --user lauri  --name "Lauri Hyvönen"    --password f1tuuri --fb $1
python profiles.py -a -x --user unzki  --name "Anssi Liski"      --password oma       --bank "FI39 1124 3500 2673 18" --email egonomi@gmail.com --fb $1
python profiles.py -a -x --user tuukka --name "Tuukka Karhu"     --password oma       --email tuukkakarhu@yahoo.com --fb $1

echo "Done."

