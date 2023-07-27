document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('save').addEventListener('click', function() {
    const value = document.getElementById('api-key').value;
    console.log(value);
    chrome.storage.local.set({ 'open-ai-key': value }).then(() => {
        console.log("New API key saved");
    });
  });
});