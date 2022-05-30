'use strict';
// import classes
import Debug from './core/debug.js';
import Extension from './core/extension.js';
import Stream from './core/stream.js';

// Enable / disable all debug info
Debug.enabled = true;
Debug.level = 2;

Debug.log('stream_monitor', "Stream Monitor is starting...", "warn");
let get_settings = new CustomEvent("stream_monitor_settings_sync", {detail: 'all'});

// initialize extension and stream elements
let extension = new Extension();
let stream = new Stream(); 

window.addEventListener('load', function() {
    
    document.body.appendChild(extension.element);
    Debug.log(['event'], get_settings, 'sent');

    window.dispatchEvent(get_settings);

    // update stream info 
    window.setInterval(function(){
        stream.update();
    }, extension.core.config.refresh);

    // Add the frame drop & rate intervals
    window.setInterval(function(){
        if (extension.frame_rate.config.enabled) {extension.frame_rate.update(stream.data.frame.rate); } 
        if (extension.frame_drop.config.enabled) {extension.frame_drop.update(stream.data.frame.drop); }
        if (extension.data_usage.config.enabled) {extension.data_usage.update(stream.data.data_usage); }
    }, extension.core.config.refresh);

    // Add the resolution intervals
    window.setInterval(function(){       
        if (extension.resolution.config.enabled) {
            extension.resolution.update(stream.data.height, stream.data.width);
        }
    }, extension.resolution.config.refresh);

    // Add the time intervals
    window.setInterval(function(){       
        if (extension.time.config.enabled) {
            extension.time.update();
        }
    }, extension.time.config.refresh);

    // Add global accessor
    let monitor = { debug: Debug, extension: extension, stream: stream }
    window.StreamMonitor = monitor;
    Debug.log(extension.id, monitor);
    console.info(`%c[${extension.id}]`, 'color: #FFB86A;', "Stream Monitor accessible via window.StreamMonitor");
})

// listen for update requests from the popup.html
window.addEventListener('stream_monitor_load_settings', function(event){
    Debug.log(['event'], event.detail, 'received');
    extension.load(event.detail);
});

// listen for update requests from the popup.html
window.addEventListener('stream_monitor_update', function(event){
    Debug.log(['event'], event.detail, 'received');
    extension.update(event.detail);
});

