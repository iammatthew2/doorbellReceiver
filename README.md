# doorbellSender

This app is the receiver part of [doorbellSender](https://github.com/iammatthew2/doorbellSender). These are a pair of
apps used to trigger an event emitted from one [raspberry pi](https://www.raspberrypi.org/) to another
without regards for what network they are running on. Azure IoT hub is
the connection point for both apps. There are simpler options, namely
running an Express Server - but the approach taken here does not require an
exposed port and is provides a chance to play with Azure.

doorbellReceiver is roughly written in [Typescript](https://www.typescriptlang.org/) running on Node.js.

## What does it do

doorbellReceiver relies on [Azure Hub direct method invocation](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-direct-methods) to trigger a set of chime sounds. A set of chron jobs mute the bell in the evening and un-mute the bell in the morning. The app is configured for two different bell trigger. See constants/requests for all api options.


## How to use doorbellReceiver

* Add two configs to as environmental variables - [dotenv](https://github.com/motdotla/dotenv) makes this easy:
  * AZURE_IOT_CONNECTION_STRING - see [Azure docs](https://docs.microsoft.com/en-us/azure/iot-hub/quickstart-control-device-node) for setup. This could use more documentation here
  * INSTRUMENTATION_KEY - see [Azure docs](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-resources-app-insights-keys?view=azure-bot-service-4.0) for setup. This could use more documentation here

* `$ npm install`
* `$ npm start`


### How do you run this at startup

Add this to `/etc/rc.local`: `su pi -c 'npm start --prefix ~/<pathToTheApp>/doorbellReceiver/'`