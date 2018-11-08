/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.4512ecaa-7507-443a-b054-360a2d3e8213';
const dynamoDBTableName = 'JumbledLetters';

const SKILL_NAME = 'JumbledLettersSKill';
const HELP_MESSAGE = 'You can ask me to start a new game, resume a game you have already played or reset game stats and start afresh';
const STOP_MESSAGE = 'Goodbye!';

const arr = [{"Q":"emit","A":"time"},{"Q":"pets","A":"step"},{"Q":"ahyz","A":"hazy"},{"Q":"xulf","A":"flux"},{"Q":"jruy","A":"jury"},{"Q":"aquy","A":"quay"},{"Q":"jmoo","A":"mojo"},{"Q":"beij","A":"jibe"},{"Q":"booz","A":"bozo"},{"Q":"ipqu","A":"quip"}];

function getRandom(min, max) {
  return Math.floor((Math.random() * ((max - min) + 1)) + min);
}

const handlers = {
    'LaunchRequest': function () {
        if(this.attributes.Game.score === undefined){
            this.emit('start');
        }else if(this.attributes.Game.end === 1){
            var score = this.attributes.Game.score;
            const SPEECH_1 = "I have asked all the questions I had. You have scored " + score + " . If you wish to delete this game and start over again, say delete my previous game.";
            var output = SPEECH_1;
            this.response.speak(output).listen(output);
            this.emit(':responseReady');
        }else{
            const SPEECH_2 = "You have already played the game. Your score is " + this.attributes.Game.score + " . To resume your game,say resume my game, or to delete your previous game and start afresh, say delete my previous game";
            var output = SPEECH_2;
            this.response.speak(output).listen(output);
            this.emit(':responseReady');
        }
    },
    'start': function(){
        this.attributes.Game.score=0;
        this.attributes.Game.index=0;
        this.attributes.Game.count=3;
        const random=getRandom(0,arr.length-1);
        var question=arr[random].Q;
        var q="<break time='0.5s'/>" + question.split('').join("<break time='0.5s'/>") + "<break time='0.5s'/>";
        var qc=question.split('').join(" ");
        const SPEECH_3 = "Let's begin, Here are your jumbled letters " + q + " Guess the word, You have 3 attempts left";
        var output = SPEECH_3;
        this.response.cardRenderer(SKILL_NAME,output,qc);
        this.response.speak(output).listen(output);
        this.emit(':responseReady');
    },
    "resume":function(){
        var index=this.attributes.Game.index;
        var count=this.attributes.Game.count;
        var question=arr[index].Q;
        var q="<break time='0.5s'/>" + question.split('').join("<break time='0.5s'/>") + "<break time='0.5s'/>";
        var qc=question.split('').join(" ");
        const SPEECH_4 = "Welcome back, Here are your jumbled letters " + q + " Guess the word, You have " + count + " attempts left";
        var output = SPEECH_4;
        this.response.cardRenderer(SKILL_NAME,output,qc);
        this.response.speak(output).listen(output);
        this.emit(':responseReady');
    },
    "AMAZON.StartOverIntent":function(){
        if(this.attributes.Game.score===undefined){
        this.emit('start');
        }else if(this.attributes.Game.end===1){
            var score=this.attributes.Game.score;
            const SPEECH_5 = "I have asked all the questions I had. You have scored " + score + " . If you wish to delete this game and start over again, say delete my previous game.";
            var output = SPEECH_5;
            this.response.speak(output).listen(output);
            this.emit(':responseReady');
        }else{
            const SPEECH_6 = "You have already played the game. Your score is " + this.attributes.Game.score + " . To resume your game,say resume my game, or to delete your previous game and start afresh, say delete my previous game";
            var output = SPEECH_6;
            this.response.speak(output).listen(output);
            this.emit(':responseReady');
        }
    },
    "AnswerIntent":function(){
        var guess=this.event.request.intent.slots.guess.value;
        var l1=this.event.request.intent.slots.letterone.value;
        var l2=this.event.request.intent.slots.lettertwo.value;
        var l3=this.event.request.intent.slots.letterthree.value;
        var l4=this.event.request.intent.slots.letterfour.value;
        var index=this.attributes.Game.index;
        var count=this.attributes.Game.count;
        var answer=arr[index].A;
        var a=answer.split('');
        if(guess!==undefined && l1!==undefined && l2!==undefined && l3!==undefined && l4!==undefined){
            l1=l1.toLowerCase();
            l2=l2.toLowerCase();
            l3=l3.toLowerCase();
            l4=l4.toLowerCase();
            if(guess===answer && (l1===a[0] || l1===a[0]+'.') && (l2===a[1] || l2===a[1]+'.') && (l3===a[2] || l3===a[2]+'.') && (l4===a[3] || l1===a[3]+'.')){
            this.attributes.Game.score+=1;
            var score=this.attributes.Game.score;
            if(count===3){
                const SPEECH_7 = "Good Job! You have guessed it right in one attempt. Your score is " + score + " . Do you wish to play again? Say yes to play again and no to quit.";
                var output = SPEECH_7;
                this.response.speak(output).listen(output);
                this.emit(':responseReady');
            }else{
                const SPEECH_8 = "Good Job! You have guessed it right in " + (4-count) + " attempts. Your score is " + score + " . Do you wish to play again? Say yes to play again and no to quit.";
                this.response.speak(output).listen(output);
                this.emit(':responseReady');
            }}else{
                this.attributes.Game.count-=1;
                count=this.attributes.Game.count;
                var question=arr[index].Q;
                var q="<break time='0.5s'/>" + question.split('').join("<break time='0.5s'/>") + "<break time='0.5s'/>";
                if(count>0)
                {
                    if(count===1)
                    {
                        const SPEECH_9 = "Please try again. Your question was " + q + ". You have one attempt left";
                        var output = SPEECH_9;
                        this.response.speak(output).listen(output);
                        this.emit(':responseReady');
                    }else{
                        const SPEECH_10 = "Please try again. your question was " + q + " . You have " + count + " attempts left.";
                        var output = SPEECH_10;
                        this.response.speak(output).listen(output);
                        this.emit(':responseReady');
                    }}else{
                        var ans="<break time='0.5s'/>" + answer.split('').join("<break time='0.5s'/>") + "<break time='0.5s'/>";
                        const SPEECH_11 = "Sorry there are no attempts left, the correct answer is " + ans + answer + " . Do you wish to try again? Say yes to play again and no to quit.";
                        var output = SPEECH_11;
                        this.response.speak(output).listen(output);
                        this.emit(':responseReady');
                    }}}},
    "AMAZON.YesIntent":function(){
        if(this.attributes.Game.index===arr.length-1){
            this.attributes.Game.end=1;
            var score=this.attributes.Game.score;
            const SPEECH_12 = "I have asked all the questions I had. You have scored " + score + " . If you wish to delete this game and start over again, say delete my previous game.";
            var output = SPEECH_12;
            this.response.speak(output).listen(output);
            this.emit(':responseReady');
        }else{
            this.attributes.Game.index+=1;
            this.attributes.Game.count=3;
            this.emit('resume');
        }
    },
    "AMAZON.NoIntent":function(){
        if(this.attributes.Game.index===arr.length-1){
            this.attributes.Game.end=1;
            this.response.speak("Thank You");
            this.emit(':responseReady');
        }else{
            this.attributes.Game.index+=1;
            this.attributes.Game.count=3;
            this.response.speak("Thank You");
            this.emit(':responseReady');
        }
    },
    "AMAZON.ResumeIntent":function(){
        if(this.attributes.Game.score===undefined){
            const SPEECH_14 = "You have not started the game yet, to start the game say start a game";
            var output = SPEECH_14;
            this.response.speak(output).listen(output);
            this.emit(':responseReady');
        }else if(this.attributes.Game.end===1){
            var score=this.attributes.Game.score;
            const SPEECH_15 = "I have asked all the questions I had. You have scored " + score + " . If you wish to delete this game and start over again, say delete my previous game.";
            var output = SPEECH_15;
            this.response.speak(output).listen(output);
            this.emit(':responseReady');
        }else{
        this.emit('resume');
        }
    },
    "DeleteIntent":function(){
        if(this.attributes.Game.score===undefined){
            const SPEECH_13 = "You have not started the game yet, to start the game say start a game";
            var output = SPEECH_13;
            this.response.speak(output).listen(output);
            this.emit(':responseReady');
        }else{
            this.attributes.Game.end=0;
            this.emit('start');
        }
    },
    'AMAZON.HelpIntent': function () {
        var output = HELP_MESSAGE;
        
        this.response.speak(output).listen(output);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'SessionEndedRequest':function(){
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled':function(){
        var output = HELP_MESSAGE;
        this.response.speak(output).listen(output);
        this.emit(':responseReady');
    }
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.dynamoDBTableName = dynamoDBTableName;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
