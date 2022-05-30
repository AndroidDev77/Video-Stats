'use strict';

let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
// Inject the script tag programmatically so we can make use of ES6 modules
const monitor = document.createElement('script');
monitor.setAttribute("type", "module");
monitor.setAttribute("src", chrome.extension.getURL('src/main.js'));

const DebugLevel = 2;

// We have to pass a message from the background via the content js 
// so that it understands the page context.
chrome.runtime.onMessage.addListener((message, sender, callback) => {
    if (DebugLevel < 2) { console.info(`%c[${timestamp}][received][message]`, 'color: #aed581;', message); }
    
    if (message.from == 'background') {
        if (message.subject == 'settings') {

            if (DebugLevel < 2) { console.info(`%c[${timestamp}][sent][event]`, 'color: #81d4fa;', message.settings); }
            window.dispatchEvent(new CustomEvent('stream_monitor_load_settings', 
                {detail: {options: message.settings}}
            ));
            callback({success: true, data: message});
        }
        if (message.subject == 'update') {

            if (DebugLevel < 2) { console.info(`%c[${timestamp}][sent][event]`, 'color: #81d4fa;', message.updates); }
            window.dispatchEvent(new CustomEvent('stream_monitor_update', 
                {detail: {options: message.updates}}
            ));
            callback({success: true, data: message});
        }
    }
    callback({success: false, data: chrome.runtime.lastError});
});

window.addEventListener('stream_monitor_settings_sync', function(event){
    if (DebugLevel < 2) { 
        console.info(`%c[${timestamp}][received][event]`, 'color: #aed581;', {
            event: 'stream_monitor_settings_sync',
            data: event.detail
        });
    }

    chrome.runtime.sendMessage({
        from: 'content',
        subject: 'settings',
        settings: event.detail
    });
});


let content = '('+function() { 

    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const DebugLevel = 2;

    // Override the browser's default RTCPeerConnection. 
    let StreamMonitorPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    // Make sure it is supported
    if (StreamMonitorPeerConnection) {

        if (DebugLevel < 2) { 
                console.info(`%c[${timestamp}][searching][RTCPeerConnection]`, 'color: #81d4fa;', {
                event: 'stream_monitor_rtc_peer_connection',
                data: StreamMonitorPeerConnection
            });
        }

        //our own RTCPeerConnection
        let newPeerConnection = function(config, constraints) {
            // proxy the original peer connection
            let peerConnection = new StreamMonitorPeerConnection(config, constraints);

            if (DebugLevel < 2) { 
                console.info(`%c[${timestamp}][found][RTCPeerConnection]`, 'color: #aed581;', {
                    event: 'stream_monitor_rtc_peer_connection',
                    data: peerConnection
                });
            }

            let originalAddStream = peerConnection.addStream;

            //addStream is called when a local stream is added. 
            //arguments[0] is a local media stream
            peerConnection.addStream = function() {
                if (DebugLevel < 2) { 
                    console.info(`%c[${timestamp}][received][RTCPeerConnection]`, 'color: #aed581;', {
                        event: 'stream_monitor_rtc_add_stream',
                    });
                }
                return originalAddStream.apply(this, arguments);
            }

            window.StreamMonitorPeer = peerConnection;
            return peerConnection; 
        };

    ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection'].forEach(function(obj) {
        // Override objects if they exist in the window object
        if (window.hasOwnProperty(obj)) {
            window[obj] = newPeerConnection;
            // Copy the static methods
            Object.keys(StreamMonitorPeerConnection).forEach(function(x){
                window[obj][x] = StreamMonitorPeerConnection[x];
            })
            window[obj].prototype = StreamMonitorPeerConnection.prototype;
        }
    });
  }

}+')()';



// append the script tag to the document body so it doesn't slow down the page load.
const body = document.body || document.getElementsByTagName("body")[0];
body.insertBefore(monitor, body.lastChild);

const rtc = document.createElement('script');
rtc.id = "stream_monitor_rtc";
rtc.text = content;
(document.head||document.documentElement).appendChild(rtc);