#!/bin/bash

for var in "$@"
do
  ./sgrep $var tracks.csv
done
