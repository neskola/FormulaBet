#!/bin/bash
convert $1.jpg -crop 960x1440+480+0 -resize 25% $1-resize.jpg
