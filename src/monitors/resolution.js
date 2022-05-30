import Monitor from '../core/monitor.js'

// The Resolution class handles all resolution data
export default class Resolution extends Monitor {
    // setup defaults
    constructor(enabled) {
        super('Resolution', enabled);
        this.displayName = "RES";
        this.data.height = window.innerHeight;
        this.data.width = window.innerWidth;
        this.config.refresh = 3000; // Resolution isn't priority, only update every 3 seconds.
    }

    // update resolution information
    update(height, width) {
        if (height > 100 && width > 200) {
            this.data.height = height;
            this.data.width = width;
        } else {
            this.data.height = window.innerHeight;
            this.data.width = window.innerWidth;
        }
        super.update();
    }

    // return resolution text
    text() { return this.data.width+" x "+this.data.height; }

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
