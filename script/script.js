let budget = 0;
let expenses = [];
const expenseList = document.getElementById("expenseList");
const expenseValueInput = document.getElementById("expenseValue");
const expenseCategorySelect = document.getElementById("expenseCategory");
const emptyMessage = document.getElementById("emptyMessage");
const budgetAmountInput = document.getElementById("budgetAmount");
const balanceSection = document.getElementById("balanceSection");
const balanceAmountDisplay = document.getElementById("balanceAmount");
const chartCanvas = document.getElementById("expenseChart");
const pieChartCanvas = document.getElementById("expensePieChart");
const lineChartCanvas = document.getElementById("expenseLineChart");
let expenseChart;
let expensePieChart;
let expenseLineChart;

// Load data from local storage on page load
document.addEventListener("DOMContentLoaded", loadData);
budgetAmountInput.addEventListener("change", updateBudget);

function loadData() {
  const storedBudget = localStorage.getItem("budget");
  const storedExpenses = localStorage.getItem("expenses");

  if (storedBudget) {
    budget = parseFloat(storedBudget);
    budgetAmountInput.value = budget;
  }

  if (storedExpenses) {
    expenses = JSON.parse(storedExpenses);
  }

  renderList();
  updateBalance();
  renderDonutChart();
  renderPieChart();
  renderLineChart();
}

function saveData() {
  localStorage.setItem("budget", budget);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateBudget() {
  budget = parseFloat(budgetAmountInput.value) || 0;
  updateBalance();
  saveData();
}

function renderList() {
  expenseList.innerHTML = "";
  if (expenses.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
    expenses.forEach((expense, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                <div class="tracker-item-details">
                    <strong>${
                      expense.category
                    }</strong>: Rs.${expense.value.toFixed(2)}
                </div>
                <div class="tracker-item-actions">
                    <button onclick="removeExpense(${index})">Delete</button>
                </div>
            `;
      expenseList.appendChild(listItem);
    });
  }
  updateBalance();
}

// ✅ Updated Function
function addExpense() {
  const value = parseFloat(expenseValueInput.value);
  const category = expenseCategorySelect.value;

  if (!isNaN(value)) {
    // Check if the category already exists
    const existingExpense = expenses.find((exp) => exp.category === category);
    if (existingExpense) {
      // Add value to the existing category
      existingExpense.value += value;
    } else {
      // If category doesn't exist, push new one
      expenses.push({ value: value, category: category });
    }

    expenseValueInput.value = "";
    renderList();
    saveData();
    renderDonutChart();
    renderPieChart();
    renderLineChart();
  } else {
    alert("Please enter a valid expense value.");
  }
}

function removeExpense(index) {
  if (confirm("Are you sure you want to delete this expense?")) {
    expenses.splice(index, 1);
    renderList();
    saveData();
    renderDonutChart();
    renderPieChart();
    renderLineChart();
  }
}

function calculateTotalExpenses() {
  return expenses.reduce((sum, expense) => sum + expense.value, 0);
}

function updateBalance() {
  const totalExpenses = calculateTotalExpenses();
  const balance = budget - totalExpenses;
  balanceAmountDisplay.textContent = balance.toFixed(2);

  if (balance > 0) {
    balanceAmountDisplay.className = "balance-positive";
  } else if (balance < 0) {
    balanceAmountDisplay.className = "balance-negative";
  } else {
    balanceAmountDisplay.className = "balance-neutral";
  }
}

function renderDonutChart() {
  const categoryTotals = {};
  expenses.forEach((expense) => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.value;
    } else {
      categoryTotals[expense.category] = expense.value;
    }
  });

  const chartLabels = Object.keys(categoryTotals);
  const chartData = Object.values(categoryTotals);
  const backgroundColors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
  ];

  if (expenseChart) {
    expenseChart.destroy();
  }

  expenseChart = new Chart(chartCanvas, {
    type: "doughnut",
    data: {
      labels: chartLabels,
      datasets: [
        {
          data: chartData,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "Expense Distribution by Category (Doughnut)",
        },
      },
    },
  });
}

function renderPieChart() {
  const categoryTotals = {};
  expenses.forEach((expense) => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.value;
    } else {
      categoryTotals[expense.category] = expense.value;
    }
  });

  const chartLabels = Object.keys(categoryTotals);
  const chartData = Object.values(categoryTotals);
  const backgroundColors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
  ];

  if (expensePieChart) {
    expensePieChart.destroy();
  }

  expensePieChart = new Chart(pieChartCanvas, {
    type: "pie",
    data: {
      labels: chartLabels,
      datasets: [
        {
          data: chartData,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Expense Distribution by Category (Pie)",
        },
      },
    },
  });
}

function renderLineChart() {
  const labels = expenses.map((_, index) => `Expense ${index + 1}`);
  const data = expenses.map((expense) => expense.value);

  if (expenseLineChart) {
    expenseLineChart.destroy();
  }

  expenseLineChart = new Chart(lineChartCanvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Expense Value Over Entry",
          data: data,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Expense Value",
          },
        },
        x: {
          title: {
            display: true,
            text: "Expense Entry Order",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Trend of Expenses",
        },
        legend: {
          display: false,
        },
      },
    },
  });
}

// Reset everything
document.getElementById("reset-app").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});
