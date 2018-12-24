"use strict";

var data = require('./function');
const OD = data.OD;
var AR = data.AR.slice();
var Alexa = require("alexa-sdk");
var APP_ID = "amzn1.ask.skill.6c5eb149-28ad-42f3-b282-8334d672764e";


var handlers = {
   'LaunchRequest': function () {
    this.response.speak('Hey there, welcome to swim seed. The ultimate animal Swim game. What is your name?').listen("Can you please tell me your name?"); 
    this.emit(":responseReady");
   },
   'NameIntent': function () {
       this.handler.state = "_DECISION";
       this.attributes.name = slotValue(this.event.request.intent.slots.myname);
       this.response.speak(`Hello ${this.attributes['name']}, Lets test your knowledge about animals that can swim. Swim Seed will ask you list of words. it can me animal, bird or non living thing or any random thing, and you have to tell whether it can swim or not. you will be responding with either yes or no. Would you like to take this ultimate test?`).listen("Ask for help if not sure what to do!");
       this.emit(":responseReady");
   },
   'QuizIntent': function () {
       let outputspeech = "";
       if(this.attributes.score == 0){
           outputspeech += '<say-as interpret-as="interjection">Perfect. lets begin!</say-as>';
       }
       
       if(AR.length > 0 ) {
            this.attributes.randomizer = Math.floor(Math.random() * (AR.length-1));
            outputspeech += ` Can ${OD[AR[this.attributes.randomizer]].name} swim?`;
           var image = {
                    smallImageUrl: OD[AR[this.attributes.randomizer]].photoSmall,
                    largeImageUrl: OD[AR[this.attributes.randomizer]].photoBig
            };
            var cardTitle = OD[AR[this.attributes.randomizer]].name;
            var cardContent = `"${OD[AR[this.attributes.randomizer]].sound}" \n\n ${OD[AR[this.attributes.randomizer]].fact}`;
       }
        
        
       
       this.response.speak(outputspeech).listen().cardRenderer(cardTitle, cardContent, image);
       this.emit(":responseReady");  
   }, 
   'SayIntent': function () {
       this.attributes.animalsays = slotValue(this.event.request.intent.slots.animal);
       
       for(let i =0; i<OD.length; i++){
           if(OD[i].name == this.attributes.animalsays){
                let says = `The ${OD[i].name} says <audio src="${OD[i].mp3}" />`;
                let saysimage = {
                    smallImageUrl: OD[i].photoSmall,
                    largeImageUrl: OD[i].photoBig
                };
                let sayscardTitle = OD[i].name;
                let sayscardContent = `"${OD[i].sound}" \n\n ${OD[i].fact}`;
                this.response.speak(says).cardRenderer(sayscardTitle, sayscardContent, saysimage).listen("If you want to play does it fly game, tell me your name.");
                this.emit(":responseReady");
           }
       }
       let says = "What is your name?";
       this.response.speak(says).listen("What is your name?");
       this.emit(":responseReady");
   },

    'AMAZON.HelpIntent': function () {
        this.handler.state = "_DECISION";
        this.response.speak("Lets test your knowledge about animals that can swimAlexa will ask you list of words. it can me animal, bird or non living thing or any random thing, and you have to tell whether it can swim or not. you will be responding with either yes or no. Would you like to play?").listen('Would you like to play?');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('okay goodbye and have a nice day');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('okay goodbye it was nice to meet you');
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        const message = 'I don\'t get it! ask Alexa to swim seed!';
        this.response.speak(message);
        this.emit(':responseReady');
    },
    'UnhandledIntent': function() {
        const message = 'I don\'t get it! Try saying Alexa, swim seed';
        this.response.speak(message);
        this.emit(':responseReady');
    }

};


