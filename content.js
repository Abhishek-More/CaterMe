function getDateFromURL(url) {
  // Regular expression to match the date format YYYY-MM-DD
  const dateRegex = /(\d{4}-\d{2}-\d{2})/;

  const match = url.match(dateRegex);
  if (match) {
    const dateString = match[1]; // The date string
    return dateString;
  } else {
    console.log("No date found in the URL.");
  }
}

function getAllTextContent(element) {
  let textArray = [];

  // Iterate over all child nodes of the element
  element.childNodes.forEach((child) => {
    // If the child is a text node, push its trimmed content
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent.trim();
      if (
        text.length > 0 &&
        !(text.includes("Serves") || text.includes("Remove")) &&
        !/^\d+$/.test(text) &&
        !/\$/.test(text)
      ) {
        textArray.push(text);
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      // If the child is an element, recursively get its text content
      textArray = textArray.concat(getAllTextContent(child));
    }
  });

  return textArray;
}

function getAllSiblings(element) {
  const siblings = [];

  // Get previous siblings
  let previousSibling = element.previousElementSibling;
  while (previousSibling) {
    siblings.push(previousSibling);
    previousSibling = previousSibling.previousElementSibling;
  }

  // Get next siblings
  let nextSibling = element.nextElementSibling;
  while (nextSibling) {
    siblings.push(nextSibling);
    nextSibling = nextSibling.nextElementSibling;
  }

  if (siblings.length > 0) {
    siblings.pop(); // Remove the last element
  }

  return siblings;
}

// Function to get the specific text content and store it
function storeCartText() {
  const cartElement = document.querySelector('[data-testid="cart"]');

  if (cartElement) {
    // Find the element containing the text "For"
    let specificTextElement = Array.from(
      cartElement.querySelectorAll("span"),
    ).find((el) => el.textContent.includes("For"));

    let specificTextElements = getAllSiblings(specificTextElement);

    if (specificTextElements.length > 0) {
      let textArray = [];
      specificTextElements.forEach((sibling) => {
        textArray = textArray.concat(getAllTextContent(sibling));
      });

      const specificText = textArray.join("|");
      //
      // Store the specific text in Chrome storage
      const storageObject = {};
      storageObject[getDateFromURL(window.location.href)] = specificText;
      console.log(storageObject);
      chrome.storage.local.set(storageObject, () => {
        console.log("Specific text saved to Chrome storage");
      });
    } else {
      console.log("Specific text not found in the cart.");
    }
  }
}

if (window.location.hostname.includes("ezcater.com")) {
  const observer = new MutationObserver(() => {
    // Call storeCartText whenever a mutation occurs
    storeCartText();
  });

  // Start observing the body for changes
  observer.observe(document.body, {
    childList: true, // Observe direct children (added/removed nodes)
    subtree: true, // Observe all descendants
    attributes: true, // Observe attribute changes
  });
}

// // Optionally, you can call storeCartText() initially if you expect the text to be present on load
// storeCartText();
