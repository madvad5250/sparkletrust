// Dashboard JavaScript
let currentTab = "overview"
let showBalance = true
let currentPopup = null
let isProcessing = false

// Sample data
const accountData = {
  accounts: [
    {
      id: 1,
      name: "Current Account",
      type: "checking",
      balance: 4841.50,
      accountNumber: "****4734",
      sortCode: "27-34-56",
    },
    {
      id: 2,
      name: "Savings Account",
      type: "savings",
      balance: 6000000.00,
      accountNumber: "****5678",
      sortCode: "27-34-56",
      interestRate: 4.75,
    },
    {
      id: 3,
      name: "Business Account",
      type: "business",
      balance: 0.00,
      accountNumber: "****9012",
      sortCode: "27-34-56",
    },
  ],
  transactions: [
    {
       id: 1,
      description: "Direct Deposit - Inheritance Distribution (xxxxxxx842)",
      amount: 2550000.00,
      date: "2025-03-13",
      type: "credit",
      category: "Income",
      account: "Current Account",
    },
        {
      id: 2,
      description: "Direct Deposit - Estate Sale Proceeds  (xxxxxxx799)",
      amount: 2050000.50,
      date: "2025-02-09",
      type: "credit",
      category: "Income",
      account: "Current Account",
    },
    {
      id: 3,
      description: "Bank Transfer - M&A Settlement Y (xxxxxxx725)",
      amount: 1400000.00,
      date: "2025-01-11",
      type: "credit",
      category: "Income",
      account: "Current Account",
    },


    {
      id: 7,
      description: "Freelance Payment",
      amount: 4841.00,
      date: "2017-01-09",
      type: "credit",
      category: "Income",
      account: "Business Account",
    },
    {
      id: 8,
      description: "Utility Bill - Electric",
      amount: -145.50,
      date: "2017-01-08",
      type: "debit",
      category: "Bills",
      account: "Current Account",
    },
  ],
  analytics: {
    monthlySpending: [
      { month: "Jan", amount: 250 },
      { month: "Dec", amount: 320 },
      { month: "Nov", amount: 280 },
      { month: "Oct", amount: 260 },
      { month: "Sep", amount: 290 },
      { month: "Aug", amount: 310 },
    ],
    categorySpending: [
      { category: "Shopping", amount: 850, percentage: 34 },
      { category: "Bills", amount: 650, percentage: 26 },
      { category: "Food & Drink", amount: 800, percentage: 16 },
      { category: "Transport", amount: 300, percentage: 12 },
      { category: "Entertainment", amount: 200, percentage: 8 },
      { category: "Other", amount: 100, percentage: 4 },
    ],
  },
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication()
  initializeDashboard()
  loadUserData()
  populateTransactions()
  populateAccounts()
  populateAnalytics()
  const saveButton = document.querySelector(".settings-card .button")
  if (saveButton) {
    saveButton.addEventListener("click", saveProfile)
  }
})

function checkAuthentication() {
  const isAuth = localStorage.getItem("isAuthenticated")
  const userData = localStorage.getItem("userData")

  if (!isAuth || !userData) {
    window.location.href = "index.html"
    return
  }
}

function initializeDashboard() {
  // Set up event listeners
  setupTabNavigation()
  setupPopups()
  setupFilters()
  setupFormHandlers()
}

function loadUserData() {
  const userData = JSON.parse(localStorage.getItem("userData"))
  if (userData) {
    document.getElementById("dashboardUserName").textContent = userData.name
    document.getElementById("dashboardUserEmail").textContent = userData.email
    document.getElementById("welcomeMessage").textContent = `Welcome back, ${userData.name.split(" ")[0]}!`
    document.getElementById("profileName").value = userData.name
    document.getElementById("profileEmail").value = userData.email
  }
}

// Tab navigation
function setupTabNavigation() {
  const tabBtns = document.querySelectorAll(".tab-btn")
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.getAttribute("data-tab")
      switchTab(tabName)
    })
  })
}

function switchTab(tabName) {
  // Update active tab button
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")

  // Update active tab content
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.remove("active")
  })
  document.getElementById(tabName).classList.add("active")

  currentTab = tabName
}

