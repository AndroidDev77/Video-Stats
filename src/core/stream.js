import Monitor from './monitor.js';
import Debug from './debug.js';

// The stream class handle fetching the running game stream element.
export default class Stream extends Monitor {
    // setup defaults
    constructor() {
        super("Stream");
        this.data.frame = {};
        this.data.frame.rate = 0;
        this.data.frame.drop = 0;
        this.data.height = 0;
        this.data.width = 0;
        this.data.stream_id = "";
        this.data.element = "";
        this.data.data_usage = 0;
		this.data.prev_data_usage = 0;
		this.data.curr_data_usage = 0;
        this.data.rtc = {};
    }

    // nice wrapper for updating stream info
    update() { 
        this.data.element = this.getStream();   
		if(this.data?.element?.webkitDecodedFrameCount != false)
			this.data.frame.rate = this.data.element.webkitDecodedFrameCount || 0;
		this.data.frame.drop = this.data.element.webkitDroppedFrameCount || 0;
        this.data.height = this.data.element.videoHeight || 0;
        this.data.width = this.data.element.videoWidth || 0;
        this.data.prev_data_usage = this.data.curr_data_usage ;
        this.data.curr_data_usage =  this.getDataUsage() || 0;
        this.data.data_usage = this.data.curr_data_usage - this.data.prev_data_usage;
    }

    getDataUsage() {
        if (this.site == "stadia.google.com") {
            this.data.rtc.base = window.StreamMonitorPeer;
            this.data.rtc.state = window.StreamMonitorPeer.connectionState;

            if (this.data.rtc.state == 'connected') {
                this.data.rtc.base.getStats().then(stats => {    
                                    
                    for (const key of stats.keys()) {
                        if (key.indexOf('RTCInboundRTPVideoStream') != -1) {
                            this.data.rtc.stream = stats.get(key);
                            break;
                        }
                    }
                });

                Debug.log([this.id, "data",'rtc'], this.data.rtc);
                return this.data.rtc.stream.bytesReceived;
            } 
        } else {
			
            return this.data.element.webkitVideoDecodedByteCount ;
        }
    }

    // attribute accessors
    height() { return this.data.height; }
    width() { return this.data.width; }

    getStream(){
		
		if (this.site == "tv.apple.com"){
			let video = document.querySelector("body > apple-tv-plus-player").shadowRoot.querySelector("amp-window-takeover > div > amp-video-player-internal").shadowRoot.querySelector("amp-video-player").shadowRoot.querySelector("#apple-music-video-player");
			return video;
		}
        // fetch all video elements on the page
        let videoElements = document.getElementsByTagName('video');

        // if we've found a stream before, we don't need to go hunting through the array again.
        if (videoElements[this.data.stream_id] && 
            videoElements[this.data.stream_id].srcObject && 
            videoElements[this.data.stream_id].srcObject.active) {
            Debug.log([this.id,"getStream",'videoElement'], videoElements[this.data.stream_id].srcObject);
            return videoElements[this.data.stream_id];
        }

        // find the video element with an id set
        for (let video of videoElements) {
            // this element is most likely the game stream     
            // For some reason Stadia occasionally duplicates video elements and id's, 
            // so we also need to check that a srcObject exists.       
            if (video.id && video.srcObject && video.srcObject.active) {
                this.data.stream_id = video.id;
                Debug.log([this.id,"getStream",'video'], video);
                return video;
            }
        }
        let video = videoElements[0]; // First video element found
        Debug.log([this.id,"getStream",'defaulting to first element'], video);
        return video;
    }
}