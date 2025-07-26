// Learning Coach Interactive Functions
class LearningCoach {
    constructor() {
        this.subjects = {
            physics: {
                name: '物理',
                icon: '⚛️',
                topics: [
                    { name: '力与运动', desc: '探索物体运动的基本规律' },
                    { name: '声与光', desc: '理解声音和光的传播原理' },
                    { name: '电与磁', desc: '掌握电流和磁场的关系' },
                    { name: '能量转换', desc: '学习各种能量形式的转化' }
                ],
                color: '#3b82f6'
            },
            chemistry: {
                name: '化学',
                icon: '🧪',
                topics: [
                    { name: '物质构成', desc: '了解原子分子的基本结构' },
                    { name: '化学反应', desc: '掌握化学反应的基本类型' },
                    { name: '酸碱盐', desc: '学习常见化合物的性质' },
                    { name: '化学实验', desc: '安全进行化学实验操作' }
                ],
                color: '#10b981'
            },
            mathematics: {
                name: '数学',
                icon: '📐',
                topics: [
                    { name: '代数基础', desc: '掌握方程和不等式求解' },
                    { name: '几何图形', desc: '理解平面几何的基本定理', link: 'circle-learning.html' },
                    { name: '函数概念', desc: '学习一次函数和二次函数' },
                    { name: '数据统计', desc: '掌握基本的统计分析方法' }
                ],
                color: '#8b5cf6'
            }
        };
        
        this.encouragements = [
            "你做得很棒！继续保持这种学习热情！",
            "每一个问题都是成长的机会，加油！",
            "学习就像爬山，虽然辛苦但山顶的风景值得期待！",
            "不要害怕犯错，错误是学习路上最好的老师！",
            "相信自己，你比想象中更有能力！"
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.addAnimations();
        this.showWelcomeMessage();
    }
    
    bindEvents() {
        // Subject circle click events
        const subjectCircles = document.querySelectorAll('.subject-circle');
        subjectCircles.forEach(circle => {
            circle.addEventListener('click', (e) => {
                const subject = e.currentTarget.dataset.subject;
                this.showSubjectDetails(subject);
            });
        });
        
        // Feature circle hover events
        const featureCircles = document.querySelectorAll('.feature-circle');
        featureCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                this.showEncouragement();
            });
        });
        
        // Path circle click events
        const pathCircles = document.querySelectorAll('.path-circle');
        pathCircles.forEach((circle, index) => {
            circle.addEventListener('click', () => {
                this.showLearningTip(index + 1);
            });
        });
        
        // Coach avatar click event
        const coachAvatar = document.querySelector('.avatar-circle');
        coachAvatar.addEventListener('click', () => {
            this.showRandomEncouragement();
        });
    }
    
    addAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        // Add fade-in animation to sections
        const sections = document.querySelectorAll('.hero, .subjects, .learning-path');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.6s ease';
            observer.observe(section);
        });
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.showNotification('欢迎来到KarmaLab！点击任意科目开始你的学习之旅吧！', 'info');
        }, 1000);
    }
    
    showSubjectDetails(subjectKey) {
        const subject = this.subjects[subjectKey];
        if (!subject) return;
        
        const modal = this.createModal();
        modal.innerHTML = `
            <div class="modal-content subject-modal">
                <div class="modal-header" style="background: ${subject.color}">
                    <h2>${subject.icon} ${subject.name}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <h3>学习主题</h3>
                    <div class="topics-grid">
                        ${subject.topics.map(topic => `
                            <div class="topic-card" onclick="learningCoach.showTopicDetail('${topic.name}', '${topic.desc}', '${topic.link || ''}')">
                                <h4>${topic.name}</h4>
                                <p>${topic.desc}</p>
                                ${topic.link ? '<div class="topic-link">🎯 进入详细学习</div>' : ''}
                            </div>
                        `).join('')}
                    </div>
                    <div class="study-tips">
                        <h4>💡 学习建议</h4>
                        <p>建议你从基础概念开始，循序渐进地学习。记住，理解比记忆更重要！</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.bindModalEvents(modal);
    }
    
    showTopicDetail(topicName, description, link) {
        if (link) {
            // 如果有链接，跳转到详细学习页面
            this.showNotification(`正在进入"${topicName}"的详细学习页面...`, 'info');
            setTimeout(() => {
                window.location.href = link;
            }, 1000);
        } else {
            this.showNotification(`太棒了！你选择了"${topicName}"。${description}让我们一起深入探索吧！`, 'success');
        }
    }
    
    showEncouragement() {
        const randomEncouragement = this.encouragements[Math.floor(Math.random() * this.encouragements.length)];
        this.showNotification(randomEncouragement, 'success');
    }
    
    showRandomEncouragement() {
        const messages = [
            "你好！我是你的学习教练，有什么可以帮助你的吗？",
            "学习是一个持续的过程，每天进步一点点就很棒了！",
            "记住，没有笨学生，只有不合适的学习方法！",
            "保持好奇心，这是学习最好的动力！"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.showNotification(randomMessage, 'info');
    }
    
    showLearningTip(step) {
        const tips = [
            "简化知识：把复杂的概念拆分成小块，一步一步理解！",
            "个性化辅导：每个人的学习节奏不同，找到适合你的方法！",
            "启发思考：多问为什么，培养独立思考的能力！",
            "给予鼓励：相信自己，你一定可以做到的！"
        ];
        this.showNotification(tips[step - 1] || "继续加油，你做得很好！", 'info');
    }
    
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
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 4000);
    }
    
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        return modal;
    }
    
    bindModalEvents(modal) {
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            modal.classList.add('closing');
            setTimeout(() => document.body.removeChild(modal), 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('closing');
                setTimeout(() => document.body.removeChild(modal), 300);
            }
        });
    }
}

// Additional CSS for modal and notifications
const additionalStyles = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: modalFadeIn 0.3s ease;
    }
    
    .modal.closing {
        animation: modalFadeOut 0.3s ease;
    }
    
    @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes modalFadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .modal-content {
        background: white;
        border-radius: 20px;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        animation: modalSlideIn 0.3s ease;
    }
    
    @keyframes modalSlideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .modal-header {
        padding: 2rem;
        color: white;
        border-radius: 20px 20px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-header h2 {
        margin: 0;
        font-size: 1.8rem;
    }
    
    .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
    }
    
    .close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .modal-body {
        padding: 2rem;
    }
    
    .topics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .topic-card {
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 15px;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .topic-card:hover {
        border-color: #4f46e5;
        background: #eef2ff;
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(79, 70, 229, 0.15);
    }
    
    .topic-card h4 {
        color: #1f2937;
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
    }
    
    .topic-card p {
        color: #6b7280;
        font-size: 0.9rem;
        margin: 0;
    }
    
    .topic-link {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        color: white;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        text-align: center;
    }
    
    .study-tips {
        background: linear-gradient(135deg, #fef3c7, #fcd34d);
        border-radius: 15px;
        padding: 1.5rem;
        margin-top: 2rem;
    }
    
    .study-tips h4 {
        color: #92400e;
        margin-bottom: 0.5rem;
    }
    
    .study-tips p {
        color: #b45309;
        margin: 0;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 15px;
        padding: 1rem 1.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left: 4px solid #10b981;
    }
    
    .notification.info {
        border-left: 4px solid #3b82f6;
    }
    
    .notification.warning {
        border-left: 4px solid #f59e0b;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .notification-message {
        color: #374151;
        font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
        .modal-content {
            width: 95%;
            margin: 20px;
        }
        
        .modal-header, .modal-body {
            padding: 1.5rem;
        }
        
        .topics-grid {
            grid-template-columns: 1fr;
        }
        
        .notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;

// Add additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the Learning Coach when the page loads
let learningCoach;

document.addEventListener('DOMContentLoaded', () => {
    learningCoach = new LearningCoach();
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add some fun interactions
document.addEventListener('keydown', (e) => {
    // Easter egg: Press 'h' for help
    if (e.key === 'h' || e.key === 'H') {
        learningCoach.showNotification('💡 提示：点击科目圆圈查看详细内容，点击我的头像获得鼓励！', 'info');
    }
    
    // Press 'e' for encouragement
    if (e.key === 'e' || e.key === 'E') {
        learningCoach.showRandomEncouragement();
    }
});