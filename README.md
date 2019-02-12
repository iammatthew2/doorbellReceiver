# doorbellSender

This app is the sender part of doorbellReceiver. These are a pair of
apps used to trigger an event emitted from one [raspberry pi](https://www.raspberrypi.org/) to another
without regards for what network they are running on. Azure IoT hub is
the connection point for both apps. There are surely simpler options, namely
running an Express Server - but the approach taken here does not require an
exposed port and is provides a chance to play with Azure.

doorbellSender is written in [Typescript](https://www.typescriptlang.org/) running on Node.js.

## What does it do

doorbellSender is a tiny app that simply listens for a button press
and fires an http request on that event. It also lights up an LED
for a brief period after the button press. While the LED is on
there are no button press events fired.

### Parts list

- Raspberry Pi: I'm using a Raspberry Pi 3 Model B+, but this should work an any that can run Node.js, including [Raspberry Pi Zero WH](https://www.adafruit.com/product/3708) (the smart option)
- Raspberry Pi enclosure: I've skipped this for now
- button: [something with a built-in LED](https://www.adafruit.com/product/1440) is nice
- button enclosure: [this](https://www.amazon.com/gp/product/B0054G6KBI) is what I'm using to hold the button but there are [more clever options](https://www.google.com/search?q=altoids+button+enclosure&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjsqIPJ-ZLeAhXMJTQIHRqvAEUQ_AUIDygC&biw=1280&bih=667)
- wire: used to connect the button to the Raspberi Pi.

## How to use doorbellSender

This app can be setup very quickly to have it hitting a dummy url. I recommend running it
first on your pc/mac and then porting it to your Raspberry Pi once you have it working.

- make sure you have node and yarn installed
- git clone this repo
- create a file `.env` in the top-level directory of your app
- in `.env` two lines like so populated with your target url details:
  - TARGET_URL_BASE=BASE_URL_HERE
  - TARGET_URL_PARAMS=/api/DoorBell-HttpTrigger?code=oSla/iXCyVJVdhpbUWhcbzZUHRa65pBCaeWDWnz7ViMYNh6cMJoEoQ==&name=backGate
- when running this on your Raspbery Pi, if you want to save the logs to disk be sure to set your NODE_ENV to `production`
- run the app: `yarn build && yarn start`

### How do you run this at startup

- try: <https://raspberrypi.stackexchange.com/questions/13743/how-to-run-a-script-node-js-at-startup>
- or: <https://weworkweplay.com/play/raspberry-pi-nodejs/>
- or: <https://stackoverflow.com/questions/21542304/how-to-start-a-node-js-app-on-system-boot#answer-21830512>
