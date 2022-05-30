import Debug from './debug.js';
import Config from './config.js';

// Base Monitor class
// handles the generics for creating a monitor of any type.
export default class Monitor {
    // setup defaults
    constructor(name, enabled) {
        this.name = name == null ? "Core Monitor" : `${name} Monitor`; // A monitor must have a type.
        this.id = name == null ? "monitors" : `stream_monitor_${name.toLowerCase().replace(/ /g,"_")}`; // the HTML ID of the monitor
        this.data = {}; // A monitor can have data of any type
        this.config = new Config(enabled || true);
        this.site = window.location.host;
        this.element; // monitor HTML element
        this.built = false; // has the monitor element been built?
        this.monitors = [];
        Debug.log(this.id, this);
    }

    // update the monitor
    update(){
        let monitor = document.getElementById(this.id);
        if (monitor) { 
            let data = monitor.getElementsByClassName('data')[0];
            if (data) data.innerText = this.text();
        }
        Debug.log([this.id, 'update'], this.data);
    }

    // add an element to the monitor
    addMonitor(monitor) {
        if (!this.monitors.includes(monitor)) { 
            this.monitors.push(monitor); 
            this.element.appendChild(monitor.element);
            monitor.config.enabled = true;
            Debug.log([this.id, 'add'], monitor);
        }
    }
    // remove an element to the monitor
    removeMonitor(monitor) {
        if (this.monitors.includes(monitor)) {
            let idx = this.monitors.indexOf(monitor);
            if (idx > -1) { this.monitors.splice(idx, 1); }
            this.element.removeChild(monitor.element);
            monitor.config.enabled = false;
            Debug.log([this.id, 'remove'], this.monitors);
        }
    }
    
    // build the monitor surround
    build(css) {
        this.element = document.createElement("div");
        this.element.id = this.id;
        this.element.classList.add(css);
        this.built = true;
    }
}
