document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    if (!isAuthenticated()) {
        window.location.href = '/pages/login.html';
        return;
    }
    loadProfile();
    setupTabs();
});

function setupTabs() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.getAttribute('href') === '#') {
                e.preventDefault();
                const tab = e.target.dataset.tab;
                if (tab) {
                    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    document.getElementById(`${tab}-tab`).classList.add('active');
                }
            }
        });
    });
}

async function loadProfile() {
    const response = await apiCall('/auth/profile');
    if (response.success) {
        const user = response.user;
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone || '';
    }
}

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    const response = await apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    });

    if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));
        showToast('Profile updated successfully!', 'success');
    } else {
        showToast(response.message, 'error');
    }
});

document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    const data = {
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: newPassword
    };

    const response = await apiCall('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(data)
    });

    if (response.success) {
        showToast('Password changed successfully!', 'success');
        document.getElementById('passwordForm').reset();
    } else {
        showToast(response.message, 'error');
    }
});