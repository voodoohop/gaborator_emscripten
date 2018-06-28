#!/bin/bash
cd "$(dirname "$0")"
em++ -std=c++11 -I. -ffast-math wrap_gaborator.cc --bind -s MODULARIZE=1 -s ALLOW_MEMORY_GROWTH=1 -o ../wrap_gaborator.js
cd -
