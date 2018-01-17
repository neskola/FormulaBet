#!/bin/bash
for i in *.jpg ; do convert "$i" -resize 185x123 "${i%-resize.*}" ; done
