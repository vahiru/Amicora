
  // 创建下雨容器
  const rainContainer = document.createElement('div');
  rainContainer.id = 'rain-container';
  rainContainer.style.display = 'none';
  document.body.appendChild(rainContainer);
  
  // 存储原始背景
  let originalBackground = '';
  
  // 生成雨滴
  function createRain() {
    // 清空现有雨滴
    rainContainer.innerHTML = '';
    
    // 创建100个雨滴
    for (let i = 0; i < 100; i++) {
      const raindrop = document.createElement('div');
      raindrop.classList.add('raindrop');
      
      // 随机属性
      const size = Math.random() * 5 + 5;
      const posX = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 1 + 0.5;
      
      // 应用样式
      raindrop.style.height = `${size}px`;
      raindrop.style.left = `${posX}%`;
      raindrop.style.animationDelay = `${delay}s`;
      raindrop.style.animationDuration = `${duration}s`;
      
      rainContainer.appendChild(raindrop);
    }
    
    rainContainer.style.display = 'block';
  }
  
  // 停止下雨
  function stopRain() {
    rainContainer.style.display = 'none';
  }
  
  // 为音乐项添加点击事件
  document.querySelectorAll('.music-item').forEach(item => {
    item.addEventListener('click', function() {
      // 移除所有音乐项的活跃状态
      document.querySelectorAll('.music-item').forEach(i => {
        i.classList.remove('bg-white/10');
        i.querySelector('i').className = 'fa fa-music text-white/70 mr-2';
      });
      
      // 设置当前音乐项为活跃
      this.classList.add('bg-white/10');
      this.querySelector('i').className = 'fa fa-music text-primary mr-2';
      
      // 更新当前播放的音乐名称
      const musicName = this.getAttribute('data-music');
      document.getElementById('currentMusic').textContent = musicName;
      
      // 检查是否是下雨相关歌曲
      const isRainy = this.getAttribute('data-rainy') === 'true';
      
      if (isRainy) {
        // 保存原始背景
        if (!originalBackground) {
          originalBackground = document.body.className;
        }
        
        // 应用下雨背景
        document.body.className = originalBackground.replace('bg-anime', 'rainy-background');
        createRain();
      } else if (originalBackground) {
        // 恢复原始背景
        document.body.className = originalBackground;
        stopRain();
      }
      
      // 播放音乐（这里只是模拟，实际项目中需要处理音频播放）
      document.getElementById('toggleMusic').innerHTML = '<i class="fa fa-pause"></i>';
    });
  });
  
