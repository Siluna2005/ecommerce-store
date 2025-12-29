// Authentication handling for login/register pages

// Login form handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Clear previous errors
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';
        
        // Show loading state
        document.getElementById('loginBtnText').style.display = 'none';
        document.getElementById('loginSpinner').style.display = 'inline-block';
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Save token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Show success message
                showToast('Login successful! Redirecting...', 'success');
                
                // Redirect after short delay
                setTimeout(() => {
                    const redirect = new URLSearchParams(window.location.search).get('redirect');
                    if (redirect) {
                        window.location.href = `/pages/${redirect}.html`;
                    } else if (data.user.role === 'admin') {
                        window.location.href = '/pages/admin/dashboard.html';
                    } else {
                        window.location.href = '/';
                    }
                }, 1000);
            } else {
                showToast(data.message || 'Login failed', 'error');
                if (data.message.includes('email')) {
                    document.getElementById('emailError').textContent = data.message;
                } else {
                    document.getElementById('passwordError').textContent = data.message;
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Login failed. Please try again.', 'error');
        } finally {
            document.getElementById('loginBtnText').style.display = 'inline';
            document.getElementById('loginSpinner').style.display = 'none';
        }
    });
}

// Register form handler
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        // Validate passwords match
        if (password !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
            showToast('Passwords do not match', 'error');
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        // Show loading state
        document.getElementById('registerBtnText').style.display = 'none';
        document.getElementById('registerSpinner').style.display = 'inline-block';
        
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, phone, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showToast('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = '/pages/login.html';
                }, 2000);
            } else {
                showToast(data.message || 'Registration failed', 'error');
                if (data.message.includes('email')) {
                    document.getElementById('emailError').textContent = data.message;
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            showToast('Registration failed. Please try again.', 'error');
        } finally {
            document.getElementById('registerBtnText').style.display = 'inline';
            document.getElementById('registerSpinner').style.display = 'none';
        }
    });
}

// Google login button
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleRegisterBtn = document.getElementById('googleRegisterBtn');

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        showToast('Google OAuth is not configured yet. Please use email login.', 'warning');
        // In production, redirect to Google OAuth
        // window.location.href = `${API_URL}/auth/google`;
    });
}

if (googleRegisterBtn) {
    googleRegisterBtn.addEventListener('click', () => {
        showToast('Google OAuth is not configured yet. Please use email registration.', 'warning');
        // In production, redirect to Google OAuth
        // window.location.href = `${API_URL}/auth/google`;
    });
}

// Check authentication status on page load
function checkAuth() {
    const token = getToken();
    const user = getUser();
    const userMenu = document.getElementById('userMenu');
    const authLinks = document.getElementById('authLinks');
    
    if (token && user) {
        // User is logged in
        if (userMenu) userMenu.style.display = 'block';
        if (authLinks) authLinks.style.display = 'none';
        
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = user.name.split(' ')[0]; // First name only
        }
        
        // Show admin link if user is admin
        const adminLink = document.getElementById('adminLink');
        if (adminLink && user.role === 'admin') {
            adminLink.style.display = 'block';
        }
    } else {
        // User is not logged in
        if (userMenu) userMenu.style.display = 'none';
        if (authLinks) authLinks.style.display = 'flex';
    }
}