// Custom debug module for ease of development.
class Debug {
    // global debug flag
    constructor(){
        this.enabled = false;
        this.level = 2;
    }

    get levels() {
        console.log({
            0: "info",
            1: "warning",
            2: "error"
        });
    }

    log(name, message, log_level = "info") {

        // don't output logs if debugging is disabled
        if (!this.enabled) { return; }
    
        let file = `[${name}]`;
    
        if (Array.isArray(name)){
            file = "[";
            name.forEach((n, key, arr) => {
                // Only add joining dot if not the last in array
                file += (Object.is(arr.length - 1, key)) ? `${n}` : `${n}.`;
            });
            file += "]";
        }
    
        let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    
        switch(log_level) {
            case "info":
                if (this.level < 1) { console.info(`[${timestamp}]${file}`, message); }
                break;
            case "warn":
                if (this.level < 2) { console.info(`%c[${timestamp}]${file}`, 'color: #FFB86A;', message); }
                break;
            case "error":
                if (this.level < 3) { console.info(`%c[${timestamp}]${file}`, 'color: #EF83A9;', message); }
                break;            
            case "sent":
                if (this.level < 1) { console.info(`%c[${timestamp}][sent]${file}`, 'color: #81d4fa;', message); }
                break;
            case "received":
                if (this.level < 1) { console.info(`%c[${timestamp}][received]${file}`, 'color: #aed581;', message); }
                break;
    
            default:
                console.log(`[${timestamp}]${file}`, message);
        }
    }

}

export default (new Debug);