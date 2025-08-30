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

// 模拟存档数据
const saveSlots = [
    { id: 1, name: '存档1', hasData: false, info: '空存档位', date: '--/--/----', level: 0, progress: 0, playtime: '00:00:00' },
    { id: 2, name: '存档2', hasData: false, info: '空存档位', date: '--/--/----', level: 0, progress: 0, playtime: '00:00:00' },
    { id: 3, name: '存档3', hasData: false, info: '空存档位', date: '--/--/----', level: 0, progress: 0, playtime: '00:00:00' },
    { id: 4, name: '存档4', hasData: false, info: '空存档位', date: '--/--/----', level: 0, progress: 0, playtime: '00:00:00' },
    { id: 5, name: '存档5', hasData: false, info: '空存档位', date: '--/--/----', level: 0, progress: 0, playtime: '00:00:00' },
    { id: 6, name: '存档6', hasData: false, info: '空存档位', date: '--/--/----', level: 0, progress: 0, playtime: '00:00:00' }
];

// 加载存档状态
function loadSaveData() {
    const currentUser = localStorage.getItem('currentUser');
    const savedData = localStorage.getItem(`gameSaves_${currentUser}`);

    if (savedData) {
        const saves = JSON.parse(savedData);
        saveSlots.forEach((slot, index) => {
            if (saves[index]) {
                Object.assign(slot, saves[index]);
            }
        });
    }

    updateSaveDisplay();
}

// 更新存档显示
function updateSaveDisplay() {
    saveSlots.forEach(slot => {
        const element = document.getElementById(`save${slot.id}`);
        const infoElement = element.querySelector('.save-info');
        const dateElement = element.querySelector('.save-date');

        if (slot.hasData) {
            element.classList.add('has-data');
            element.classList.remove('empty');
            infoElement.textContent = `等级 ${slot.level} - 进度 ${slot.progress}%`;
            dateElement.textContent = slot.date;
        } else {
            element.classList.add('empty');
            element.classList.remove('has-data');
            infoElement.textContent = '空存档位';
            dateElement.textContent = '--/--/----';
        }
    });
}

// 保存存档数据
function saveSaveData() {
    const currentUser = localStorage.getItem('currentUser');
    localStorage.setItem(`gameSaves_${currentUser}`, JSON.stringify(saveSlots));
}

// 创建新存档
function createSave(slotId) {
    const slot = saveSlots.find(s => s.id === slotId);
    if (slot) {
        slot.hasData = true;
        slot.info = `等级 1 - 进度 0%`;
        slot.date = new Date().toLocaleDateString('zh-CN');
        slot.level = 1;
        slot.progress = 0;
        slot.playtime = '00:00:00';

        saveSaveData();
        updateSaveDisplay();

        showNotification(`已创建 ${slot.name}`);
    }
}

// 读取存档
function loadSave(slotId) {
    const slot = saveSlots.find(s => s.id === slotId);
    if (slot && slot.hasData) {
        showNotification(`正在读取 ${slot.name}...`);

        // 模拟读取时间
        setTimeout(() => {
            alert(`已读取 ${slot.name}\n等级: ${slot.level}\n进度: ${slot.progress}%\n游戏时间: ${slot.playtime}\n保存日期: ${slot.date}`);
            // 这里可以添加实际的游戏状态加载逻辑
        }, 1000);
    } else {
        showNotification(`${slot.name} 为空存档位`);
    }
}

// 删除存档
function deleteSave(slotId) {
    const slot = saveSlots.find(s => s.id === slotId);
    if (slot && slot.hasData) {
        if (confirm(`确定要删除 ${slot.name} 吗？此操作无法撤销。`)) {
            slot.hasData = false;
            slot.info = '空存档位';
            slot.date = '--/--/----';
            slot.level = 0;
            slot.progress = 0;
            slot.playtime = '00:00:00';

            saveSaveData();
            updateSaveDisplay();

            showNotification(`已删除 ${slot.name}`);
        }
    }
}

// 显示通知
function showNotification(message) {
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
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// 存档项点击事件
function handleSaveClick(slotId) {
    const slot = saveSlots.find(s => s.id === slotId);
    if (slot) {
        if (slot.hasData) {
            // 有存档数据，显示选项菜单
            const action = confirm(`${slot.name}\n等级: ${slot.level}\n进度: ${slot.progress}%\n游戏时间: ${slot.playtime}\n保存日期: ${slot.date}\n\n点击"确定"读取存档，点击"取消"删除存档`);
            if (action) {
                loadSave(slotId);
            } else {
                deleteSave(slotId);
            }
        } else {
            // 空存档位，创建新存档
            const create = confirm(`${slot.name} 为空存档位\n\n是否创建新存档？`);
            if (create) {
                createSave(slotId);
            }
        }
    }
}

// 生成随机存档数据（用于测试）
function generateTestSave(slotId) {
    const slot = saveSlots.find(s => s.id === slotId);
    if (slot) {
        slot.hasData = true;
        slot.level = Math.floor(Math.random() * 50) + 1;
        slot.progress = Math.floor(Math.random() * 100);
        slot.date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN');
        slot.playtime = `${Math.floor(Math.random() * 99).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
        slot.info = `等级 ${slot.level} - 进度 ${slot.progress}%`;

        saveSaveData();
        updateSaveDisplay();

        showNotification(`已生成测试存档 ${slot.name}`);
    }
}

// 清空所有存档
function clearAllSaves() {
    if (confirm('确定要清空所有存档吗？此操作无法撤销。')) {
        saveSlots.forEach(slot => {
            slot.hasData = false;
            slot.info = '空存档位';
            slot.date = '--/--/----';
            slot.level = 0;
            slot.progress = 0;
            slot.playtime = '00:00:00';
        });

        saveSaveData();
        updateSaveDisplay();

        showNotification('已清空所有存档');
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
    if (checkLoginStatus()) {
        loadSaveData();

        // 绑定存档项点击事件
        saveSlots.forEach(slot => {
            const element = document.getElementById(`save${slot.id}`);
            element.addEventListener('click', () => {
                handleSaveClick(slot.id);
            });

            // 双击生成测试存档
            element.addEventListener('dblclick', () => {
                if (!slot.hasData) {
                    generateTestSave(slot.id);
                }
            });
        });

        // 添加调试按钮（可选）
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            addDebugButtons();
        }
    }
});

// 添加调试按钮
function addDebugButtons() {
    const debugPanel = document.createElement('div');
    debugPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        display: flex;
        gap: 10px;
        z-index: 1000;
    `;

    const testBtn = document.createElement('button');
    testBtn.textContent = '生成测试存档';
    testBtn.style.cssText = `
        padding: 8px 12px;
        background: rgba(255, 165, 0, 0.8);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
    `;
    testBtn.onclick = () => {
        const emptySlot = saveSlots.find(s => !s.hasData);
        if (emptySlot) {
            generateTestSave(emptySlot.id);
        } else {
            alert('没有空的存档位');
        }
    };

    const clearBtn = document.createElement('button');
    clearBtn.textContent = '清空存档';
    clearBtn.style.cssText = `
        padding: 8px 12px;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
    `;
    clearBtn.onclick = clearAllSaves;

    debugPanel.appendChild(testBtn);
    debugPanel.appendChild(clearBtn);
    document.body.appendChild(debugPanel);
}

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