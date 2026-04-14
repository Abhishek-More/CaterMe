const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Function to extract price from a text line
function extractPrice(text) {
  const priceMatch = text.match(/\$(\d+\.?\d*)/);
  return priceMatch ? parseFloat(priceMatch[1]) : 0;
}

// Function to check if an item is out of budget
function isOutOfBudget(itemText, budget) {
  if (!budget || budget <= 0) return false;
  const price = extractPrice(itemText);
  return price > budget;
}

// Function to render orders with budget filtering
function renderOrders(data, budget = null) {
  const cartContentDiv = document.getElementById("cartContent");
  cartContentDiv.innerHTML = ''; // Clear existing content

  const dates = Object.keys(data)
    .filter((key) => dateRegex.test(key))
    .sort((a, b) => new Date(b) - new Date(a));

  if (dates.length > 0) {
    // Add budget info if budget is set
    if (budget && budget > 0) {
      const budgetInfoDiv = document.createElement("div");
      budgetInfoDiv.className = "budget-info";
      budgetInfoDiv.textContent = `Budget: $${budget.toFixed(2)} - Items over budget are grayed out`;
      cartContentDiv.appendChild(budgetInfoDiv);
    }

    dates.forEach((date) => {
      const dateDiv = document.createElement("div");
      dateDiv.className = "date";
      dateDiv.textContent = date;
      cartContentDiv.appendChild(dateDiv);

      const lines = data[date].split("|");

      lines.forEach((line) => {
        if (line.trim()) {
          const lineDiv = document.createElement("div");
          lineDiv.className = "line";
          

