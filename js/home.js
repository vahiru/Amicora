// 导航栏滚动效果优化
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('bg-glass/95', 'shadow-md');
    header.classList.remove('bg-transparent');
  } else {
    header.classList.remove('bg-glass/95', 'shadow-md');
    header.classList.add('bg-transparent');
  }
}, { passive: true }); // 使用passive提高滚动性能

// 图片点击放大功能
document.querySelectorAll('.collapse-content img').forEach(img => {
  img.addEventListener('click', function() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
    overlay.innerHTML = `<img src="${this.src}" alt="${this.alt}" class="max-w-full max-h-[90vh] object-contain transition-transform duration-300">`;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    overlay.addEventListener('click', function() {
      overlay.remove();
      document.body.style.overflow = '';
    }, { once: true });
  });
});

// 优化搜索功能
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', debounce(function(e) {
  const query = e.target.value.trim();
  if (query.length < 2) {
    searchResults.classList.add('hidden');
    return;
  }
  
  // 搜索逻辑...
}, 300)); // 防抖处理

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// API配置
const API_KEY = ''; // 请在此处填写真实的API密钥
const API_URL = '';

// 检查API密钥是否存在
function hasApiKey() {
  return API_KEY && API_KEY.trim() !== '';
}

// 实现完整的API函数
function fetchData(endpoint, options = {}) {
  // 检查API密钥
  if (!hasApiKey()) {
    showApiError();
    return;
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  return fetch(`${API_URL}${endpoint}`, {
    signal: controller.signal,
    ...options,
    headers: {}
  })
}
// 获取访问统计数据
function fetchVisitStats() {
  // 检查API密钥
  if (!hasApiKey()) {
    showApiError();
    return;
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  fetch('/api/visit-stats', {
    signal: controller.signal,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // 更新访问量显示
      try {
        document.getElementById('totalVisits').textContent = data.total_visits;
        document.getElementById('todayVisits').textContent = data.today_visits;
        document.getElementById('modalTotalVisits').textContent = data.total_visits;
        document.getElementById('modalTodayVisits').textContent = data.today_visits;
        
        // 更新历史记录
        const historyList = document.getElementById('visitHistoryList');
        historyList.innerHTML = '';
        
        if (Object.keys(data.daily_history).length === 0) {
          historyList.innerHTML = '<div style="text-align: center; padding: 20px; opacity: 0.7;">暂无历史记录</div>';
        } else {
          // 按日期倒序显示最近7天的记录
          const sortedDates = Object.keys(data.daily_history).sort((a, b) => new Date(b) - new Date(a)).slice(0, 7);
          
          sortedDates.forEach(date => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
              <span>${date}</span>
              <span>${data.daily_history[date]} 次访问</span>
            `;
            historyList.appendChild(historyItem);
          });
        }
      } catch (error) {
        console.error('更新访问统计显示失败:', error);
      }
    })
    .catch(error => {
      console.error('获取访问统计失败:', error);
    })
    .finally(() => {
      clearTimeout(timeoutId);
    });
}

// 获取弹幕数据
function fetchDanmaku() {
  // 检查API密钥
  if (!hasApiKey()) {
    showApiError();
    return;
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  fetch('/api/danmaku', {
    signal: controller.signal,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // 这里可以添加处理弹幕数据的逻辑
      console.log('获取到弹幕数据:', data);
      // 实际应用中应该更新页面上的弹幕显示
    })
    .catch(error => {
      console.error('获取弹幕失败:', error);
    })
    .finally(() => {
      clearTimeout(timeoutId);
    });
}

// 获取服务器状态
function fetchStatus() {
  // 检查API密钥
  if (!hasApiKey()) {
    showApiError();
    return;
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  fetch('/api/status', {
    signal: controller.signal,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // 这里可以添加处理服务器状态数据的逻辑
      console.log('获取到服务器状态:', data);
      // 实际应用中应该更新页面上的服务器状态显示
    })
    .catch(error => {
      console.error('获取服务器状态失败:', error);
    })
    .finally(() => {
      clearTimeout(timeoutId);
    });
}

// 优化服务器状态轮询
let statusPolling;

function startStatusPolling() {
  // 停止之前的轮询
  if (statusPolling) clearInterval(statusPolling);
  
  // 初始获取一次状态
  fetchServerStatus();
  
  // 每30秒更新一次，减少请求频率
  statusPolling = setInterval(fetchServerStatus, 30000);
}

function fetchServerStatus() {
  // 检查API密钥
  if (!hasApiKey()) {
    showApiError();
    return;
  }
  
  // 使用fetch API并设置超时
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  // 使用真实API接口
  fetch('/api/server-status', {
    signal: controller.signal,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (typeof updateServerStatus === 'function') {
        updateServerStatus(data);
      }
    })
    .catch(error => {
      console.error('获取服务器状态失败:', error);
    })
    .finally(() => {
      clearTimeout(timeoutId);
    });
}

// 页面加载时启动轮询
startStatusPolling();

// 页面隐藏时停止轮询，显示时重新启动
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    if (statusPolling) clearInterval(statusPolling);
  } else {
    startStatusPolling();
  }
});