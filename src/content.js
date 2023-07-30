
window.articles = document.querySelectorAll('[data-testid="tweet"]');

if (window.articles) {
    window.articles.forEach(async article => {
        const content = article.querySelector('[data-testid="tweet"] [data-testid="tweetText"]');
        const user = article.querySelector('[data-testid="tweet"] [data-testid="User-Name"]');

        const spans = user.querySelectorAll('span');

        let username = ""
        for (let i = 0; i < spans.length; i++) {
            if (spans[i].innerText.startsWith("@")) {
                username = spans[i].innerText || "";
                break;
            }
        }

        const tweetRef = article.querySelectorAll('[id="generated-reply"]');

        if (tweetRef.length > 0) {
            console.log("already generated");
            return;
        }

        const allRefs = user.querySelectorAll('a');
        const ref = allRefs[2].getAttribute('href');
        const tweetId = ref.split('/')[3];
        console.log(tweetId);

        // Log the extracted information to the console
        let div = document.createElement("div");
        div.style.borderStyle = 'solid';
        div.style.borderRadius = '5px';
        div.style.borderWidth = '2px';
        div.style.padding = '10px';
        div.style.margin = '10px';

        const apiKey = await chrome.storage.local.get(['open-ai-key']);
        const gptQuery = await chrome.storage.local.get(['gpt-query']) || "You are a ghostwriter and reply to the user's tweets by talking directly to the person, you must keep it short, exclude hashtags.";
        // create a new button
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey['open-ai-key']
            },
            body: JSON.stringify({
                "messages": [
                    { role: "system", content: gptQuery['gpt-query'] },
                    { role: "user", content: '[username] wrote [tweet]'.replace('[username]', username).replace('[tweet]', content.innerText) }
                ],
                model: "gpt-3.5-turbo",
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            })
        })

        const resp = await response.json()
        console.log(resp);

        let p = document.createElement("p");
        p.innerHTML = "Generated reply: ";
        p.style.marginBottom = '10px';
        p.style.marginTop = '5px';
        div.appendChild(p);

        resp.choices.forEach(choice => {
            let link = document.createElement("a");
            link.id = "generated-reply";
            link.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(choice.message.content) + "&in_reply_to=" + tweetId;
            link.target = "_blank";
            link.innerHTML = choice.message.content;
            link.style.marginTop = '10px';
            link.style.color = 'rgb(0, 0, 0)';
            link.style.textDecoration = 'none';

            // add the button and input field to the div
            div.appendChild(link);
        })

        // add the div to the tweet
        content.appendChild(div);
    })
}