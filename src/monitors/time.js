import Monitor from '../core/monitor.js';

// The Resolution class handles all resolution data
export default class Time extends Monitor {
    // setup defaults
    constructor(enabled) {
        super('Time', enabled);
        this.displayName = "TIME";
        this.data.hours = new Date().getHours();
        this.data.mins = new Date().getMinutes();
    }

    // update resolution information
    update() {
        this.data.hours = new Date().getHours();
        this.data.mins = new Date().getMinutes();
        super.update();
    }

    // return resolution text
    text() { return `${this.padTime(this.data.hours)}:${this.padTime(this.data.mins)}`; }

    // Add leading 0 for numbers below 10
    padTime(unit){
        return (unit < 10) ? `0${unit}` : `${unit}`;
    }
    // build resolution element
    build(css) {
        super.build(css);
        let name =  document.createElement("div");
        name.classList.add('name');
        name.innerText = this.displayName;

        let data = document.createElement('b');
        data.classList.add('data');
        data.innerHTML = this.text();

        this.element.appendChild(name);
        this.element.appendChild(data);
    }
}