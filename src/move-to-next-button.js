function moveToNextButton() {
  const buttons = Array.from(document.querySelectorAll("button[id='generated-reply']"));
  console.log(buttons)
  const activeElement = document.activeElement;

  if (activeElement && activeElement.tagName === 'BUTTON') {
    const currentIndex = buttons.indexOf(activeElement);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % buttons.length;
      if (nextIndex === 0) {
        // Call generate reply and move to the
        window.generateReply();
      } else {
        buttons[nextIndex].focus();
      }
    }
  } else if (buttons.length > 0) {
    buttons[0].focus();
  }
}

function focusOnTweetButton() {
    const tweetButton = document.querySelector('[data-testid="tweetButton"]');
    if (tweetButton) {
        console.log("FOCUSING ON TWEET BUTTON");
        tweetButton.focus();
        return true;
    }
    return false;
}


if (focusOnTweetButton() == false) {
  console.log("FOCUSING ON GENERATED REPLY BUTTON")
  moveToNextButton();
}
  