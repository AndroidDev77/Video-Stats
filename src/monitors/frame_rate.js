import Monitor from '../core/monitor.js'

// The Resolution class handles all resolution data
export default class FrameRate extends Monitor {
    // setup defaults
    constructor(enabled) {
        super('Frame Rate', enabled);
        this.displayName = "FPS";
        this.data.rate = 0;
        this.data.current = 0;
    }

    // update frame information
    update(current){
        this.data.rate = Math.round(current - this.data.current);
        this.data.current = current;
        super.update();
    }

    // return frame text
    text() { return this.data.rate; }

    // build the element
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
