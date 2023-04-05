## RBOT-IO

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
npm uninstall --global rbot-io 
npm link
```

## Use commands:

### Test dualshock torque-delay-direction profile with console output:
```
rbotio-torque-delay-direction-dualshock-console
```

### Control dualshock torque-delay-direction profile with serial output (useful for controlling open loop spwm):
```
rbotio-torque-delay-direction-dualshock-serial
```

