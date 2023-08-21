from bokeh.models import CheckboxGroup, ColumnDataSource
from bokeh.layouts import column, row
from bokeh.plotting import curdoc, figure
import json
import socket
from pathlib import Path

current_dir_path = str(Path(__file__).parent.resolve())

myIp = "127.0.0.1"
myPort = 5001

config_file = open(current_dir_path + "/config.json", "r")
config_json = json.load(config_file)

inputs_dict = dict()
for input in config_json["inputs"]:
    inputs_dict[input["name"]] = []
plot_data = ColumnDataSource(inputs_dict)

buffer_length = config_json["buffer_length"]

print(inputs_dict)
doc = curdoc()
figs = []
for plot in config_json['plots']:
    print("building plot", plot["name"])
    fig = figure(title=plot["name"], plot_width=2000, output_backend="webgl") # , y_range=(0, 200)
    x_axis = plot["independant_column"]
    for dependant_column in plot["dependant_columns"]:
        y_axis = dependant_column["name"]
        color = dependant_column["color"]
        fig.line(source=plot_data, x=x_axis, y=y_axis, color=color, legend_label=y_axis)
    figs.append(fig)

#https://discourse.bokeh.org/t/interactive-multi-line-graph-with-checkbox-widget-to-show-hide-lines-not-generating-graph-is-there-a-line-limit/8122

doc = curdoc()
doc.add_root(column(*figs))

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) 
sock.bind((myIp, myPort))


def update():
    data_bytes, addr = sock.recvfrom(1024) # buffer size is 1024 bytes
    data_str = data_bytes.decode('utf-8')
    #print(data_str)
    # split by delimeter
    data_str_split = data_str.split(",")

    stream_obj = {}
    for input in config_json["inputs"]:
        input_name = input["name"]
        input_position = input["position"]
        try:
            relevant_data = float(data_str_split[input_position])
            if "scale" in input:
                print("scale", input["scale"])
                relevant_data *= input["scale"]
        except Exception as error:
            print(error)
            relevant_data = 0.0
        stream_obj[input_name] = [relevant_data]
    
    print("-----")
    print(stream_obj)
    print("----")
    #plot_data.patch(stream_obj)
    plot_data.stream(stream_obj, rollover=buffer_length)

    doc.add_next_tick_callback(update)

# add callback for first tick
doc.add_next_tick_callback(update)