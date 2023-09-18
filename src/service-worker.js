
chrome.commands.onCommand.addListener((command) => {
  console.log("Handling: " + command)

  if (command === 'generate_reply') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['src/content.js'],
      });
    });
  } else if (command === "move_to_next_button") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['src/move-to-next-button.js']
      });
    });
  } else if (command === "move_to_previous_button") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['src/move-to-previous-button.js']
      });
    });
  }
});


//chrome.scripting.registerContentScripts({
//  matches: ["https://twitter.com/*"],
//  files: ['src/single-reply-content.js'],
//});

chrome.runtime.onInstalled.addListener(async function (details) {
  console.log('Handling runtime install...', ...arguments)

  const self = await chrome.management.getSelf()

  if (details.reason === 'update' && self.installType !== 'development') {
    const changelogUrl = chrome.runtime.getURL('src/changelog.html')

    chrome.tabs.create({ url: changelogUrl })
  }
})

chrome.runtime.setUninstallURL(
  'https://xreplygpt.com/uninstall.html'
)

chrome.runtime.onInstalled.addListener(function (details) {
  chrome.tabs.create({ url: 'https://xreplygpt.com/welcome.html' });
});