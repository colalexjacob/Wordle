class DisplayTile {
    static keyChangedEvent = new Event("keyChanged", {"bubbles":true, "cancelable":true});

    #key = null;
    get key() {
        return this.#key;
    }
    set key(value) {
        if(value === "") {
            value = null;
        }
        if(value >= 65 && value <= 90) {
            if(value != this.#key){
                this.#key = value;
                this.dispatchEvent('function eventHandler(event) {');
            }
        }
        else if (value == null) {
            if(value != this.#key){
                this.#key = value;
                this.dispatchEvent('keyChangedEvent');
            } 
        }
    }

    toString() {
        return this.#key ? String.fromCharCode(this.#key) : null;
    }

    hasValue() {
        return !(this.#key == null);
    }

    #wasHintTaken = false;
    get wasHintTaken() {
        return this.#wasHintTaken;
    }
    set wasHintTaken (value) {
        this.#wasHintTaken = value ? true : false;
    }

    #displayTile = null;
    get displayTile() {
        return this.#displayTile;
    }
    set displayTile(value) {
       this.#displayTile = value; 
    }

    addEventListener(type, callback){
        
    }

    eventHandler(event) {
        if(event.type === 'keyChanged') {

        }
    }

}

class DisplayRow {
    constructor() {
        this.tiles = [];
    }

    static tileAddedEvent = new Event("tileAdded", {"bubbles":true, "cancelable":true});

    addTile(value) {
        if(this.tiles.length < 5){
            this.tiles.push(value);
            this.#documentRow.dispatchEvent('tileAdded');
        }
    }

    #documentRow = null;
    get documentRow() {
        return this.#documentRow;
    }
    set documentRow(value) {
       this.#documentRow = value; 
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