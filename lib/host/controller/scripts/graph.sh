#!/bin/bash
bokeh serve --port 8033 --show $(which kaepek-io-INTERNALS-graph.py) --args "$@"