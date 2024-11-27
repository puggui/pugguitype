import { newGame, gameOver } from "./game.js";
import { getJson, moveCursor, addClass } from "./utils.js";
import { initEvents } from "./events.js"

// init global variables
window.timer = null;
window.gameStart = null;
window.gameTime = 30;
window.wordNum = 100;
window.isWordTest = null;
window.wordCount = 0;
window.typedLetter = 0;
window.typedLetterIncorrect = 0;
window.filePath = "./data/all-letter.json";

async function main() {
  try {
    const letterID = localStorage.getItem("letter") || "all-letter";
    window.filePath = `./data/${letterID}.json`;
    const file = await getJson(window.filePath);
    console.log(window.filePath)
    
    const letterElement = document.getElementById(letterID)
    addClass(letterElement, "active"); 

    newGame(window.wordNum, file.words);
  } catch (error) {
    console.error(error);
  }
}

initEvents(main, gameTime, gameOver, moveCursor);

main();