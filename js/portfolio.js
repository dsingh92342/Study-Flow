// Portfolio management

function getPortfolio(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);
    return user && user.portfolio ? user.portfolio : [];
}

function savePortfolio(userId, portfolio) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].portfolio = portfolio;
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
}

function addPortfolioItem(item) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;

    const portfolio = getPortfolio(currentUser.id);
    item.id = Date.now().toString();
    item.createdAt = new Date().toISOString();
    portfolio.push(item);
    
    return savePortfolio(currentUser.id, portfolio);
}

function removePortfolioItem(itemId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;

    const portfolio = getPortfolio(currentUser.id);
    const filtered = portfolio.filter(item => item.id !== itemId);
    
    return savePortfolio(currentUser.id, filtered);
}

function loadPortfolio() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const portfolio = getPortfolio(currentUser.id);
    const container = document.getElementById('portfolioContainer');
    const noPortfolio = document.getElementById('noPortfolio');

    if (portfolio.length === 0) {
        container.style.display = 'none';
        noPortfolio.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    noPortfolio.style.display = 'none';

    container.innerHTML = portfolio.map(item => `
        <div class="portfolio-item">
            <div class="portfolio-image">
                <i class="fas fa-file-alt"></i>
            </div>
            <div class="portfolio-content">
                <h4>${item.title}</h4>
                <p><strong>Subject:</strong> ${item.subject}</p>
                <p>${item.description}</p>
                ${item.link ? `<p><a href="${item.link}" target="_blank" style="color: var(--primary-color);"><i class="fas fa-external-link-alt"></i> View Work</a></p>` : ''}
                <div class="portfolio-actions">
                    <button class="btn-danger btn-small" onclick="deletePortfolioItem('${item.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function deletePortfolioItem(itemId) {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
        if (removePortfolioItem(itemId)) {
            loadPortfolio();
        }
    }
}

