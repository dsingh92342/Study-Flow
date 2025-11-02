// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkAuthStatus();
    
    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Handle signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

function checkAuthStatus() {
    const currentUser = getCurrentUser();
    const path = window.location.pathname;
    if (currentUser && (path.includes('login.html') || path.includes('signup.html'))) {
        // Redirect to dashboard if already logged in
        window.location.href = currentUser.userType === 'provider' 
            ? 'dashboard-provider.html' 
            : 'dashboard-student.html';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Set current user
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType
        }));
        
        // Show success message
        showAlert('Login successful! Redirecting...', 'success');
        
        // Redirect to appropriate dashboard
        setTimeout(() => {
            window.location.href = user.userType === 'provider' 
                ? 'dashboard-provider.html' 
                : 'dashboard-student.html';
        }, 1000);
    } else {
        showAlert('Invalid email or password. Please try again.', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showAlert('Email already registered. Please login instead.', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        userType: userType,
        rating: userType === 'provider' ? 0 : null,
        totalJobs: 0,
        completedJobs: 0,
        portfolio: [],
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set current user
    localStorage.setItem('currentUser', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType
    }));
    
    // Show success message
    showAlert('Account created successfully! Redirecting...', 'success');
    
    // Redirect to appropriate dashboard
    setTimeout(() => {
        window.location.href = userType === 'provider' 
            ? 'dashboard-provider.html' 
            : 'dashboard-student.html';
    }, 1000);
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    alert.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    // Insert alert
    const form = document.querySelector('form') || document.body;
    if (form) {
        form.insertBefore(alert, form.firstChild);
    } else {
        document.body.insertBefore(alert, document.body.firstChild);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getCurrentUser, logout };
}

