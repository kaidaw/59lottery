let played = false;
//sets the initial state of whether a round has been played or not
//notice that if this is true, click handlers for random and play and
//selecting individual numbers short circuit until the 'reset' button
//is pressed and played is reset to its initial value of false

const REWARDS = {
  0: 0,
  1: 0,
  2: 0,
  3: 50,
  4: 100,
  5: 200,
  6: 500,
};
//The above object maps the number of correct balls with the appropriate score.
function getInitState() {
  let lotteryBalls = {};
  for (let i = 1; i < 60; i++) {
    lotteryBalls[i] = 0;
  }
  return lotteryBalls;
}
//This function initiates the data structure I am using to represent the lottery game with the following logic:
//{number: 0(unselected)/1(selected)/2(selected AND a winning number)}

function getReward(obj) {
  let total = 0;
  for (let num of Object.values(obj)) {
    if (num === 2) {
      total++;
    }
  }
  return REWARDS[total];
}
//using the REWARDS object and the above logic, this function checks to see how many winning numbers there are
//and returns the number of points that score equates to.

function selectSixRandom(input) {
  let output = {};
  let checker = [];
  let length = Object.keys(input).length;
  Object.assign(output, input);
  while (checker.length < 6) {
    let randomNumber = Math.floor(Math.random() * length) + 1;
    if (!checker.includes(randomNumber)) {
      checker.push(randomNumber);
      output[randomNumber] += 1;
    }
  }
  return [output, checker];
}
//this function alters the initial state changing the value of
//six 'balls' (keys in my lottery object) from 0 (unselected) to 1(selected)
//and returns an array containing the new lottery object and an array of the entries changed
//I made this function abstract enough to handle both the functionality to allow the player to
//choose a random set of numbers, and the functionality to establish a winning set of numbers.

function playClickHandler(lotteryObject) {
  if (played) {
    return;
  }
  if (addObjectVals(lotteryObject) !== 6) {
    alert(
      "You have not selected 6 balls. Please make sure you select 6 to get the best chances of winning. Good luck!"
    );
    return;
  }
  //prevents players from starting without selecting their numbers
  played = true;
  scoreContainer.innerHTML = "";
  let [endState, winningBalls] = selectSixRandom(lotteryObject);
  lotteryBalls = endState;
  //saving the end state of the lottery balls object and the array of 6 winning numbers to variables
  let winBalls = document.createElement("div");
  let scores = document.createElement("div");
  winBalls.className = "winBalls";
  scores.className = "scores";
  for (let ball of winningBalls) {
    let winningBall = document.createElement("button");
    winningBall.innerHTML = ball;
    if (lotteryObject[ball] !== 0) {
      winningBall.className = "selected";
    } else {
      winningBall.className = "unselected";
    }
    winBalls.appendChild(winningBall);
  }
  scores.appendChild(winBalls);
  let message = document.createElement("button");
  message.innerHTML = "WINNERS";
  message.className = "message";
  scoreContainer.appendChild(message);
  scoreContainer.appendChild(winBalls);
  //when the 'go' button is pressed, this loop turns each winning number into an element
  //which displays whether or not it was selected or not, making it easy for the player
  //to determine which numbers matched up with the winning numbers.
  let scoreDivider = document.createElement("div");
  let score = document.createElement("button");
  let messageTwo = document.createElement("button");
  scoreDivider.className = "scores";
  score.innerHTML = getReward(endState);
  messageTwo.innerHTML = "SCORE";
  messageTwo.className = "message";
  if (score.innerHTML !== "0") {
    score.className = "winner";
  } else {
    score.className = "unselected";
  }
  scoreContainer.appendChild(messageTwo);
  scoreDivider.appendChild(score);
  scoreContainer.appendChild(scoreDivider);

  //beneath the winning numbers, I am also displaying the player's score (0 points for 2 balls or fewer, 50 points for 3 balls etc.)
  // and to make it visually more obvious, if the player has scored this element will be yellow, otherwise it will be red.
  //I picked yellow to differentiate this from the green colour I chose to mark the selected numbers.
}

function render(lotteryObject) {
  let scoreContainer = document.getElementById("scoreContainer");
  let container = document.getElementById("holder");
  let ballHolder = document.createElement("div");
  let randomizer = document.getElementById("random");
  let reset = document.getElementById("reset");

  //ensures that at re-render, the previous score/ selected balls are reset
  randomizer.onclick = () => {
    if (played) {
      return;
    }
    scoreContainer.innerHTML = "";
    let times = 0;
    let setInt = setInterval(() => {
      times++;
      let newObject = selectSixRandom(getInitState())[0];
      render(newObject);
      if (times === 10) {
        clearInterval(setInt);
      }
    }, 100);
  };
  container.innerHTML = "";
  //this event handler adds functionality to the 'random' button selecting 6 numbers at
  // random and showing the selection. This can be repeated if desired.
  //Ensuring that the container for the balls is reset with each render ensures
  //that components do not render more than once.
  reset.onclick = () => {
    played = false;
    scoreContainer.innerHTML = "";
    render(getInitState());
  };
  //I have implemented a reset button to reset everything back to its initial state
  //which simply reverts the 'score container' to empty and renders the page again with the initial state

  for (let number of Object.keys(lotteryObject)) {
    let lotteryBall = document.createElement("button");
    lotteryBall.className = number;
    if (lotteryObject[number]) {
      lotteryBall.className = "selected";
    } else {
      lotteryBall.className = "unselected";
    }
    lotteryBall.innerHTML = number;
    lotteryBall.onclick = () => {
      if (played) {
        return;
      }
      scoreContainer.innerHTML = "";
      selectOne(number, lotteryObject);
    };
    ballHolder.appendChild(lotteryBall);
  }
  //this is probably the most key element of the render function, turning the lottery object data structure into
  //HTML elements that visually represent the lottery balls/ numbers. Each number is given a class which is a string of
  //its number, a click handler which toggles the state of the number between selected and unselected, and changes colour
  //according to which state it is in.
  let play = document.createElement("button");
  play.className = "play";
  play.innerHTML = "GO!";
  play.onclick = () => {
    playClickHandler(lotteryObject);
  };
  ballHolder.appendChild(play);
  container.appendChild(ballHolder);
  //see above for the functionality of the 'go' button which I have kept separate to keep my render function more concise.
}

function addObjectVals(object) {
  return Object.values(object).reduce((a, b) => {
    return a + b;
  }, 0);
}
//this function takes the values of my lottery object and returns the total. I need to know this
//firstly when the 'go' button is pressed to ensure that the user has selected 6 numbers, and secondly
//in the function to select individual numbers to ensure that ONLY six are selected.

function selectOne(currentNumber, lotteryObject) {
  let total = addObjectVals(lotteryObject);
  if (lotteryObject[currentNumber] === 1) {
    lotteryObject[currentNumber]--;
  } else if (total === 6) {
    return;
  } else if (lotteryObject[currentNumber] === 0) {
    lotteryObject[currentNumber]++;
  }
  render(lotteryObject);
}
//This function is the counterpart to selectSixRandom and, as the name suggests, selects one unique number
//at a time and re-renders with the new state. The function ensures that only six numbers are selected.

render(getInitState());
//renders the page with the initial state (59 balls unselected)
