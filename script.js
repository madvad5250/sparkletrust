// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    menuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    });

    // Handle dropdown menus on mobile
    const dropdownButtons = document.querySelectorAll('.dropdown-button');
    
    dropdownButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // Prevent the click from propagating to document
            event.stopPropagation();
            
            // Toggle the dropdown content
            const content = this.nextElementSibling;
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                if (dropdown !== content) {
                    dropdown.style.display = 'none';
                }
            });
            
            // Toggle this dropdown
            if (window.getComputedStyle(content).display === 'none') {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    });

    // Prevent dropdown content clicks from closing the dropdown
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });

    // Handle hover on desktop
    if (window.innerWidth >= 768) {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', function() {
                this.querySelector('.dropdown-content').style.display = 'block';
            });
            
            dropdown.addEventListener('mouseleave', function() {
                this.querySelector('.dropdown-content').style.display = 'none';
            });
        });
    }

    // Responsive behavior
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            mobileMenu.classList.remove('active');
            
            // Setup hover for desktop
            const dropdowns = document.querySelectorAll('.dropdown');
            
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('mouseenter', function() {
                    this.querySelector('.dropdown-content').style.display = 'block';
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    this.querySelector('.dropdown-content').style.display = 'none';
                });
            });
        } else {
            // Remove hover for mobile
            const dropdowns = document.querySelectorAll('.dropdown');
            
            dropdowns.forEach(dropdown => {
                dropdown.removeEventListener('mouseenter', function() {});
                dropdown.removeEventListener('mouseleave', function() {});
            });
        }
    });
});



// Global variables
let isAuthenticated = false
let currentUser = null
let authMode = "login"
let cookieConsentShown = false

// Default credentials
const defaultCredentials = [
  { email: "bloomingheart14@outlook.com", password: "password123", name: "Sarah Johnson" },
  { email: "john.smith@gmail.com", password: "secure456", name: "John Smith" },
  { email: "emma.wilson@yahoo.com", password: "mypass789", name: "Emma Wilson" },
  { email: "michael.brown@hotmail.com", password: "login321", name: "Michael Brown" },
  { email: "lisa.davis@outlook.com", password: "access654", name: "Lisa Davis" },
]

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus()
  initializeScrollButton()
  initializeCookieConsent()
  initializeMobileMenu()
  initializeAuth()
})

// Authentication functions
function checkAuthStatus() {
  const authStatus = localStorage.getItem("isAuthenticated")
  const userData = localStorage.getItem("userData")

  if (authStatus === "true" && userData) {
    isAuthenticated = true
    currentUser = JSON.parse(userData)
    updateAuthUI()
  }
}

function updateAuthUI() {
  const loginBtn = document.getElementById("loginBtn")
  const userDropdown = document.getElementById("userDropdown")
  const userName = document.getElementById("userName")
  const mobileUserSection = document.getElementById("mobileUserSection")
  const mobileLoginSection = document.getElementById("mobileLoginSection")
  const mobileUserName = document.getElementById("mobileUserName")
  const mobileUserEmail = document.getElementById("mobileUserEmail")

  if (isAuthenticated && currentUser) {
    // Desktop UI
    loginBtn.style.display = "none"
    userDropdown.style.display = "block"
    userName.textContent = currentUser.name

    // Mobile UI
    mobileUserSection.style.display = "block"
    mobileLoginSection.style.display = "none"
    mobileUserName.textContent = currentUser.name
    mobileUserEmail.textContent = currentUser.email
  } else {
    // Desktop UI
    loginBtn.style.display = "flex"
    userDropdown.style.display = "none"

    // Mobile UI
    mobileUserSection.style.display = "none"
    mobileLoginSection.style.display = "block"
  }
}

function openAuthModal() {
  const modal = document.getElementById("authModal")
  modal.classList.add("active")
  updateAuthModal()
  // Close mobile menu if open
  closeMobileMenu()
}

function closeAuthModal() {
  const modal = document.getElementById("authModal")
  modal.classList.remove("active")
  clearAuthForm()
}

function updateAuthModal() {
  const title = document.getElementById("authTitle")
  const nameField = document.getElementById("nameField")
  const submitBtn = document.getElementById("authSubmitBtn")
  const toggleBtn = document.getElementById("authToggleBtn")
  const demoCredentials = document.getElementById("demoCredentials")

  if (authMode === "login") {
    title.textContent = "Login"
    nameField.style.display = "none"
    submitBtn.textContent = "Login"
    toggleBtn.textContent = "Don't have an account? Sign up"
    demoCredentials.style.display = "block"
  } else {
    title.textContent = "Sign Up"
    nameField.style.display = "block"
    submitBtn.textContent = "Sign Up"
    toggleBtn.textContent = "Already have an account? Login"
    demoCredentials.style.display = "none"
  }
}

