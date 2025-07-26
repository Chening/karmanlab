// 圆学习页面的交互功能
class CircleLearningCoach {
    constructor() {
        this.currentSection = 'basics';
        this.quizQuestions = [
            {
                question: "圆是由什么构成的？",
                options: [
                    "到定点距离等于定长的所有点的集合",
                    "任意画出的封闭曲线",
                    "三个点组成的图形",
                    "四条边组成的图形"
                ],
                correct: 0,
                explanation: "圆的定义是平面上到定点（圆心）距离等于定长（半径）的所有点的集合。"
            },
            {
                question: "如果圆的半径是5cm，那么直径是多少？",
                options: ["5cm", "10cm", "15cm", "25cm"],
                correct: 1,
                explanation: "直径等于半径的2倍，所以 d = 2r = 2 × 5 = 10cm。"
            },
            {
                question: "圆的周长公式是什么？",
                options: ["C = πr", "C = 2πr", "C = πr²", "C = 2πr²"],
                correct: 1,
                explanation: "圆的周长公式是 C = 2πr，也可以写成 C = πd。"
            },
            {
                question: "半径为3cm的圆，面积大约是多少？（π≈3.14）",
                options: ["18.84 cm²", "28.26 cm²", "9.42 cm²", "37.68 cm²"],
                correct: 1,
                explanation: "圆的面积公式是 S = πr²，所以 S = π × 3² = 9π ≈ 28.26 cm²。"
            },
            {
                question: "垂径定理说的是什么？",
                options: [
                    "垂直于弦的直径平分这条弦",
                    "所有弦都相等",
                    "直径是最短的弦",
                    "圆心到弦的距离都相等"
                ],
                correct: 0,
                explanation: "垂径定理：垂直于弦的直径平分这条弦，并且平分弦所对的弧。"
            }
        ];
        this.currentQuestionIndex = 0;
        this.quizScore = 0;
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initCanvas();
        this.initCalculator();
        this.initDragAndDrop();
        this.updateProgress();
    }
    
