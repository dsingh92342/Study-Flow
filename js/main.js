// Main JavaScript for index page

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Check if user is logged in and update nav
    const currentUser = getCurrentUser();
    if (currentUser) {
        updateNavForLoggedIn(currentUser);
    }
});

function updateNavForLoggedIn(user) {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Remove login/signup links
    const loginLink = navLinks.querySelector('a[href="login.html"]');
    const signupLink = navLinks.querySelector('a[href="signup.html"]');
    if (loginLink) loginLink.remove();
    if (signupLink) signupLink.remove();

    // Add dashboard link
    const dashboardLink = document.createElement('a');
    dashboardLink.href = user.userType === 'provider' 
        ? 'dashboard-provider.html' 
        : 'dashboard-student.html';
    dashboardLink.textContent = 'Dashboard';
    navLinks.insertBefore(dashboardLink, navLinks.firstChild);

    // Add logout link
    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.textContent = 'Logout';
    logoutLink.onclick = function(e) {
        e.preventDefault();
        logout();
    };
    navLinks.appendChild(logoutLink);
}

// Helper function to get current user (defined in auth.js)
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Helper function to logout (defined in auth.js)
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

