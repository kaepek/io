# KAEPEK-IO V2.0.0

Remote controller. Enabling IO to be piped from various inputs to different devices over network/serial communication ports.

## Install:

```
npm install
npm run build
npm link
```

## Relink (if package.json bin property has changed):

```
npm run build
npm ls --global
npm uninstall --global kaepek-io
npm link
```

or


```
npm run build
npm run relink
```

# Commands:

## kaepek-io-director command

CLI to enable directing various input / output streams.

### Configuration:

- Inputs sources (```-i``` or ```--source```):
    - dualshock
    - keyboard (optional configuration: `<smooth_analog?>`,`<smooth_motion?>`,`<joy_deadband?>`,`<move_deadband?>`)
    - network (configuration: `<host>`,`<port>`,`<protocol:'tcp'|'upd'>`)
- Control words (```-c``` or ```--control_word```):
    - null
    - start
    - stop
    - reset
    - thrustui16
    - directionui8
- Peripheral devices (```-p``` or ```--peripheral```):
    - console
    - network (configuration `<host>`,`<port>`,`<protocol:'tcp'|'upd'>`)
    - serial (optional configuration `<baud_rate?>`,`<path?>` defaults to baud_rate=5000000 and path=/dev/ttyACMX [where X is the lowest found device index])
- Outputs sinks (```-o``` or ```--sink```):
    - console
    - network (configuration `<host>`,`<port>`,`<protocol:'tcp'|'upd'>`)

### Example use:

```
kaepek-io-director -i keyboard -c stop start null -p console serial -o network=localhost,9000,udp console
```

This command example will setup a keyboard input source, it will moderate the stop, start and null control words, it will pipe the control words to both a serial device as well as logging the control words to console, finally it will redirect the output of the serial device to a network sink localhost:9000 via the udp protocol and it will also pipe the serial device output to the console.

### Combining arguments:

```
kaepek-io-director -i <input-source-1> <input-source-2> -c <control-word-1> <control-word-2> -p <peripheral-device-1> <peripheral-device-1> -o <output-sink-1> <output-sink-2>
```

or

```
kaepek-io-director --source <input-source-1> <input-source-2> --control_word <control-word-1> <control-word-2> --peripheral <peripheral-device-1> <peripheral-device-1> --sink <output-sink-1> <output-sink-2>
```

or 

```
kaepek-io-director -i <input-source-1> -i <input-source-2> -c <control-word-1> -c <control-word-2> -p <peripheral-device-1> -p <peripheral-device-1> -o <output-sink-1> -o <output-sink-2>
```

or

```
kaepek-io-director --source <input-source-1> --source <input-source-2> --control_word <control-word-1> --control_word <control-word-2> --peripheral <peripheral-device-1> --peripheral <peripheral-device-1> --sink <output-sink-1> --sink <output-sink-2>
```

### Optional fields (all else are required):

```
--sink or -o
```

### Element configuration

Elements which require configuration have their arguments seperated by a '=' delimeter, only for elements which need it. 

Network sink configuration example (with a console sink as well) e.g.
```
-o network=localhost,9000,udp console
```
or
```
--sink network=localhost,9000,udp console
```
or
```
-o network=localhost,9000,udp -o console
```
or
```
--sink network=localhost,9000,udp --sink console
```

## kaepek-io-netsend command

### Configuration:

- host ```-h``` or ```--host``` e.g. ```-h localhost```
- port ```-p``` or ```--port``` e.g. ```-p 9000```
- protocol ```-n``` or ```--protocol``` e.g. ```-n upd```
- word ```-w``` or ```---word``` e.g. ```thrustui16```
- data (optional only for words which require data) ```-d``` or ```--data``` e.g. ```-d 2```

### Example usage

```
kaepek-io-netsend -h localhost -p 8002 -n udp -w thrustui16 -d 2
```

This command will send the `thrustui16` control word with a thrust level of `2` via upd port `8002` to the host `localhost`. Note
for this command to do anything the director must be run with a input source of ```kaepek-io-director -i network=localhost,8002,udp <...other configs>``` which will capture and process the send word.

## kaepek-io-graph command

### Install

In order to use this command you must install bokeh globally via `pip install bokeh==2.4.3`.

### Configuration:

- address ```-a``` or ```--address``` e.g. ```-a localhost```
- port ```-p``` or ```--port``` e.g. ```-p 9008```
- config ```-c``` or ```--config``` e.g. ```-c ./lib/host/graphing/config.json```

### Example usage

```
kaepek-io-graph --address localhost --port 9008 --config ./lib/host/graphing/config.json
```

This command will open the bokeh graph server, the server will listen on address `localhost`, port `9008` via a `udp` socket. Incoming network ASCII data row is delimited by `,` for each data column. The graph server then parses the data using the provided config.json via the `"inputs"` config attribute which unpacks the line and finally it plots the data based on the `"plots"` config attribute. [Config example.](./lib/host/graphing/config.json)

Note that in order for this graph server to recieve any data then the director must have a network output sink to redirect peripheral output to the server. For the above example the following output sink should be added ```kaepek-io-director -o network=localhost,9008,udp <...other configs>```

# c++ lib

```

```