// Default Options
const init_data = {
  position: "top",
  resolution: { enabled: true, refresh: 3000 },
  frame_rate: { enabled: true, refresh: 1000 },
  frame_drop: { enabled: true, refresh: 1000 },
  data_usage: { enabled: true, refresh: 1000 },
  time: { enabled: true, refresh: 1000 }
};
const show_data = {
  resolution: { enabled: true, refresh: 3000 },
  frame_rate: { enabled: true, refresh: 1000 },
  frame_drop: { enabled: true, refresh: 1000 },
  data_usage: { enabled: true, refresh: 1000 },
  time: { enabled: true, refresh: 1000 }
};
const hide_data = {
  resolution: { enabled: false, refresh: 3000 },
  frame_rate: { enabled: false, refresh: 1000 },
  frame_drop: { enabled: false, refresh: 1000 },
  data_usage: { enabled: false, refresh: 1000 },
  time: { enabled: false, refresh: 1000 }
};

function load(){
  chrome.storage.sync.get(init_data, (stored_data) => update_data(stored_data));

  // Click handler for the Apply button
  document.getElementById('apply_monitor_options').onclick = () => apply();
  // Click handler for the Reset button
  document.getElementById('reset_monitor_options').onclick = () => reset();
  // Click handler for the Show All button
  document.getElementById('show_monitor_options').onclick = () => show();
  // Click handler for the Hide All button
  document.getElementById('hide_monitor_options').onclick = () => hide();

  // Click handler for the links
  let links = document.querySelectorAll('a');
  for (const link in links) {
    if (links.hasOwnProperty(link)) {
      const a = links[link];
      a.onclick = function() {
        chrome.tabs.create({url: a.getAttribute('href')}); 
      }   
    }
  }

  // Get the extension version for display
  document.getElementById('version').innerText = chrome ? `v${chrome.app.getDetails().version}` : 'v00.00.00';
}

// Show All Monitors
function show() { chrome.storage.sync.set(show_data, () => update_data(show_data)); }
// Hide All Monitors
function hide() { chrome.storage.sync.set(hide_data, () => update_data(hide_data)); }
// Reset All Monitors
function reset() { chrome.storage.sync.set(init_data, () => update_data(init_data)); }

// Apply the selected options
function apply(){
  let positions = document.getElementById('display_position');

  chrome.storage.sync.set({
    position: positions.options[positions.selectedIndex].value.split(" "),
    resolution: { enabled: document.getElementById("resolution").checked, refresh: 3000 },
    frame_rate: { enabled: document.getElementById("frame_rate").checked, refresh: 1000 },
    frame_drop: { enabled: document.getElementById("frame_drop").checked, refresh: 1000 },
    data_usage: { enabled: document.getElementById("data_usage").checked, refresh: 1000 },
    time: { enabled: document.getElementById("time").checked, refresh: 1000, showSeconds: true }
  });
}

// Update UI Elements
function update_data(data) {
  // Hide / Show all do not pass in a position
  if (data.position) {
    document.getElementById('display_position').selectedIndex = getIndexForPosition(data.position);
  }
  document.getElementById("resolution").checked = data.resolution.enabled;
  document.getElementById("frame_rate").checked = data.frame_rate.enabled;
  document.getElementById("frame_drop").checked = data.frame_drop.enabled;
  document.getElementById("data_usage").checked = data.data_usage.enabled;
  document.getElementById("time").checked = data.time.enabled;
}

// Get Index for select box by value
function getIndexForPosition(value) {
  position = value;
  // might be an Array
  if (Array.isArray(value)) {
    position = value.join(" ");
  }

  let positions = document.getElementById('display_position');
  for(let i in positions) {
    let pos = positions.options[i].value;
    if (pos == position) {
      return i;
    }
  }
}

document.addEventListener('DOMContentLoaded', load);