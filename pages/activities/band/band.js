Page({
	data: {
	  particles: [], // 存储所有粒子的数组
	  ctx: null, // 画布上下文
	  canvasWidth: 0, // 画布宽度
	  canvasHeight: 0 // 画布高度
	},
	onReady() {
	  // 获取画布上下文
	  const query = wx.createSelectorQuery();
	  query.select('#particleCanvas')
		.fields({ node: true, size: true })
		.exec((res) => {
		  if (res[0]) {
			const canvas = res[0].node;
			const ctx = canvas.getContext('2d');
			const dpr = wx.getSystemInfoSync().pixelRatio;
			canvas.width = res[0].width * dpr;
			canvas.height = res[0].height * dpr;
			ctx.scale(dpr, dpr);
  
			this.setData({
			  ctx,
			  canvasWidth: res[0].width,
			  canvasHeight: res[0].height
			});
  
			// 初始化粒子
			this.initParticles();
			// 开始动画循环
			this.animate();
		  } else {
			console.error('未找到 canvas 元素');
		  }
		});
	},
	initParticles() {
	  const particles = [];
	  const numParticles = 50; // 粒子数量
	  for (let i = 0; i < numParticles; i++) {
		// 随机生成粒子的位置、速度、颜色
		const x = Math.random() * this.data.canvasWidth;
		const y = Math.random() * this.data.canvasHeight;
		const vx = (Math.random() - 0.5) * 0.5;
		const vy = (Math.random() - 0.5) * 0.5;
		// 随机生成不同深浅的颜色，体现层次感和立体感
		const shade = Math.floor(Math.random() * 100);
		const color = `rgba(${shade}, ${shade}, ${shade}, 0.6)`; 
		particles.push({ x, y, vx, vy, color });
	  }
	  this.setData({ particles });
	},
	animate() {
	  const { ctx, canvasWidth, canvasHeight, particles } = this.data;
	  // 清空画布
	  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
	  // 更新粒子位置
	  for (let i = 0; i < particles.length; i++) {
		const particle = particles[i];
		particle.x += particle.vx;
		particle.y += particle.vy;
  
		// 边界检测
		if (particle.x < 0 || particle.x > canvasWidth) {
		  particle.vx = -particle.vx;
		}
		if (particle.y < 0 || particle.y > canvasHeight) {
		  particle.vy = -particle.vy;
		}
	  }
  
	  // 绘制粒子和连线
	  for (let i = 0; i < particles.length; i++) {
		const particle1 = particles[i];
		// 绘制粒子
		ctx.beginPath();
		ctx.arc(particle1.x, particle1.y, 3, 0, Math.PI * 2);
		ctx.fillStyle = particle1.color;
		ctx.fill();
  
		// 绘制连线
		for (let j = i + 1; j < particles.length; j++) {
		  const particle2 = particles[j];
		  if (particle1.color === particle2.color) {
			const dx = particle1.x - particle2.x;
			const dy = particle1.y - particle2.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < 100) {
			  ctx.beginPath();
			  ctx.moveTo(particle1.x, particle1.y);
			  ctx.lineTo(particle2.x, particle2.y);
			  ctx.strokeStyle = particle1.color;
			  ctx.lineWidth = 0.5;
			  ctx.stroke();
			}
		  }
		}
	  }
  
	  // 循环调用动画函数
	  requestAnimationFrame(this.animate.bind(this));
	}
  });