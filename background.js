console.log("Service worker is running");

chrome.webNavigation.onCompleted.addListener(
  (details) => {
    console.log("Navigated to ezCater, executing content script.");

    chrome.scripting.executeScript(
      {
        target: { tabId: details.tabId },
        files: ["content.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.log("Script injection failed: ", chrome.runtime.lastError);
        } else {
          console.log("Content script executed successfully.");
        }
      },
    );
  },
  { url: [{ hostContains: "ezcater.com" }] },
);
