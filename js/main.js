import { newGame, gameOver } from "./game.js";
import { getJson, moveCursor } from "./utils.js";
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

async function main() {
  try {
    const file = await getJson("./data/english_1k.json");
    newGame(window.wordNum, file.words);
  } catch (error) {
    console.error(error);
  }
}

initEvents(main, gameTime, gameOver, moveCursor);

main();