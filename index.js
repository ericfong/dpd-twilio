/**
* Module dependencies
*/
var Resource = require('deployd/lib/resource');
var util = require('util');


/**
* Module setup.
*/
function Twilio() {
    Resource.apply( this, arguments );

    //require the Twilio module and create a REST client
    if (this.config.twilioAccountSid && this.config.twilioAuthToken) {
        this.twilio = require('twilio')(this.config.twilioAccountSid, this.config.twilioAuthToken);
    }
}
util.inherits( Twilio, Resource );

Twilio.prototype.clientGeneration = true;

Twilio.basicDashboard = {
    settings: [
    {
        name        : 'twilioAccountSid',
        type        : 'text',
        description : 'Twilio Account Sid'
    }, {
        name        : 'twilioAuthToken',
        type        : 'text',
        description : 'Twilio Auth Token'
    }, {
        name        : 'defaultFromTel',
        type        : 'text',
        description : 'Default From Tel'
    }, {
        name        : 'rootOrInternalOnly',
        type        : 'checkbox',
        description : 'Only allow root or internal scripts to send email'
    }, {
        name        : 'productionOnly',
        type        : 'checkbox',
        description : 'If on development mode, print emails to console instead of sending them'
    }]
};
Twilio.events = ["post"];




Twilio.prototype.handle = function ( ctx, next ) {

    if ( ctx.req && ctx.req.method !== 'POST' ) {
        return next();
    }

    if ( this.config.rootOrInternalOnly && (!ctx.req.internal && !ctx.req.isRoot) ) {
        return ctx.done({ statusCode: 403, message: 'Forbidden' });
    }

    var data = ctx.body || {};
    // to // Any number Twilio can deliver to
    // from, // A number you bought from Twilio and can use for outbound communication
    // body // body of the SMS message

    var errors = {};
    if (!data.to) {
        errors.to = '\'to\' is required';
    }
    if ( !data.body ) {
        errors.body = '\'body\' is required';
    }
    if ( Object.keys(errors).length ) {
        return ctx.done({ statusCode: 400, errors: errors });
    }

    // defaults
    if (!data.from) { data.from = this.config.defaultFromTel }


    var that = this;
    if (that.events.post) {
        that.events.post.run(ctx, {data:data}, function(err) {
            if (err) return ctx.done(err);
            that.sendMessage(ctx, data);
        });
    } else {
        that.sendMessage(ctx, data);
    }


    /*
    //Place a phone call, and respond with TwiML instructions from the given URL
    client.makeCall({

        to:'+16515556677', // Any number Twilio can call
        from: '+14506667788', // A number you bought from Twilio and can use for outbound communication
        url: 'http://www.example.com/twiml.php' // A URL that produces an XML document (TwiML) which contains instructions for the call

    }, function(err, responseData) {
    //executed when the call has been initiated.
    console.log(responseData.from); // outputs "+14506667788"
    });
    */
};


Twilio.prototype.sendMessage = function(ctx, data) {
    var env = this.options.server.options.env;
    if (this.config.productionOnly && env != 'production') {
        console.log('_______________________________________________');
        console.log('Simulate Twilio', data);
        console.log('```````````````````````````````````````````````');
        return ctx.done( null, { message : 'Simulated' } );
    }

    //Send an SMS text message
    this.twilio.sendMessage( data, function(err, responseData) { //this function is executed when a response is received from Twilio
        if (err) { // "err" is an error received during the request, if any
            console.error(err);
        }

        return ctx.done(err, responseData);
        // if (!err) { // "err" is an error received during the request, if any
        //
        //     // "responseData" is a JavaScript object containing data received from Twilio.
        //     // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        //     // http://www.twilio.com/docs/api/rest/sending-sms#example-1
        //
        //     console.log(responseData.from); // outputs "+14506667788"
        //     console.log(responseData.body); // outputs "word to your mother."
        //
        // } else {
        //     console.error(err);
        // }
    });
}


module.exports = Twilio;
