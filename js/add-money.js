document.addEventListener('DOMContentLoaded', function() {
    // Bank Transfer Modal
    const bankTransferOption = document.getElementById('bankTransferOption');
    const bankTransferModal = document.getElementById('bankTransferModal');
    const closeBankTransferModal = document.getElementById('closeBankTransferModal');
    const bankTransferForm = document.getElementById('bankTransferForm');
    const transferFormContainer = document.getElementById('transferFormContainer');
    const processingScreen = document.getElementById('processingScreen');
    const successScreen = document.getElementById('successScreen');
    const transferProgress = document.getElementById('transferProgress');
    const progressStatus = document.getElementById('progressStatus');
    const doneBtn = document.getElementById('doneBtn');
    
    // Debit Card Modal
    const debitCardOption = document.getElementById('debitCardOption');
    const debitCardModal = document.getElementById('debitCardModal');
    const closeDebitCardModal = document.getElementById('closeDebitCardModal');
    const debitCardForm = document.getElementById('debitCardForm');
    const cardFormContainer = document.getElementById('cardFormContainer');
    const cardProcessingScreen = document.getElementById('cardProcessingScreen');
    const cardSuccessScreen = document.getElementById('cardSuccessScreen');
    const cardProgress = document.getElementById('cardProgress');
    const cardProgressStatus = document.getElementById('cardProgressStatus');
    const cardDoneBtn = document.getElementById('cardDoneBtn');
    
    // Quick amounts for bank transfer
    const quickAmounts = document.querySelectorAll('.quick-amount');
    const transferAmount = document.getElementById('transferAmount');
    
    if (quickAmounts && transferAmount) {
        quickAmounts.forEach(btn => {
            btn.addEventListener('click', function() {
                const amount = parseFloat(this.getAttribute('data-amount'));
                transferAmount.value = amount.toFixed(2);
            });
        });
    }
    
    // Quick amounts for debit card
    const cardQuickAmounts = document.querySelectorAll('.card-amount');
    const cardAmount = document.getElementById('cardAmount');
    
    if (cardQuickAmounts && cardAmount) {
        cardQuickAmounts.forEach(btn => {
            btn.addEventListener('click', function() {
                const amount = parseFloat(this.getAttribute('data-amount'));
                cardAmount.value = amount.toFixed(2);
            });
        });
    }
    
    // Open Bank Transfer Modal
    if (bankTransferOption && bankTransferModal) {
        bankTransferOption.addEventListener('click', function() {
            bankTransferModal.classList.add('active');
        });
    }
    
    // Close Bank Transfer Modal
    if (closeBankTransferModal && bankTransferModal) {
        closeBankTransferModal.addEventListener('click', function() {
            bankTransferModal.classList.remove('active');
            // Reset form
            setTimeout(() => {
                transferFormContainer.style.display = 'block';
                processingScreen.style.display = 'none';
                successScreen.style.display = 'none';
                if (bankTransferForm) bankTransferForm.reset();
            }, 300);
        });
    }
    
    // Open Debit Card Modal
    if (debitCardOption && debitCardModal) {
        debitCardOption.addEventListener('click', function() {
            debitCardModal.classList.add('active');
        });
    }
    
    // Close Debit Card Modal
    if (closeDebitCardModal && debitCardModal) {
        closeDebitCardModal.addEventListener('click', function() {
            debitCardModal.classList.remove('active');
            // Reset form
            setTimeout(() => {
                cardFormContainer.style.display = 'block';
                cardProcessingScreen.style.display = 'none';
                cardSuccessScreen.style.display = 'none';
                if (debitCardForm) debitCardForm.reset();
            }, 300);
        });
    }
    
    // Submit Bank Transfer Form
    if (bankTransferForm) {
        bankTransferForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Hide form and show processing
            transferFormContainer.style.display = 'none';
            processingScreen.style.display = 'block';
            
            // Get form values
            const amount = document.getElementById('transferAmount').value;
            const bank = document.getElementById('fromBank');
            const bankName = bank.options[bank.selectedIndex].text;
            const reference = document.getElementById('reference').value || '-';
            
            // Update confirmed values in success screen
            document.getElementById('confirmedAmount').textContent = amount;
            document.getElementById('confirmedBank').textContent = bankName;
            document.getElementById('confirmedReference').textContent = reference;
            
            // Simulate progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 5;
                transferProgress.style.width = `${progress}%`;
                
                if (progress === 20) {
                    progressStatus.textContent = 'Connecting to your bank...';
                } else if (progress === 50) {
                    progressStatus.textContent = 'Verifying account details...';
                } else if (progress === 80) {
                    progressStatus.textContent = 'Processing transfer...';
                } else if (progress >= 100) {
                    clearInterval(progressInterval);
                    progressStatus.textContent = 'Transfer complete!';
                    
                    // Show success screen after a short delay
                    setTimeout(() => {
                        processingScreen.style.display = 'none';
                        successScreen.style.display = 'block';
                    }, 800);
                }
            }, 200);
        });
    }
    
    // Submit Debit Card Form
    if (debitCardForm) {
        debitCardForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Hide form and show processing
            cardFormContainer.style.display = 'none';
            cardProcessingScreen.style.display = 'block';
            
            // Get form values
            const amount = document.getElementById('cardAmount').value;
            const cardNumber = document.getElementById('cardNumber').value;
            const last4 = cardNumber.slice(-4);
            
            // Update confirmed values in success screen
            document.getElementById('confirmedCardAmount').textContent = amount;
            document.getElementById('confirmedCardLast4').textContent = last4;
            
            // Simulate progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 5;
                cardProgress.style.width = `${progress}%`;
                
                if (progress === 20) {
                    cardProgressStatus.textContent = 'Verifying card details...';
                } else if (progress === 50) {
                    cardProgressStatus.textContent = 'Processing payment...';
                } else if (progress === 80) {
                    cardProgressStatus.textContent = 'Finalizing transaction...';
                } else if (progress >= 100) {
                    clearInterval(progressInterval);
                    cardProgressStatus.textContent = 'Payment complete!';
                    
                    // Show success screen after a short delay
                    setTimeout(() => {
                        cardProcessingScreen.style.display = 'none';
                        cardSuccessScreen.style.display = 'block';
                    }, 800);
                }
            }, 200);
        });
    }
    
    // Done Button (Bank Transfer)
    if (doneBtn && bankTransferModal) {
        doneBtn.addEventListener('click', function() {
            bankTransferModal.classList.remove('active');
            
            // Reset form
            setTimeout(() => {
                transferFormContainer.style.display = 'block';
                processingScreen.style.display = 'none';
                successScreen.style.display = 'none';
                if (bankTransferForm) bankTransferForm.reset();
            }, 300);
            
            // Update balance on dashboard
            updateBalanceAfterAddMoney();
        });
    }
    
    // Done Button (Debit Card)
    if (cardDoneBtn && debitCardModal) {
        cardDoneBtn.addEventListener('click', function() {
            debitCardModal.classList.remove('active');
            
            // Reset form
            setTimeout(() => {
                cardFormContainer.style.display = 'block';
                cardProcessingScreen.style.display = 'none';
                cardSuccessScreen.style.display = 'none';
                if (debitCardForm) debitCardForm.reset();
            }, 300);
            
            // Update balance on dashboard
            updateBalanceAfterAddMoney();
        });
    }
    
    // Update balance after adding money
    function updateBalanceAfterAddMoney() {
        // This would typically come from an API, but we'll simulate it
        // by redirecting to the dashboard and updating localStorage
        
        // First get current balance if it exists
        let currentBalance = localStorage.getItem('accountBalance');
        
        if (!currentBalance) {
            currentBalance = "10050998.70"; // Default balance
        }
        
        // Add a random amount between 100-1000
        const addedAmount = (Math.random() * 900 + 100).toFixed(2);
        const newBalance = (parseFloat(currentBalance) + parseFloat(addedAmount)).toFixed(2);
        
        // Save the new balance
        localStorage.setItem('accountBalance', newBalance);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});