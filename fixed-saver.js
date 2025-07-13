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

  // Fixed Saver calculator functionality
  const calculateBtn = document.getElementById('calculateBtn');
  const depositAmountInput = document.getElementById('depositAmount');
  const savingTermSelect = document.getElementById('savingTerm');
  
  const initialDepositElement = document.getElementById('initialDeposit');
  const interestRateElement = document.getElementById('interestRate');
  const interestEarnedElement = document.getElementById('interestEarned');
  const finalBalanceElement = document.getElementById('finalBalance');
  const maturityDateElement = document.getElementById('maturityDate');
  
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateFixedSaver);
    
    // Calculate on page load with default values
    calculateFixedSaver();
  }
  
  function calculateFixedSaver() {
    const depositAmount = parseFloat(depositAmountInput.value) || 0;
    const termYears = parseInt(savingTermSelect.value) || 0;
    
    // Get interest rate based on term
    let interestRate;
    switch(termYears) {
      case 1:
        interestRate = 4.85;
        break;
      case 2:
        interestRate = 5.00;
        break;
      case 3:
        interestRate = 5.10;
        break;
      default:
        interestRate = 5.00;
    }
    
    // Calculate interest (compound annually)
    const finalBalance = depositAmount * Math.pow(1 + (interestRate / 100), termYears);
    const interestEarned = finalBalance - depositAmount;
    
    // Calculate maturity date
    const today = new Date();
    const maturityDate = new Date(today);
    maturityDate.setFullYear(today.getFullYear() + termYears);
    
    // Format maturity date
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedMaturityDate = maturityDate.toLocaleDateString('en-US', options);
    
    // Update results
    initialDepositElement.textContent = `£${depositAmount.toFixed(2)}`;
    interestRateElement.textContent = `${interestRate.toFixed(2)}% AER/Gross`;
    interestEarnedElement.textContent = `£${interestEarned.toFixed(2)}`;
    finalBalanceElement.textContent = `£${finalBalance.toFixed(2)}`;
    maturityDateElement.textContent = formattedMaturityDate;
  }
  
  // Update interest rate when term changes
  if (savingTermSelect) {
    savingTermSelect.addEventListener('change', function() {
      const termYears = parseInt(this.value) || 0;
      let interestRate;
      
      switch(termYears) {
        case 1:
          interestRate = 4.85;
          break;
        case 2:
          interestRate = 5.00;
          break;
        case 3:
          interestRate = 5.10;
          break;
        default:
          interestRate = 5.00;
      }
      
      // Update the interest rate display
      if (interestRateElement) {
        interestRateElement.textContent = `${interestRate.toFixed(2)}% AER/Gross`;
      }
      
      // Recalculate
      calculateFixedSaver();
    });
  }
});