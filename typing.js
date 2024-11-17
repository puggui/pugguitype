const gameTime = 30;
// create timer property on window object
window.timer = null;
window.gameStart = null

async function getJson(filePath) {
  let res = await fetch(filePath)
  if (res.ok) return await res.json()
  throw new Error(`Error found: ${res.statusText}`)
}

async function main() {
  try {
    const file = await getJson("./english_1k.json")
    newGame(100, file.words)
  } catch (error) {
    console.error(error)
  }
}

function addClass(el, name) {
  el.className += " " + name;
}

function removeClass(el, name) {
  el.className = el.className.replace(name, "")
}

function formatWord(word) {
  return `<div class="word">${word}</div>`
}

function getWord(arr) {
  let randIndex = Math.floor(Math.random() * arr.length); 
  let letters = arr[randIndex].split("");
  let newWord = "";

  for (let i=0; i<letters.length; i++) {
    newWord += `<span class="letter">${letters[i]}</span>`
  }
  return newWord
}

function moveCursor() {
  const nextLetter = document.querySelector('.letter.current');
  const nextWord = document.querySelector('.word.current');
  const cursor = document.getElementById('cursor');
  cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
}

function newGame(textLen, arr) {
  // add refresh animation
  addClass(document.getElementById("game"), "refresh")
  
  // get words for typing game
  document.getElementById("words").innerHTML = "";
  for (i=0; i<textLen; i++) {
    document.getElementById("words").innerHTML += formatWord(getWord(arr))
  }
  addClass(document.querySelector(".word"), "current");
  addClass(document.querySelector(".letter"), "current");
  
  // reset window.timer every time newGame() is called
  removeClass(document.getElementById("game"), "over")
  clearInterval(window.timer)
  window.timer = null;
  window.gameStart = null;
  document.getElementById("info").innerHTML = `${gameTime}`;

  // reset margin
  const words = document.getElementById("words")
  const margin = parseInt(words.style.marginTop || "0px")
  words.style.marginTop = "0px"
  // reset cursor
  moveCursor();
}

function gameOver() {
  clearInterval(window.timer)
  addClass(document.getElementById("game"), "over")
  const stats = [...getStats()]
  document.getElementById("info").innerHTML = `WPM: ${stats[0]}, Accuracy = ${Math.floor(stats[1])}%`;
}

function getStats() {
  const words = [...document.querySelectorAll(".typed")];
  let correctLettersCount = 0;
  let incorrectLettersCount = 0;
  words.forEach(word => {
    letters = [...word.children]
    letters.forEach(letter => {
      if (letter.classList[1] === "correct") correctLettersCount++;
      if (letter.classList[1] === "incorrect") incorrectLettersCount++;
    })
  })

  const WPM = (correctLettersCount+incorrectLettersCount)/5 * (60/gameTime)
  const accuracy = correctLettersCount * 100 / (correctLettersCount + incorrectLettersCount)

  return [WPM, accuracy]
}


document.getElementById("game").addEventListener("keydown", e => {
  let key = e.key;
  const currLetter = document.querySelector(".letter.current");
  const currWord = document.querySelector(".word.current");
  const expected = currLetter?.innerHTML || " ";
  const isLetter = key.length === 1 && key !== " "
  
  // lock game if game over
  if (document.querySelector("#game.over")) {
    return;
  }

  // timer
  if (!window.timer && isLetter) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = (new Date()).getTime();
      }      
      const currTime = (new Date()).getTime();
      const timePassedms = currTime - window.gameStart
      const secLeft = gameTime - Math.floor(timePassedms/1000)
      document.getElementById("info").innerHTML = secLeft;
      if (secLeft <= 0) {
        console.log("game over!!!")
        gameOver();
        return;
      }
    }, 1000)
  }
  
  if (isLetter) {
    if (currLetter) {
      addClass(currLetter, key === expected ? "correct": "incorrect")
      removeClass(currLetter, "current")
      if (currLetter.nextSibling) addClass(currLetter.nextSibling, "current")
    } else {
      const incorrectLetter = document.createElement('span');
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = "letter incorrect extra";
      currWord.appendChild(incorrectLetter)
    }
  } 

  if (e.code === "Space" && currLetter !== currWord.firstChild) {
    // if is the first letter, dont allow space to invalidate entire word
    if (expected !== " ") {
      const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
      lettersToInvalidate.forEach(letter => {
        addClass(letter, "incorrect")
      })
      addClass(currWord, "error");

    } else {
      const allLetters = [...document.querySelectorAll('.word.current .letter')];
      let allCorrectFlag = true
      allLetters.forEach(letter => {
        if (letter.className.indexOf("incorrect") !== -1) allCorrectFlag = false;
      })
      if (allCorrectFlag) {
        removeClass(currWord, "error")
      } else {
        addClass(currWord, "error")
      }
    }
    if (currWord.className.indexOf("typed") === -1) addClass(currWord, "typed")
    removeClass(currWord, "current")
    addClass(currWord.nextSibling, "current")
    if (currLetter) removeClass(currLetter, 'current');
    addClass(currWord.nextSibling.firstChild, 'current'); 
  }

  if (key === "Backspace") {
    const isFirstLetter = currLetter === currWord.firstChild

    // is first letter, backspace to prev incorrect word
    if (currWord.previousSibling && currWord.previousSibling.className.indexOf("error") !== -1 && isFirstLetter) {
      removeClass(currWord, "current")
      addClass(currWord.previousSibling, "current")
      
      removeClass(currLetter, "current")
      addClass(currWord.previousSibling.lastChild, "current")
      removeClass(currWord.previousSibling.lastChild, "incorrect")
      removeClass(currWord.previousSibling.lastChild, "correct")

      if (currWord.previousSibling.lastChild.className.indexOf("extra") !== -1) {
        currWord.previousSibling.lastChild.remove();
      }
    }

    // not the first letter
    if (currLetter && !isFirstLetter) {
      // move back one letter, remove incorrect/correct class
      removeClass(currLetter, "current")
      removeClass(currLetter.previousSibling, "incorrect")
      removeClass(currLetter.previousSibling, "correct")
      addClass(currLetter.previousSibling, "current")
    }

    // backspace on last letter, select last letter (last child on currWord)
    if (currLetter === null) {
      // remove correct/incorrect class on last letter
      removeClass(currWord.lastChild, "incorrect")
      removeClass(currWord.lastChild, "correct")
      // set current to lastChild
      addClass(currWord.lastChild, "current")
      
      // remove extra characters 
      if (currWord.lastChild.className.indexOf("extra") !== -1) {
        currWord.lastChild.remove();
      } 
    }

    // remove extra character after space has been pressed
    if (currLetter && currLetter.className.indexOf("extra") !== -1) {
      currLetter.remove();
    }
  }

  // scrolling line
  if (currWord.getBoundingClientRect().top > 250) {
    const words = document.getElementById("words")
    const margin = parseInt(words.style.marginTop || "0px")
    words.style.marginTop = (margin - 36.5) + "px"
  }

  // move cursor
  moveCursor();
})


document.getElementById("new-game-btn").addEventListener("click", () => {
  removeClass(document.getElementById("game"), "refresh")
  main();
}) 
document.getElementById("game").addEventListener("keydown", e => {
  removeClass(document.getElementById("game"), "refresh")
  if (e.key === "Tab") main();
})

main();


