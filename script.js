"use strict";

const NO_OF_ROWS = 6;
const TILES_PER_ROW = 5;
const DICT_URL = "https://www.dictionary.com/browse/";

let words; // Class. Contains list of words
let rowsContainer; // DOM element to hold all rows
let rows = []; // Contains 06 x rows of 05 x tiles each
let keyBoardkeys; // Nodelist of all keyboard keys

let btnNewGame; // Starts a new game
let btnGiveUp; // Discards current game
let btnHint; // Reveals letter of current tile
let btnMeaning; // Checks meaning of current word in dictionary.com

let wordToGuess = null;
let isGameOver = false;
let isGameWon = false;

let currentRow = 0;

window.addEventListener("load", onWindowLoad);

function onWindowLoad(event) {
  words = new Words();
  words.loadWords();
  wordToGuess = words.getRandomWord();

  btnNewGame = document.querySelector("#newGame");
  btnNewGame.addEventListener("click", onBtnNewGameClick);
  btnGiveUp = document.querySelector("#giveUp");
  btnGiveUp.addEventListener("click", onBtnGiveUpClick);
  btnHint = document.querySelector("#hint");
  btnHint.addEventListener("click", onBtnHintClick);
  btnMeaning = document.querySelector("#meaning");
  btnMeaning.addEventListener("click", onBtnMeaningClick);

  rowsContainer = document.querySelector("#rowsContainer");
  setUpTiles();

  keyBoardkeys = document.querySelectorAll(".keyBoardRow .keyBoardKey");
  for (let index = 0; index < keyBoardkeys.length; index++) {
    keyBoardkeys[index].addEventListener("click", onKeyBoardKeyClick);
  }

  document.addEventListener("keydown", onKeyDown);

  rows[currentRow].tilePointer.callbackAfterCurrentTileChanged?.();
}

function setUpTiles() {
  if (rows.length > 0) {
    rows.length = 0;
  }

  for (let index = 0; index < NO_OF_ROWS; index++) {
    let newRow = document.createElement("div");
    newRow.id = `row${index}`;
    newRow.className = "wodrleRow";
    let dr = new DisplayRow();
    dr.documentRow = newRow;
    rows.push(dr);

    for (let n = 0; n < TILES_PER_ROW; n++) {
      let newTile = document.createElement("div");
      newTile.id = `R${index}C${n}`;
      newTile.tabIndex = 0;
      newTile.className = "tile lightGrayTile";
      newTile.addEventListener("click", onTileClick);
      let dt = new DisplayTile();
      dt.displayTile = newTile;
      dr.tiles.push(dt);
      newRow.append(newTile);
    }
    rowsContainer.append(newRow);
  }
}

function onKeyDown(event) {
  let chrCode = event.key.charCodeAt(0);
  if (event.key === "Backspace") {
    chrCode = 8;
  } else if (event.key === "Enter") {
    chrCode = 13;
  } else if (chrCode >= 65 && chrCode <= 90) {
    chrCode += 32;
  }

  if (chrCode == 8 || chrCode == 13 || (chrCode >= 97 && chrCode <= 122)) {
    doKeyPress(chrCode);
  }
}

function onTileClick(event) {
  if (isGameOver || isGameWon) {
    return;
  }
  let tileClicked = event.target;
  let dr = rows[currentRow];
  let tileIndex = dr.getTileIndex(tileClicked);

  if (tileIndex >= 0) {
    dr.currentTileIndex = tileIndex;
  }
}

function onKeyBoardKeyClick(event) {
  let keyBoardKey = event.target;
  let chrCode = Number(keyBoardKey.dataset.key);

  doKeyPress(chrCode);
}

function doKeyPress(key) {
  if (isGameOver || isGameWon) {
    return;
  }

  let dr = rows[currentRow];
  if (key === 8) {
    if (dr?.currentTileIndex >= 0) {
      let dt = dr.tiles[dr.currentTileIndex];
      if (dt.hasValue) {
        dt.key = null;
        dr.tilePointer.movePrevious();
      } else {
        dr.tilePointer.movePrevious();
        dt = dr.tiles[dr.currentTileIndex];
        dt.key = null;
      }
    }
  } else if (key === 13) {
    if (dr?.areAllTilesFilled()) {
      checkWord(dr);
      if (isGameOver || isGameWon) {
        return;
      } else if (currentRow < NO_OF_ROWS) {
        dr?.onBeforeTileChanged();
        currentRow++;
        rows[currentRow]?.tilePointer?.callbackAfterCurrentTileChanged?.();
      }
      if (currentRow == NO_OF_ROWS) {
        alert(`You lose. The word was: ${wordToGuess}`);
        isGameOver = true;
      }
    }
  } else if (dr?.currentTileIndex < TILES_PER_ROW && key >= 97 && key <= 122) {
    dr.currentTile.key = key - 32;
    dr.tilePointer.moveNext();
  }
}

function onTileKeyChanged(event) {
  let tile = event.target;
  tile.displayTile.innerText = tile.key;
}

function checkWord(dr) {
  let wds = [...wordToGuess];

  if (dr.getWord() === wordToGuess) {
    isGameOver = true;
    for (let i = 0; i < dr.tiles.length; i++) {
      dr.tiles[i].tileStatus = TileStatus.green;
      setKeyboardKeyColour(dr.tiles[i].toString(), "greenTile");
      dr.tiles[i].displayTile.classList.add("flip");
    }
  } else {
    for (let i = 0; i < dr.tiles.length; i++) {
      const elt = dr.tiles[i];
      if (wds[i] === elt.toString()) {
        elt.tileStatus = TileStatus.green;
        setKeyboardKeyColour(dr.tiles[i].toString(), "greenTile");
      } else if (wds.includes(elt.toString())) {
        elt.tileStatus = TileStatus.yellow;
        setKeyboardKeyColour(dr.tiles[i].toString(), "yellowTile");
      } else {
        elt.tileStatus = TileStatus.wrong;
        setKeyboardKeyColour(dr.tiles[i].toString(), "darkGrayTile");
      }
    }
  }
}

function setKeyboardKeyColour(value, classToAdd) {
  let key = value.charCodeAt(0);
  if (key >= 65 && key <= 90) {
    key += 32;
  }
  if (key < 97 || key > 122) {
    return;
  }

  let str = `.keyBoardKey[data-key="${key}"]`;
  let keybdKey = document.querySelector(str);

  keybdKey?.classList.add(classToAdd);
}

function onBtnNewGameClick() {
  if (isGameOver || isGameWon) {
    location.reload();
  }
}

function onBtnGiveUpClick() {
  if (isGameOver || isGameWon) {
    return;
  }
  if (confirm("Are you sure you want to give up?")) {
    alert(`You lose. The word was: ${wordToGuess}`);
    isGameOver = true;
  }
}

function onBtnHintClick() {
  let dr = rows[currentRow];
  let tileIndex = dr.currentTileIndex;

  dr.currentTile.key = wordToGuess.charCodeAt(tileIndex);
  dr.currentTile.displayTile.classList.add("hintTaken");
}

function onBtnMeaningClick() {
  let dr = rows[currentRow];
  let str = dr.getWord();
  if (str) {
    str = DICT_URL + str;
    window.open(str, "_blank");
  }
}
