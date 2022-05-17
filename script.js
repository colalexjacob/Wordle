const NO_OF_ROWS = 6;
const TILES_PER_ROW = 5;

let words; // Class. Contains list of words
let rowsContainer; // DOM element to hold all rows 
let rows = [];

let currentRow = 0;
let currentCol = 0;

window.addEventListener('load', onWindowLoad);

function onWindowLoad(event) {
    words = new Words();
    words.loadWords();

    rowsContainer = document.querySelector('#rowsContainer');
    setUpTiles();

    let keyBoardkeys = document.querySelectorAll(".keyBoardRow .keyBoardKey" );
    for (let index = 0; index < keyBoardkeys.length; index++) {
        keyBoardkeys[index].addEventListener('click', onKeyBoardKeyClick);
    }
}

function setUpTiles() {
    if(rows.length > 0) {
        rows.length = 0;
    }

    for (let index = 0; index < NO_OF_ROWS; index++) {
        let newRow = document.createElement("div");
        newRow.id = `row${index}`;
        newRow.className = 'wodrleRow';
        let dr = new DisplayRow();
        dr.documentRow = newRow;
        rows.push(dr);

        for (let n = 0; n < TILES_PER_ROW; n++) {
            let newTile = document.createElement("div");
            newTile.id = `R${index}C${n}`;
            newTile.className = 'tile lightGrayTile';
            let dt = new DisplayTile;
            dt.displayTile = newTile;
            dt.addEventListener('keyChanged', onTileKeyChanged);
            dr.tiles.push(dt);
            newRow.append(newTile);
        }
        rowsContainer.append(newRow);
    }   
}

function onKeyBoardKeyClick(event) {
    let keyBoardKey = event.target;
    let chrCode = Number(keyBoardKey.dataset.key);

    doKeyPress(chrCode);
}

function doKeyPress(key) {
    if(key === 8) {
        if(currentCol > 0){

        }
    }
    if(currentCol < 5){
        if(key === 8 || key === 13 || (key >= 97 && key <= 122)){

        }
    }
}

function onTileKeyChanged(event) {
    let tile = event.target;
    tile.displayTile.innerText = tile.key;
}