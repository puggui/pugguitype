async function getJson(filePath) {
  let res = await fetch(filePath)
  if (res.ok) return await res.json()
  throw new Error(`Error found: ${res.statusText}`)
}

async function main() {
  try {
    const file = await getJson("./english_1k.json")
    newGame(15, file.words)
  } catch (error) {
    console.error(error)
  }
}

function getText(textLen, arr) {
  let text = ""
  for (i=0; i<textLen; i++) {
    let randIndex = Math.floor(Math.random() * arr.length); 
    text = text + arr[randIndex] + " "
  }
  return text.trim();
}

function newGame(textLen, arr) {
  document.getElementById("words").innerHTML = ""
  document.getElementById("words").innerHTML += getText(textLen, arr)
}

main();


