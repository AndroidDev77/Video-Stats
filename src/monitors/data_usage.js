import Monitor from '../core/monitor.js'

// The Resolution class handles all resolution data
export default class DataUsage extends Monitor {
    // setup defaults
    constructor(enabled) {
        super('Data Used', enabled);
        this.displayName = "DATA";
        this.data.usage = 0;
    }

    // update frame information
    update(bytes){
      
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = 2;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));
      this.data.usage = parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i] + '/S';
      super.update();
    }

    // return frame text
    text() { return this.data.usage; }

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