function toggleAuthMode() {
  authMode = authMode === "login" ? "signup" : "login"
  updateAuthModal()
  clearAuthForm()
}

function clearAuthForm() {
  document.getElementById("authForm").reset()
}

function initializeAuth() {
  const authForm = document.getElementById("authForm")
  authForm.addEventListener("submit", handleAuthSubmit)
}

function handleAuthSubmit(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const email = formData.get("email")
  const password = formData.get("password")
  const name = formData.get("name")

  if (authMode === "login") {
    handleLogin(email, password)
  } else {
    handleSignup(email, password, name)
  }
}

function handleLogin(email, password) {
  const credential = defaultCredentials.find((cred) => cred.email === email && cred.password === password)

  if (credential) {
    isAuthenticated = true
    currentUser = { email: credential.email, name: credential.name }

    // Store in localStorage
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userData", JSON.stringify(currentUser))

    // Update UI
    updateAuthUI()
    closeAuthModal()

    // Show success message
    showSuccessMessage("Login successful! Redirecting to dashboard...")

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1500)
  } else {
    showErrorMessage("Invalid credentials. Please try one of the default accounts.")
  }
}

function handleSignup(email, password, name) {
  // For demo purposes, just log them in
  isAuthenticated = true
  currentUser = { email, name }

  // Store in localStorage
  localStorage.setItem("isAuthenticated", "true")
  localStorage.setItem("userData", JSON.stringify(currentUser))

  // Update UI
  updateAuthUI()
  closeAuthModal()

  // Show success message
  showSuccessMessage("Account created successfully! Redirecting to dashboard...")

  // Redirect to dashboard after a short delay
  setTimeout(() => {
    window.location.href = "dashboard.html"
  }, 1500)
}

function logout() {
  isAuthenticated = false
  currentUser = null

  // Clear localStorage
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("userData")

  // Update UI
  updateAuthUI()

  // Close mobile menu if open
  closeMobileMenu()

  // Show logout message
  showSuccessMessage("Logged out successfully!")

  // Redirect to home if on dashboard
  if (window.location.pathname.includes("dashboard")) {
    setTimeout(() => {
      window.location.href = "index.html"
    }, 1000)
  }
}

function showSuccessMessage(message) {
  // Remove existing message if any
  const existingMessage = document.querySelector(".success-message")
  if (existingMessage) {
    existingMessage.remove()
  }

  // Create new message
  const messageDiv = document.createElement("div")
  messageDiv.className = "success-message"
  messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`

  document.body.appendChild(messageDiv)

  // Remove after 4 seconds
  setTimeout(() => {
    messageDiv.style.animation = "slideOutRight 0.4s ease-in forwards"
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove()
      }
    }, 400)
  }, 4000)
}

function showErrorMessage(message) {
  // Create and show a temporary error message
  const messageDiv = document.createElement("div")
  messageDiv.className = "error-message"
  messageDiv.textContent = message
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #ef4444;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    font-weight: 600;
    animation: slideIn 0.3s ease-out;
  `

  document.body.appendChild(messageDiv)

  // Remove after 4 seconds
  setTimeout(() => {
    messageDiv.remove()
  }, 4000)
}

function toggleUserMenu() {
  // This function can be used for mobile user menu toggle if needed
}

// Mobile menu functions
function initializeMobileMenu() {
  const menuButton = document.getElementById("menuButton")
  const mobileMenu = document.getElementById("mobileMenu")

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("active")

      // Toggle hamburger icon
      const icon = menuButton.querySelector("i")
      if (mobileMenu.classList.contains("active")) {
        icon.className = "fas fa-times"
      } else {
        icon.className = "fas fa-bars"
      }
    })

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (!menuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
        mobileMenu.classList.remove("active")
        menuButton.querySelector("i").className = "fas fa-bars"
      }
    })
  }
}

function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu")
  const menuIcon = document.getElementById("menuIcon")

  if (mobileMenu.classList.contains("active")) {
    closeMobileMenu()
  } else {
    openMobileMenu()
  }
}

function openMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu")
  const menuIcon = document.getElementById("menuIcon")

  mobileMenu.classList.add("active")
  menuIcon.className = "fas fa-times"

  // Prevent body scroll when menu is open
  document.body.style.overflow = "hidden"
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu")
  const menuIcon = document.getElementById("menuIcon")

  mobileMenu.classList.remove("active")
  menuIcon.className = "fas fa-bars"

  // Restore body scroll
  document.body.style.overflow = ""

  // Close all mobile dropdowns
  const dropdowns = document.querySelectorAll(".mobile-dropdown-content")
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("active")
  })
}

