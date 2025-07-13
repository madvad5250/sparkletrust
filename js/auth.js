// Authentication credentials
const validCredentials = [
  { email: "sarah.johnson@email.com", password: "password123", name: "Sarah Johnson" },
  { email: "john.smith@email.com", password: "secure456", name: "John Smith" },
  { email: "emma.wilson@email.com", password: "mypass789", name: "Emma Wilson" },
  { email: "michael.brown@email.com", password: "login321", name: "Michael Brown" },
  { email: "edward.cooksey72@gmail.com", password: "edwardlee@321", name: "Edward Lee Cooksey" },
  { email: "ismailramanmohammed72@gmail.com", password: "ismailrmohammed@890", name: "Ismail Raman Mohammed" },
  { email: "sharonbrown272@gmail.com", password: "sharonbrown9284@", name: "Sharon Brown" },
  { email: "lisa.davis@email.com", password: "access654", name: "Lisa Davis" },
]

// Global variables
let currentTab = "login"
let isLoading = false

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeAuth()
  initializePasswordStrength()
  initializeForms()
})

// Initialize authentication system
function initializeAuth() {
  const isLoggedIn = localStorage.getItem("isAuthenticated")
  const userData = localStorage.getItem("userData")

  if (isLoggedIn === "true" && userData) {
    try {
      const user = JSON.parse(userData)
      if (user.email.toLowerCase() === "sharonbrown272@gmail.com") {
        window.location.href = "users.html"
      } else {
        window.location.href = "dashboard.html"
      }
    } catch (error) {
      console.error("Error parsing userData:", error)
      // Fallback in case of parsing error
      window.location.href = "dashboard.html"
    }
  }
}




// Initialize forms
function initializeForms() {
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")
  const forgotPasswordForm = document.getElementById("forgotPasswordForm")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", handleForgotPassword)
  }
}

// Switch between login and signup tabs
function switchTab(tab) {
  currentTab = tab

  // Update tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelector(`[data-tab="${tab}"]`).classList.add("active")

  // Update form visibility
  document.querySelectorAll(".auth-form").forEach((form) => {
    form.classList.remove("active")
  })
  document.getElementById(`${tab}Tab`).classList.add("active")

  // Clear any error messages
  clearMessages()
}

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault()

  if (isLoading) return

  const email = document.getElementById("loginEmail").value.trim()
  const password = document.getElementById("loginPassword").value
  const rememberMe = document.getElementById("rememberMe").checked

  // Validate inputs
  if (!email || !password) {
    showError("loginError", "Please fill in all fields")
    return
  }

  if (!isValidEmail(email)) {
    showError("loginError", "Please enter a valid email address")
    return
  }

  // Show loading state
  setLoadingState("loginButton", true)
  clearMessages()

  try {
    // Simulate API call delay
    await delay(1500)

    // Check credentials
    const user = validCredentials.find(
      (cred) => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password,
    )

    if (user) {
      // Successful login
      showSuccess("loginSuccess", "Login successful! Redirecting...")

      // Store user data
      const userData = {
        email: user.email,
        name: user.name,
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe,
      }

      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userData", JSON.stringify(userData))

      if (rememberMe) {
        localStorage.setItem("rememberUser", "true")
      }

// Redirect after short delay
setTimeout(() => {
  if (user.email.toLowerCase() === "sharonbrown272@gmail.com") {
    window.location.href = "users.html"
  } else {
    window.location.href = "dashboard.html"
  }
}, 1000)
    } else {
      // Invalid credentials
      showError("loginError", "Invalid email or password. Please try again.")
    }
  } catch (error) {
    showError("loginError", "An error occurred. Please try again.")
    console.error("Login error:", error)
  } finally {
    setLoadingState("loginButton", false)
  }
}

// Handle signup form submission
async function handleSignup(event) {
  event.preventDefault()

  if (isLoading) return

  const firstName = document.getElementById("firstName").value.trim()
  const lastName = document.getElementById("lastName").value.trim()
  const email = document.getElementById("signupEmail").value.trim()
  const password = document.getElementById("signupPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const agreeTerms = document.getElementById("agreeTerms").checked

  // Validate inputs
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    showError("signupError", "Please fill in all fields")
    return
  }

  if (!isValidEmail(email)) {
    showError("signupError", "Please enter a valid email address")
    return
  }

  if (password !== confirmPassword) {
    showError("signupError", "Passwords do not match")
    return
  }

  if (!isStrongPassword(password)) {
    showError(
      "signupError",
      "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
    )
    return
  }

  if (!agreeTerms) {
    showError("signupError", "Please agree to the Terms of Service and Privacy Policy")
    return
  }

  // Check if email already exists
  const existingUser = validCredentials.find((cred) => cred.email.toLowerCase() === email.toLowerCase())

  if (existingUser) {
    showError("signupError", "An account with this email already exists")
    return
  }

  // Show loading state
  setLoadingState("signupButton", true)
  clearMessages()

  try {
    // Simulate API call delay
    await delay(2000)

    // Successful signup
    showSuccess("signupSuccess", "Account created successfully! Redirecting to login...")

    // Store new user data (in real app, this would be sent to server)
    const newUser = {
      email: email,
      name: `${firstName} ${lastName}`,
      password: password, // In real app, this would be hashed
    }

    // Add to valid credentials for demo purposes
    validCredentials.push(newUser)

    // Switch to login tab after delay
    setTimeout(() => {
      switchTab("login")
      // Pre-fill email in login form
      document.getElementById("loginEmail").value = email
      showSuccess("loginSuccess", "Account created! Please log in with your new credentials.")
    }, 1500)
  } catch (error) {
    showError("signupError", "An error occurred while creating your account. Please try again.")
    console.error("Signup error:", error)
  } finally {
    setLoadingState("signupButton", false)
  }
}

