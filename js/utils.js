export async function getJson(filePath) {
  let res = await fetch(filePath)
  if (res.ok) return await res.json()
  throw new Error(`Error found: ${res.statusText}`)
}

export function removeClass(element, className) {
  if (element) element.classList.remove(className);
}

export function addClass(element, className) {
  if (element) element.classList.add(className);
}


export function formatWord(word) {
  return `<div class="word">${word}</div>`
}

export function moveCursor() {
  const nextLetter = document.querySelector('.letter.current');
  const nextWord = document.querySelector('.word.current');
  const cursor = document.getElementById('cursor');
  cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
}