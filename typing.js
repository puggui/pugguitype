async function getJson(filePath) {
  let res = await fetch(filePath)
  if (res.ok) return await res.json()
  throw new Error(`Error found: ${res.statusText}`)
}

async function main() {
  try {
    const file = await getJson("./english_1k.json")
    newGame(200, file.words)
  } catch (error) {
    console.error(error)
  }
}

function formatWord(word) {
  return `<div class="word">
            ${word}
          </div>`
}

function getWord(arr) {
  let randIndex = Math.floor(Math.random() * arr.length); 
  let letters = arr[randIndex].split("");
  let newWord = "";

  for (let i=0; i<letters.length; i++) {
    newWord += `<span class="letter">${letters[i]}</span>`
  }
  console.log(newWord)
  return newWord
}

function newGame(textLen, arr) {
  document.getElementById("words").innerHTML = "";
  for (i=0; i<textLen; i++) {
    document.getElementById("words").innerHTML += formatWord(getWord(arr))
  }
}

main();


