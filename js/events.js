import { addClass, removeClass, moveCursor } from './utils.js';
import { gameOver } from './game.js';

export function initEvents(main, gameTime) {
  document.getElementById("game").addEventListener("keydown", e => {
    handleKeydown(e, gameTime, gameOver, moveCursor);
  });
    
  document.getElementById("new-game-btn").addEventListener("click", () => {
    removeClass(document.getElementById("game"), "refresh");
    main();
  });

  window.addEventListener("keydown", e => {
    if (e.key === "Tab") {
      e.preventDefault();
      removeClass(document.getElementById("game"), "refresh");
      main();
    }
  });
}

export function handleKeydown(e, gameTime, gameOver, moveCursor) {
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
      const timePassedms = currTime - window.gameStart;
      const secLeft = gameTime - Math.floor(timePassedms/1000);
      document.getElementById("info").innerHTML = secLeft;
      if (secLeft <= 0) {
        gameOver(gameTime);
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
  
    // delete entire word with ALT+Backspace or Meta+Backspace
    if (e.metaKey || e.altKey) {      
      const letters = [...document.querySelectorAll('.word.current .letter')];
      letters.forEach(letter => {
        letter.classList = "letter"
      });
      addClass(currWord.firstChild, "current")
    }

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
      removeClass(currLetter, "current");
      removeClass(currLetter.previousSibling, "incorrect");
      removeClass(currLetter.previousSibling, "correct");
      addClass(currLetter.previousSibling, "current");
    }

    // backspace on last letter, select last letter (last child on currWord)
    if (currLetter === null) {
      // remove correct/incorrect class on last letter
      removeClass(currWord.lastChild, "incorrect");
      removeClass(currWord.lastChild, "correct");
      
      // set current to lastChild
      addClass(currWord.lastChild, "current");
      
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
    const words = document.getElementById("words");
    const margin = parseInt(words.style.marginTop || "0px");
    words.style.marginTop = (margin - 36.5) + "px";
  }

  // move cursor
  moveCursor();
}