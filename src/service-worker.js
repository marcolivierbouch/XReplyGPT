
chrome.commands.onCommand.addListener((command) => {
  console.log(command)
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['src/content.js'],
    });
  });
});