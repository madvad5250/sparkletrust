document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu functionality
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // FAQ accordion functionality
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });

  // Savings calculator functionality
  const calculateBtn = document.getElementById('calculateBtn');
  const initialDepositInput = document.getElementById('initialDeposit');
  const monthlyDepositInput = document.getElementById('monthlyDeposit');
  const savingPeriodInput = document.getElementById('savingPeriod');
  const interestRateInput = document.getElementById('interestRate');
  
  const totalDepositsElement = document.getElementById('totalDeposits');
  const interestEarnedElement = document.getElementById('interestEarned');
  const finalBalanceElement = document.getElementById('finalBalance');
  
  let savingsChart = null;
  
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateSavings);
    
    // Calculate on page load with default values
    calculateSavings();
  }
  
  function calculateSavings() {
    const initialDeposit = parseFloat(initialDepositInput.value) || 0;
    const monthlyDeposit = parseFloat(monthlyDepositInput.value) || 0;
    const savingPeriod = parseInt(savingPeriodInput.value) || 0;
    const interestRate = parseFloat(interestRateInput.value) || 0;
    
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    
    let balance = initialDeposit;
    let totalDeposits = initialDeposit;
    const monthlyData = [initialDeposit];
    
    // Calculate month by month
    for (let month = 1; month <= savingPeriod; month++) {
      // Add monthly deposit
      balance += monthlyDeposit;
      totalDeposits += monthlyDeposit;
      
      // Add interest
      const monthlyInterest = balance * monthlyRate;
      balance += monthlyInterest;
      
      monthlyData.push(balance);
    }
    
    const interestEarned = balance - totalDeposits;
    
    // Update results
    totalDepositsElement.textContent = `$${totalDeposits.toFixed(2)}`;
    interestEarnedElement.textContent = `$${interestEarned.toFixed(2)}`;
    finalBalanceElement.textContent = `$${balance.toFixed(2)}`;
    
    // Update chart
    updateChart(monthlyData);
  }
  
  function updateChart(monthlyData) {
    const ctx = document.getElementById('savingsChart');
    
    if (!ctx) return;
    
    // Destroy previous chart if it exists
    if (savingsChart) {
      savingsChart.destroy();
    }
    
    // Create labels for each month
    const labels = Array.from({ length: monthlyData.length }, (_, i) => {
      if (i === 0) return 'Start';
      return `Month ${i}`;
    });
    
    // Create chart
    savingsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Balance',
          data: monthlyData,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(255, 255, 255, 1)',
          pointRadius: 3,
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
              callback: function(value) {
                return '$' + value;
              }
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
              maxRotation: 45,
              minRotation: 45
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Balance: $${context.raw.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  }
});