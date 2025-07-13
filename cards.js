document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Card limit sliders
    const atmSlider = document.getElementById('atmSlider');
    const purchaseSlider = document.getElementById('purchaseSlider');
    const onlineSlider = document.getElementById('onlineSlider');
    
    // Update limit values when sliders change
    if (atmSlider) {
        atmSlider.addEventListener('input', function() {
            updateLimitValue(this, '$');
        });
    }
    
    if (purchaseSlider) {
        purchaseSlider.addEventListener('input', function() {
            updateLimitValue(this, '$');
        });
    }
    
    if (onlineSlider) {
        onlineSlider.addEventListener('input', function() {
            updateLimitValue(this, '$');
        });
    }
    
    // Function to update limit value display
    function updateLimitValue(slider, currency) {
        const value = slider.value;
        const formattedValue = formatCurrency(value, currency);
        slider.parentElement.previousElementSibling.querySelector('.limit-value').textContent = formattedValue;
    }
    
    // Format currency with commas
    function formatCurrency(value, currency) {
        return currency + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Card freeze/unfreeze functionality
    const freezeButtons = document.querySelectorAll('.card-actions .button:first-child');
    
    freezeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardItem = this.closest('.card-item');
            const cardStatus = cardItem.querySelector('.card-status');
            
            if (cardStatus.classList.contains('active')) {
                // Freeze card
                cardStatus.textContent = 'Frozen';
                cardStatus.classList.remove('active');
                cardStatus.classList.add('frozen');
                this.innerHTML = '<i class="fas fa-unlock"></i> Unfreeze Card';
                
                // Add frosted effect to card
                cardItem.querySelector('.card-preview').style.opacity = '0.7';
                
                // Show confirmation
                alert('Card has been frozen. No new transactions will be authorized.');
            } else {
                // Unfreeze card
                cardStatus.textContent = 'Active';
                cardStatus.classList.remove('frozen');
                cardStatus.classList.add('active');
                this.innerHTML = '<i class="fas fa-lock"></i> Freeze Card';
                
                // Remove frosted effect
                cardItem.querySelector('.card-preview').style.opacity = '1';
                
                // Show confirmation
                alert('Card has been unfrozen. Transactions will now be authorized normally.');
            }
        });
    });
    
    // Card management functionality
    const manageButtons = document.querySelectorAll('.card-actions .button:nth-child(2)');
    
    manageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardItem = this.closest('.card-item');
            const cardType = cardItem.querySelector('.card-title h3').textContent;
            
            // Show card management options
            const options = [
                'View Card Details',
                'Change PIN',
                'Report Lost or Stolen',
                'Order Replacement',
                cardType.includes('Virtual') ? 'Delete Virtual Card' : 'Upgrade Card'
            ];
            
            const optionsMessage = 'Select an option:\n' + 
                options.map((option, index) => `${index + 1}. ${option}`).join('\n');
            
            const selection = prompt(optionsMessage, '1');
            
            if (selection && selection > 0 && selection <= options.length) {
                alert(`Selected option: ${options[selection - 1]}\nThis feature would be implemented in a real application.`);
            }
        });
    });
    
    // Toggle switches functionality
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const toggleName = this.closest('.toggle-item').querySelector('.toggle-name').textContent;
            const status = this.checked ? 'enabled' : 'disabled';
            
            // Show confirmation
            alert(`${toggleName} has been ${status}.`);
        });
    });
    
    // Save changes button
    const saveChangesBtn = document.querySelector('.settings-actions .button');
    
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function() {
            // Show confirmation
            alert('Card settings have been saved successfully.');
        });
    }
    
    // Make transaction items link to transaction details page
    const transactionItems = document.querySelectorAll('.transaction-item');
    
    transactionItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            window.location.href = `transaction-details.html?id=${index + 1}`;
        });
    });
});