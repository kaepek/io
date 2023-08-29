#!/bin/sh
dir="$(pwd)/lib/host/graphing/plot.py" 
bokeh serve --port 8033 --show $dir --args "$@"