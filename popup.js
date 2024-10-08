const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
document.addEventListener("DOMContentLoaded", () => {
  const cartContentDiv = document.getElementById("cartContent");

  // Retrieve all stored order text from Chrome storage
  chrome.storage.local.get(null, (data) => {
    // Check if there are any stored keys (dates)
    const dates = Object.keys(data)
      .filter((key) => dateRegex.test(key))
      .sort((a, b) => new Date(b) - new Date(a));
    console.log(data);

    if (dates.length > 0) {
      // Iterate over each date and display its associated text content
      dates.forEach((date) => {
        const dateDiv = document.createElement("div");
        dateDiv.className = "date"; // Class for date styling
        dateDiv.textContent = date; // Display the date
        cartContentDiv.appendChild(dateDiv); // Append date to the container

        // const contentDiv = document.createElement("div");
        // contentDiv.className = "content"; // Class for content styling

        // Split the text content by newlines and create a div for each line
        const lines = data[date].split("|"); // Use newline separator

        lines.forEach((line) => {
          console.log(line);
          const lineDiv = document.createElement("div");
          lineDiv.className = "line"; // Add class for styling
          lineDiv.textContent = line; // Set the text content
          dateDiv.appendChild(lineDiv); // Append to content div
        });
      });
    } else {
      cartContentDiv.textContent = "No order found."; // Handle empty case
    }
  });
});
