var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var keyPress = false;
var level = 0;
var remainingErrors = 3;

function nextSequence() {
    // Reset user clicked pattern
    userClickedPattern = [];

    // Add random color to the game pattern
    var randomNumber = Math.floor(Math.random()*4);
    var randomColor = buttonColors[randomNumber];
    gamePattern.push(randomColor);

    // The buttons flash and make sound
    for (var i = 0; i < gamePattern.length; i++) {
        currentButtonColor(i);
    }
        
    // Add a new level
    level++;
    $("#level-title").text("Level " + level);
    
}

function currentButtonColor (i) {
    setTimeout(function () {
        $("#" + gamePattern[i]).fadeOut(100).fadeIn(100);
        console.log(gamePattern[i]);
        playSound(gamePattern[i]);
    }, 500*i);
}

$(document).keypress(function ( ) { 
    if (keyPress === false) {
        keyPress = true;
        $("#level-title").after("<h2> Megmaradt hibák:" + remainingErrors + "</h2>");
        nextSequence();
    }
});

$(".btn").on("click", function () {
    if (keyPress === true) {
        var userChosenColor = $(this).attr("id");
        playSound(userChosenColor);
        userClickedPattern.push(userChosenColor);
        animatePress(userChosenColor);
        checkAnswer(userClickedPattern.length-1);
    }
});

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColor) {
    $("." + currentColor).addClass("pressed");
    setTimeout(function () {
        $("." + currentColor).removeClass("pressed");
    }, 100)
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]){
        if(currentLevel === gamePattern.length-1) {
            setTimeout(nextSequence, 1000);
        }
    } else {
        if (remainingErrors > 1) {
            error();
        } else {
            gameOver();
        }
    }
}

function error() {
    remainingErrors--;
    userClickedPattern = [];
    wrongAnswer();
    $("h2").text("Megmaradt hibák: " + remainingErrors);
}

function wrongAnswer() {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 200);
}

function gameOver() {
    wrongAnswer();
    $("#level-title").text("Játék vége! Nyomj meg egy gombot az újrakezdéshez! A pontszámod: " + (level-1));
    $("h2").remove();
    keyPress = false;
    level = 0;
    gamePattern = [];
    remainingErrors = 3;
}