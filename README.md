# dpd-twilio

## Description

Send SMS via Twilio. You should create your account in Twilio first.

## Getting started
This module requires deployd ~0.7.0.

If you haven't used Deployd before, make sure to read the [documentation](http://docs.deployd.com/).

### Installation without package.json
````
npm install dpd-twilio
````

### Installation with package.json
If you have a package.json, you'll have to add this module in it.
````
npm install dpd-twilio --save
````
Once it is installed, Deployd will automatically load it.  
For more information about Modules, take a look at [the module page on the deployd documentation](http://docs.deployd.com/docs/using-modules/).

## The dpd-twilio module
### Overview

It is a simple [twilio](https://www.npmjs.org/package/twilio) wrapper for deployd

### Options/Settings

Require:
 - twilioAccountSid
 - twilioAuthToken
 - defaultFromTel

Please fill them in using the deployd dashboard config page of this module.


### Usage example

    // send a SMS to +123456789
    dpd.twilio.post({to:'+123456789', body:'Hello World!'});

## Contributing

Just send me a Pull Request in Github.

## Release history

 - 0.1.0: first version

## Contributors

[Eric Fong](https://github.com/ericfong)
