async function screenshotConversation() {
  // TODO: Make the selector more specific.

  // Get the message block, if it's chatting then take one more level of div, otherwise it won't get messages.
  var chatHTMLs = document.querySelector('#__next div div main div div div').childNodes;
  if (chatHTMLs.length == 1) {
    console.log("No messages found.");
    chatHTMLs = document.querySelector('#__next div div main div div div div').childNodes;
  }

  var totalHeight = 0;
  var staticWidth = 0;
  var blocks = [];
  var block_heights = [];

  console.log("Rendering " + chatHTMLs.length + " messages.");
  for (let i = 0; i < chatHTMLs.length - 1; i++) {
    chatHTML = chatHTMLs[i];
    // Get actual message block canvas height and width to set result canvas size
    await html2canvas(chatHTML).then(function (canvas) {
      var block = document.createElement("canvas");
      block.width = canvas.width;
      block.height = canvas.height;

      var blockCtx = block.getContext("2d");
      blockCtx.drawImage(canvas, 0, 0);

      blocks.push(block);
      block_heights.push(canvas.height);
      totalHeight += canvas.height;
      staticWidth = canvas.width;
    });
  }

  var resultCanvas = document.createElement("canvas");
  resultCanvas.height = totalHeight;
  resultCanvas.width = staticWidth;
  var resultCtx = resultCanvas.getContext("2d");

  var y = 0;
  console.log("Drawing " + blocks.length + " messages.");
  for (let i = 0; i < blocks.length; i++) {
    // Use the html2canvas library to create a canvas element from the chat HTML
    resultCtx.drawImage(blocks[i], 0, y);
    y += block_heights[i];
  }
  let link = document.createElement("a");
  link.download = "chat_screenshot.png";
  link.href = resultCanvas.toDataURL("image/png");
  link.click();
  console.log("done");
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: screenshotConversation
    });
  }
});