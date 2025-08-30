let isSignupMode = false; // 默认是登录模式

const authForm = document.getElementById('authForm');
const authBtn = document.getElementById('authBtn');
const switchLink = document.getElementById('switchLink');
const switchText = document.getElementById('switchText');
const loginTitle = document.querySelector('.login-title');
const loginSubtitle = document.querySelector('.login-subtitle');
const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');

authForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // 基本验证
  if (!username) {
    showError('请输入用户名');
    return;
  }

  if (password.length < 6) {
    showError('密码至少需要6位');
    return;
  }

  if (isSignupMode) {
    // 注册模式：检查密码是否一致
    if (password !== confirmPassword) {
      showError("密码不匹配");
      return;
    }

    // 检查用户名是否已存在
    if (isUserExists(username)) {
      showError("用户名已存在，请选择其他用户名");
      return;
    }

    // 保存用户信息到本地存储
    saveUser(username, password);
    showSuccess("账户创建成功！正在进入游戏");

    // 禁用表单防止重复提交
    authBtn.disabled = true;
    authBtn.classList.add('loading');

    // 模拟加载时间，然后跳转到游戏主页
    setTimeout(() => {
      console.log('Attempting to redirect to game page after registration...');
      const gameUrl = '../game/game.html';
      console.log('Redirect URL:', gameUrl);
      window.location.href = gameUrl;
    }, 2000);
  } else {
    // 登录模式：验证本地存储的用户信息
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Password length:', password.length);
    console.log('isSignupMode:', isSignupMode);
    
    if (validateUser(username, password)) {
      showSuccess("登入成功，正在进入游戏");
      // 禁用表单防止重复提交
      authBtn.disabled = true;
      authBtn.classList.add('loading');

      // 模拟加载时间，然后跳转到游戏主页
      setTimeout(() => {
        console.log('Attempting to redirect to game page...');
        const gameUrl = '../game/game.html';
        console.log('Redirect URL:', gameUrl);
        window.location.href = gameUrl;
      }, 2000);
    } else {
      showError("用户名或密码错误");
      console.log('Login failed for:', username); // Debug log
    }
  }
});

// 切换登录/注册模式
switchLink.addEventListener('click', function (e) {
  e.preventDefault();
  isSignupMode = !isSignupMode;

  if (isSignupMode) {
    loginTitle.textContent = "熵变协议";
    loginSubtitle.textContent = "创建您的账户开始游戏";
    authBtn.textContent = "创建账户";
    switchText.textContent = "已经有账户了？";
    switchLink.textContent = "在这里登录";
    confirmPasswordGroup.style.display = "block";
  } else {
    loginTitle.textContent = "欢迎回来";
    loginSubtitle.textContent = "登录您的账户继续游戏";
    authBtn.textContent = "登录";
    switchText.textContent = "还没有账户？";
    switchLink.textContent = "在这里注册";
    confirmPasswordGroup.style.display = "none";
  }

  // 重置按钮状态
  authBtn.disabled = false;
  authBtn.classList.remove('loading');
  authForm.reset();
  clearMessages();
});

// 显示错误信息
function showError(message) {
  clearMessages();
  const errorDiv = document.createElement('div');
  errorDiv.className = 'message error-message';
  errorDiv.textContent = message;
  authForm.appendChild(errorDiv);
}

// 显示成功信息
function showSuccess(message) {
  clearMessages();
  const successDiv = document.createElement('div');
  successDiv.className = 'message success-message';
  successDiv.textContent = message;
  authForm.appendChild(successDiv);
}

// 清除消息
function clearMessages() {
  const messages = document.querySelectorAll('.message');
  messages.forEach(msg => msg.remove());
}

// 本地存储用户管理功能
function saveUser(username, password) {
  // 获取现有用户列表
  let users = JSON.parse(localStorage.getItem('gameUsers') || '[]');

  // 添加新用户
  users.push({
    username: username,
    password: password,
    createdAt: new Date().toISOString()
  });

  // 保存到本地存储
  localStorage.setItem('gameUsers', JSON.stringify(users));

  // 设置当前登录用户
  localStorage.setItem('currentUser', username);
}

function isUserExists(username) {
  const users = JSON.parse(localStorage.getItem('gameUsers') || '[]');
  return users.some(user => user.username === username);
}

function validateUser(username, password) {
  const users = JSON.parse(localStorage.getItem('gameUsers') || '[]');
  console.log('All users in storage:', users); // Debug log
  console.log('Trying to login with:', username, password); // Debug log

  const user = users.find(user => user.username === username && user.password === password);
  console.log('Found user:', user); // Debug log

  if (user) {
    // 设置当前登录用户
    localStorage.setItem('currentUser', username);
    console.log('Login successful, currentUser set to:', username); // Debug log
    return true;
  }

  // 保留默认管理员账户用于测试
  if (username === "admin" && password === "123456") {
    localStorage.setItem('currentUser', username);
    console.log('Admin login successful'); // Debug log
    return true;
  }

  console.log('Login failed'); // Debug log
  return false;
}

// 获取当前登录用户
function getCurrentUser() {
  return localStorage.getItem('currentUser');
}

// 登出功能
function logout() {
  localStorage.removeItem('currentUser');
  showLoginPanel();
}

// 显示游戏内容
function showGameContent() {
  const loginPanel = document.getElementById('loginPanel');
  const gameContent = document.getElementById('gameContent');

  if (loginPanel && gameContent) {
    loginPanel.style.display = 'none';
    gameContent.style.display = 'flex';

    // 显示当前用户信息
    const currentUser = getCurrentUser();
    if (currentUser) {
      // 可以在这里添加显示用户名的逻辑
      console.log(`欢迎，${currentUser}！`);
    }
  }
}

// 显示登录面板
function showLoginPanel() {
  const loginPanel = document.getElementById('loginPanel');
  const gameContent = document.getElementById('gameContent');

  if (loginPanel && gameContent) {
    loginPanel.style.display = 'flex';
    gameContent.style.display = 'none';

    // 重置表单状态
    authBtn.disabled = false;
    authBtn.classList.remove('loading');
    authForm.reset();
    clearMessages();
  }
}
