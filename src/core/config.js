// Configuration manager class
export default class Config {
    constructor(enabled){
        this.enabled = enabled || true; // is the monitor enabled?
        this.refresh = 1000; // how often the monitor data is refreshed
    }

    // toggle the visibility of the monitor
    toggleVisibility(){
        this.enabled = !this.enabled;
    }
}