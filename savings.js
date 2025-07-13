document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Savings account actions
    const depositButtons = document.querySelectorAll('.account-actions .button:nth-child(1)');
    const withdrawButtons = document.querySelectorAll('.account-actions .button:nth-child(2)');
    const manageButtons = document.querySelectorAll('.account-actions .button:nth-child(3)');
    
    // Deposit functionality
    depositButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                const accountName = this.closest('.savings-account').querySelector('h3').textContent;
                const currentBalance = this.closest('.savings-account').querySelector('.balance-amount').textContent;
                
                const amount = prompt(`Enter amount to deposit into ${accountName} (current balance: ${currentBalance}):`);
                
                if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                    alert(`£${amount} would be deposited into your ${accountName} in a real application.`);
                } else if (amount !== null) {
                    alert('Please enter a valid amount.');
                }
            });
        }
    });
    
    // Withdraw functionality
    withdrawButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                const accountName = this.closest('.savings-account').querySelector('h3').textContent;
                const currentBalance = this.closest('.savings-account').querySelector('.balance-amount').textContent;
                
                const amount = prompt(`Enter amount to withdraw from ${accountName} (current balance: ${currentBalance}):`);
                
                if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                    alert(`£${amount} would be withdrawn from your ${accountName} in a real application.`);
                } else if (amount !== null) {
                    alert('Please enter a valid amount.');
                }
            });
        }
    });
    
    // Manage account functionality
    manageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const accountName = this.closest('.savings-account').querySelector('h3').textContent;
            
            const options = [
                'View Account Details',
                'Change Account Name',
                'Update Interest Notifications',
                'Close Account'
            ];
            
            const optionsMessage = `Select an option for ${accountName}:\n` + 
                options.map((option, index) => `${index + 1}. ${option}`).join('\n');
            
            const selection = prompt(optionsMessage, '1');
            
            if (selection && selection > 0 && selection <= options.length) {
                alert(`Selected option: ${options[selection - 1]}\nThis feature would be implemented in a real application.`);
            }
        });
    });
    
    // Open new savings account
    const addAccountBtn = document.querySelector('.add-account .button');
    
    if (addAccountBtn) {
        addAccountBtn.addEventListener('click', function() {
            const accountTypes = [
                'Instant Access Saver - 3.25% AER',
                'Fixed Rate Bond (1 Year) - 4.25% AER',
                'Fixed Rate Bond (2 Years) - 4.50% AER',
                'Fixed Rate Bond (5 Years) - 4.75% AER',
                'ISA Saver - 3.50% AER'
            ];
            
            const accountMessage = 'Select an account type to open:\n' + 
                accountTypes.map((type, index) => `${index + 1}. ${type}`).join('\n');
            
            const selection = prompt(accountMessage, '1');
            
            if (selection && selection > 0 && selection <= accountTypes.length) {
                alert(`You selected: ${accountTypes[selection - 1]}\nIn a real application, you would proceed to open this account.`);
            }
        });
    }
    
    // Savings goals actions
    const addMoneyButtons = document.querySelectorAll('.goal-actions .button:nth-child(1)');
    const editGoalButtons = document.querySelectorAll('.goal-actions .button:nth-child(2)');
    
    // Add money to goal
    addMoneyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const goalName = this.closest('.goal-card').querySelector('h3').textContent;
            const savedAmount = this.closest('.goal-card').querySelector('.saved-amount').textContent;
            const targetAmount = this.closest('.goal-card').querySelector('.target-amount').textContent;
            
            const amount = prompt(`Add money to ${goalName} (${savedAmount} of ${targetAmount}):`);
            
            if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                alert(`£${amount} would be added to your ${goalName} goal in a real application.`);
            } else if (amount !== null) {
                alert('Please enter a valid amount.');
            }
        });
    });
    
    // Edit goal
    editGoalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const goalName = this.closest('.goal-card').querySelector('h3').textContent;
            
            const options = [
                'Rename Goal',
                'Change Target Amount',
                'Update Target Date',
                'Delete Goal'
            ];
            
            const optionsMessage = `Select an option for ${goalName}:\n` + 
                options.map((option, index) => `${index + 1}. ${option}`).join('\n');
            
            const selection = prompt(optionsMessage, '1');
            
            if (selection && selection > 0 && selection <= options.length) {
                alert(`Selected option: ${options[selection - 1]}\nThis feature would be implemented in a real application.`);
            }
        });
    });
    
    // New goal button
    const newGoalBtn = document.querySelector('.savings-goals .button');
    
    if (newGoalBtn) {
        newGoalBtn.addEventListener('click', function() {
            alert('In a real application, you would be able to create a new savings goal here.');
        });
    }
    
    // Savings calculator
    const initialDepositInput = document.getElementById('initialDeposit');
    const monthlyContributionInput = document.getElementById('monthlyContribution');
    const interestRateInput = document.getElementById('interestRate');
    const savingPeriodInput = document.getElementById('savingPeriod');
    const calculateBtn = document.getElementById('calculateBtn');
    
    const totalContributionsElement = document.getElementById('totalContributions');
    const interestEarnedElement = document.getElementById('interestEarned');
    const finalBalanceElement = document.getElementById('finalBalance');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            calculateSavings();
        });
    }
    
    // Calculate savings
    function calculateSavings() {
        // Get input values
        const initialDeposit = parseFloat(initialDepositInput.value) || 0;
        const monthlyContribution = parseFloat(monthlyContributionInput.value) || 0;
        const interestRate = parseFloat(interestRateInput.value) || 0;
        const savingPeriod = parseInt(savingPeriodInput.value) || 0;
        
        // Calculate total contributions
        const totalMonthlyContributions = monthlyContribution * savingPeriod * 12;
        const totalContributions = initialDeposit + totalMonthlyContributions;
        
        // Calculate final balance with compound interest
        let balance = initialDeposit;
        const monthlyRate = interestRate / 100 / 12;
        
        for (let i = 0; i < savingPeriod * 12; i++) {
            balance += monthlyContribution;
            balance *= (1 + monthlyRate);
        }
        
        const finalBalance = balance;
        const interestEarned = finalBalance - totalContributions;
        
        // Update results
        totalContributionsElement.textContent = formatCurrency(totalContributions);
        interestEarnedElement.textContent = formatCurrency(interestEarned);
        finalBalanceElement.textContent = formatCurrency(finalBalance);
        
        // Update chart
        updateChart(totalContributions, interestEarned);
    }
    
    // Format currency
    function formatCurrency(value) {
        return '£' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    
    // Update chart
    function updateChart(contributions, interest) {
        const total = contributions + interest;
        const contributionsPercentage = (contributions / total) * 100;
        const interestPercentage = (interest / total) * 100;
        
        const contributionsBar = document.querySelector('.chart-bar.contributions');
        const interestBar = document.querySelector('.chart-bar.interest');
        
        if (contributionsBar && interestBar) {
            contributionsBar.style.height = contributionsPercentage + '%';
            interestBar.style.height = interestPercentage + '%';
        }
    }
    
    // Initialize calculator
    calculateSavings();
});