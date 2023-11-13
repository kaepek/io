# KAEPEK-IO V4.1.0

IO controller. Enabling IO to be piped from various inputs to different devices over network/serial communication ports.

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

- host ```-a``` or ```--host``` e.g. ```-h localhost``` (defaults to 'localhost')
- port ```-p``` or ```--port``` e.g. ```-p 9000``` (defaults to '9000')
- protocol ```-n``` or ```--protocol``` e.g. ```-n upd``` (defaults to 'upd')
- word ```-w``` or ```---word``` e.g. ```thrustui16```
- data (optional only for words which require data) ```-d``` or ```--data``` e.g. ```-d 2```

### Example usage

```
kaepek-io-netsend -h localhost -p 8002 -n udp -w thrustui16 -d 2
```

This command will send the `thrustui16` control word with a thrust level of `2` via upd port `8002` to the host `localhost`. Note
for this command to do anything the director must be run with a input source of ```kaepek-io-director -i network=localhost,8002,udp <...other configs>``` which will capture and process the send word.

## kaepek-io-graph command

Performs realtime graphing from data coming from kaepek-io-direction (provided it has an output sink sending data to the program) given a config file which informs it how to read/plot the data.

### Install

In order to use this command you must install bokeh globally via `pip install bokeh==2.4.3`.

### Configuration:

- address ```-a``` or ```--address``` e.g. ```-a localhost```
- port ```-p``` or ```--port``` e.g. ```-p 9002```
- config ```-c``` or ```--config``` e.g. ```-c ./lib/host/graphing/config.json```

### Example usage

```
kaepek-io-graph --address localhost --port 9002 --config ./lib/host/graphing/config.json
```

This command will open the bokeh graph server, the server will listen on address `localhost`, port `9002` via a `udp` socket. Incoming network ASCII data row is delimited by `,` for each data column. The graph server then parses the data using the provided config.json via the `"inputs"` config attribute which unpacks the line and finally it plots the data based on the `"plots"` config attribute. [Config example.](./lib/host/graphing/config.json)

Note that in order for this graph server to recieve any data then the director must have a network output sink to redirect peripheral output to the server. For the above example the following output sink should be added ```kaepek-io-director -o network=localhost,9002,udp <...other configs>```

## kaepek-io-graph-file command

Program creates graphs from a csv file, given a config file which informs it how to read/plot the data and an output file where it will save the result.

### Install

In order to use this command you must install bokeh globally via `pip install bokeh==2.4.3`.

### Configuration:

- input data csv file location ```-i``` or ```--input_data_file``` e.g. ```./some-dir/some-file.csv```
- config ```-c``` or ```--config``` e.g. ```-c ./lib/host/graphing/config.json```

### Example usage

```
kaepek-io-graph-file -i ./some-dir/some-file.csv -c ./lib/host/graphing/config.json`
```

The outputed graph file for inspection would be `./some-dir/some-file.csv.html`

# c++ lib

The peripheral com lib SerialInputControl can be inherited from and an implementation of the ```process_host_control_word``` method to handle the control words can be defined like in the [example file](./lib/peripheral/com-test/com-test.ino)

```
#include "lib/comlib.cpp"

namespace kaepek
{
  /**
   * Dummy Base class
   */
  class BaseTester
  {
  public:
    BaseTester() {}
  };

