function getOpenAIModels(apiKey) {
  return fetch('https://api.openai.com/v1/models', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    }
  }).then(response => response.json());
}

function validateApiKey() {
  const apiKey = document.getElementById('api-key').value;
  const gptQueryInput = document.getElementById('gpt-query');
  const apiKeyInput = document.getElementById('api-key');
  const validateButton = document.getElementById('validate-button');
  const selectModels = document.getElementById('models-select');

  getOpenAIModels(apiKey)
      .then((response) => {
          if (response['error'] !== undefined) {
              apiKeyInput.style.borderColor = 'red';
              gptQueryInput.disabled = true;
              selectModels.disabled = true;
              validateButton.classList.add('invalid');
          } else {
              apiKeyInput.style.borderColor = 'green';
              gptQueryInput.disabled = false;
              selectModels.disabled = false;
              loadAndPopulateModels()
              validateButton.classList.remove('invalid');
          }
      })
      .catch((error) => {
          console.error('Error occurred during API key validation:', error);
          apiKeyInput.style.borderColor = 'red';
          gptQueryInput.disabled = true;
          selectModels.disabled = true;
          validateButton.classList.add('invalid');
      });
}

function loadAndPopulateModels() {
    const apiKey = document.getElementById('api-key').value;

    getOpenAIModels(apiKey)
        .then((response) => {
            const modelSelect = document.getElementById('models-select');

            // Clear existing options
            modelSelect.innerHTML = '';

            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = 'gpt-3.5-turbo';
            defaultOption.text = 'gpt-3.5-turbo';
            defaultOption.selected = true;
            modelSelect.appendChild(defaultOption);

            // Add models from response
            console.log(response.data);
            response.data.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.text = model.id;
                modelSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error loading models:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {

  // API key save
  document.getElementById('api-key').addEventListener('change', function () {
    const value = document.getElementById('api-key').value;
    chrome.storage.local.set({ 'open-ai-key': value }).then(() => {
      console.log("New API key saved");
    });
    validateApiKey();
  });
  
  document.getElementById('validate-button').addEventListener('click', validateApiKey);

  document.getElementById('models-select').addEventListener('change', function () {
    const value = document.getElementById('models-select').value;
    chrome.storage.local.set({ 'openai-model': value }).then(() => {
      console.log("New OpenAI model saved");
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
      document.getElementById('api-key').value = "";
      document.getElementById('validate-button').classList.add('invalid');
    } else {
      document.getElementById('api-key').value = result['open-ai-key'];
      validateApiKey();
    }
  });

  chrome.storage.local.get(['openai-model']).then((result) => {
    console.log(result);
    if (result['openai-model'] == undefined) {
      chrome.storage.local.set({ 'openai-model': 'gpt-3.5-turbo' })
    }
  });

  chrome.storage.local.get(['automatic-window-close']).then((result) => {
    if (result['automatic-window-close'] == undefined) {
      document.getElementById('window-close').checked = true;
      chrome.storage.local.set({ 'automatic-window-close': true }).then(() => {
        console.log("Automatic window close enabled");
      });
    } else {
      document.getElementById('window-close').checked = result['automatic-window-close'];
    }
  });
}); 