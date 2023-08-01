
chrome.commands.onCommand.addListener((command) => {
  
  console.log("Handling: " + command)

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['src/content.js'],
    });
  });
});

chrome.runtime.onInstalled.addListener(async function (details) {
  console.log('Handling runtime install...', ...arguments)

  const self = await chrome.management.getSelf()

  if (details.reason === 'update'){// && self.installType !== 'development') {
    const changelogUrl = chrome.runtime.getURL('src/changelog.html')

    chrome.tabs.create({ url: changelogUrl })
  }
})