
function waitForElement(selector) {
  return new Promise(function(resolve, reject) {
      var element = document.querySelector(selector);

      if(element) {
          resolve(element);
          return;
      }

      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var nodes = Array.from(mutation.addedNodes);
            for(var node of nodes) {
                if(node.querySelectorAll) {
                    var elements = node.querySelectorAll(selector);
                    if(elements && elements.length > 0) {
                        observer.disconnect();
                        resolve(elements[0]);
                        return;
                    }
                }
            };
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

function waitForElementRemoval(selector) {
  return new Promise(function(resolve, reject) {
      var element = document.querySelector(selector);

      if(!element) {
          resolve();
          return;
      }

      var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
              var nodes = Array.from(mutation.removedNodes);
              for(var node of nodes) {
                  if(node.matches && node.matches(selector)) {
                      observer.disconnect();
                      resolve();
                      return;
                  }
                  if(node.querySelectorAll) {
                      var elements = node.querySelectorAll(selector);
                      if(elements.length) {
                          observer.disconnect();
                          resolve();
                          return;
                      }
                  }
              }
          });
      });

      observer.observe(document.body, { childList: true, subtree: true });
  });
}

async function waitForElementsBeforeQuit() {
  console.log("page is fully loaded");
  await waitForElement('[data-testid="mask"]')
  console.log("element found");
  await waitForElementRemoval('[data-testid="mask"]')
  console.log("element removed");
  window.close();
}


chrome.storage.local.get(['automatic-window-close']).then((result) => {
  if (result['automatic-window-close'] == undefined) {
    result = { 'automatic-window-close': true };
  }

  if (result['automatic-window-close']) {
    console.log('before event');
    waitForElementsBeforeQuit();
  }
})

