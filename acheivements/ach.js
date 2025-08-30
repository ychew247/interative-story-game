// 返回游戏页面
function goBack() {
    window.location.href = '../game/game.html';
}

// 检查用户登录状态
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        // 如果没有登录，重定向到登录页面
        window.location.href = '../login/login.html';
        return false;
    }
    
    return true;
}

// 模拟成就数据
const achievements = [
    { id: 1, name: '成就1', description: '完成第一个任务', unlocked: false },
    { id: 2, name: '成就2', description: '收集10个道具', unlocked: false },
    { id: 3, name: '成就3', description: '击败第一个Boss', unlocked: false },
    { id: 4, name: '成就4', description: '探索5个区域', unlocked: false },
    { id: 5, name: '成就5', description: '升级到10级', unlocked: false },
    { id: 6, name: '成就6', description: '完成所有支线任务', unlocked: false },
    { id: 7, name: '成就7', description: '收集所有稀有道具', unlocked: false },
    { id: 8, name: '成就8', description: '通关游戏', unlocked: false },
    { id: 9, name: '成就9', description: '获得完美评分', unlocked: false }
];

// 加载成就状态
function loadAchievements() {
    const savedAchievements = localStorage.getItem('gameAchievements');
    if (savedAchievements) {
        const saved = JSON.parse(savedAchievements);
        achievements.forEach((achievement, index) => {
            if (saved[index]) {
                achievement.unlocked = saved[index].unlocked;
            }
        });
    }
    updateAchievementDisplay();
}

// 更新成就显示
function updateAchievementDisplay() {
    achievements.forEach((achievement, index) => {
        const element = document.getElementById(`achievement${achievement.id}`);
        const statusElement = element.querySelector('.achievement-status');
        
        if (achievement.unlocked) {
            element.classList.add('unlocked');
            statusElement.textContent = '已解锁';
        } else {
            element.classList.remove('unlocked');
            statusElement.textContent = '未解锁';
        }
    });
}

// 保存成就状态
function saveAchievements() {
    localStorage.setItem('gameAchievements', JSON.stringify(achievements));
}

// 解锁成就
function unlockAchievement(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        saveAchievements();
        updateAchievementDisplay();
        
        // 显示解锁通知
        showUnlockNotification(achievement.name);
    }
}

// 显示解锁通知
function showUnlockNotification(achievementName) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(64, 224, 208, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.5s ease;
    `;
    notification.textContent = `🎉 解锁成就: ${achievementName}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 成就项点击事件
function handleAchievementClick(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement) {
        alert(`${achievement.name}\n${achievement.description}\n状态: ${achievement.unlocked ? '已解锁' : '未解锁'}`);
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    if (checkLoginStatus()) {
        loadAchievements();
        
        // 绑定成就项点击事件
        achievements.forEach(achievement => {
            const element = document.getElementById(`achievement${achievement.id}`);
            element.addEventListener('click', () => {
                handleAchievementClick(achievement.id);
            });
        });
        
        // 测试用：点击成就1可以解锁它
        document.getElementById('achievement1').addEventListener('dblclick', () => {
            unlockAchievement(1);
        });
    }
});

// 添加滑入动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);