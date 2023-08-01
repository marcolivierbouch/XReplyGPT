document.addEventListener('DOMContentLoaded', function () {

  // API key save
  document.getElementById('api-key').addEventListener('change', function () {
    const value = document.getElementById('api-key').value;
    console.log(value);
    chrome.storage.local.set({ 'open-ai-key': value }).then(() => {
      console.log("New API key saved");
    });
  });

  // Query save
  document.getElementById('gpt-query').addEventListener('change', function () {
    const value = document.getElementById('gpt-query').value;
    console.log(value);
    chrome.storage.local.set({ 'gpt-query': value }).then(() => {
      console.log("New GPT query saved");
    });
  });

  document.getElementById('show-api-key').addEventListener('click', function (event) {
    const isChecked = document.getElementById('show-api-key').checked;
    if (isChecked) {
      document.getElementById('api-key').setAttribute('type', 'text');
    } else {
      document.getElementById('api-key').setAttribute('type', 'password');
    }
  });

  document.getElementById('window-close').addEventListener('click', function (event) {
    const isChecked = document.getElementById('window-close').checked;
    if (isChecked) {
      chrome.storage.local.set({ 'automatic-window-close': true }).then(() => {
        console.log("Automatic window close enabled");
      });
    } else {
      chrome.storage.local.set({ 'automatic-window-close': false }).then(() => {
        console.log("Automatic window close disabled");
      });
    }
  });

  // Set query by default is it is already there
  chrome.storage.local.get(['gpt-query']).then((result) => {
    document.getElementById('gpt-query').value =
      result['gpt-query'] || "You are a ghostwriter and reply to the user's tweets by talking directly to the person, you must keep it short, exclude hashtags.";
  });

  chrome.storage.local.get(['open-ai-key']).then((result) => {
    if (result['open-ai-key'] == undefined) {
      document.getElementById('api-key').value = "Change this value with your API key";
    } else {
      document.getElementById('api-key').value = result['open-ai-key'];
    }
  });

  chrome.storage.local.get(['automatic-window-close']).then((result) => {
    if (result['automatic-window-close'] == undefined) {
      document.getElementById('window-close').checked = true;
    } else {
      document.getElementById('window-close').checked = result['automatic-window-close'];
    }
  });

  chrome.storage.local.get(['automatic-window-close']).then((result) => {
    document.getElementById('window-close').checked = result['automatic-window-close'];
  });
}); 