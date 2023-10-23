from bokeh.models import CheckboxGroup, ColumnDataSource, LinearAxis, Range1d
from bokeh.layouts import column, row
from bokeh.plotting import curdoc, figure
import json
import socket
from pathlib import Path
import sys
import argparse
import os
from bokeh.io import show, output_file, save

parser=argparse.ArgumentParser()
cwd = os.getcwd()
current_dir_path = str(Path(__file__).parent.resolve())

# parse arguments
parser.add_argument("--address", "-a", help="Listen address")
parser.add_argument("--port", "-p", help="UDP listen port")
parser.add_argument("--config", "-c", help="JSON config file. See example in kaepek-io/lib/host/graphing/config.json")
parser.add_argument("--buffer", "-b", help="Buffer length override")
parser.add_argument("--input_data_file", "-i", help="Input data file location, either use this or port/address combination.")

args = vars(parser.parse_args())

# validate arguments

# two modes either address/port or input_data_file

exit_flag = False
online_graphing = False

if args["address"] != None or args["port"] != None:
    if args["address"] == None:
        print("NetGraph: missing argument --address or -a e.g. --address=localhost")
        exit_flag = True
    if args["port"] == None:
        print("NetGraph: missing argument --port or -p e.g. --port=5001")
        exit_flag = True
    if args["input_data_file"] != None:
        print("NetGraph: provided input_data_file and address / port arguments. Need to choose either input_data_file or address and port.")
        exit_flag = True
    online_graphing = True

# both args[port] and args[address] are both None make sure we have an input_data_file

if args["input_data_file"] == None and (args["address"] == None or args["port"] == None):
    print("NetGraph: provided input_data_file or address / port arguments. Need to choose either --input_data_file (-i) or --address (-a) and --port (-p).")
    exit_flag = True

if exit_flag == True:
    exit(1)

if args["config"] == None:
    print("NetGraph: missing argument --config or -c e.g. --config=./kaepek-io/lib/host/graphing/config.json")
    exit(1)

print("args", args)

# get config file path and load
full_config_path = cwd + "/" + args["config"]

print("full_config_path", full_config_path)
config_json = None 
try:
    config_file = open(full_config_path, "r")
    config_json = json.load(config_file)
except Exception as error:
    print("NetGraph: bad config path or config path not json --config or -c: " + full_config_path + ":" + error)
    exit(1)

print("config_json", config_json)

# create column data structure
inputs_dict = dict()
for input in config_json["inputs"]:
    print("input", input)
    inputs_dict[input["name"]] = []
plot_data = ColumnDataSource(inputs_dict)

# get buffer length
buffer_length = None

if "buffer_length" in config_json:
    buffer_length = config_json["buffer_length"]

if (args["buffer"]):
    buffer_length = int(args["buffer"])

print("BUFFER LENGTH", buffer_length)


# get plot data if we are not in online graphing mode
plot_source = {}
plot_source_min = {}
plot_source_max = {}

if online_graphing is False:
    full_input_path = cwd + "/" + args["input_data_file"]
    full_output_path = cwd + "/" + args["input_data_file"] + ".html"
    input_data_file = None
    try:
        with open(full_input_path, "r") as fin:
            input_data_file = fin.read()
    except Exception as error:
        print("NetGraph: bad full_input_path --full_input_path or -i: " + full_input_path + ":" + error)
        exit(1)
    input_lines = input_data_file.splitlines()
    for input_line in input_lines:
        data_str_split = input_line.split(",")
        for input in config_json["inputs"]:
            input_name = input["name"]
            input_position = input["position"]
            try:
                relevant_data = float(data_str_split[input_position])
                if "scale" in input:
                    relevant_data *= input["scale"]
            except Exception as error:
                relevant_data = 0.0
            if input_name in plot_source:
                plot_source[input_name].append(relevant_data)
            else:
                plot_source[input_name] = [relevant_data]
            # find mins
            if input_name in plot_source_min:
                if relevant_data < plot_source_min[input_name]:
                    plot_source_min[input_name] = relevant_data
            else:
                plot_source_min[input_name] = relevant_data
            # find maxes
            if input_name in plot_source_max:
                if relevant_data > plot_source_max[input_name]:
                    plot_source_max[input_name] = relevant_data
            else:
                plot_source_max[input_name] = relevant_data
    print("plot_source", plot_source)

# creating plots
doc = curdoc()
figs = []
for plot in config_json['plots']:
    print("Building plot", plot["name"])
    fig = figure(title=plot["name"], plot_width=2000, output_backend="webgl") # , y_range=(0, 200)
    fig.extra_y_ranges = {}
    x_axis = plot["independant_column"]
    for dependant_column in plot["dependant_columns"]:
        # do we want a line or a scatter?
        scatter = True
        line = True
        if "line" in dependant_column:
            line = dependant_column["line"]
        if "scatter" in dependant_column:
            scatter = dependant_column["scatter"]
        y_axis = dependant_column["name"]
        color = dependant_column["color"]
        if "axis" in dependant_column:
            axis_min = None
            axis_max = None

            print("dependant_column", dependant_column)

            if online_graphing is False:
                # we can scan the data for the min and the max value
                axis_min = plot_source_min[dependant_column["name"]]
                axis_max = plot_source_max[dependant_column["name"]]

            if "min" in dependant_column["axis"]:
                axis_min = dependant_column["axis"]["min"]
            if "max" in dependant_column["axis"]:
                axis_max = dependant_column["axis"]["max"]


            fig.extra_y_ranges[y_axis] = Range1d(start=float(axis_min), end=float(axis_max))
            fig.add_layout(LinearAxis(y_range_name=y_axis, axis_label=y_axis), dependant_column["axis"]["location"])
            if line:
                fig.line(source=plot_data, x=x_axis, y=y_axis, color=color, legend_label=y_axis, y_range_name=y_axis)
            if scatter:
                fig.scatter(source=plot_data, x=x_axis, y=y_axis, color=color, legend_label=y_axis, y_range_name=y_axis)
        else:
            if line:
                fig.line(source=plot_data, x=x_axis, y=y_axis, color=color, legend_label=y_axis)
            if scatter:
                fig.scatter(source=plot_data, x=x_axis, y=y_axis, color=color, legend_label=y_axis)
        ##p.xaxis.axis_label = 'Time'
    fig.xaxis.axis_label = x_axis
    figs.append(fig)

# todo enable disable plots via ui checkboxs
#https://discourse.bokeh.org/t/interactive-multi-line-graph-with-checkbox-widget-to-show-hide-lines-not-generating-graph-is-there-a-line-limit/8122

# add figures to document
doc = curdoc()
doc.add_root(column(*figs))

# bind to upd socket

if args["port"]:
    listen_address = None
    listen_port = None
    try:
        listen_port = int(args["port"])   
        listen_address = args["address"]
    except Exception as error:
        print("NetGraph: bad argument --port or -p did not parse as an integer")
        exit(1)
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
        if buffer_length is not None:
            plot_data.stream(stream_obj, rollover=buffer_length)
        else:
            plot_data.stream(stream_obj)
        doc.add_next_tick_callback(update)

    # add callback for first tick
    doc.add_next_tick_callback(update)

else:
    # we have an input file data
    for input_name in plot_source:
        plot_data.data[input_name] = plot_source[input_name]
    print("plot_data", plot_data)

    output_file(filename=full_output_path, title=full_input_path)
    save(doc)