import Debug from './debug.js';

// Current there aren't many options for the main extension yet
// This will probably expand in the future
export default class Options {
    constructor(){
        this.position = "top";
        Debug.log("options", this);
    }
}