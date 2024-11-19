import { newGame, gameOver } from "./game.js";
import { getJson, moveCursor } from "./utils.js";
import { initEvents } from "./events.js"

// init global variables
window.timer = null;
window.gameStart = null;
window.gameTime = 30;

async function main() {
  try {
    const file = await getJson("./data/english_1k.json");
    newGame(100, file.words);
  } catch (error) {
    console.error(error);
  }
}

initEvents(main, gameTime, gameOver, moveCursor);

main();