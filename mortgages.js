document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Mortgage action buttons
    const statementsBtn = document.querySelector('.mortgage-actions .button:nth-child(1)');
    const overpaymentBtn = document.querySelector('.mortgage-actions .button:nth-child(2)');
    
    // Statements functionality
    if (statementsBtn) {
        statementsBtn.addEventListener('click', function() {
            alert('Mortgage statements would be displayed in a real application.');
        });
    }
    
    // Overpayment functionality
    if (overpaymentBtn) {
        overpaymentBtn.addEventListener('click', function() {
            const currentBalance = document.querySelector('.detail-value').textContent;
            
            const amount = prompt(`Enter overpayment amount (current balance: ${currentBalance}):`);
            
            if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                alert(`Overpayment of $${amount} would be processed in a real application.`);
            } else if (amount !== null) {
                alert('Please enter a valid amount.');
            }
        });
    }
    
    // Payment schedule filter
    const scheduleFilter = document.getElementById('scheduleFilter');
    
    if (scheduleFilter) {
        scheduleFilter.addEventListener('change', function() {
            const filterValue = this.value;
            const tableRows = document.querySelectorAll('.schedule-table tbody tr');
            
            tableRows.forEach(row => {
                const status = row.querySelector('.payment-status').textContent.toLowerCase();
                
                if (filterValue === 'all') {
                    row.style.display = '';
                } else if (filterValue === 'upcoming' && status === 'upcoming') {
                    row.style.display = '';
                } else if (filterValue === 'past' && status === 'completed') {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Download schedule button
    const downloadScheduleBtn = document.querySelector('.schedule-actions .button');
    
    if (downloadScheduleBtn) {
        downloadScheduleBtn.addEventListener('click', function() {
            alert('Payment schedule would be downloaded in a real application.');
        });
    }
    
    // Mortgage calculator
    const propertyValueInput = document.getElementById('propertyValue');
    const depositAmountInput = document.getElementById('depositAmount');
    const mortgageAmountInput = document.getElementById('mortgageAmount');
    const interestRateInput = document.getElementById('interestRate');
    const mortgageTermInput = document.getElementById('mortgageTerm');
    const calculateMortgageBtn = document.getElementById('calculateMortgageBtn');
    
    // Update deposit percentage when property value or deposit amount changes
    if (propertyValueInput && depositAmountInput) {
        const updateDepositPercentage = function() {
            const propertyValue = parseFloat(propertyValueInput.value) || 0;
            const depositAmount = parseFloat(depositAmountInput.value) || 0;
            
            if (propertyValue > 0) {
                const percentage = (depositAmount / propertyValue) * 100;
                document.querySelector('.deposit-percentage').textContent = `${percentage.toFixed(1)}% Deposit`;
            }
        };
        
        propertyValueInput.addEventListener('input', function() {
            const propertyValue = parseFloat(this.value) || 0;
            const depositAmount = parseFloat(depositAmountInput.value) || 0;
            
            // Update mortgage amount
            mortgageAmountInput.value = Math.max(0, propertyValue - depositAmount);
            
            updateDepositPercentage();
        });
        
        depositAmountInput.addEventListener('input', function() {
            const propertyValue = parseFloat(propertyValueInput.value) || 0;
            const depositAmount = parseFloat(this.value) || 0;
            
            // Update mortgage amount
            mortgageAmountInput.value = Math.max(0, propertyValue - depositAmount);
            
            updateDepositPercentage();
        });
        
        mortgageAmountInput.addEventListener('input', function() {
            const propertyValue = parseFloat(propertyValueInput.value) || 0;
            const mortgageAmount = parseFloat(this.value) || 0;
            
            // Update deposit amount
            depositAmountInput.value = Math.max(0, propertyValue - mortgageAmount);
            
            updateDepositPercentage();
        });
    }
    
    // Calculate mortgage button
    if (calculateMortgageBtn) {
        calculateMortgageBtn.addEventListener('click', function() {
            calculateMortgage();
        });
    }
    
    // Calculate mortgage
    function calculateMortgage() {
        // Get input values
        const mortgageAmount = parseFloat(mortgageAmountInput.value) || 0;
        const interestRate = parseFloat(interestRateInput.value) || 0;
        const mortgageTerm = parseInt(mortgageTermInput.value) || 0;
        
        // Calculate monthly payment
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = mortgageTerm * 12;
        
        let monthlyPayment = 0;
        
        if (monthlyRate > 0) {
            monthlyPayment = mortgageAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        } else {
            monthlyPayment = mortgageAmount / numberOfPayments;
        }
        
        // Calculate total repayment and interest
        const totalRepayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalRepayment - mortgageAmount;
        
        // Update results
        document.querySelector('.payment-amount').textContent = formatCurrency(monthlyPayment);
        document.getElementById('totalRepayment').textContent = formatCurrency(totalRepayment);
        document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
        
        // Update chart
        const principalPercentage = (mortgageAmount / totalRepayment) * 100;
        const interestPercentage = (totalInterest / totalRepayment) * 100;
        
        document.querySelector('.chart-segment.principal').style.width = `${principalPercentage}%`;
        document.querySelector('.chart-segment.interest').style.width = `${interestPercentage}%`;
        
        document.querySelector('.chart-label:nth-child(1) .label-text').textContent = `Principal (${principalPercentage.toFixed(0)}%)`;
        document.querySelector('.chart-label:nth-child(2) .label-text').textContent = `Interest (${interestPercentage.toFixed(0)}%)`;
    }
    
    // Format currency
    function formatCurrency(value) {
        return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    
    // Initialize calculator
    calculateMortgage();
});