#!/bin/bash
for i in *.jpg ; do convert "$i" -crop 960x1440+480+0 -resize 25% "${i%-resize.*}" ; done
