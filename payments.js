document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Payment option buttons
    const transferBtn = document.getElementById('transferBtn');
    const payBtn = document.getElementById('payBtn');
    const scheduledBtn = document.getElementById('scheduledBtn');
    const payeesBtn = document.getElementById('payeesBtn');
    
    // Payment forms
    const transferForm = document.getElementById('transferForm');
    
    // Close and cancel buttons
    const closeTransferForm = document.getElementById('closeTransferForm');
    const cancelTransfer = document.getElementById('cancelTransfer');
    
    // Show transfer form
    if (transferBtn) {
        transferBtn.addEventListener('click', function() {
            transferForm.classList.add('active');
            
            // Set minimum date for scheduled transfers to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('scheduledDate').min = today;
        });
    }
    
    // Show other payment forms (would be implemented in a real app)
    if (payBtn) {
        payBtn.addEventListener('click', function() {
            alert('Pay Someone functionality would be implemented in a real application.');
        });
    }
    
    if (scheduledBtn) {
        scheduledBtn.addEventListener('click', function() {
            alert('Scheduled Payments functionality would be implemented in a real application.');
        });
    }
    
    if (payeesBtn) {
        payeesBtn.addEventListener('click', function() {
            alert('Manage Payees functionality would be implemented in a real application.');
        });
    }
    
    // Close transfer form
    if (closeTransferForm) {
        closeTransferForm.addEventListener('click', function() {
            transferForm.classList.remove('active');
        });
    }
    
    if (cancelTransfer) {
        cancelTransfer.addEventListener('click', function() {
            transferForm.classList.remove('active');
        });
    }
    
    // Transfer type selector
    const transferTypeBtns = document.querySelectorAll('.transfer-type-btn');
    const ownAccountsGroup = document.getElementById('ownAccountsGroup');
    const otherAccountsGroup = document.getElementById('otherAccountsGroup');
    
    transferTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            transferTypeBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show/hide appropriate account selection
            const type = this.getAttribute('data-type');
            if (type === 'own') {
                ownAccountsGroup.classList.remove('hidden');
                otherAccountsGroup.classList.add('hidden');
            } else {
                ownAccountsGroup.classList.add('hidden');
                otherAccountsGroup.classList.remove('hidden');
            }
        });
    });
    
    // Date selector
    const dateOptions = document.querySelectorAll('.date-option');
    const datePickerGroup = document.getElementById('datePickerGroup');
    
    dateOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            dateOptions.forEach(o => o.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Show/hide date picker
            const date = this.getAttribute('data-date');
            if (date === 'now') {
                datePickerGroup.classList.add('hidden');
            } else {
                datePickerGroup.classList.remove('hidden');
            }
        });
    });
    
    // Handle new payee selection
    const payeeSelect = document.getElementById('payee');
    
    if (payeeSelect) {
        payeeSelect.addEventListener('change', function() {
            if (this.value === 'new') {
                alert('Add New Payee functionality would be implemented in a real application.');
                this.value = ''; // Reset selection
            }
        });
    }
    
    // From account selection
    const fromAccountSelect = document.getElementById('fromAccount');
    const toOwnAccountSelect = document.getElementById('toOwnAccount');
    
    if (fromAccountSelect && toOwnAccountSelect) {
        fromAccountSelect.addEventListener('change', function() {
            // Update to account options to exclude the selected from account
            const selectedValue = this.value;
            
            // Get all options
            const options = toOwnAccountSelect.querySelectorAll('option');
            
            // Show all options first
            options.forEach(option => {
                option.style.display = 'block';
            });
            
            // Hide the selected from account in the to account dropdown
            const matchingOption = toOwnAccountSelect.querySelector(`option[value="${selectedValue}"]`);
            if (matchingOption) {
                matchingOption.style.display = 'none';
                
                // If the hidden option was selected, select the first visible option
                if (toOwnAccountSelect.value === selectedValue) {
                    const firstVisibleOption = toOwnAccountSelect.querySelector('option:not([style="display: none;"])');
                    if (firstVisibleOption) {
                        toOwnAccountSelect.value = firstVisibleOption.value;
                    }
                }
            }
        });
    }
    
    // Handle form submission
    const moneyTransferForm = document.getElementById('moneyTransferForm');
    
    if (moneyTransferForm) {
        moneyTransferForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const fromAccount = document.getElementById('fromAccount').value;
            const transferType = document.querySelector('.transfer-type-btn.active').getAttribute('data-type');
            const toAccount = transferType === 'own' 
                ? document.getElementById('toOwnAccount').value 
                : document.getElementById('payee').value;
            const amount = document.getElementById('amount').value;
            const reference = document.getElementById('reference').value;
            const transferTime = document.querySelector('.date-option.active').getAttribute('data-date');
            const scheduledDate = document.getElementById('scheduledDate').value;
            
            // Validate form
            if (!amount || parseFloat(amount) <= 0) {
                alert('Please enter a valid amount.');
                return;
            }
            
            if (transferType === 'other' && (!toAccount || toAccount === '')) {
                alert('Please select a payee.');
                return;
            }
            
            if (transferTime === 'later' && !scheduledDate) {
                alert('Please select a date for the scheduled transfer.');
                return;
            }
            
            // Show confirmation
            let confirmMessage = `You are about to transfer £${amount} from your ${fromAccount.charAt(0).toUpperCase() + fromAccount.slice(1)} Account`;
            
            if (transferType === 'own') {
                confirmMessage += ` to your ${toAccount.charAt(0).toUpperCase() + toAccount.slice(1)} Account`;
            } else {
                const payeeName = document.querySelector(`#payee option[value="${toAccount}"]`).textContent;
                confirmMessage += ` to ${payeeName}`;
            }
            
            if (transferTime === 'later') {
                confirmMessage += ` on ${scheduledDate}`;
            } else {
                confirmMessage += ` now`;
            }
            
            if (reference) {
                confirmMessage += ` with reference "${reference}"`;
            }
            
            confirmMessage += `. Do you want to proceed?`;
            
            if (confirm(confirmMessage)) {
                // In a real app, this would submit the transfer to the server
                alert('Transfer successful!');
                
                // Reset form and hide it
                moneyTransferForm.reset();
                transferForm.classList.remove('active');
            }
        });
    }
    
    // Make payment items clickable
    const paymentItems = document.querySelectorAll('.payment-item');
    
    paymentItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.payment-title').textContent;
            alert(`Payment details for "${title}" would be shown in a real application.`);
        });
    });
});