import { addClass, removeClass, moveCursor } from './utils.js';
import { gameOver } from './game.js';

export function initEvents(main) {
  document.getElementById("game").addEventListener("keydown", e => {
    handleKeydown(e, gameOver, moveCursor);
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


  const timeDict = {
    "timer-60": 60,
    "timer-30": 30,
    "timer-15": 15,
    "timer-custom": window.gameTime,
  }
  const wordDict = {
    "word-50": 50,
    "word-25": 25,
    "word-10": 10,
    "word-custom": window.wordNum,
  }

  function updateTimer(className, time) {
    window.gameTime = time;
    window.isWordTest = null;
    window.wordNum = 100;
    Object.keys(timeDict).forEach(key => { document.querySelector(`.${key}`).classList = key })
    Object.keys(wordDict).forEach(key => { document.querySelector(`.${key}`).classList = key })
    addClass(document.querySelector(`.${className}`), "active")
    document.getElementById("count-down").innerHTML = `${window.gameTime}`;
    main();
  };

  function updateWords(className, words) {
    window.wordNum = words;
    window.isWordTest = true;
    Object.keys(timeDict).forEach(key => { document.querySelector(`.${key}`).classList = key })
    Object.keys(wordDict).forEach(key => { document.querySelector(`.${key}`).classList = key })
    addClass(document.querySelector(`.${className}`), "active")
    main();
  };
  
  // Add event listeners for predefined timers
  Object.entries(timeDict).forEach(([className, time]) => {
    document.querySelector(`.${className}`).addEventListener("click", () => {
      updateTimer(className, time);
    });
  });

  Object.entries(wordDict).forEach(([className, word]) => {
    document.querySelector(`.${className}`).addEventListener("click", () => {
      updateWords(className, word);
    });
  });

  // custom popup
  document.querySelector("#popup button").addEventListener("click", () => {
    Object.keys(timeDict).forEach(key => { document.querySelector(`.${key}`).classList = key })
    Object.keys(wordDict).forEach(key => { document.querySelector(`.${key}`).classList = key })
    if (window.isWordTest) {
      window.wordNum = document.getElementById("custom-test-duration").value;
      addClass(document.querySelector(".word-custom"), "active")
    } else {
      window.gameTime = document.getElementById("custom-test-duration").value;
      addClass(document.querySelector(".timer-custom"), "active")
      document.getElementById("count-down").innerHTML = `${window.gameTime}`;
    }
    document.getElementById("popup").classList = "hide";
    main();
  })

  // custom timer  button behavior 
  document.querySelector(".timer-custom").addEventListener("click", () => {
    document.querySelector("#popup .title").innerHTML = "custom test duration"
    document.getElementById("popup").classList = "show";
    document.getElementById("custom-test-duration").value = window.gameTime;
  })

  // custom word  button behavior 
  document.querySelector(".word-custom").addEventListener("click", () => {
    document.querySelector("#popup .title").innerHTML = "custom word amount"
    document.getElementById("popup").classList = "show";
    document.getElementById("custom-test-duration").value = window.wordNum;
  })

}

export function handleKeydown(e, gameOver, moveCursor) {
  let key = e.key;
  const currLetter = document.querySelector(".letter.current");
  const currWord = document.querySelector(".word.current");
  const lastLetter = document.getElementById("words").lastChild.lastChild;
  const isLetter = key.length === 1 && key !== " "
  const expected = currLetter?.innerHTML || " ";

  window.typedLetter++;
  if (key !== expected && isLetter) {
    window.typedLetterIncorrect++;
  }

  // lock game if game over
  if (document.querySelector("#game.over")) {
    return;
  }
  
  // word test
  if (window.isWordTest) {
    if (expected === " "  && key === " ") {
      if (currWord && currWord.className.indexOf("typed") === -1) {
        window.wordCount++;
        document.getElementById("count-down").innerHTML = `${window.wordCount}/${window.wordNum}`;
      }
    }
    // game over when typed last letter
    if (currWord.nextSibling === null && currLetter === lastLetter) {
      window.wordCount++;
      document.getElementById("count-down").innerHTML = `${window.wordCount}/${window.wordNum}`;
      addClass(currLetter, key === expected ? "correct": "incorrect")
      removeClass(currWord, "current");
      addClass(currWord, "typed");
      gameOver();
      return;
    }
  }
  
  // word test timer
  if (window.isWordTest && !window.timer && isLetter) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = (new Date()).getTime();
      }      
      const currTime = (new Date()).getTime();
      window.gameTime = Math.floor((currTime - window.gameStart)/1000)
    }, 1000)
  }

  // timed test timer
  if (!window.isWordTest && !window.timer && isLetter) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = (new Date()).getTime();
      }      
      const currTime = (new Date()).getTime();
      const timePassedms = currTime - window.gameStart;
      const secLeft = window.gameTime - Math.floor(timePassedms/1000);
      document.getElementById("count-down").innerHTML = secLeft;
      if (secLeft <= 0) {
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

  if (e.code === "Space" && currLetter !== currWord.firstChild && expected === " ") {
    // add error class to words with incorrect letter(s)
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

    // move current class to next word
    // move current class to first letter of next word
    removeClass(currWord, "current")
    if (currWord.nextSibling) {
      addClass(currWord.nextSibling, "current")
      addClass(currWord.nextSibling.firstChild, "current")
    }
    // add class typed if not already added
    if (!currWord.classList.contains("typed")) {
      addClass(currWord, "typed")
    }
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

      if (currWord.previousSibling.lastChild.classList.contains("extra")) {
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

    // delete entire word with ALT+Backspace or Meta+Backspace
    // theres a bug here idk where 
    if (e.metaKey || e.altKey && expected) {  
      removeClass(document.querySelector(".letter.current"), "current")   
      const letters = [...document.querySelectorAll('.word.current .letter')];
      letters.forEach(letter => {
        if (letter.className.indexOf("extra") !== -1) letter.remove();
        letter.classList = "letter"
      });
      if (isFirstLetter && currWord.previousSibling) {
        addClass(currWord.previousSibling.firstChild, "current")
      } else {
        addClass(currWord.firstChild, "current")
      }
    }
    
  }

  // scrolling line
  if (currWord.getBoundingClientRect().top > 430) {
    const words = document.getElementById("words");
    const margin = parseFloat(words.style.marginTop || "0px");
    words.style.marginTop = (margin - 36.5) + "px";
  }

  // move cursor
  moveCursor();
}

// dark/light mode toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("theme-toggle");
  const rootElement = document.documentElement;

  const currentTheme = localStorage.getItem("theme") || "light";
  rootElement.setAttribute("data-theme", currentTheme);

  toggleButton.addEventListener("click", () => {
    const newTheme = rootElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    rootElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
});