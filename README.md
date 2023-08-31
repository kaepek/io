# KAEPEK-IO

Remote controller. Enabling IO to be piped from various inputs to different devices over network/serial communication ports.

# Install commands:

```
npm install
npm link
```

# Relink commands (if package.json bin property has changed):

```
npm ls --global
npm uninstall --global kaepek-io
npm link
```

or


```
npm run relink
```

# Configuration

## Inputs sources:

- dualshock
- keyboard (optional configuration: <smooth_analog?>,<smooth_motion?>,<joy_deadband?>,<move_deadband?>)
- network (configuration: <host>,<port>,<protocol>)

## Control words:

- null
- start
- stop
- reset
- thrustui16
- directionui8

# Peripheral devices

- console
- network (configuration <host>,<port>,<protocol>)
- serial (optional configuration <baud_rate?>,<path?> defaults to baud_rate=5000000 and path=/dev/ttyACMX [where X is the lowest found device index])

## Outputs sinks:

- console
- network (configuration <host>,<port>,<protocol>)

# Commands

## Director

```
kaepek-io-director -i keyboard -c stop start null -p console serial -o network=localhost,9000,udp console
```

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

### Input source examples

- keyboard ```-i keyboard``` or ```--source=keyboard```
- dualshock ```-i dualshock``` or ```--source=dualshock```
- network ```-i network=<host>,<port>,<protocol>``` or ```--source network=<host>,<port>,<protocol>```

## Use commands:

### Test dualshock torque-delay-direction profile with console output:
```
kaepek-torque-delay-direction-dualshock-console
```

### Control dualshock torque-delay-direction profile with serial output (useful for controlling open loop spwm):
```
kaepek-torque-delay-direction-dualshock-serial
```

### Control dualshock torque-phase profile with console output:

```
kaepek-torque-phase-direction-dualshock-console
```

### Control dualshock torque-phase profile with serial output:

```
kaepek-torque-phase-direction-dualshock-serial
```

### Closed loop spwm speed control:

## Console
```
kaepek-ThrustU16LEDirectionU8Model-dualshock-console
```

## Serial
```
kaepek-ThrustU16LEDirectionU8Model-dualshock-serial
```

## Serial with graph
```
kaepek-ThrustU16LEDirectionU8Model-dualshock-serial-graph
```
