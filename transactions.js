document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Account tab selection
    const accountTabs = document.querySelectorAll('.account-tab');
    
    accountTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            accountTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get account type from data attribute
            const accountType = this.getAttribute('data-account');
            
            // Filter transactions based on account type
            filterTransactionsByAccount(accountType);
        });
    });

    // Transaction filtering
    const searchInput = document.getElementById('searchTransactions');
    const dateFilter = document.getElementById('dateFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const amountFilter = document.getElementById('amountFilter');
    const typeFilter = document.getElementById('typeFilter');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const transactionCountElement = document.getElementById('transactionCount');
    
    // Apply filters button
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFilters();
        });
    }
    
    // Reset filters button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            resetFilters();
        });
    }
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Apply filters as user types (with debounce)
            clearTimeout(searchInput.timeout);
            searchInput.timeout = setTimeout(function() {
                applyFilters();
            }, 300);
        });
    }
    
    // Export dropdown functionality
    const exportLinks = document.querySelectorAll('.export-dropdown-content a');
    
    exportLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const format = this.getAttribute('data-format');
            exportTransactions(format);
        });
    });
    
    // Make transaction items link to transaction details page
    const transactionItems = document.querySelectorAll('.transaction-item');
    
    transactionItems.forEach(item => {
        item.addEventListener('click', function() {
            const transactionId = this.getAttribute('data-id');
            window.location.href = `transaction-details.html?id=${transactionId}`;
        });
    });
    
    // Load more transactions button
    const loadMoreBtn = document.getElementById('loadMoreTransactions');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreTransactions();
        });
    }
    
    // Filter transactions by account
    function filterTransactionsByAccount(accountType) {
        // In a real app, this would fetch transactions for the selected account
        // For this demo, we'll just show a message
        console.log(`Filtering transactions for account: ${accountType}`);
        
        // Update transaction count
        let visibleCount = 0;
        
        if (accountType === 'all') {
            // Show all transactions
            document.querySelectorAll('.transaction-item').forEach(item => {
                item.style.display = 'flex';
                visibleCount++;
            });
        } else {
            // In a real app, this would filter based on account
            // For this demo, we'll just hide some random transactions
            document.querySelectorAll('.transaction-item').forEach((item, index) => {
                if (index % 2 === 0) {
                    item.style.display = 'flex';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
        }
        
        // Update transaction count
        if (transactionCountElement) {
            transactionCountElement.textContent = visibleCount;
        }
        
        // Show/hide date groups that have no visible transactions
        updateDateGroups();
    }
    
    // Apply all filters
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const dateValue = dateFilter.value;
        const categoryValue = categoryFilter.value;
        const amountValue = amountFilter.value;
        const typeValue = typeFilter.value;
        
        let visibleCount = 0;
        
        // Filter transactions
        document.querySelectorAll('.transaction-item').forEach(item => {
            const title = item.querySelector('.transaction-title').textContent.toLowerCase();
            const category = item.getAttribute('data-category');
            const amount = parseFloat(item.getAttribute('data-amount'));
            const type = item.getAttribute('data-type');
            
            // Check if transaction matches all filters
            const matchesSearch = searchTerm === '' || title.includes(searchTerm);
            const matchesCategory = categoryValue === 'all' || category === categoryValue;
            const matchesType = typeValue === 'all' || type === typeValue;
            
            // Check amount range
            let matchesAmount = true;
            if (amountValue === 'under10') {
                matchesAmount = amount < 10;
            } else if (amountValue === '10to50') {
                matchesAmount = amount >= 10 && amount <= 50;
            } else if (amountValue === '50to100') {
                matchesAmount = amount > 50 && amount <= 100;
            } else if (amountValue === 'over100') {
                matchesAmount = amount > 100;
            }
            
            // Date filtering would be more complex in a real app
            // For this demo, we'll assume all transactions match the date filter
            const matchesDate = true;
            
            // Show/hide transaction based on filter matches
            if (matchesSearch && matchesCategory && matchesAmount && matchesType && matchesDate) {
                item.style.display = 'flex';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update transaction count
        if (transactionCountElement) {
            transactionCountElement.textContent = visibleCount;
        }
        
        // Show/hide date groups that have no visible transactions
        updateDateGroups();
    }
    
    // Reset all filters
    function resetFilters() {
        if (searchInput) searchInput.value = '';
        if (dateFilter) dateFilter.value = 'week';
        if (categoryFilter) categoryFilter.value = 'all';
        if (amountFilter) amountFilter.value = 'all';
        if (typeFilter) typeFilter.value = 'all';
        
        // Show all transactions
        document.querySelectorAll('.transaction-item').forEach(item => {
            item.style.display = 'flex';
        });
        
        // Update transaction count
        if (transactionCountElement) {
            transactionCountElement.textContent = document.querySelectorAll('.transaction-item').length;
        }
        
        // Show all date groups
        document.querySelectorAll('.transaction-date-group').forEach(group => {
            group.style.display = 'block';
        });
    }
    
    // Update visibility of date groups
    function updateDateGroups() {
        document.querySelectorAll('.transaction-date-group').forEach(group => {
            const visibleTransactions = group.querySelectorAll('.transaction-item[style="display: flex;"]');
            
            if (visibleTransactions.length === 0) {
                group.style.display = 'none';
            } else {
                group.style.display = 'block';
            }
        });
    }
    
    // Export transactions
    function exportTransactions(format) {
        // In a real app, this would generate and download a file
        // For this demo, we'll just show a message
        alert(`Exporting transactions as ${format.toUpperCase()}`);
    }
    
    // Load more transactions
    function loadMoreTransactions() {
        // In a real app, this would fetch more transactions from the server
        // For this demo, we'll just show a message
        alert('Loading more transactions...');
        
        // Disable the button to indicate loading
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Loading...';
        
        // Simulate loading delay
        setTimeout(function() {
            // Re-enable the button
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = 'Load More';
            
            // Show a message
            alert('No more transactions to load');
        }, 1500);
    }
});