    // 绑定事件
    bindEvents() {
        // 进度圆圈点击事件
        document.querySelectorAll('.progress-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.goToSection(section);
            });
        });
        
        // 添加前进后退按钮事件
        this.addNavigationButtons();
        
        // 输入框事件
        const radiusInput = document.getElementById('radius-input');
        if (radiusInput) {
            radiusInput.addEventListener('input', () => this.updateCalculator());
        }
        
        // 滑块事件
        const radiusSlider = document.getElementById('radius-slider');
        if (radiusSlider) {
            radiusSlider.addEventListener('input', (e) => {
                document.getElementById('radius-value').textContent = e.target.value + 'px';
                this.drawCircleOnCanvas();
            });
        }
        
        // 颜色选择器
        const colorPicker = document.getElementById('circle-color');
        if (colorPicker) {
            colorPicker.addEventListener('change', () => this.drawCircleOnCanvas());
        }
    }
    
    // 添加导航按钮
    addNavigationButtons() {
        const sections = ['basics', 'properties', 'formulas', 'angles', 'inscribed', 'positions', 'interactive', 'quiz'];
        
        sections.forEach((sectionId, index) => {
            const section = document.getElementById(sectionId);
            if (!section) return;
            
            // 创建导航容器
            const navContainer = document.createElement('div');
            navContainer.className = 'section-navigation';
            navContainer.style.cssText = `
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-top: 2rem; 
                padding: 1rem 0;
            `;
            
            // 上一步按钮
            if (index > 0) {
                const prevBtn = document.createElement('button');
                prevBtn.className = 'btn-secondary nav-btn';
                prevBtn.innerHTML = `← 上一步: ${this.getSectionTitle(sections[index - 1])}`;
                prevBtn.onclick = () => this.goToSection(sections[index - 1]);
                navContainer.appendChild(prevBtn);
            } else {
                navContainer.appendChild(document.createElement('div')); // 占位
            }
            
            // 下一步按钮
            if (index < sections.length - 1) {
                const nextBtn = document.createElement('button');
                nextBtn.className = 'btn-primary nav-btn';
                nextBtn.innerHTML = `下一步: ${this.getSectionTitle(sections[index + 1])} →`;
                nextBtn.onclick = () => this.nextSection(sections[index + 1]);
                navContainer.appendChild(nextBtn);
            } else {
                const completeBtn = document.createElement('button');
                completeBtn.className = 'btn-primary nav-btn';
                completeBtn.innerHTML = '🎉 完成学习';
                completeBtn.onclick = () => this.showCompletion();
                navContainer.appendChild(completeBtn);
            }
            
            // 将导航添加到section末尾
            section.appendChild(navContainer);
        });
    }
    
    // 获取section标题
    getSectionTitle(sectionId) {
        const titles = {
            'basics': '认识圆',
            'properties': '圆的性质', 
            'formulas': '公式计算',
            'angles': '圆周角定理',
            'inscribed': '内接四边形',
            'positions': '位置关系',
            'interactive': '互动练习',
            'quiz': '知识测试'
        };
        return titles[sectionId] || sectionId;
    }
    
    // 初始化画布
    initCanvas() {
        this.canvas = document.getElementById('circle-canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.drawCircleOnCanvas();
            
            // 添加点击画布绘制圆的功能
            this.canvas.addEventListener('click', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.drawCircleAt(x, y);
            });
        }
    }
    
    // 在画布指定位置绘制圆
    drawCircleAt(x, y) {
        if (!this.ctx) return;
        
        const radius = parseInt(document.getElementById('radius-slider').value);
        const color = document.getElementById('circle-color').value;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // 绘制圆心
        this.ctx.beginPath();
        this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        
        this.updateCanvasInfo(radius);
    }
    
    // 绘制圆到画布中心
    drawCircleOnCanvas() {
        if (!this.ctx || !this.canvas) return;
        
        const radius = parseInt(document.getElementById('radius-slider').value);
        const color = document.getElementById('circle-color').value;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制圆
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // 绘制圆心
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fill();
        
        // 绘制半径线
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(centerX + radius, centerY);
        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // 标注半径
        this.ctx.fillStyle = '#10b981';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('r', centerX + radius/2 - 5, centerY - 10);
        
        this.updateCanvasInfo(radius);
    }
    
    // 更新画布信息显示
    updateCanvasInfo(radius) {
        const radiusInCm = (radius / 10).toFixed(1); // 假设10px = 1cm
        const circumference = (2 * Math.PI * radiusInCm).toFixed(2);
        const area = (Math.PI * radiusInCm * radiusInCm).toFixed(2);
        
        document.getElementById('current-radius').textContent = `${radiusInCm} cm`;
        document.getElementById('current-circumference').textContent = `${circumference} cm`;
        document.getElementById('current-area').textContent = `${area} cm²`;
    }
    
    // 清空画布
    clearCanvas() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            document.getElementById('current-radius').textContent = '0';
            document.getElementById('current-circumference').textContent = '0';
            document.getElementById('current-area').textContent = '0';
        }
    }
    
    // 绘制随机圆
    drawRandomCircle() {
        if (!this.ctx || !this.canvas) return;
        
        const radius = Math.random() * 80 + 20; // 20-100的随机半径
        const x = Math.random() * (this.canvas.width - 2 * radius) + radius;
        const y = Math.random() * (this.canvas.height - 2 * radius) + radius;
        const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        this.updateCanvasInfo(radius);
    }
    
    // 初始化计算器
    initCalculator() {
        const radiusInput = document.getElementById('radius-input');
        if (radiusInput) {
            radiusInput.addEventListener('input', () => this.updateCalculator());
        }
    }
    
    // 更新计算器结果
    updateCalculator() {
        const radiusInput = document.getElementById('radius-input');
        const radius = parseFloat(radiusInput.value);
        
        if (isNaN(radius) || radius <= 0) {
            document.getElementById('diameter-result').textContent = '-';
            document.getElementById('circumference-result').textContent = '-';
            document.getElementById('area-result').textContent = '-';
            return;
        }
        
        const diameter = (2 * radius).toFixed(2);
        const circumference = (2 * Math.PI * radius).toFixed(2);
        const area = (Math.PI * radius * radius).toFixed(2);
        
        document.getElementById('diameter-result').textContent = `${diameter} cm`;
        document.getElementById('circumference-result').textContent = `${circumference} cm`;
        document.getElementById('area-result').textContent = `${area} cm²`;
    }
    
    // 初始化拖拽匹配游戏
    initDragAndDrop() {
        const draggableItems = document.querySelectorAll('.draggable-item');
        const dropSlots = document.querySelectorAll('.drop-slot');
        
        draggableItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.concept);
                e.target.classList.add('dragging');
            });
            
            item.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });
        
        dropSlots.forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });
            
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });
            
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                
                const draggedConcept = e.dataTransfer.getData('text/plain');
                const expectedAnswer = slot.dataset.answer;
                
                if (draggedConcept === expectedAnswer) {
                    slot.classList.add('correct');
                    slot.textContent = '✓ ' + slot.textContent;
                    this.checkMatchingCompletion();
                } else {
                    slot.classList.add('incorrect');
                    setTimeout(() => {
                        slot.classList.remove('incorrect');
                    }, 1000);
                }
            });
        });
    }
    
    // 检查匹配游戏完成情况
    checkMatchingCompletion() {
        const correctSlots = document.querySelectorAll('.drop-slot.correct');
        const totalSlots = document.querySelectorAll('.drop-slot');
        
        if (correctSlots.length === totalSlots.length) {
            const feedback = document.getElementById('matching-feedback');
            feedback.textContent = '🎉 太棒了！你已经掌握了所有概念！';
            feedback.className = 'game-feedback success';
        }
    }
    
    // 切换到指定section
    goToSection(sectionId) {
        // 隐藏所有section
        document.querySelectorAll('.learning-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // 显示目标section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            this.currentSection = sectionId;
            this.updateProgress();
            
            // 滚动到section顶部
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // 下一个section
    nextSection(sectionId) {
        this.goToSection(sectionId);
        
        // 添加鼓励消息
        const encouragements = [
            "很好！继续保持这种学习热情！",
            "你的理解能力真棒！",
            "一步一步，稳扎稳打！",
            "学习就是这样循序渐进的！"
        ];
        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        
        setTimeout(() => {
            this.showNotification(randomEncouragement, 'success');
        }, 500);
    }
    
    // 更新进度指示器
    updateProgress() {
        document.querySelectorAll('.progress-item').forEach(item => {
            item.classList.remove('active', 'completed');
            
            const section = item.dataset.section;
            if (section === this.currentSection) {
                item.classList.add('active');
            } else {
                // 简单的逻辑判断是否已完成
                const sections = ['basics', 'properties', 'formulas', 'interactive', 'quiz'];
                const currentIndex = sections.indexOf(this.currentSection);
                const itemIndex = sections.indexOf(section);
                
                if (itemIndex < currentIndex) {
                    item.classList.add('completed');
                }
            }
        });
    }
    
    // 动画演示垂径定理
    animatePerpendicularTheorem() {
        const demo = document.getElementById('perpendicular-demo');
        if (!demo) return;
        
        // 这里可以添加SVG动画逻辑
        this.showNotification('📐 看！垂直线完美地平分了这条弦！这就是垂径定理的魅力。', 'info');
    }
    
    // 动画演示圆周角定理
    animateInscribedAngle() {
        const demo = document.getElementById('inscribed-angle-demo');
        if (!demo) return;
        
        // 添加闪烁动画突出显示圆周角相等
        const circles = demo.querySelectorAll('circle[cx="150"], circle[cx="250"]');
        const angles = demo.querySelectorAll('text[x="130"], text[x="220"]');
        
        circles.forEach((circle, index) => {
            setTimeout(() => {
                circle.style.animation = 'pulse 1s ease-in-out 3';
                angles[index].style.animation = 'pulse 1s ease-in-out 3';
            }, index * 500);
        });
        
        setTimeout(() => {
            this.showNotification('🎯 看！不同位置的圆周角都相等，且都等于圆心角的一半！这就是圆周角定理的神奇之处。', 'success');
        }, 2000);
    }
    
    // 开始测试
    startQuiz() {
        this.currentQuestionIndex = 0;
        this.quizScore = 0;
        this.showQuizQuestion();
        this.updateQuizProgress();
    }
    
    // 显示测试问题
    showQuizQuestion() {
        if (this.currentQuestionIndex >= this.quizQuestions.length) {
            this.showQuizResults();
            return;
        }
        
        const question = this.quizQuestions[this.currentQuestionIndex];
        const quizContent = document.getElementById('quiz-content');
        
        quizContent.innerHTML = `
            <div class="quiz-question">
                <div class="question-text">${question.question}</div>
                <div class="answer-options">
                    ${question.options.map((option, index) => `
                        <div class="answer-option" data-index="${index}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
                <div class="quiz-actions">
                    <button class="btn-secondary" onclick="circleCoach.goToSection('interactive')">返回练习</button>
                    <button class="btn-primary" id="next-question-btn" disabled onclick="circleCoach.nextQuestion()">下一题</button>
                </div>
            </div>
        `;
        
        // 绑定选项点击事件
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', (e) => {
                // 移除之前的选择
                document.querySelectorAll('.answer-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // 添加当前选择
                e.target.classList.add('selected');
                document.getElementById('next-question-btn').disabled = false;
                
                // 检查答案
                const selectedIndex = parseInt(e.target.dataset.index);
                const correctIndex = question.correct;
                
                setTimeout(() => {
                    document.querySelectorAll('.answer-option').forEach((opt, index) => {
                        if (index === correctIndex) {
                            opt.classList.add('correct');
                        } else if (index === selectedIndex && index !== correctIndex) {
                            opt.classList.add('incorrect');
                        }
                    });
                    
                    // 显示解释
                    const explanation = document.createElement('div');
                    explanation.className = 'answer-explanation';
                    explanation.innerHTML = `<strong>解释：</strong>${question.explanation}`;
                    explanation.style.cssText = `
                        background: #f0f9ff;
                        border-left: 4px solid #0ea5e9;
                        padding: 1rem;
                        margin-top: 1rem;
                        border-radius: 5px;
                        color: #0c4a6e;
                    `;
                    document.querySelector('.quiz-question').appendChild(explanation);
                    
                    if (selectedIndex === correctIndex) {
                        this.quizScore += 20; // 每题20分
                    }
                }, 500);
            });
        });
        
        this.updateQuizProgress();
    }
    
    // 下一题
    nextQuestion() {
        this.currentQuestionIndex++;
        this.showQuizQuestion();
    }
    
    // 更新测试进度
    updateQuizProgress() {
        const progress = (this.currentQuestionIndex / this.quizQuestions.length) * 100;
        document.getElementById('quiz-progress-fill').style.width = `${progress}%`;
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = this.quizQuestions.length;
    }
    
    // 显示测试结果
    showQuizResults() {
        document.getElementById('quiz-content').classList.add('hidden');
        const resultsDiv = document.getElementById('quiz-results');
        resultsDiv.classList.remove('hidden');
        
        document.getElementById('final-score').textContent = this.quizScore;
        
        // 根据分数显示不同的消息
        let title, message;
        if (this.quizScore >= 80) {
            title = '太棒了！🏆';
            message = '你已经很好地掌握了圆的知识！';
        } else if (this.quizScore >= 60) {
            title = '不错！👍';
            message = '你对圆的理解还不错，再加把劲就更好了！';
        } else {
            title = '继续努力！💪';
            message = '建议你回顾一下前面的内容，多练习几遍！';
        }
        
        document.getElementById('score-title').textContent = title;
        document.getElementById('score-message').textContent = message;
        
        // 完成进度更新
        this.updateProgress();
        
        // 如果分数够高，显示完成庆祝
        if (this.quizScore >= 60) {
            setTimeout(() => {
                this.showCompletion();
            }, 2000);
        }
    }
    
    // 重新测试
    retakeQuiz() {
        document.getElementById('quiz-results').classList.add('hidden');
        document.getElementById('quiz-content').classList.remove('hidden');
        this.startQuiz();
    }
    
    // 显示学习证书
    showCertificate() {
        const certificateHTML = `
            <div style="background: white; border-radius: 20px; padding: 3rem; text-align: center; max-width: 500px; margin: 2rem auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                <h2 style="color: #4f46e5; margin-bottom: 1rem;">🏆 学习证书</h2>
                <p style="color: #6b7280; margin-bottom: 2rem;">恭喜你完成了圆的学习！</p>
                <div style="border: 3px solid #4f46e5; border-radius: 15px; padding: 2rem; background: linear-gradient(135deg, #f0f9ff, #e0e7ff);">
                    <h3 style="color: #1f2937; margin-bottom: 1rem;">KarmaLab 学习证书</h3>
                    <p style="color: #4f46e5; font-weight: bold; margin-bottom: 0.5rem;">数学 · 几何 · 圆</p>
                    <p style="color: #6b7280; font-size: 0.9rem;">学习时间: ${new Date().toLocaleDateString()}</p>
                    <p style="color: #6b7280; font-size: 0.9rem;">测试分数: ${this.quizScore}/100</p>
                </div>
                <button class="btn-primary" onclick="this.parentElement.remove()" style="margin-top: 2rem;">关闭</button>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 1000;
            display: flex; align-items: center; justify-content: center;
        `;
        overlay.innerHTML = certificateHTML;
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }
    
    // 显示完成庆祝
    showCompletion() {
        document.getElementById('completion').classList.remove('hidden');
        document.getElementById('completion').scrollIntoView({ behavior: 'smooth' });
    }
    
    // 分享学习成果
    shareProgress() {
        const shareText = `我在KarmaLab完成了圆的学习！🎉\n✅ 掌握了圆的基本概念\n✅ 学会了重要性质和公式\n✅ 测试分数: ${this.quizScore}/100\n一起来学习吧！`;
        
        if (navigator.share) {
            navigator.share({
                title: 'KarmaLab学习成果',
                text: shareText,
                url: window.location.href
            });
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('学习成果已复制到剪贴板！', 'success');
            });
        }
    }
    
    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✅' : type === 'info' ? 'ℹ️' : '⚠️'}
                </span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// 初始化圆学习教练
let circleCoach;

document.addEventListener('DOMContentLoaded', () => {
    circleCoach = new CircleLearningCoach();
    
    // 自动开始测试（如果在quiz section）
    if (window.location.hash === '#quiz') {
        circleCoach.goToSection('quiz');
        setTimeout(() => {
            circleCoach.startQuiz();
        }, 1000);
    }
    
    // 欢迎消息
    setTimeout(() => {
        circleCoach.showNotification('欢迎来到圆的学习世界！让我们一步步探索圆的奥秘吧！', 'info');
    }, 1000);
});

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.key === 'n' || e.key === 'N') {
        // 按N键下一section
        const sections = ['basics', 'properties', 'formulas', 'interactive', 'quiz'];
        const currentIndex = sections.indexOf(circleCoach.currentSection);
        if (currentIndex < sections.length - 1) {
            circleCoach.nextSection(sections[currentIndex + 1]);
        }
    }
    
    if (e.key === 'p' || e.key === 'P') {
        // 按P键上一section  
        const sections = ['basics', 'properties', 'formulas', 'interactive', 'quiz'];
        const currentIndex = sections.indexOf(circleCoach.currentSection);
        if (currentIndex > 0) {
            circleCoach.goToSection(sections[currentIndex - 1]);
        }
    }
    
    if (e.key === 'r' || e.key === 'R') {
        // 按R键随机画圆
        circleCoach.drawRandomCircle();
    }
    
    if (e.key === 'c' || e.key === 'C') {
        // 按C键清空画布
        circleCoach.clearCanvas();
    }
});