function toggleMobileDropdown(dropdownId) {
  const dropdown = document.getElementById(`${dropdownId}-dropdown`)
  const allDropdowns = document.querySelectorAll(".mobile-dropdown-content")

  // Close all other dropdowns
  allDropdowns.forEach((dd) => {
    if (dd !== dropdown) {
      dd.classList.remove("active")
    }
  })

  // Toggle current dropdown
  dropdown.classList.toggle("active")
}

// Scroll to top functionality
function initializeScrollButton() {
  window.addEventListener("scroll", handleScroll)
}

function handleScroll() {
  const scrollBtn = document.getElementById("scrollTopBtn")
  const scrollTop = window.pageYOffset
  const docHeight = document.documentElement.scrollHeight
  const winHeight = window.innerHeight
  const scrollPercent = scrollTop / (docHeight - winHeight)

  if (scrollPercent > 0.2) {
    scrollBtn.classList.add("visible")
  } else {
    scrollBtn.classList.remove("visible")
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Cookie Consent Functionality
function initializeCookieConsent() {
  const cookiesAccepted = localStorage.getItem("cookiesAccepted")
  const cookieConsent = document.getElementById("cookieConsent")

  if (cookiesAccepted !== "true" && !cookieConsentShown) {
    // Show cookie banner after 1 second
    setTimeout(() => {
      showCookieBanner()
    }, 1000)
  }
}

function showCookieBanner() {
  const cookieConsent = document.getElementById("cookieConsent")
  cookieConsent.classList.add("show")
  cookieConsentShown = true
}

function hideCookieBanner() {
  const cookieConsent = document.getElementById("cookieConsent")
  cookieConsent.classList.add("hide")

  // Remove from DOM after animation
  setTimeout(() => {
    cookieConsent.style.display = "none"
  }, 400)
}

function acceptCookies() {
  // Store consent
  localStorage.setItem("cookiesAccepted", "true")
  localStorage.setItem(
    "cookiePreferences",
    JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }),
  )

  // Set actual cookies
  setCookie("user_consent", "all", 365)
  setCookie("analytics_enabled", "true", 365)
  setCookie("marketing_enabled", "true", 365)

  // Hide banner
  hideCookieBanner()

  // Show success message
  showSuccessMessage("✅ Cookie preferences saved successfully!")

  // Initialize analytics (if you have any)
  initializeAnalytics()
}

function acceptEssentialOnly() {
  // Store minimal consent
  localStorage.setItem("cookiesAccepted", "essential")
  localStorage.setItem(
    "cookiePreferences",
    JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }),
  )

  // Set only essential cookies
  setCookie("user_consent", "essential", 365)

  // Close modal and hide banner
  closeCookieModal()
  hideCookieBanner()

  // Show success message
  showSuccessMessage("✅ Essential cookies only - preferences saved!")
}

function acceptAllCookies() {
  acceptCookies()
  closeCookieModal()
}

function learnMore() {
  const modal = document.getElementById("cookieModal")
  modal.classList.add("show")
}

function closeCookieModal() {
  const modal = document.getElementById("cookieModal")
  modal.classList.remove("show")
}

// Utility function to set cookies
function setCookie(name, value, days) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

// Utility function to get cookies
function getCookie(name) {
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

// Initialize analytics (placeholder)
function initializeAnalytics() {
  console.log("Analytics initialized - cookies accepted")
  // Add your analytics code here (Google Analytics, etc.)
}

// Scroll to Top Functionality
function initializeScrollToTop() {
  const scrollBtn = document.getElementById("scrollTopBtn")

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = scrollTop / docHeight

    if (scrollPercent > 0.2) {
      scrollBtn.classList.add("visible")
    } else {
      scrollBtn.classList.remove("visible")
    }
  })
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  const modal = document.getElementById("cookieModal")
  if (event.target === modal) {
    closeCookieModal()
  }
})

// Handle escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCookieModal()
  }
})

// Reset cookies function (for testing)
function resetCookies() {
  localStorage.removeItem("cookiesAccepted")
  localStorage.removeItem("cookiePreferences")

  // Clear cookies
  document.cookie = "user_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  document.cookie = "analytics_enabled=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  document.cookie = "marketing_enabled=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

  location.reload()
}

// Add slideOutRight animation
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)



