// 密码显示/隐藏切换
        const toggleRegPassword = document.getElementById('toggleRegPassword');
        const regPassword = document.getElementById('regPassword');
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        const captchaImage = document.querySelector('.captcha img');
        
        function setupPasswordToggle(toggle, input) {
            toggle.addEventListener('click', function() {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
                
                // 添加点击反馈
                this.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            });
        }
        
        setupPasswordToggle(toggleRegPassword, regPassword);
        setupPasswordToggle(toggleConfirmPassword, confirmPassword);
        
        
        // 注册表单提交
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('regUsername').value;
            const password = document.getElementById('regPassword').value;
            const confirmPass = document.getElementById('confirmPassword').value;
            const confirmError = document.querySelector('#confirmPassword + .error-message');
            
            // 密码长度验证
            if (password.length < 6) {
                document.querySelector('#regPassword + .error-message').style.display = 'block';
                return;
            }
            
            // 密码一致性验证
            if (password !== confirmPass) {
                confirmError.style.display = 'block';
                return;
            } else {
                confirmError.style.display = 'none';
            }
            
            // 存储用户信息
            const registerTime = new Date().toLocaleString();
            localStorage.setItem('user', JSON.stringify({
                username: username,
                registerTime: registerTime,
                isAdmin: false,
                signature: '这家伙很懒，什么都没留下',
                avatar: 'images/default-avatar.png',
                articles: [],
                collections: []
            }));
            
            // 注册成功动画反馈
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> 注册成功';
            submitBtn.style.background = '#4ade80';
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
        
        // 实时验证密码一致性
        confirmPassword.addEventListener('input', function() {
            const password = regPassword.value;
            const confirmError = this.nextElementSibling;
            
            if (this.value !== password && this.value !== '') {
                confirmError.style.display = 'block';
            } else {
                confirmError.style.display = 'none';
            }
        });
        
        // 密码长度验证
        regPassword.addEventListener('input', function() {
            const errorEl = this.nextElementSibling.nextElementSibling;
            if (this.value.length < 6 && this.value !== '') {
                errorEl.style.display = 'block';
            } else {
                errorEl.style.display = 'none';
            }
        });

// 验证reCAPTCHA是否完成
if(grecaptcha.getResponse() === "") {
    document.getElementById('captchaError').style.display = 'block';
    return false;
}