// Balance toggle
function toggleBalance() {
  showBalance = !showBalance
  const balanceIcon = document.getElementById("balanceIcon")
  const totalBalance = document.getElementById("totalBalance")
  const savingsBalance = document.getElementById("savingsBalance")
  const currentBalance = document.getElementById("currentBalance")

  if (showBalance) {
    balanceIcon.className = "fas fa-eye"
    totalBalance.textContent = "$5,304,841.50"
    savingsBalance.textContent = "$5,000,000.00"
    currentBalance.textContent = "$4,841.50"
  } else {
    balanceIcon.className = "fas fa-eye-slash"
    totalBalance.textContent = "••••••"
    savingsBalance.textContent = "••••••"
    currentBalance.textContent = "••••••"
  }
}

// Populate transactions
function populateTransactions() {
  const recentList = document.getElementById("recentTransactionsList")
  const allList = document.getElementById("allTransactionsList")

  // Recent transactions (first 5)
  const recentTransactions = accountData.transactions.slice(0, 5)
  recentList.innerHTML = recentTransactions.map((transaction) => createTransactionHTML(transaction)).join("")

  // All transactions
  allList.innerHTML = accountData.transactions.map((transaction) => createTransactionHTML(transaction, true)).join("")
}

function createTransactionHTML(transaction, detailed = false) {
  const isCredit = transaction.type === "credit"
  const icon = isCredit ? "fas fa-arrow-down-left" : "fas fa-arrow-up-right"
  const iconClass = isCredit ? "credit" : "debit"
  const amountClass = isCredit ? "credit" : "debit"
  const amountPrefix = isCredit ? "+" : ""

  return `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon ${iconClass}">
                    <i class="${icon}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <div class="transaction-meta">
                        ${detailed ? `${transaction.category} • ${transaction.account} • ` : ""}${transaction.date}
                    </div>
                </div>
            </div>
            <div class="transaction-amount ${amountClass}">
                ${amountPrefix}$${Math.abs(transaction.amount).toFixed(2)}
            </div>
        </div>
    `
}

