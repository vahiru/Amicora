// 页面加载时初始化个人资料
        document.addEventListener('DOMContentLoaded', function() {
            // 检查用户登录状态
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                window.location.href = 'login.html';
                return;
            }
            
            // 填充用户信息
            initUserProfile(user);
            
            // 加载文章
            loadUserArticles(user);
            
            // 初始化事件监听
            initEventListeners(user);
        });
        
        // 初始化用户资料显示
        function initUserProfile(user) {
            // 基本信息
            document.getElementById('username').textContent = user.username || '用户名';
            document.getElementById('bio').textContent = user.profile?.bio || '请编辑个人简介';
            document.getElementById('website').href = user.profile?.website || '#';
            document.getElementById('website').innerHTML = `<i class="fa fa-link mr-1"></i> ${user.profile?.website || '个人网站'}`;
            document.getElementById('registerDate').textContent = user.registerDate || new Date().toLocaleDateString();
            document.getElementById('registerTime').textContent = user.registerDate || new Date().toLocaleDateString();
            document.getElementById('articleCountDisplay').textContent = `${user.articles?.length || 0} 篇文章`;
            document.getElementById('articleCount').textContent = user.articles?.length || 0;
            
            // 头像
            if (user.profile?.avatar) {
                document.getElementById('avatar').src = user.profile.avatar;
            }
            
            // 兴趣爱好
            const interestsContainer = document.getElementById('interests');
            if (user.profile?.interests && user.profile.interests.length > 0) {
                interestsContainer.innerHTML = '';
                user.profile.interests.forEach(interest => {
                    addInterestTag(interest, interestsContainer);
                });
            }
            
            // 管理员相关
            if (user.isAdmin) {
                document.getElementById('adminSection').classList.remove('hidden');
                document.getElementById('adminSuccessMsg').classList.remove('hidden');
                document.getElementById('adminKeyInput').classList.add('hidden');
                document.getElementById('verifyAdminBtn').classList.add('hidden');
            } else {
                document.getElementById('adminSection').classList.remove('hidden');
            }
            
            // 签到状态
            const today = new Date().toDateString();
            if (user.lastCheckIn === today) {
                const checkInBtn = document.getElementById('checkInBtn');
                checkInBtn.textContent = '已签到';
                checkInBtn.disabled = true;
                checkInBtn.style.backgroundColor = '#c8e6c9';
            }
        }
        
        // 初始化事件监听器
        function initEventListeners(user) {
            const editBtn = document.getElementById('editProfileBtn');
            const saveBtn = document.getElementById('saveProfileBtn');
            const newInterest = document.getElementById('newInterest');
            const addInterestBtn = document.getElementById('addInterestBtn');
            
            // 编辑资料
            editBtn.addEventListener('click', function() {
                document.body.classList.add('edit-mode');
                editBtn.classList.add('hidden');
                saveBtn.classList.remove('hidden');
                newInterest.classList.remove('hidden');
                addInterestBtn.classList.remove('hidden');
                
                // 使内容可编辑
                document.querySelectorAll('.editable').forEach(el => {
                    el.contentEditable = true;
                    el.focus();
                });
            });
            
            // 保存资料
            saveBtn.addEventListener('click', function() {
                // 保存修改
                user.profile = user.profile || {};
                user.profile.bio = document.getElementById('bio').textContent;
                user.profile.website = document.getElementById('website').href;
                
                localStorage.setItem('user', JSON.stringify(user));
                
                // 退出编辑模式
                document.body.classList.remove('edit-mode');
                editBtn.classList.remove('hidden');
                saveBtn.classList.add('hidden');
                newInterest.classList.add('hidden');
                addInterestBtn.classList.add('hidden');
                
                // 使内容不可编辑
                document.querySelectorAll('.editable').forEach(el => {
                    el.contentEditable = false;
                });
                
                // 显示成功提示
                showNotification('资料保存成功');
            });
            
            // 更换头像
            document.getElementById('changeAvatarBtn').addEventListener('click', function() {
                document.getElementById('avatarInput').click();
            });
            
            document.getElementById('avatarInput').addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById('avatar').src = e.target.result;
                        user.profile = user.profile || {};
                        user.profile.avatar = e.target.result;
                        localStorage.setItem('user', JSON.stringify(user));
                        showNotification('头像更新成功');
                    }
                    reader.readAsDataURL(this.files[0]);
                }
            });
            
            // 添加兴趣
            addInterestBtn.addEventListener('click', function() {
                addNewInterest(user);
            });
            
            // 按Enter键添加兴趣
            newInterest.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addNewInterest(user);
                }
            });
            
            // 签到功能
            document.getElementById('checkInBtn').addEventListener('click', function() {
                const today = new Date().toDateString();
                user.lastCheckIn = today;
                localStorage.setItem('user', JSON.stringify(user));
                
                this.textContent = '已签到';
                this.disabled = true;
                this.style.backgroundColor = '#c8e6c9';
                showNotification('签到成功！');
            });
            
            // 管理员验证
            document.getElementById('verifyAdminBtn').addEventListener('click', function() {
                const keyInput = document.getElementById('adminKeyInput');
                // 实际应用中应该通过后端验证
                if (keyInput.value === 'amicora_admin_123') { // 示例密钥
                    user.isAdmin = true;
                    localStorage.setItem('user', JSON.stringify(user));
                    document.getElementById('adminSuccessMsg').classList.remove('hidden');
                    keyInput.classList.add('hidden');
                    this.classList.add('hidden');
                    showNotification('验证成功，你已成为管理员');
                } else {
                    showNotification('密钥不正确', 'error');
                }
            });
        }
        
        // 添加新兴趣
        function addNewInterest(user) {
            const newInterest = document.getElementById('newInterest');
            const interest = newInterest.value.trim();
            
            if (interest) {
                const interestsContainer = document.getElementById('interests');
                addInterestTag(interest, interestsContainer);
                
                // 保存到用户数据
                user.profile = user.profile || {};
                user.profile.interests = user.profile.interests || [];
                user.profile.interests.push(interest);
                localStorage.setItem('user', JSON.stringify(user));
                
                newInterest.value = '';
                newInterest.focus();
            }
        }
        
        // 添加兴趣标签
        function addInterestTag(interest, container) {
            const span = document.createElement('span');
            span.className = 'px-3 py-1 rounded-full text-sm interest-tag fade-in';
            span.textContent = interest;
            span.dataset.interest = interest;
            
            // 点击删除兴趣
            span.addEventListener('click', function() {
                if (document.body.classList.contains('edit-mode')) {
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (user.profile?.interests) {
                        user.profile.interests = user.profile.interests.filter(item => item !== interest);
                        localStorage.setItem('user', JSON.stringify(user));
                    }
                    span.remove();
                }
            });
            
            container.appendChild(span);
        }
        
        // 加载用户文章
        function loadUserArticles(user) {
            const articlesContainer = document.getElementById('myArticles');
            articlesContainer.innerHTML = '';
            
            if (!user.articles || user.articles.length === 0) {
                articlesContainer.innerHTML = `
                    <div class="bg-white dark:bg-gray-800 p-6 text-center">
                        <i class="fas fa-file-alt text-4xl text-green-200 mb-3"></i>
                        <p class="text-gray-500">还没有发布任何文章</p>
                        <button class="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                            <i class="fa fa-plus mr-1"></i> 发布第一篇文章
                        </button>
                    </div>
                `;
                return;
            }
            
            document.getElementById('articleCountDisplay').textContent = `${user.articles.length} 篇文章`;
            
            user.articles.forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.className = 'bg-white dark:bg-gray-800 p-6 hover:shadow-md transition-shadow article-card';
                articleCard.innerHTML = `
                    ${article.imageUrl ? `<img src="${article.imageUrl}" alt="${article.title}" class="w-full h-48 object-cover rounded-lg mb-4">` : ''}
                    <h3 class="text-xl font-bold mb-2 hover:text-green-600 transition-colors">${article.title}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">${article.content}</p>
                    <div class="flex flex-wrap justify-between items-center gap-2">
                        <span class="text-sm text-gray-500"><i class="far fa-calendar-alt mr-1"></i>${article.date}</span>
                        <div>
                            <button onclick="editArticle(${article.id})" class="text-green-500 hover:text-green-700 mr-3 transition-colors">
                                <i class="fa fa-edit"></i> 编辑
                            </button>
                            <button onclick="deleteArticle(${article.id})" class="text-red-400 hover:text-red-600 transition-colors">
                                <i class="fa fa-trash"></i> 删除
                            </button>
                        </div>
                    </div>
                `;
                articlesContainer.appendChild(articleCard);
            });
        }
        
        // 编辑文章函数
        function editArticle(articleId) {
            // 实际应用中应跳转到编辑页面
            const user = JSON.parse(localStorage.getItem('user'));
            const article = user.articles.find(a => a.id === articleId);
            if (article) {
                showNotification(`编辑文章失败!因为开发者没做好(): ${article.title}`);
                // 示例：window.location.href = `edit-article.html?id=${articleId}`;
            }
        }
        
        // 删除文章函数
        function deleteArticle(articleId) {
            if (confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
                const user = JSON.parse(localStorage.getItem('user'));
                user.articles = user.articles.filter(article => article.id !== articleId);
                localStorage.setItem('user', JSON.stringify(user));
                loadUserArticles(user);
                showNotification('文章已删除');
            }
        }
        
        // 显示通知
        function showNotification(message, type = 'success') {
            // 创建通知元素
            const notification = document.createElement('div');
            notification.className = `fixed bottom-4 right-4 px-4 py-3 z-50 transition-all transform translate-y-0 opacity-100 notification ${
                type === 'success' ? 'bg-green-400' : 'bg-red-400'
            } text-white`;
            notification.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
                ${message}
            `;
            
            // 添加到页面
            document.body.appendChild(notification);
            
            // 自动消失
            setTimeout(() => {
                notification.classList.add('opacity-0', 'translate-y-4');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // 好句库
const goodQuotes = [
  // 中文句子
  "每天进步一点点，就是最大的成功",
  "生活就像海洋，只有意志坚强的人才能到达彼岸",
  "今天的努力，明天的实力",
  
  // 英文句子
  "The best time to plant a tree was 20 years ago. The second best is now.",
  "In the middle of difficulty lies opportunity.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts."
];

// 签到功能
document.getElementById('checkinBtn').addEventListener('click', function() {
  const now = new Date();
  const checkinTime = now.toLocaleString();
  
  // 随机选择好句
  const randomQuote = goodQuotes[Math.floor(Math.random() * goodQuotes.length)];
  
  // 获取用户信息(假设已存在)
  const user = JSON.parse(localStorage.getItem('user') || '{"nickname":"游客","avatar":"images/default-avatar.png","checkinCount":0,"streakDays":1,"lastCheckin":"从未"}');
  
  // 更新用户数据
  user.checkinCount++;
  user.lastCheckin = checkinTime;
  localStorage.setItem('user', JSON.stringify(user));
  
  // 生成随机排名
  const randomRank = Math.floor(Math.random() * 50) + 1;
  
  // 创建签到版块
  const checkinCard = document.createElement('div');
  checkinCard.className = 'bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-md mb-4 glass-effect';
  checkinCard.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <span class="text-gray-700 dark:text-gray-300 italic">${randomQuote}</span>
      <span class="text-gray-500 dark:text-gray-400 text-sm">| ${checkinTime}</span>
    </div>
    <div class="flex items-start">
      <img src="${user.avatar}" alt="头像" class="w-12 h-12 rounded-full mr-4">
      <div class="flex-1">
        <h4 class="font-bold text-gray-800 dark:text-gray-200">${user.nickname}</h4>
        <p class="text-sm text-gray-600 dark:text-gray-400">今日打卡 Top ${randomRank}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">连续打卡 ${user.streakDays} 天</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">总计打卡 ${user.checkinCount} 天</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">上次打卡: ${user.lastCheckin}</p>
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">by Amicora World</p>
      </div>
    </div>
    <button id="saveCheckinBtn" class="mt-3 text-primary hover:text-primary/80 text-sm flex items-center">
      <i class="fa fa-download mr-1"></i> 保存为图片
    </button>
  `;
  
  // 添加到容器
  document.getElementById('checkinContainer').prepend(checkinCard);
  
  // 保存图片功能(需要html2canvas库支持)
  checkinCard.querySelector('#saveCheckinBtn').addEventListener('click', function() {
    html2canvas(checkinCard).then(canvas => {
      const link = document.createElement('a');
      link.download = `checkin-${checkinTime.replace(/[:/]/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  });
  
  // 禁用签到按钮
  this.disabled = true;
  this.textContent = "今日已签到";
  this.classList.add('bg-gray-400');
  this.classList.remove('bg-green-600', 'hover:bg-green-700');
});