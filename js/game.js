import { addClass, removeClass, formatWord, moveCursor } from './utils.js'

export function newGame(textLen, arr, gameTime) {
  // add refresh animation
  addClass(document.getElementById("game"), "refresh")
  
  // get words for typing game
  document.getElementById("words").innerHTML = "";
  for (let i=0; i<textLen; i++) {
    document.getElementById("words").innerHTML += formatWord(getWord(arr))
  }

  // add current class to first word and letter
  addClass(document.querySelector(".word"), "current");
  addClass(document.querySelector(".letter"), "current");
  
  // reset state
  removeClass(document.getElementById("game"), "over")
  document.getElementById("stats").classList = "hide"
  clearInterval(window.timer)
  window.timer = null;
  window.gameStart = null;
  document.getElementById("time").innerHTML = `${gameTime}`;
  document.getElementById("words").style.marginTop = "0px"
  
  // reset cursor
  moveCursor();
}

export function gameOver(gameTime) {
  clearInterval(window.timer)
  addClass(document.getElementById("game"), "over")
  const stats = [...getStats(gameTime)]

  // display stats
  document.getElementById("stats").classList = "show"
  document.getElementById("stats").innerHTML = `WPM: ${Math.round(stats[0])}, Accuracy = ${Math.floor(stats[1])}%`;
}

export function getWord(arr) {
  let randIndex = Math.floor(Math.random() * arr.length); 
  let letters = arr[randIndex].split("");
  let newWord = "";

  for (let i=0; i<letters.length; i++) {
    newWord += `<span class="letter">${letters[i]}</span>`
  }
  return newWord
}

function getStats(gameTime) {
  const words = [...document.querySelectorAll(".typed")];
  let correctLettersCount = 0;
  let incorrectLettersCount = 0;
  words.forEach(word => {
    const letters = [...word.children]
    letters.forEach(letter => {
      if (letter.classList[1] === "correct") correctLettersCount++;
      if (letter.classList[1] === "incorrect") incorrectLettersCount++;
    })
  })

  const WPM = (correctLettersCount+incorrectLettersCount)/5 * (60/gameTime)
  const accuracy = correctLettersCount * 100 / (correctLettersCount + incorrectLettersCount)

  return [WPM, accuracy]
}