// Populate accounts
function populateAccounts() {
  const accountsList = document.getElementById("accountsList")

  accountsList.innerHTML = accountData.accounts
    .map(
      (account) => `
        <div class="account-card">
            <div class="account-header">
                <div class="account-info">
                    <h3>${account.name}</h3>
                    <div class="account-details">
                        Account: ${account.accountNumber} | Sort Code: ${account.sortCode}
                    </div>
                </div>
                <div class="account-balance">
                    <div class="balance">$${account.balance.toLocaleString()}</div>
                    ${account.interestRate ? `<div class="rate">${account.interestRate}% AER</div>` : ""}
                </div>
            </div>
            <div class="account-actions">
                <button class="button outline-button" onclick="downloadStatement('${account.id}')">View Statements</button>
                <button class="button outline-button" onclick="downloadPDF('${account.id}')">Download PDF</button>
                <button class="button outline-button" onclick="manageAccount('${account.id}')">Manage Account</button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Account action functions
function downloadStatement(accountId) {
  showSuccessMessage("Statement download started. Check your downloads folder.")
}

function downloadPDF(accountId) {
  showSuccessMessage("PDF download started. Check your downloads folder.")
}

function manageAccount(accountId) {
  showSuccessMessage("Account management feature coming soon!")
}

// Populate analytics
function populateAnalytics() {
  const monthlyChart = document.getElementById("monthlySpendingChart")
  const categoryChart = document.getElementById("categorySpendingChart")

  // Monthly spending chart
  monthlyChart.innerHTML = accountData.analytics.monthlySpending
    .map(
      (month) => `
        <div class="chart-item">
            <span class="chart-label">${month.month}</span>
            <div class="chart-bar-container">
                <div class="chart-bar">
                    <div class="chart-bar-fill purple" style="width: ${(month.amount / 3500) * 100}%"></div>
                </div>
                <span class="chart-value">$${month.amount}</span>
            </div>
        </div>
    `,
    )
    .join("")

  // Category spending chart
  categoryChart.innerHTML = accountData.analytics.categorySpending
    .map(
      (category) => `
        <div class="chart-item">
            <span class="chart-label">${category.category}</span>
            <div class="chart-bar-container">
                <div class="chart-bar">
                    <div class="chart-bar-fill yellow" style="width: ${category.percentage}%"></div>
                </div>
                <span class="chart-value">$${category.amount}</span>
            </div>
        </div>
    `,
    )
    .join("")
}

// Popup functions
function setupPopups() {
  // Close popup when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("popup")) {
      closePopup()
    }
  })

  // Close popup with escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePopup()
    }
  })
}

function openPopup(type) {
  if (isProcessing) return

  currentPopup = type
  const popup = document.getElementById(`${type}Popup`)
  popup.classList.add("active")

  // Reset popup state
  resetPopupState(type)
}

function closePopup() {
  if (currentPopup) {
    const popup = document.getElementById(`${currentPopup}Popup`)
    popup.classList.remove("active")
    resetPopupState(currentPopup)
    currentPopup = null
    isProcessing = false
  }
}

function resetPopupState(type) {
  // Hide loading and error states
  const loadingEl = document.getElementById(`${type}Loading`)
  const errorEl = document.getElementById(`${type}Error`)
  const formEl = document.getElementById(`${type}Form`)

  if (loadingEl) loadingEl.style.display = "none"
  if (errorEl) {
    errorEl.style.display = "none"
    errorEl.innerHTML = ""
  }
  if (formEl) formEl.style.display = "block"

  // Reset form
  const form = formEl?.querySelector("form")
  if (form) form.reset()
}

function showLoading(type) {
  const loadingEl = document.getElementById(`${type}Loading`)
  const formEl = document.getElementById(`${type}Form`)

  if (formEl) formEl.style.display = "none"
  if (loadingEl) loadingEl.style.display = "block"
}

function showError(type, message) {
  const loadingEl = document.getElementById(`${type}Loading`)
  const errorEl = document.getElementById(`${type}Error`)

  if (loadingEl) loadingEl.style.display = "none"
  if (errorEl) {
    errorEl.style.display = "block"
    errorEl.innerHTML = `<p>${message}</p>`
  }
}

function showSuccess(type, message) {
  const loadingEl = document.getElementById(`${type}Loading`)
  const formEl = document.getElementById(`${type}Form`)
  const errorEl = document.getElementById(`${type}Error`)

  if (loadingEl) loadingEl.style.display = "none"
  if (formEl) formEl.style.display = "none"
  if (errorEl) {
    errorEl.style.display = "block"
    errorEl.innerHTML = `<div style="color: #10b981; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); padding: 0.75rem; border-radius: 0.375rem;"><p>${message}</p></div>`
  }

  // Close popup after 2 seconds
  setTimeout(() => {
    closePopup()
  }, 2000)
}

// Form handlers setup
function setupFormHandlers() {
  // Transfer form
  const transferForm = document.querySelector("#transferForm form")
  if (transferForm) {
    transferForm.addEventListener("submit", handleTransfer)
  }

  // Deposit form
  const depositForm = document.querySelector("#depositForm form")
  if (depositForm) {
    depositForm.addEventListener("submit", handleDeposit)
  }

  // Withdraw form
  const withdrawForm = document.querySelector("#withdrawForm form")
  if (withdrawForm) {
    withdrawForm.addEventListener("submit", handleWithdraw)
  }

  // Invest form
  const investForm = document.querySelector("#investForm form")
  if (investForm) {
    investForm.addEventListener("submit", handleInvest)
  }
}

// Handle form submissions with realistic processing
function handleTransfer(event) {
  event.preventDefault()
  if (isProcessing) return

  isProcessing = true
  const formData = new FormData(event.target)
  const amount = Number.parseFloat(formData.get("amount"))
  const recipient = formData.get("recipient")
  const fromAccount = formData.get("fromAccount")

  // Validate amount
  if (amount <= 0) {
    showError("transfer", "Please enter a valid amount greater than 0.")
    isProcessing = false
    return
  }

  if (amount > 10000) {
    showError("transfer", "We're sorry, you cannot perform a Transfer on this account at the moment. Please contact a bank representative for assistance.")
    isProcessing = false
    return
  }

  showLoading("transfer")

  // Simulate realistic processing time
  setTimeout(() => {
    // Simulate random success/failure (80% success rate)
    if (Math.random() > 0.2) {
      // Success
      showSuccess(
        "transfer",
        `Transfer cannot be completed at the moment $${amount.toFixed(2)} to ${recipient}. Transaction ID: TXN${Date.now()}  "We're sorry, you cannot perform a Transfer on this account at the moment. Please contact a bank representative for assistance`,
      )

      // Update account balance (simulate)
      updateAccountBalance(fromAccount, -amount)

      // Add transaction to history
      addNewTransaction({
        description: `Transfer to ${recipient}`,
        amount: -amount,
        type: "debit",
        category: "Transfer",
        account: getAccountName(fromAccount),
      })
    } else {
      // Failure
      showError("transfer", "We're sorry, you cannot perform a Transfer on this account at the moment. Please contact a bank representative for assistance.")
    }
    isProcessing = false
  }, 3000)
}

