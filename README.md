# Study Flow Platform

A student-to-student assignment platform where students can hire other students to complete assignments, and providers earn money for their services.

## Features

### For Students (Requesters)
- Post assignment requests with details, budget, and deadlines
- View accepted assignments and provider profiles
- Rate providers after completion
- Track spending and assignment status

### For Providers
- Browse and accept available assignments
- Manage portfolio to showcase skills
- Submit completed work
- Earn 80% of assignment budget (platform keeps 20% fee)
- Build rating and reputation

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. Click "Sign Up" to create an account
3. Choose your role: "Hire Students" or "Provide Services"

### As a Student
1. Post a new assignment from your dashboard
2. Wait for a provider to accept your assignment
3. Review the provider's profile and portfolio
4. Once work is submitted, mark it as complete and rate the provider
5. Payment is automatically processed (provider gets 80%)

### As a Provider
1. Browse available jobs and filter by subject/budget
2. Accept jobs that match your skills
3. Complete and submit the work
4. Get paid once the student marks it complete
5. Build your portfolio and ratings to attract more clients

## File Structure

```
Study_Flow/
├── index.html              # Landing page
├── login.html              # Login page
├── signup.html             # Registration page
├── dashboard-student.html  # Student dashboard
├── dashboard-provider.html # Provider dashboard
├── post-job.html           # Post new assignment
├── browse-jobs.html        # Browse available jobs
├── portfolio.html          # Manage portfolio
├── profile.html            # View your profile
├── view-provider.html      # View provider profile
├── styles/
│   └── main.css            # Main stylesheet
└── js/
    ├── auth.js             # Authentication
    ├── jobs.js              # Job management
    ├── dashboard.js         # Dashboard functionality
    ├── portfolio.js         # Portfolio management
    └── main.js              # Main page scripts
```

## Technologies Used
- HTML5
- CSS3 (Custom styling with modern design)
- JavaScript (Vanilla JS, localStorage for data)
- Font Awesome (Icons)

## Notes
- All data is stored in browser localStorage (for demo purposes)
- In a production environment, you would need a backend server and database
- Payment processing is simulated - integrate with a real payment gateway for production

## Getting Started Locally

Simply open `index.html` in any modern web browser. No server setup required!

