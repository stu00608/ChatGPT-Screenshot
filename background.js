async function screenshotConversation() {
  // TODO: Make the selector more specific.
  var chatHTMLs = document.querySelector('#__next div div main div div div').childNodes;

  // Open a new window to display the screenshots
  var x = window.open();

  var totalHeight = 0;
  var staticWidth = 0;

  var y = 0;
  for (let i = 0; i < chatHTMLs.length - 1; i++) {
    chatHTML = chatHTMLs[i];
    // Get actual message block canvas height and width to set result canvas size
    await html2canvas(chatHTML).then(function (canvas) {
      var resultCanvas = x.document.createElement("canvas");
      console.log("canvas w: " + canvas.width + " h: " + canvas.height)
      totalHeight += canvas.height;
      staticWidth = canvas.width;
    });
  }

  var resultCanvas = x.document.createElement("canvas");
  console.log("--------------------");
  console.log("totalHeight: " + totalHeight + " staticWidth: " + staticWidth);
  console.log("--------------------");
  resultCanvas.height = totalHeight;
  resultCanvas.width = staticWidth;
  var resultCtx = resultCanvas.getContext("2d");

  for (let i = 0; i < chatHTMLs.length - 1; i++) {
    chatHTML = chatHTMLs[i];
    // Use the html2canvas library to create a canvas element from the chat HTML
    await html2canvas(chatHTML).then(function (canvas) {
      resultCtx.drawImage(canvas, 0, y);
      y += canvas.height;
    });
  }
  x.document.body.appendChild(resultCanvas);
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: screenshotConversation
    });
  }
});