function handleDeposit(event) {
  event.preventDefault()
  if (isProcessing) return

  isProcessing = true
  const formData = new FormData(event.target)
  const amount = Number.parseFloat(formData.get("amount"))
  const toAccount = formData.get("toAccount")
  const method = formData.get("method")

  if (amount <= 0) {
    showError("deposit", "Please enter a valid amount greater than 0.")
    isProcessing = false
    return
  }

  showLoading("deposit")

  setTimeout(() => {
    if (Math.random() > 0.1) {
      showSuccess("deposit", `Deposit of $${amount.toFixed(2)} via ${method}. Reference: DEP${Date.now()} not successful.`)

      updateAccountBalance(toAccount, amount)

      addNewTransaction({
        description: `Deposit via ${method}`,
        amount: amount,
        type: "credit",
        category: "Income",
        account: getAccountName(toAccount),
      })
    } else {
      showError("deposit", "We're sorry, you cannot perform a deposit on this account at the moment. Please contact a bank representative for assistance.")
    }
    isProcessing = false
  }, 2500)
}

function handleWithdraw(event) {
  event.preventDefault()
  if (isProcessing) return

  isProcessing = true
  const formData = new FormData(event.target)
  const amount = Number.parseFloat(formData.get("amount"))
  const fromAccount = formData.get("fromAccount")
  const method = formData.get("method")

  if (amount <= 0) {
    showError("withdraw", "Please enter a valid amount greater than 0.")
    isProcessing = false
    return
  }

  if (amount > 500) {
    showError("withdraw", "We're sorry, you cannot perform a deposit on this account at the moment. Please contact a bank representative for assistance.")
    isProcessing = false
    return
  }

  showLoading("withdraw")

  setTimeout(() => {
    if (Math.random() > 0.15) {
      showSuccess("withdraw", `Unable to withdraw $${amount.toFixed(2)} via ${method}. Reference: WTH${Date.now()}  We're sorry, you cannot perform withdrawal on this account at the moment. Please contact a bank representative for assistance.`)

      updateAccountBalance(fromAccount, -amount)

      addNewTransaction({
        description: `Withdrawal via ${method}`,
        amount: -amount,
        type: "debit",
        category: "Cash",
        account: getAccountName(fromAccount),
      })
    } else {
      showError("withdraw", "We're sorry, you cannot perform withdrawal on this account at the moment. Please contact a bank representative for assistance.")
    }
    isProcessing = false
  }, 2000)
}

function handleInvest(event) {
  event.preventDefault()
  if (isProcessing) return

  isProcessing = true
  const formData = new FormData(event.target)
  const amount = Number.parseFloat(formData.get("amount"))
  const type = formData.get("type")
  const term = formData.get("term")

  if (amount < 100) {
    showError("invest", "Minimum investment amount is $100.")
    isProcessing = false
    return
  }

  showLoading("invest")

  setTimeout(() => {
    if (Math.random() > 0.05) {
      showSuccess(
        "invest",
        `Unable to invest ${type} investment of $${amount.toFixed(2)} for ${term} months. Reference: INV${Date.now()}  We're sorry, you cannot invest on this account at the moment. Please contact a bank representative for assistance.`,
      )

      addNewTransaction({
        description: `Investment - ${type}`,
        amount: -amount,
        type: "debit",
        category: "Investment",
        account: "Current Account",
      })
    } else {
      showError("invest", "Investment setup failed. We're sorry, you cannot Invest on this account at the moment. Please contact a bank representative for assistance.")
    }
    isProcessing = false
  }, 4000)
}

