from bokeh.models import CheckboxGroup, ColumnDataSource
from bokeh.layouts import column, row
from bokeh.plotting import curdoc, figure
import json
import socket
from pathlib import Path
import sys
import argparse
import os

parser=argparse.ArgumentParser()
cwd = os.getcwd()
current_dir_path = str(Path(__file__).parent.resolve())

# parse arguments
parser.add_argument("--address", "-a", help="Listen address")
parser.add_argument("--port", "-p", help="UDP listen port")
parser.add_argument("--config", "-c", help="JSON config file. See example in kaepek-io/lib/host/graphing/config.json")
args = vars(parser.parse_args())

# validate arguments
if args["address"] == None:
    print("NetGraph: missing argument --address or -a e.g. --address=localhost")
if args["port"] == None:
    print("NetGraph: missing argument --port or -p e.g. --port=5001")
if args["config"] == None:
    print("NetGraph: missing argument --config or -c e.g. --config=./kaepek-io/lib/host/graphing/config.json")
if (args["port"] == None or args["address"] == None or args["config"] == None):
    exit(1)
listen_address = args["address"]
listen_port = None
try:
    listen_port = int(args["port"])   
except Exception as error:
    print("NetGraph: bad argument --port or -p did not parse as an integer")
    exit(1)

# get config file path and load
full_config_path = cwd + "/" + args["config"]
try:
    config_file = open(full_config_path, "r")
except Exception as error:
    print("NetGraph: bad config path --config or -c: " + full_config_path)
    exit(1)
config_json = json.load(config_file)

# create column data structure
inputs_dict = dict()
for input in config_json["inputs"]:
    inputs_dict[input["name"]] = []
plot_data = ColumnDataSource(inputs_dict)

# get buffer length
buffer_length = config_json["buffer_length"]

# creating plots
doc = curdoc()
figs = []
for plot in config_json['plots']:
    print("Building plot", plot["name"])
    fig = figure(title=plot["name"], plot_width=2000, output_backend="webgl") # , y_range=(0, 200)
    x_axis = plot["independant_column"]
    for dependant_column in plot["dependant_columns"]:
        y_axis = dependant_column["name"]
        color = dependant_column["color"]
        fig.line(source=plot_data, x=x_axis, y=y_axis, color=color, legend_label=y_axis)
        fig.scatter(source=plot_data, x=x_axis, y=y_axis, color=color, legend_label=y_axis)
    figs.append(fig)

# todo enable disable plots via ui checkboxs
#https://discourse.bokeh.org/t/interactive-multi-line-graph-with-checkbox-widget-to-show-hide-lines-not-generating-graph-is-there-a-line-limit/8122

# add figures to document
doc = curdoc()
doc.add_root(column(*figs))

# bind to upd socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
try:
    sock.bind((listen_address, listen_port)) 
except Exception as error:
    print("NetGraph: failed to bind address and port combination, address: " + listen_address + ", port: " + str(listen_port))
    exit(1)

# tick method, recieve new bytes, build a stream object and send to the plot program.
def update():
    data_bytes, addr = sock.recvfrom(1024) # buffer size is 1024 bytes
    data_str = data_bytes.decode('utf-8')
    data_str_split = data_str.split(",")
    stream_obj = {}
    for input in config_json["inputs"]:
        input_name = input["name"]
        input_position = input["position"]
        try:
            relevant_data = float(data_str_split[input_position])
            if "scale" in input:
                relevant_data *= input["scale"]
        except Exception as error:
            relevant_data = 0.0
        stream_obj[input_name] = [relevant_data]
    plot_data.stream(stream_obj, rollover=buffer_length)
    doc.add_next_tick_callback(update)

# add callback for first tick
doc.add_next_tick_callback(update)