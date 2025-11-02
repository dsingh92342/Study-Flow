// Dashboard functionality
function checkAuth(requiredType = null) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (requiredType && currentUser.userType !== requiredType) {
        // Redirect to appropriate dashboard
        window.location.href = currentUser.userType === 'provider' 
            ? 'dashboard-provider.html' 
            : 'dashboard-student.html';
        return false;
    }
    
    return true;
}

function loadStudentDashboard() {
    const currentUser = getCurrentUser();
    const jobs = getJobs();
    
    // Filter jobs for current student
    const myJobs = jobs.filter(job => job.postedBy === currentUser.id);
    
    // Calculate stats
    const totalJobs = myJobs.length;
    const pendingJobs = myJobs.filter(j => j.status === 'pending').length;
    const completedJobs = myJobs.filter(j => j.status === 'completed').length;
    const totalSpent = myJobs
        .filter(j => j.status === 'completed' || j.status === 'active')
        .reduce((sum, j) => sum + j.budget, 0);
    
    // Update stats
    document.getElementById('totalJobs').textContent = totalJobs;
    document.getElementById('pendingJobs').textContent = pendingJobs;
    document.getElementById('completedJobs').textContent = completedJobs;
    document.getElementById('totalSpent').textContent = '$' + totalSpent.toFixed(2);
    
    // Display jobs
    const container = document.getElementById('jobsContainer');
    const noJobs = document.getElementById('noJobs');
    
    if (myJobs.length === 0) {
        container.style.display = 'none';
        noJobs.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    noJobs.style.display = 'none';
    
    // Sort by date (newest first)
    myJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    container.innerHTML = myJobs.map(job => {
        const badgeClass = job.status === 'pending' ? 'badge-pending' : 
                          job.status === 'active' ? 'badge-active' : 'badge-completed';
        
        let statusInfo = '';
        if (job.status === 'active' && job.acceptedByName) {
            statusInfo = `<p style="color: var(--success-color); margin-top: 10px;">
                <i class="fas fa-user-check"></i> Accepted by ${job.acceptedByName}
                <a href="view-provider.html?id=${job.acceptedBy}" style="margin-left: 10px; color: var(--primary-color); text-decoration: none;">
                    <i class="fas fa-eye"></i> View Profile
                </a>
            </p>`;
        }
        
        return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${job.title}</h3>
                        <span class="card-badge ${badgeClass}">${job.status}</span>
                    </div>
                </div>
                <div class="card-description">${job.description}</div>
                <div class="card-meta">
                    <span><i class="fas fa-book"></i> ${job.subject}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(job.deadline)}</span>
                </div>
                ${statusInfo}
                <div class="card-footer">
                    <div class="card-price">$${job.budget.toFixed(2)}</div>
                    <div class="card-actions">
                        ${job.status === 'active' ? `
                            <button class="btn-success btn-small" onclick="markComplete('${job.id}')">
                                <i class="fas fa-check"></i> Mark Complete
                            </button>
                        ` : ''}
                        ${job.status === 'completed' ? `
                            <span style="color: var(--success-color);">
                                <i class="fas fa-check-circle"></i> Completed
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function loadProviderDashboard() {
    const currentUser = getCurrentUser();
    const jobs = getJobs();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === currentUser.id);
    
    // Filter jobs for current provider
    const myJobs = jobs.filter(job => job.acceptedBy === currentUser.id);
    
    // Calculate stats
    const activeJobs = myJobs.filter(j => j.status === 'active').length;
    const completedJobs = myJobs.filter(j => j.status === 'completed').length;
    const averageRating = user && user.rating ? parseFloat(user.rating) : 0;
    const totalEarnings = user && user.totalEarnings ? user.totalEarnings : 0;
    
    // Update stats
    document.getElementById('activeJobs').textContent = activeJobs;
    document.getElementById('completedJobs').textContent = completedJobs;
    document.getElementById('averageRating').textContent = averageRating.toFixed(1);
    document.getElementById('totalEarnings').textContent = '$' + totalEarnings.toFixed(2);
    
    // Display active jobs
    const activeJobsList = myJobs.filter(j => j.status === 'active');
    const container = document.getElementById('jobsContainer');
    const noJobs = document.getElementById('noJobs');
    
    if (activeJobsList.length === 0) {
        container.style.display = 'none';
        noJobs.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    noJobs.style.display = 'none';
    
    container.innerHTML = activeJobsList.map(job => {
        const providerEarnings = (job.budget * 0.8).toFixed(2);
        
        return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${job.title}</h3>
                        <span class="card-badge badge-active">Active</span>
                    </div>
                </div>
                <div class="card-description">${job.description}</div>
                <div class="card-meta">
                    <span><i class="fas fa-book"></i> ${job.subject}</span>
                    <span><i class="fas fa-user"></i> ${job.postedByName}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(job.deadline)}</span>
                </div>
                <div class="card-footer">
                    <div>
                        <div class="card-price">$${providerEarnings}</div>
                        <small style="color: var(--gray);">(You earn 80% of $${job.budget.toFixed(2)})</small>
                    </div>
                    <button class="btn-success btn-small" onclick="submitWork('${job.id}')">
                        <i class="fas fa-upload"></i> Submit Work
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function markComplete(jobId) {
    const rating = prompt('Please rate the provider (1-5):');
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
        alert('Please enter a valid rating between 1 and 5.');
        return;
    }
    
    if (completeJob(jobId, rating)) {
        alert('Job marked as completed! Payment has been processed.');
        loadStudentDashboard();
    } else {
        alert('Error completing job. Please try again.');
    }
}

function submitWork(jobId) {
    const confirmation = confirm('Are you ready to submit this work? The student will review and mark it as complete.');
    if (!confirmation) return;
    
    alert('Work submitted! Waiting for student approval...');
    // In a real app, this would trigger a notification to the student
}

