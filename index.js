var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern;
var userClickedPattern ;
var levels;
var lives;
var difficulty;
var pressButton = true;

// Easy difficulty

$("#easy").on("click", function () {
    newGame("easy", 1, 5);
});

// Medium difficulty

$("#medium").on("click", function () {
    newGame("medium", 1, 3);
});

// Hard difficulty

$("#hard").on("click", function () {
    newGame("hard", 1, 3);
});

// "Random" difficulty

$("#random").on("click", function () {
    newGame("random", 1, 3);
});

$("#survivor").on("click", function () {
    newGame("survivor", 1, 1);
});

// Start a game

function newGame(diff, level, life) {
    difficulty = diff;
    levels = level;
    lives = life;
    gamePattern = [];
    userClickedPattern = [];
    $(".diff-container").hide();
    $(".button-container").show();
    $("#level-title").text("Level " + levels);
    $("h2").text("Megmaradt életek: " + lives);
    nextSequence();
}


// Put a new element into the pattern array and show the sequence to the player

function nextSequence() {
    // Reset user clicked pattern
    userClickedPattern = [];

    // Add random color to the game pattern
    var randomNumber = Math.floor(Math.random()*4);
    var randomColor = buttonColors[randomNumber];
    gamePattern.push(randomColor);

    // Show the sequence (on easy and on medium to lvl10)
    if (difficulty === "easy" || difficulty === "survivor" || (difficulty === "medium" && levels <= 10)) {
        showSequence(gamePattern);
    } else {
        $("#" + randomColor).fadeOut(100).fadeIn(100);
    }
    
    
}

// Random sequence for random difficulty

function randomSequence() {
    gamePattern = [];
    userClickedPattern = [];
    for(var i=1; i<=levels; i++) {
        var randomNumber = Math.floor(Math.random()*4);
        var randomColor = buttonColors[randomNumber];
        gamePattern.push(randomColor);
    }
    showSequence(gamePattern);
}


// Show the full pattern

function showSequence (gamePattern) {
    notPressButton(gamePattern.length);
    for (var i = 0; i < gamePattern.length; i++) {
        currentButtonColor(i);
    }
}

function currentButtonColor (i) {
    setTimeout(function () {
        $("#" + gamePattern[i]).fadeOut(100).fadeIn(100);
        playSound(gamePattern[i]);
    }, 500*i);
}

// The player can't press any button when the sequence is shown

function notPressButton(length) {
    pressButton = false;
    setTimeout(function () {
        pressButton = true;
    }, 500*length)
}


// Animation and sound for the clicked button

$(".btn").on("click", function () {
    if (pressButton === true) {
        var userChosenColor = $(this).attr("id"); // we can get the pressed button's id attribute with this
        playSound(userChosenColor);
        userClickedPattern.push(userChosenColor);
        animatePress(userChosenColor);
        checkAnswer(userClickedPattern.length-1);
    }
});


// Play the correct sound for the colored buttons

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}


// A press animation for the pressed button

function animatePress(currentColor) {
    $("." + currentColor).addClass("pressed");
    setTimeout(function () {
        $("." + currentColor).removeClass("pressed");
    }, 100)
}


// Check, if your choose was good or wrong

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]){
        if(currentLevel === gamePattern.length-1) {
            getLife();
            newLevel();
            if(difficulty !== "random") {
                setTimeout(nextSequence, 1000);
            } else {
                setTimeout(randomSequence, 1000);
            }
        }
    } else {
        if (lives > 1) {
            error();
        } else {
            gameOver();
        }
    }
}


// After returning the correct pattern, you level up

function newLevel() {
    levels++;
    $("#level-title").text("Level " + levels);
}


// Extra life - the player gets an extra life (easy: after every 5 levels, medium: every 8 levels, hard: every 10 levels)

function getLife() {
    if ((difficulty === "easy" || difficulty === "random") && (levels % 5 === 0)) {
        lives++;
        $(".message").text("Megmaradt életek: " + lives);
    } else if ((difficulty === "medium" && levels % 8 === 0)) {
        lives++;
        $(".message").text("Megmaradt életek: " + lives);
    } else if ((difficulty === "hard" && levels % 10 === 0)) {
        lives++;
        $(".message").text("Megmaradt életek: " + lives);
    }
}

// If you choose a wrong button, you lose a life

function error() {
    lives--;
    userClickedPattern = [];
    wrongAnswer();
    $("h2").text("Megmaradt életek: " + lives);
    setTimeout(function () {
        showSequence(gamePattern);
    }, 1000);
}


// The background turns red for 0.2 sec, if you choose a wrong answer

function wrongAnswer() {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 200);
}


// If you lose all of your lives, your game is over

function gameOver() {
    wrongAnswer();
    $("#level-title").text("Játék vége! Szeretnél újra játszani?");
    $(".message").text("A pontszámod: " + (levels-1));
    $(".button-container").hide();
    $(".diff-container").show();
}