 // 密码显示/隐藏切换
        const togglePassword = document.getElementById('togglePassword');
        const password = document.getElementById('password');
        
        togglePassword.addEventListener('click', function() {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
        
        // 登录表单提交
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // 这里添加登录验证逻辑
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // 简单验证示例
            if (username && password) {
                // 存储登录状态
                localStorage.setItem('user', JSON.stringify({
                    username: username,
                    isAdmin: false // 默认不是管理员
                }));
                window.location.href = 'home.html';
            }
        });

        document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 基本验证
    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }
    
    // 从localStorage获取注册用户
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const user = registeredUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        // 登录成功，保存用户信息
        localStorage.setItem('user', JSON.stringify(user));
        alert('登录成功');
        window.location.href = 'home.html';
    } else {
        alert('用户名或密码错误');
    }
});