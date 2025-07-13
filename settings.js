document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    window.location.href = 'login.html';
    return;
  }

  // Get user info from session storage
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  
  // Update user information in the UI
  const userDisplayName = document.getElementById('userDisplayName');
  const userAvatars = document.querySelectorAll('.user-avatar');
  
  if (userDisplayName) {
    userDisplayName.textContent = userInfo.displayName;
  }
  
  // Set user initials in avatars
  userAvatars.forEach(avatar => {
    const nameParts = userInfo.displayName.split(' ');
    const initials = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : nameParts[0].substring(0, 2);
    
    avatar.querySelector('span').textContent = initials.toUpperCase();
  });

  // Sidebar toggle functionality
  const sidebar = document.getElementById('sidebar');
  const toggleSidebarBtn = document.getElementById('toggleSidebar');
  const closeSidebarBtn = document.getElementById('closeSidebar');
  
  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
  }
  
  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', function() {
      sidebar.classList.remove('active');
    });
  }

  // Handle logout
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userInfo');
      window.location.href = 'login.html';
    });
  }

  // Settings navigation
  const settingsNavLinks = document.querySelectorAll('.settings-nav-link');
  const settingsSections = document.querySelectorAll('.settings-section');
  
  // Show the first section by default
  if (settingsSections.length > 0) {
    settingsSections[0].style.display = 'block';
  }
  
  // Hide all other sections
  for (let i = 1; i < settingsSections.length; i++) {
    settingsSections[i].style.display = 'none';
  }
  
  // Add active class to the first nav link
  if (settingsNavLinks.length > 0) {
    settingsNavLinks[0].classList.add('active');
  }
  
  // Add click event listeners to nav links
  settingsNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      settingsNavLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Hide all sections
      settingsSections.forEach(section => {
        section.style.display = 'none';
      });
      
      // Show the corresponding section
      const targetId = this.getAttribute('href').substring(1);
      document.getElementById(targetId).style.display = 'block';
    });
  });

  // Toggle switches
  const toggleSwitches = document.querySelectorAll('.toggle-switch input');
  
  toggleSwitches.forEach(toggle => {
    toggle.addEventListener('change', function() {
      const settingName = this.getAttribute('data-setting');
      const isEnabled = this.checked;
      
      // In a real app, this would save the setting to the server
      console.log(`Setting "${settingName}" changed to: ${isEnabled}`);
      
      // Show a notification
      showNotification(`${settingName} has been ${isEnabled ? 'enabled' : 'disabled'}.`);
    });
  });

  // Profile form submission
  const profileForm = document.getElementById('profileForm');
  
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const updatedUserInfo = {
        ...userInfo,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        displayName: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email'),
        phone: formData.get('phone')
      };
      
      // In a real app, this would save the data to the server
      // For this demo, we'll just update the session storage
      sessionStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      
      // Show a notification
      showNotification('Profile updated successfully.');
      
      // Update displayed user info
      if (userDisplayName) {
        userDisplayName.textContent = updatedUserInfo.displayName;
      }
      
      // Update user initials in avatars
      userAvatars.forEach(avatar => {
        const nameParts = updatedUserInfo.displayName.split(' ');
        const initials = nameParts.length > 1 
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : nameParts[0].substring(0, 2);
        
        avatar.querySelector('span').textContent = initials.toUpperCase();
      });
    });
  }

  // Password change form
  const passwordForm = document.getElementById('passwordForm');
  
  if (passwordForm) {
    passwordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Simple validation
      if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match.', 'error');
        return;
      }
      
      if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters long.', 'error');
        return;
      }
      
      // In a real app, this would verify the current password and update to the new one
      // For this demo, we'll just show a success message
      showNotification('Password updated successfully.');
      
      // Reset the form
      passwordForm.reset();
    });
  }

  // Device management
  const removeDeviceButtons = document.querySelectorAll('.remove-device-btn');
  
  removeDeviceButtons.forEach(button => {
    button.addEventListener('click', function() {
      const deviceId = this.getAttribute('data-device-id');
      const deviceItem = document.querySelector(`.device-item[data-device-id="${deviceId}"]`);
      
      if (deviceItem) {
        // Ask for confirmation
        if (confirm('Are you sure you want to remove this device?')) {
          // In a real app, this would send a request to the server
          // For this demo, we'll just remove the element
          deviceItem.remove();
          showNotification('Device removed successfully.');
        }
      }
    });
  });

  // Delete account button
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', function() {
      // Show a confirmation dialog
      const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
      
      if (confirmDelete) {
        // In a real app, this would send a request to the server
        // For this demo, we'll just log out the user
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userInfo');
        
        // Redirect to the login page
        window.location.href = 'login.html';
      }
    });
  }

  // Notification function
  function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to the document
    document.body.appendChild(notification);
    
    // Show the notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      
      // Remove from DOM after animation
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
});