// Helper functions
function updateAccountBalance(accountType, amount) {
  const account = accountData.accounts.find((acc) => acc.type === accountType)
  if (account) {
    account.balance += amount
    populateAccounts() // Refresh account display
    updateBalanceCards() // Update balance cards
  }
}

function getAccountName(accountType) {
  const accountMap = {
    checking: "Current Account",
    savings: "Savings Account",
    business: "Business Account",
  }
  return accountMap[accountType] || "Current Account"
}

function addNewTransaction(transactionData) {
  const newTransaction = {
    id: accountData.transactions.length + 1,
    description: transactionData.description,
    amount: transactionData.amount,
    date: new Date().toISOString().split("T")[0],
    type: transactionData.type,
    category: transactionData.category,
    account: transactionData.account,
  }

  accountData.transactions.unshift(newTransaction) // Add to beginning
  populateTransactions() // Refresh transaction display
}

function updateBalanceCards() {
  const totalBalance = accountData.accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const savingsAccount = accountData.accounts.find((acc) => acc.type === "savings")
  const currentAccount = accountData.accounts.find((acc) => acc.type === "checking")

  if (showBalance) {
    document.getElementById("totalBalance").textContent = `$${totalBalance.toLocaleString()}`
    document.getElementById("savingsBalance").textContent = `$${savingsAccount.balance.toLocaleString()}`
    document.getElementById("currentBalance").textContent = `$${currentAccount.balance.toLocaleString()}`
  }
}

// Filter functions
function setupFilters() {
  const searchInput = document.getElementById("transactionSearch")
  const categoryFilter = document.getElementById("categoryFilter")
  const dateFilter = document.getElementById("dateFilter")

  if (searchInput) {
    searchInput.addEventListener("input", filterTransactions)
  }
  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterTransactions)
  }
  if (dateFilter) {
    dateFilter.addEventListener("change", filterTransactions)
  }
}

function filterTransactions() {
  const searchTerm = document.getElementById("transactionSearch")?.value.toLowerCase() || ""
  const categoryFilter = document.getElementById("categoryFilter")?.value || ""
  const dateFilter = document.getElementById("dateFilter")?.value || ""

  const filteredTransactions = accountData.transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm)
    const matchesCategory = !categoryFilter || transaction.category === categoryFilter
    // For demo purposes, we'll ignore date filtering
    const matchesDate = true

    return matchesSearch && matchesCategory && matchesDate
  })

  const allList = document.getElementById("allTransactionsList")
  if (allList) {
    allList.innerHTML = filteredTransactions.map((transaction) => createTransactionHTML(transaction, true)).join("")
  }
}

// Success message function
function showSuccessMessage(message) {
  const messageDiv = document.createElement("div")
  messageDiv.className = "success-message"
  messageDiv.textContent = message
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #10b981;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    font-weight: 600;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
  `

  document.body.appendChild(messageDiv)

  setTimeout(() => {
    messageDiv.remove()
  }, 3000)
}

// Navigation functions
function goHome() {
  window.location.href = "index.html"
}

function logout() {
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("userData")
  window.location.href = "index.html"
}

// Settings functions
function saveProfile() {
  const name = document.getElementById("profileName").value
  const email = document.getElementById("profileEmail").value

  if (name && email) {
    const userData = { name, email }
    localStorage.setItem("userData", JSON.stringify(userData))
    showSuccessMessage("Profile updated successfully!")
    loadUserData() // Refresh user data display
  }
}



 // Function to update the date and time
    function updateDateTime() {
        const now = new Date();
        const formattedDateTime = now.toLocaleString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        document.getElementById('dateTime').textContent = `Today is ${formattedDateTime}`;
    }

    // Call it once when the page loads
    updateDateTime();

    // Optional: update every second
    setInterval(updateDateTime, 1000);