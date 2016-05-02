#!/bin/bash

for var in "$@"
do
  ./sgrep $var sorted-tracks.csv
done
