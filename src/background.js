'use strict';

// Default Options
const init_data = {
  position: "top",
  resolution: { enabled: true, refresh: 3000 },
  frame_rate: { enabled: true, refresh: 1000 },
  frame_drop: { enabled: true, refresh: 1000 },
  data_usage: { enabled: true, refresh: 1000 },
  time: { enabled: true, refresh: 1000 }
};

// set defaults when first installed.
chrome.runtime.onInstalled.addListener(function () {   
  // clear out any data from previous installations
  chrome.storage.sync.clear();

  // set initial defaults
  chrome.storage.sync.get(init_data, (stored_data) => chrome.storage.sync.set(stored_data));

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
   chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: 'stadia.google.com', schemes: ['https'] }
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: 'www.youtube.com', schemes: ['https'] }
        }),
		new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: 'www.netflix.com', schemes: ['https'] }
        }),
		new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: 'tv.apple.com', schemes: ['https'] }
        }),		
		new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: 'play.hbomax.com', schemes: ['https'] }
        }),	
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: 'www.twitch.tv', schemes: ['https'] }
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onStartup.addListener(function() {
  chrome.storage.sync.get(init_data, (stored_data) => chrome.storage.sync.set(stored_data));
});

// Events sent from the popup
// if any settings change in the popup.html, fire an event to update the content pages.
chrome.storage.onChanged.addListener((changes) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      from: 'background',
      subject: 'update',
      updates: changes
    });
  });
});

// Messages received from the page
chrome.runtime.onMessage.addListener((message, sender, response) => {
  console.log("message received", message);

  if (message.from == 'content') {
    if (message.subject == 'settings') {

      chrome.storage.sync.get(init_data, (stored_data) => {
        console.log('settings', stored_data);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, {
              from: 'background',
              subject: 'settings',
              settings: stored_data
            });
          }
        });
      });
    }      
  }  
});