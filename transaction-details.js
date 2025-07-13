document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Get transaction ID from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('id');
    
    // In a real app, you would fetch transaction details based on the ID
    // For this demo, we'll use hardcoded data
    
    // Make similar transactions clickable
    const similarTransactions = document.querySelectorAll('.similar-transactions .transaction-item');
    
    similarTransactions.forEach((transaction, index) => {
        transaction.addEventListener('click', function() {
            // In a real app, this would navigate to the specific transaction
            // For demo purposes, we'll just show an alert
            alert(`Viewing similar transaction #${index + 1}`);
        });
    });
    
    // Category change functionality
    const changeCategoryBtn = document.querySelector('.transaction-actions .button:nth-child(1)');
    
    if (changeCategoryBtn) {
        changeCategoryBtn.addEventListener('click', function() {
            const categories = [
                'Groceries', 
                'Dining Out', 
                'Entertainment', 
                'Transport', 
                'Shopping', 
                'Utilities', 
                'Healthcare'
            ];
            
            const currentCategory = document.querySelector('.category-tag').textContent;
            const currentIndex = categories.indexOf(currentCategory);
            const nextIndex = (currentIndex + 1) % categories.length;
            
            // Update category tag
            document.querySelector('.category-tag').textContent = categories[nextIndex];
            
            // Show confirmation message
            alert(`Category updated to: ${categories[nextIndex]}`);
        });
    }
    
    // Flag transaction functionality
    const flagTransactionBtn = document.querySelector('.transaction-actions .button:nth-child(2)');
    
    if (flagTransactionBtn) {
        flagTransactionBtn.addEventListener('click', function() {
            const isFlagged = this.classList.contains('flagged');
            
            if (isFlagged) {
                this.classList.remove('flagged');
                this.innerHTML = '<i class="fas fa-flag"></i> Flag Transaction';
                alert('Transaction unflagged');
            } else {
                this.classList.add('flagged');
                this.innerHTML = '<i class="fas fa-flag"></i> Unflag Transaction';
                alert('Transaction flagged for review');
            }
        });
    }
    
    // Report issue functionality
    const reportIssueBtn = document.querySelector('.transaction-actions .button:nth-child(3)');
    
    if (reportIssueBtn) {
        reportIssueBtn.addEventListener('click', function() {
            const issues = [
                'I don\'t recognize this transaction',
                'Incorrect amount',
                'Duplicate transaction',
                'Transaction was declined but I was charged',
                'Other issue'
            ];
            
            // In a real app, this would open a modal with options
            // For demo purposes, we'll use a simple prompt
            const issueMessage = 'Select an issue:\n' + 
                issues.map((issue, index) => `${index + 1}. ${issue}`).join('\n');
            
            const selection = prompt(issueMessage, '1');
            
            if (selection && selection > 0 && selection <= issues.length) {
                alert(`Issue reported: ${issues[selection - 1]}\nOur team will review this transaction.`);
            }
        });
    }
    
    // Export details functionality
    const exportDetailsBtn = document.querySelector('.transaction-actions .button:nth-child(4)');
    
    if (exportDetailsBtn) {
        exportDetailsBtn.addEventListener('click', function() {
            const formats = ['PDF', 'CSV', 'Excel'];
            
            // In a real app, this would open a modal with options
            // For demo purposes, we'll use a simple prompt
            const formatMessage = 'Select export format:\n' + 
                formats.map((format, index) => `${index + 1}. ${format}`).join('\n');
            
            const selection = prompt(formatMessage, '1');
            
            if (selection && selection > 0 && selection <= formats.length) {
                alert(`Transaction details will be exported as ${formats[selection - 1]}`);
            }
        });
    }
    
    // Receipt download functionality
    const downloadReceiptBtn = document.querySelector('.receipt-actions .button:nth-child(1)');
    
    if (downloadReceiptBtn) {
        downloadReceiptBtn.addEventListener('click', function() {
            alert('Receipt downloaded successfully');
        });
    }
    
    // Receipt print functionality
    const printReceiptBtn = document.querySelector('.receipt-actions .button:nth-child(2)');
    
    if (printReceiptBtn) {
        printReceiptBtn.addEventListener('click', function() {
            alert('Preparing receipt for printing...');
            // In a real app, this would open the print dialog
            // window.print();
        });
    }
    
    // Update dashboard.js to make transaction items link to this page
    // This would be done in the dashboard.js file in a real implementation
    // For this demo, we'll add this functionality here
    
    // Function to update dashboard transaction links
    function updateDashboardTransactionLinks() {
        // This function would be called when navigating back to the dashboard
        // It would add click handlers to transaction items to navigate to this page
        console.log('Transaction links would be updated on dashboard');
    }
});