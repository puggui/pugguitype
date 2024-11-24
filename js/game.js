import { addClass, removeClass, formatWord, moveCursor } from './utils.js'

export function newGame(textLen, arr) {
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
  window.wordCount = 0;
  window.typedLetter = 0;
  window.typedLetterIncorrect = 0;
  document.getElementById("words").style.marginTop = "0px"
  if (window.isWordTest) {
    document.getElementById("count-down").innerHTML = `${window.wordCount}/${window.wordNum}`;
  } else {
    document.getElementById("count-down").innerHTML = `${window.gameTime}`;
  }
  
  // reset cursor
  moveCursor();
}

export function gameOver() {
  clearInterval(window.timer)
  addClass(document.getElementById("game"), "over")
  const stats = [...getStats()]

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

function getStats() {
  const WPM = (window.typedLetter)/5 * (60/window.gameTime)
  const accuracy = (window.typedLetter - window.typedLetterIncorrect) * 100 / window.typedLetter

  return [WPM, accuracy]
}