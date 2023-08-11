## KAEPEK-IO

Remote controller. Enabling IO to be piped from various inputs to different devices over network/serial communication ports.

## Inputs:

- dualshock
- udp

## Outputs:

- console
- serialport
- upd

## Install commands:

```
npm install
npm link
```

## Relink commands (if package.json bin property has changed):

```
npm ls --global
npm uninstall --global kaepek-io
npm link
```

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
