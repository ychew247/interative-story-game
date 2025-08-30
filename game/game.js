// 检查用户登录状态
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        // 如果没有登录，重定向到登录页面
        window.location.href = '../login/login.html';
        return false;
    }

    // 显示用户信息
    document.getElementById('currentUserName').textContent = currentUser;
    return true;
}

// 登出功能
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../login/login.html';
}

// 菜单项点击处理
function handleMenuClick(menuId) {
    switch (menuId) {
        case 'newGame':
            alert('新游戏开发中');
            break;
        case 'achievements':
            window.location.href = '../acheivements/ach.html';
            break;
        case 'loadGame':
            window.location.href = '../save/save.html';
            break;
        case 'aboutUs':
            alert('新游戏开发中');
            break;
    }
}



// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
    if (checkLoginStatus()) {
        // 绑定登出按钮事件
        document.getElementById('logoutBtn').addEventListener('click', logout);

        // 绑定菜单项点击事件
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                handleMenuClick(item.id);
            });
        });
    }
});
