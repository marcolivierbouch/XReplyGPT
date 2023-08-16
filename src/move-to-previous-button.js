function moveToPreviousButton() {
  const buttons = Array.from(document.querySelectorAll("button[id='generated-reply']"));
  const activeElement = document.activeElement;

  if (activeElement && activeElement.tagName === 'BUTTON') {
    const currentIndex = buttons.indexOf(activeElement);
    if (currentIndex !== -1) {
      const previousIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      buttons[previousIndex].focus();
    }
  } else if (buttons.length > 0) {
    buttons[buttons.length - 1].focus();
  }
}

moveToPreviousButton();