  /**
   * ComTester a class to demonstrate the use of SerialInputControl
   */
  class ComTester : public BaseTester, public SerialInputControl<4>
  {
  private:
    /**
     * Method to handler control input recieved via the serial port
     * @param control_word The SerialInputCommandWord in question e.g. Start Stop Thrust1UI16
     * @param data_buffer Optional data buffer. Words which have values associated with them e.g. Thrust1UI16 has type bytes worth of data in the buffer.
     */
    void process_host_control_word(uint32_t control_word, uint32_t *data_buffer)
    {
      uint16_t com_torque_value = 0;
      float float_value = 0;
      switch (control_word)
      {
      case SerialInputCommandWord::Null:
        Serial.println("Recieved word Null");
        break;
      case SerialInputCommandWord::Start:
        Serial.println("Recieved word Start");
        break;
      case SerialInputCommandWord::Stop:
        Serial.println("Recieved word Stop");
        break;
      case SerialInputCommandWord::Reset:
        Serial.println("Recieved word Reset");
        break;
      case SerialInputCommandWord::Thrust1UI16:
        Serial.println("Recieved word Thrust1UI16");
        com_torque_value = (data_buffer[1] << 8) | data_buffer[0];
        Serial.print("Word value: ");
        Serial.println(com_torque_value);
        break;
      case SerialInputCommandWord::Direction1UI8:
        Serial.println("Recieved word Direction1UI8");
        Serial.print("Word value: ");
        Serial.println(data_buffer[0]);
        break;
      case SerialInputCommandWord::ProportionalF32:
        Serial.println("Recieved word ProportionalF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::IntegralF32:
        Serial.println("Recieved word IntegralF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::DerivativeF32:
        Serial.println("Recieved word DerivativeF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::Phase1F32:
        Serial.println("Recieved word Phase1F32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::Phase2F32:
        Serial.println("Recieved word Phase2F32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::Offset1F32:
        Serial.println("Recieved word Offset1F32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::Offset2F32:
        Serial.println("Recieved word Offset2F32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::SetPointF32:
        Serial.println("Recieved word SetPointF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::PowerLawSetPointDivisorCWF32:
        Serial.println("Recieved word PowerLawSetPointDivisorCWF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::PowerLawRootCWF32:
        Serial.println("Recieved word PowerLawRootCWF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::PowerLawSetPointDivisorCCWF32:
        Serial.println("Recieved word PowerLawSetPointDivisorCCWF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::PowerLawRootCCWF32:
        Serial.println("Recieved word PowerLawRootCCWF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::LinearSetpointCoefficientCWF32:
        Serial.println("Recieved word LinearSetpointCoefficientCWF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::LinearSetpointCoefficientCCWF32:
        Serial.println("Recieved word LinearSetpointCoefficientCCWF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::LinearBiasCW:
        Serial.println("Recieved word LinearBiasCW");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::LinearBiasCCW:
        Serial.println("Recieved word LinearBiasCCW");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      default:
        Serial.print("Recieved unknown word: ");
        Serial.println(control_word);
        break;
      }
    }

  public:
    /**
     * ComTester constructor, demostrates multiple inheritance
     */
    ComTester()
        : BaseTester(), SerialInputControl<4>()
    {
    }

    /**
     * Method to invoke the control input read method.
     */
    void run()
    {
      read_input();
    }
  };
}

// Create instance.
kaepek::ComTester device;

// Setup logic.
void setup()
{
}

// Loop logic.
void loop()
{
  device.run();
}
```

# Troubleshooting

If you get an installation error mentioning a build error for sbc/sbc.o along the lines of:

```
npm ERR! ../sbc/sbc.c:83:18: error: expected ‘(’ before ‘packed’
npm ERR!    83 | } __attribute__ (packed);
```

Make sure to modify the package.json file to specify the correct dualshock controller library that matches your platform:

For Windows:
```
  "dependencies": {
    "dualshock": "github:jk89/dualshock",
```

For Linux:

```
  "dependencies": {
    "dualshock": "github:jk89/dualshock-linux",
```

To disable it completely:

```
  "dependencies": {
    "dualshock": "github.com/jk89/dualshock-disable",
```

# How to prepare the Teensy40 platform:
- Install [Arduino IDE v1.8.19](https://www.arduino.cc/en/software)
- Install [Teensyduino v2.1.0](https://www.pjrc.com/teensy/teensyduino.html)

# General dependancies:

- [Arduino.h](https://github.com/arduino/ArduinoCore-avr)
- [imxrt.h](https://github.com/PaulStoffregen/cores/tree/master)
- [Dualshock driver](https://github.com/pecacheu/dualshock)
- [Serialport](https://github.com/serialport/node-serialport/blob/main/LICENSE)
- [Bokeh](https://github.com/bokeh/bokeh/blob/branch-3.4/LICENSE.txt)
- [Typed struct](https://github.com/sarakusha/typed-struct/blob/main/LICENSE)
- [Readline](https://www.npmjs.com/package/readline)
- [RxJs](https://github.com/ReactiveX/rxjs/blob/master/LICENSE.txt)
- [TS-Node](https://github.com/TypeStrong/ts-node/blob/main/LICENSE)
- [Chalk](https://github.com/chalk/chalk/blob/main/license)
- [Extensionless](https://github.com/barhun/extensionless/blob/main/LICENSE)
- [Cross env](https://github.com/kentcdodds/cross-env)