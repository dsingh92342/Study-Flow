// Job management functionality

function getJobs() {
    return JSON.parse(localStorage.getItem('jobs') || '[]');
}

function saveJobs(jobs) {
    localStorage.setItem('jobs', JSON.stringify(jobs));
}

function postJob(jobData) {
    try {
        const jobs = getJobs();
        jobData.id = Date.now().toString();
        jobs.push(jobData);
        saveJobs(jobs);
        return true;
    } catch (error) {
        console.error('Error posting job:', error);
        return false;
    }
}

function acceptJob(jobId, providerId) {
    try {
        const jobs = getJobs();
        const jobIndex = jobs.findIndex(j => j.id === jobId);
        
        if (jobIndex === -1 || jobs[jobIndex].status !== 'pending') {
            return false;
        }

        jobs[jobIndex].status = 'active';
        jobs[jobIndex].acceptedBy = providerId;
        jobs[jobIndex].acceptedAt = new Date().toISOString();

        // Get provider info
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const provider = users.find(u => u.id === providerId);
        if (provider) {
            jobs[jobIndex].acceptedByName = provider.name;
        }

        saveJobs(jobs);
        return true;
    } catch (error) {
        console.error('Error accepting job:', error);
        return false;
    }
}

function completeJob(jobId, rating = null) {
    try {
        const jobs = getJobs();
        const jobIndex = jobs.findIndex(j => j.id === jobId);
        
        if (jobIndex === -1) {
            return false;
        }

        const job = jobs[jobIndex];
        job.status = 'completed';
        job.completedAt = new Date().toISOString();

        // Update provider earnings and rating
        if (job.acceptedBy) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const providerIndex = users.findIndex(u => u.id === job.acceptedBy);
            
            if (providerIndex !== -1) {
                const provider = users[providerIndex];
                const earnings = job.budget * 0.8; // 80% to provider
                
                // Update earnings
                if (!provider.totalEarnings) provider.totalEarnings = 0;
                provider.totalEarnings += earnings;
                
                // Update job counts
                provider.completedJobs = (provider.completedJobs || 0) + 1;
                
                // Update rating if provided
                if (rating) {
                    if (!provider.ratings) provider.ratings = [];
                    provider.ratings.push(parseFloat(rating));
                    
                    // Calculate average rating
                    const sum = provider.ratings.reduce((a, b) => a + b, 0);
                    provider.rating = (sum / provider.ratings.length).toFixed(1);
                }
                
                localStorage.setItem('users', JSON.stringify(users));
            }
        }

        saveJobs(jobs);
        return true;
    } catch (error) {
        console.error('Error completing job:', error);
        return false;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