// Handle forgot password form submission
async function handleForgotPassword(event) {
  event.preventDefault()

  const email = document.getElementById("resetEmail").value.trim()

  if (!email) {
    alert("Please enter your email address")
    return
  }

  if (!isValidEmail(email)) {
    alert("Please enter a valid email address")
    return
  }

  try {
    // Simulate API call
    await delay(1000)

    alert("Password reset link sent to your email address!")
    closeForgotPassword()
  } catch (error) {
    alert("An error occurred. Please try again.")
  }
}

// Password visibility toggle
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId)
  const icon = document.getElementById(inputId + "Icon")

  if (input.type === "password") {
    input.type = "text"
    icon.className = "fas fa-eye-slash"
  } else {
    input.type = "password"
    icon.className = "fas fa-eye"
  }
}

// Initialize password strength checker
function initializePasswordStrength() {
  const passwordInput = document.getElementById("signupPassword")
  if (passwordInput) {
    passwordInput.addEventListener("input", checkPasswordStrength)
  }
}

// Check password strength
function checkPasswordStrength() {
  const password = document.getElementById("signupPassword").value
  const strengthFill = document.getElementById("strengthFill")
  const strengthText = document.getElementById("strengthText")

  if (!password) {
    strengthFill.style.width = "0%"
    strengthText.textContent = "Password strength"
    strengthText.style.color = "var(--text-light)"
    return
  }

  let score = 0
  const feedback = []

  // Length check
  if (password.length >= 8) score += 1
  else feedback.push("at least 8 characters")

  // Uppercase check
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push("uppercase letter")

  // Lowercase check
  if (/[a-z]/.test(password)) score += 1
  else feedback.push("lowercase letter")

  // Number check
  if (/\d/.test(password)) score += 1
  else feedback.push("number")

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  else feedback.push("special character")

  // Update strength indicator
  const percentage = (score / 5) * 100
  strengthFill.style.width = percentage + "%"

  if (score <= 2) {
    strengthFill.style.background = "var(--error-color)"
    strengthText.textContent = "Weak password"
    strengthText.style.color = "var(--error-color)"
  } else if (score <= 3) {
    strengthFill.style.background = "var(--warning-color)"
    strengthText.textContent = "Fair password"
    strengthText.style.color = "var(--warning-color)"
  } else if (score <= 4) {
    strengthFill.style.background = "#3b82f6"
    strengthText.textContent = "Good password"
    strengthText.style.color = "#3b82f6"
  } else {
    strengthFill.style.background = "var(--success-color)"
    strengthText.textContent = "Strong password"
    strengthText.style.color = "var(--success-color)"
  }
}

// Fill demo credentials
function fillCredentials(email, password) {
  document.getElementById("loginEmail").value = email
  document.getElementById("loginPassword").value = password

  // Switch to login tab if not already there
  if (currentTab !== "login") {
    switchTab("login")
  }

  // Show success message
  showSuccess("loginSuccess", 'Demo credentials filled! Click "Sign In" to login.')
}

// Show/hide forgot password modal
function showForgotPassword() {
  document.getElementById("forgotPasswordModal").classList.add("show")
}

function closeForgotPassword() {
  document.getElementById("forgotPasswordModal").classList.remove("show")
  document.getElementById("resetEmail").value = ""
}

// Utility functions
function showError(elementId, message) {
  const element = document.getElementById(elementId)
  element.textContent = message
  element.classList.add("show")

  // Hide success message if showing
  const successElement = document.getElementById(elementId.replace("Error", "Success"))
  if (successElement) {
    successElement.classList.remove("show")
  }
}

function showSuccess(elementId, message) {
  const element = document.getElementById(elementId)
  element.textContent = message
  element.classList.add("show")

  // Hide error message if showing
  const errorElement = document.getElementById(elementId.replace("Success", "Error"))
  if (errorElement) {
    errorElement.classList.remove("show")
  }
}

function clearMessages() {
  document.querySelectorAll(".error-message, .success-message").forEach((element) => {
    element.classList.remove("show")
  })
}

function setLoadingState(buttonId, loading) {
  const button = document.getElementById(buttonId)
  const buttonText = button.querySelector(".button-text")
  const buttonLoader = button.querySelector(".button-loader")

  isLoading = loading
  button.disabled = loading

  if (loading) {
    buttonText.style.opacity = "0"
    buttonLoader.style.display = "block"
  } else {
    buttonText.style.opacity = "1"
    buttonLoader.style.display = "none"
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isStrongPassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
  return strongPasswordRegex.test(password)
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  const modal = document.getElementById("forgotPasswordModal")
  if (event.target === modal) {
    closeForgotPassword()
  }
})

// Handle escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeForgotPassword()
  }
})

// Auto-fill remembered user
window.addEventListener("load", () => {
  const rememberUser = localStorage.getItem("rememberUser")
  const userData = localStorage.getItem("userData")

  if (rememberUser === "true" && userData) {
    try {
      const user = JSON.parse(userData)
      document.getElementById("loginEmail").value = user.email
      document.getElementById("rememberMe").checked = true
    } catch (error) {
      console.error("Error loading remembered user:", error)
    }
  }
})