var playHandlers = Alexa.CreateStateHandler("_PLAY", {
    'AMAZON.YesIntent': function () {
        if(OD[AR[this.attributes.randomizer]].swim == "yes"){
            AR.splice(this.attributes.randomizer,1);
            this.attributes.score += 1;
            if(AR.length == 0){
                this.handler.state = "_DECISION";
                this.response.speak(`yapieee ${this.attributes.name}, you answered all, party time lets open a bottle of champagne  ${this.attributes.score}`);
                this.emit(':responseReady');
            }
            this.emit('QuizIntent');
        }
        this.handler.state = "_DECISION";
        let finalSpeech = `<say-as interpret-as="interjection">upps!</say-as> Wrong Answer. A ${OD[AR[this.attributes.randomizer]].name} can not swim. `;
        if(this.attributes.score<=5){
            finalSpeech += `Thats a very low score. you need to improve   ${this.attributes.name}. You got only ${this.attributes.score} correct.`;
        }
        else {
            finalSpeech += `Thats good, ${this.attributes.name}. You got ${this.attributes.score} correct.`;
        }
        this.response.speak(finalSpeech).listen('Do you wish to play again?');
        this.emit(':responseReady');
        
    },
    'AMAZON.NoIntent': function () {
        if(OD[AR[this.attributes.randomizer]].swim == "no"){
            AR.splice(this.attributes.randomizer,1);
            this.attributes.score += 1;
            if(AR.length == 0){
                this.handler.state = "_DECISION";
              this.response.speak(`yapieee ${this.attributes.name}, you answered all, party time lets open a bottle of champagne  ${this.attributes.score}`);
                this.emit(':responseReady');
            }
            this.emit('QuizIntent');
        }
        this.handler.state = "_DECISION";
        let finalSpeech = `<say-as interpret-as="interjection">upps!</say-as> Thats a Wrong Answer. A ${OD[AR[this.attributes.randomizer]].name} can swim. `;
        if(this.attributes.score<=5){
            finalSpeech += `Thats a very low score. you need to improve  ${this.attributes.name}. You got only ${this.attributes.score} correct.`;
        }
        else {
            finalSpeech += `Thats good, ${this.attributes.name}. You got ${this.attributes.score} correct.`;
        }
        this.response.speak(finalSpeech).listen('Want to play again?');
        this.emit(':responseReady');
    },
   'SayIntent': function () {
       this.attributes.animalsays = slotValue(this.event.request.intent.slots.animal);
       this.handler.state = "_DECISION";
       for(let i =0; i<OD.length; i++){
           if(OD[i].name == this.attributes.animalsays){
                let says = `The ${OD[i].name} says <audio src="${OD[i].mp3}" />`;
                let saysimage = {
                    smallImageUrl: OD[i].photoSmall,
                    largeImageUrl: OD[i].photoBig
                };
                let sayscardTitle = OD[i].name;
                let sayscardContent = `"${OD[i].sound}" \n\n ${OD[i].fact}`;
                this.response.speak(says).cardRenderer(sayscardTitle, sayscardContent, saysimage).listen("Do you want to continue playing?");
                this.emit(":responseReady");
           }
       }
       let says = "Do you want to continue playing?";
       this.response.speak(says).listen("What is your name?");
       this.emit(":responseReady");
   },

    'AMAZON.HelpIntent': function () {
        this.handler.state = "_DECISION";
        this.response.speak("Lets test your knowledge about animals that can swimAlexa will ask you list of words. it can me animal, bird or non living thing or any random thing, and you have to tell whether it can swim or not. you will be responding with either yes or no. Would you like to play?").listen('Would you like to play?');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('okay goodbye and have a nice day');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('okay goodbye it was nice to meet you');
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        const message = 'I don\'t get it! Try ask Alexa to open swim seed';
        this.response.speak(message);
        this.emit(':responseReady');
    }
});

var decisionHandlers = Alexa.CreateStateHandler("_DECISION", {
    'AMAZON.YesIntent': function () {
        AR = data.AR.slice();
        this.handler.state = "_PLAY";
        this.attributes.score = 0;
        this.emit('QuizIntent');
    },
    'AMAZON.NoIntent': function () {
        this.response.speak('<say-as interpret-as="interjection">ohh !</say-as> it would have been a great game together. hope to see you soon sometime.  goodbye!');
        this.emit(":responseReady");
    },
    'SayIntent': function () {
       this.attributes.animalsays = slotValue(this.event.request.intent.slots.animal);
       this.handler.state = "_DECISION";
       for(let i =0; i<OD.length; i++){
           if(OD[i].name == this.attributes.animalsays){
                let says = `The ${OD[i].name} says <audio src="${OD[i].mp3}" />`;
                let saysimage = {
                    smallImageUrl: OD[i].photoSmall,
                    largeImageUrl: OD[i].photoBig
                };
                let sayscardTitle = OD[i].name;
                let sayscardContent = `"${OD[i].sound}" \n\n ${OD[i].fact}`;
                this.response.speak(says).cardRenderer(sayscardTitle, sayscardContent, saysimage).listen("Do you want to continue playing?");
                this.emit(":responseReady");
           }
       }
       let says = "Do you want to continue playing?";
       this.response.speak(says).listen("What is your name?");
       this.emit(":responseReady");
   },
    'AMAZON.HelpIntent': function () {
        this.handler.state = "_DECISION";
        this.response.speak("Lets test your knowledge about animals that can swimAlexa will ask you list of words. it can me animal, bird or non living thing or any random thing, and you have to tell whether it can swim or not. you will be responding with either yes or no. Would you like to play?").listen('Would you like to play?');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('okay goodbye and have a nice day');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('okay goodbye it was nice to meet you');
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        const message = 'I don\'t get it! ask alexa to open swim seed';
        this.response.speak(message);
        this.emit(':responseReady');
    }
});




function slotValue(slot, useId){
    let value = slot.value;
    let resolution = (slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0) ? slot.resolutions.resolutionsPerAuthority[0] : null;
    if(resolution && resolution.status.code == 'ER_SUCCESS_MATCH'){
        let resolutionValue = resolution.values[0].value;
        value = resolutionValue.id && useId ? resolutionValue.id : resolutionValue.name;
    }
    return value;
}

exports.handler = function(event, context, callback) {

// Set up the Alexa object
var alexa = Alexa.handler(event, context); 
alexa.appId = APP_ID;
// Register Handlers
alexa.registerHandlers(handlers, playHandlers, decisionHandlers); 

// Start our Alexa code
alexa.execute(); 
  
};
