// import classes
import Monitor from "./monitor.js";
import Debug from './debug.js';
import Options from "./options.js";
import FrameDrop from "../monitors/frame_drops.js";
import Resolution from "../monitors/resolution.js";
import FrameRate from '../monitors/frame_rate.js';
import DataUsage from '../monitors/data_usage.js';
import Time from '../monitors/time.js';

// main Extension class
// This class handles almost everything in that you can see on the page (not the popup.html)
export default class Extension {
    constructor(){
        this.id = "stream_monitor";             // css & debug id
        this.name = "Stream Monitor";           // Extension name
        this.core = new Monitor();              // This is the monitor all other monitors are built from
        this.options = new Options();           // Main visual component options
        this.resolution = new Resolution();     // Resolution Monitor
        this.frame_rate = new FrameRate();      // Frame Rate Monitor
        this.frame_drop = new FrameDrop();      // Frame Drop Monitor
        this.data_usage = new DataUsage();      // Data Usage Monitor
        this.time = new Time();                 // Time Monitor
        this.element;                           // Main HTML element
        this.built = false;                     // Has it been built or not?
        this.setup();                           // Setup the extension     
        Debug.log([this.id,"initialized"], this);
    }

    // build monitor elements
    setup(){        
        Debug.log([this.id,"setup", "start"], this);
        this.core.build('container');       // This is the black surround for the other monitors
        this.resolution.build('monitor');   // Resolution element
        this.frame_rate.build('monitor');   // Frame Rate element
        this.frame_drop.build('monitor');   // Frame Drop element
        this.data_usage.build('monitor');   // Frame Drop element
        this.time.build('monitor');         // Time element
        this.build();                       // This is an invisible bar the core sits inside of.
        Debug.log([this.id,"setup", "end"], this);
    }

    load(message) {
        if (message.options.position) { 
            if (this.options.position != message.options.position) {
                this.options.position = message.options.position;
                this.reset();
            }
        }         
        
        if (message.options.resolution.enabled) {
            this.core.addMonitor(this.resolution);
        } else {
            this.resolution.config.enabled = false;
        }
        if (message.options.frame_rate.enabled) {
            this.core.addMonitor(this.frame_rate);
        } else {
            this.frame_rate.config.enabled = false;
        }
        if (message.options.frame_drop.enabled) {
            this.core.addMonitor(this.frame_drop);
        } else {
            this.frame_drop.config.enabled = false;
        }
        if (message.options.data_usage.enabled) {
            this.core.addMonitor(this.data_usage);
        } else {
            this.data_usage.config.enabled = false;
        }
        if (message.options.time.enabled) {
            this.core.addMonitor(this.time);
        } else {
            this.time.config.enabled = false;
        }

        Debug.log([this.id, "loaded"], this, 'warn');
    }

    // Update the extension and all its counter parts
    update(message) {
        Debug.log([this.id, "update", "message"], message);

        if (message.options.position) { 
            if (this.options.position != message.options.position.newValue) {
                this.options.position = message.options.position.newValue;
                this.reset();
            }
        }         
        
        if (message.options.resolution) {
            this.toggleMonitor(this.resolution, message.options.resolution);
        }
        if (message.options.frame_rate) {
            this.toggleMonitor(this.frame_rate, message.options.frame_rate);
        }
        if (message.options.frame_drop) {
            this.toggleMonitor(this.frame_drop, message.options.frame_drop);
        }
        if (message.options.data_usage) {
            this.toggleMonitor(this.data_usage, message.options.data_usage);
        }
        if (message.options.time) {
            this.toggleMonitor(this.time, message.options.time);
        }

        Debug.log([this.id, "updated"], this, 'warn');
    }

    // Toggle the visibility of any registered monitor
    toggleMonitor(object, toggle){
        Debug.log([this.id, "toggleMonitor"], [object, toggle]);
        if (toggle.newValue.enabled) {
            this.core.addMonitor(object);
        } else {
            this.core.removeMonitor(object);
        }
    }

    // Reset the extension
    // This is called after each change to the main extension
    // monitors act independently of this.
    reset() {
        document.body.removeChild(this.element);
        this.build();
        document.body.appendChild(this.element);  
    }

    // Build the extension!
    build() {
        this.element = document.createElement('div');
        this.element.id = this.id;
        if (Array.isArray(this.options.position)) {
            for (let pos in this.options.position) { 
                this.element.classList.add(this.options.position[pos]); 
            }
        } else {
            this.element.classList.add(this.options.position); 
        }
        this.element.appendChild(this.core.element);
        this.built = true;
    }
}