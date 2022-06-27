"use strict";

/*******************
 * *****************
 * @name DisplayTile
 * @description One tile
 *
 * *****************
 ******************/

class DisplayTile {
  #key = null;
  get key() {
    return this.#key;
  }
  set key(value) {
    if (value === "") {
      value = null;
    }
    if (value >= 97 && value <= 122) {
      value -= 32;
    }
    if (value >= 65 && value <= 90) {
      this.#key = value;
      this.#displayTile.innerText = String.fromCharCode(value);
    } else if (value == null) {
      this.#key = value;
      this.#displayTile.innerText = "";
    }
  }

  toString() {
    return this.#key ? String.fromCharCode(this.#key) : null;
  }

  get hasValue() {
    return !(this.#key == null);
  }

  #wasHintTaken = false;
  get wasHintTaken() {
    return this.#wasHintTaken;
  }
  set wasHintTaken(value) {
    this.#wasHintTaken = value ? true : false;
  }

  #displayTile = null;
  get displayTile() {
    return this.#displayTile;
  }
  set displayTile(value) {
    let str = value.tagName;

    if (str === "DIV" && value.classList.contains("tile")) {
      this.#displayTile = value;
    }
  }

  #tileStatus = TileStatus.blank;
  get tileStatus() {
    return this.#tileStatus;
  }
  set tileStatus(value) {
    switch (value) {
      case TileStatus.blank:
        this.#tileStatus = TileStatus.blank;
        this.displayTile.classList.remove(
          "darkGrayTile",
          "yellowTile",
          "greenTile"
        );
        this.displayTile.classList.add("lightGrayTile");
        break;
      case TileStatus.wrong:
        this.#tileStatus = TileStatus.wrong;
        this.displayTile.classList.remove(
          "lightGrayTile",
          "yellowTile",
          "greenTile"
        );
        this.displayTile.classList.add("darkGrayTile");
        break;
      case TileStatus.yellow:
        this.#tileStatus = TileStatus.yellow;
        this.displayTile.classList.remove(
          "lightGrayTile",
          "greenTile",
          "darkGrayTile"
        );
        this.displayTile.classList.add("yellowTile");
        break;
      case TileStatus.green:
        this.#tileStatus = TileStatus.green;
        this.displayTile.classList.remove(
          "lightGrayTile",
          "yellowTile",
          "darkGrayTile"
        );
        this.displayTile.classList.add("greenTile");
        break;
      default:
        this.#tileStatus = TileStatus.blank;
        this.displayTile.classList.remove(
          "darkGrayTile",
          "yellowTile",
          "greenTile"
        );
        this.displayTile.classList.add("lightGrayTile");
        break;
    }
  }
}

/*******************
 * *****************
 * @name DisplayRow
 * @description One row of tiles
 *
 * *****************
 ******************/

class DisplayRow {
  constructor() {
    this.tiles = []; //Holds DisplayTiles
  }

  tilePointer = new currentTileTracker(
    this.onBeforeTileChanged,
    this.onAfterTileChanged
  );

  addTile(value) {
    let str = value.tagName;
    if (this.tiles.length < 5) {
      this.tiles.push(value);
    }
  }

  #documentRow = null;
  get documentRow() {
    return this.#documentRow;
  }
  set documentRow(value) {
    let str = value.tagName;
    if (str === "DIV" && value.classList.contains("wodrleRow")) {
      this.#documentRow = value;
    }
  }

  areAllTilesFilled() {
    for (let i = 0; i < this.tiles.length; i++) {
      const tile = this.tiles[i];
      if (!tile.hasValue) {
        return false;
      }
    }
    return true;
  }

  getWord() {
    if (this.areAllTilesFilled()) {
      let str = "";
      for (let i = 0; i < this.tiles.length; i++) {
        const elt = this.tiles[i];
        str += elt.toString();
      }
      return str;
    } else {
      return null;
    }
  }

  get currentTileIndex() {
    return this.tilePointer.currentTileIndex;
  }
  set currentTileIndex(value) {
    this.tilePointer.currentTileIndex = value;
  }

  get currentTile() {
    return this.tiles[this.currentTileIndex];
  }

  onBeforeTileChanged() {
    let dr = rows[currentRow];
    let dt = dr.tiles[dr.currentTileIndex].displayTile;
    dt.classList.remove("tileFocusWithin");
    dt.blur();
  }

  onAfterTileChanged() {
    let dr = rows[currentRow];
    let dt = dr.tiles[dr.currentTileIndex].displayTile;
    dt.classList.add("tileFocusWithin");
    dt.focus();
  }

  getTileIndex(displayTile) {
    if (
      displayTile.tagName === "DIV" &&
      displayTile.classList.contains("tile")
    ) {
      for (let i = 0; i < this.tiles.length; i++) {
        if (displayTile === this.tiles[i].displayTile) {
          return i;
        }
      }
    }
    return -1;
  }
}

class currentTileTracker {
  #noOfTiles = TILES_PER_ROW;
  get noOfTiles() {
    return this.#noOfTiles;
  }

  #callbackBeforeCurrentTileChanged;
  get callbackBeforeCurrentTileChanged() {
    return this.#callbackBeforeCurrentTileChanged;
  }
  set callbackBeforeCurrentTileChanged(value) {
    if (value === null || typeof value == "function") {
      this.#callbackBeforeCurrentTileChanged = value;
    }
  }

  #callbackAfterCurrentTileChanged;
  get callbackAfterCurrentTileChanged() {
    return this.#callbackAfterCurrentTileChanged;
  }
  set callbackAfterCurrentTileChanged(value) {
    if (value === null || typeof value == "function") {
      this.#callbackAfterCurrentTileChanged = value;
    }
  }

  constructor(fn_beforeCurrentTileChanged, fn_afterCurrentTileChanged) {
    this.callbackBeforeCurrentTileChanged = fn_beforeCurrentTileChanged;
    this.callbackAfterCurrentTileChanged = fn_afterCurrentTileChanged;
  }

  #currentTileIndex = 0;
  get currentTileIndex() {
    return this.#currentTileIndex;
  }
  set currentTileIndex(value) {
    if (value != this.#currentTileIndex) {
      if (value >= 0 && value < this.#noOfTiles) {
        this.callbackBeforeCurrentTileChanged?.();
        this.#currentTileIndex = value;
        this.callbackAfterCurrentTileChanged?.();
      }
    }
  }

  moveNext() {
    if (this.#currentTileIndex < this.#noOfTiles - 1) {
      this.currentTileIndex += 1;
    }
  }

  movePrevious() {
    if (this.#currentTileIndex > 0) {
      this.currentTileIndex -= 1;
    }
  }
}

class Words {
  constructor() {
    this.wordsList = [];
  }

  loadWords() {
    this.wordsList = words_List;
  }

  contains(word) {
    return wordsList.contains(word);
  }

  getRandomWord() {
    let index = Math.floor(Math.random() * this.wordsList.length);
    return this.wordsList[index];
  }
}

class TileStatus {
  static blank = Symbol("blank");
  static wrong = Symbol("wrong");
  static yellow = Symbol("yellow");
  static green = Symbol("green");
}
