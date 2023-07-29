document.addEventListener('DOMContentLoaded', function () {

  // API key save
  document.getElementById('save-key').addEventListener('click', function () {
    const value = document.getElementById('api-key').value;
    console.log(value);
    chrome.storage.local.set({ 'open-ai-key': value }).then(() => {
      console.log("New API key saved");
    });
  });

  // Query save
  document.getElementById('save-query').addEventListener('click', function () {
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

  // Set query by default is it is already there
  chrome.storage.local.get(['gpt-query']).then((result) => {
    document.getElementById('gpt-query').value =
      result['gpt-query'] || "You are a ghostwriter and reply to the user's tweets by talking directly to the person, you must keep it short, exclude hashtags.";
  });

  chrome.storage.local.get(['open-ai-key']).then((result) => {
    document.getElementById('api-key').value = result['open-ai-key'];
  });
}); 