document.addEventListener('DOMContentLoaded', function() {
    // Send to Contact Modal
    const sendToContactOption = document.getElementById('sendToContactOption');
    const sendToContactModal = document.getElementById('sendToContactModal');
    const closeSendToContactModal = document.getElementById('closeSendToContactModal');
    const contactFormContainer = document.getElementById('contactFormContainer');
    const contactTransferForm = document.getElementById('contactTransferForm');
    const contactProcessingScreen = document.getElementById('contactProcessingScreen');
    const contactSuccessScreen = document.getElementById('contactSuccessScreen');
    const contactProgress = document.getElementById('contactProgress');
    const contactProgressStatus = document.getElementById('contactProgressStatus');
    const contactDoneBtn = document.getElementById('contactDoneBtn');
    
    // QR Code Modal
    const scanQROption = document.getElementById('scanQROption');
    const scanQRModal = document.getElementById('scanQRModal');
    const closeScanQRModal = document.getElementById('closeScanQRModal');
    const qrContainer = document.getElementById('qrContainer');
    const myQrContainer = document.getElementById('myQrContainer');
    const showMyQRBtn = document.getElementById('showMyQRBtn');
    const backToScanBtn = document.getElementById('backToScanBtn');
    
    // Recipients
    const recipientItems = document.querySelectorAll('.recipient-item');
    let selectedContact = null;
    
    // Payment Methods
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    // Quick amounts for contact transfer
    const contactQuickAmounts = document.querySelectorAll('.contact-amount');
    const contactAmount = document.getElementById('contactAmount');
    
    if (contactQuickAmounts && contactAmount) {
        contactQuickAmounts.forEach(btn => {
            btn.addEventListener('click', function() {
                const amount = parseFloat(this.getAttribute('data-amount'));
                contactAmount.value = amount.toFixed(2);
            });
        });
    }
    
    // Open Send to Contact Modal
    if (sendToContactOption && sendToContactModal) {
        sendToContactOption.addEventListener('click', function() {
            sendToContactModal.classList.add('active');
        });
    }
    
    // Close Send to Contact Modal
    if (closeSendToContactModal && sendToContactModal) {
        closeSendToContactModal.addEventListener('click', function() {
            sendToContactModal.classList.remove('active');
            // Reset form
            setTimeout(() => {
                contactFormContainer.style.display = 'block';
                contactProcessingScreen.style.display = 'none';
                contactSuccessScreen.style.display = 'none';
                if (contactTransferForm) contactTransferForm.reset();
                contactTransferForm.style.display = 'none';
                selectedContact = null;
                recipientItems.forEach(item => {
                    item.classList.remove('selected');
                });
            }, 300);
        });
    }
    
    // Open Scan QR Modal
    if (scanQROption && scanQRModal) {
        scanQROption.addEventListener('click', function() {
            scanQRModal.classList.add('active');
        });
    }
    
    // Close Scan QR Modal
    if (closeScanQRModal && scanQRModal) {
        closeScanQRModal.addEventListener('click', function() {
            scanQRModal.classList.remove('active');
            // Reset to default view
            setTimeout(() => {
                qrContainer.style.display = 'block';
                myQrContainer.style.display = 'none';
            }, 300);
        });
    }
    
    // Show My QR Code
    if (showMyQRBtn) {
        showMyQRBtn.addEventListener('click', function() {
            qrContainer.style.display = 'none';
            myQrContainer.style.display = 'block';
            
            // Update name from localStorage if available
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            const qrUserName = document.getElementById('qrUserName');
            if (currentUser && currentUser.name && qrUserName) {
                qrUserName.textContent = currentUser.name;
            }
        });
    }
    
    // Back to Scanner
    if (backToScanBtn) {
        backToScanBtn.addEventListener('click', function() {
            myQrContainer.style.display = 'none';
            qrContainer.style.display = 'block';
        });
    }
    
    // Select a recipient
    if (recipientItems) {
        recipientItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove selected class from all items
                recipientItems.forEach(item => {
                    item.classList.remove('selected');
                });
                
                // Add selected class to this item
                this.classList.add('selected');
                
                // Store selected contact
                selectedContact = this.getAttribute('data-contact');
                
                // Show transfer form
                if (contactTransferForm) {
                    contactTransferForm.style.display = 'block';
                }
            });
        });
    }
    
    // Select a payment method
    if (paymentMethods) {
        paymentMethods.forEach(method => {
            method.addEventListener('click', function() {
                // Remove selected class from all methods
                paymentMethods.forEach(method => {
                    method.classList.remove('selected');
                });
                
                // Add selected class to this method
                this.classList.add('selected');
            });
        });
    }
    
    // Submit Contact Transfer Form
    if (contactTransferForm) {
        contactTransferForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (!selectedContact) {
                alert('Please select a contact first.');
                return;
            }
            
            // Hide form and show processing
            contactFormContainer.style.display = 'none';
            contactProcessingScreen.style.display = 'block';
            
            // Get form values
            const amount = document.getElementById('contactAmount').value;
            const reference = document.getElementById('paymentReference').value || '-';
            
            // Get contact name based on selected contact
            let contactName = 'Contact';
            recipientItems.forEach(item => {
                if (item.getAttribute('data-contact') === selectedContact) {
                    contactName = item.querySelector('.recipient-name').textContent;
                }
            });
            
            // Update confirmed values in success screen
            document.getElementById('confirmedContactAmount').textContent = amount;
            document.getElementById('confirmedContactName').textContent = contactName;
            document.getElementById('confirmedContactReference').textContent = reference;
            
            // Simulate progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 5;
                contactProgress.style.width = `${progress}%`;
                
                if (progress === 20) {
                    contactProgressStatus.textContent = 'Verifying details...';
                } else if (progress === 50) {
                    contactProgressStatus.textContent = 'Processing payment...';
                } else if (progress === 80) {
                    contactProgressStatus.textContent = 'Finalizing transfer...';
                } else if (progress >= 100) {
                    clearInterval(progressInterval);
                    contactProgressStatus.textContent = 'Transfer complete!';
                    
                    // Show success screen after a short delay
                    setTimeout(() => {
                        contactProcessingScreen.style.display = 'none';
                        contactSuccessScreen.style.display = 'block';
                    }, 800);
                }
            }, 200);
        });
    }
    
    // Done Button (Contact Transfer)
    if (contactDoneBtn && sendToContactModal) {
        contactDoneBtn.addEventListener('click', function() {
            sendToContactModal.classList.remove('active');
            
            // Reset form
            setTimeout(() => {
                contactFormContainer.style.display = 'block';
                contactProcessingScreen.style.display = 'none';
                contactSuccessScreen.style.display = 'none';
                if (contactTransferForm) contactTransferForm.reset();
                contactTransferForm.style.display = 'none';
                selectedContact = null;
                recipientItems.forEach(item => {
                    item.classList.remove('selected');
                });
            }, 300);
            
            // Update balance on dashboard (simulate money withdrawal)
            updateBalanceAfterTransfer();
        });
    }
    
    // Update balance after transfer
    function updateBalanceAfterTransfer() {
        // This would typically come from an API, but we'll simulate it
        
        // First get current balance if it exists
        let currentBalance = localStorage.getItem('accountBalance');
        
        if (!currentBalance) {
            currentBalance = "5,350,998.70"; // Default balance
        }
        
        // Subtract the transferred amount (we'll use a fixed amount for demonstration)
        const transferredAmount = 20.00;
        const newBalance = (parseFloat(currentBalance) - transferredAmount).toFixed(2);
        
        // Save the new balance
        localStorage.setItem('accountBalance', newBalance);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});