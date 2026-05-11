// Skills Assistant Progress Tracker
// 追蹤專案進度、AI任務狀態、學習成長

class SkillsProgressTracker {
    constructor() {
        this.currentPhase = "Phase 1";
        this.phaseProgress = {
            "Phase 1": { completed: 2, total: 9, percentage: 22 },
            "Phase 2": { completed: 0, total: 8, percentage: 0 },
            "Phase 3": { completed: 0, total: 10, percentage: 0 },
            "Phase 4": { completed: 0, total: 6, percentage: 0 },
            "Phase 5": { completed: 0, total: 5, percentage: 0 }
        };

        this.aiTasks = [
            {
                id: 1,
                name: "brainstorming",
                status: "completed",
                startTime: "14:23",
                endTime: "14:35",
                duration: "12分鐘",
                output: "3個核心洞察、4個適應性模式"
            },
            {
                id: 2,
                name: "多維度視角分析",
                status: "in_progress",
                startTime: "14:35",
                endTime: null,
                duration: null,
                output: "正在進行 CEO 視角分析",
                progress: 25
            },
            {
                id: 3,
                name: "產生標準化計畫",
                status: "pending",
                startTime: null,
                endTime: null,
                duration: null,
                output: null,
                dependencies: [2]
            }
        ];

        this.learningMetrics = {
            phasesCompleted: 1,
            totalPhases: 5,
            skillsUsed: 3,
            satisfactionScore: 85,
            learnedConcepts: [
                "標準化流程的重要性",
                "AI 透明化追蹤",
                "適應性個人化設計"
            ],
            currentlyLearning: "多維度視角分析"
        };

        this.userLevel = "intermediate"; // beginner, intermediate, advanced
        this.adaptationLevel = "adaptive"; // fixed, adaptive, intelligent

        // Enhanced features
        this.githubConfig = {
            token: null,
            repo: null,
            username: null
        };

        this.pomodoroTimer = {
            isActive: false,
            duration: 25 * 60, // 25 minutes in seconds
            timeRemaining: 25 * 60,
            currentTask: null,
            breakTime: 5 * 60, // 5 minutes break
            sessionsCompleted: 0
        };

        this.taskTemplates = [
            {
                name: "Brainstorming Session",
                duration: "30分鐘",
                skills: ["brainstorming", "creative-thinking"],
                checklist: ["定義核心問題", "探索多種解決方案", "選擇最佳方案"]
            },
            {
                name: "Development Sprint",
                duration: "2小時",
                skills: ["test-driven-development", "systematic-debugging"],
                checklist: ["撰寫測試", "實作功能", "代碼審查", "文件更新"]
            }
        ];
    }

    // 更新任務狀態
    updateTaskStatus(taskId, status, output) {
        const task = this.aiTasks.find(t => t.id === taskId);
        if (task) {
            task.status = status;
            if (output) task.output = output;

            // 如果任務完成，記錄結束時間
            if (status === "completed") {
                task.endTime = new Date().toLocaleTimeString();
                task.duration = this.calculateDuration(task.startTime, task.endTime);

                // 檢查是否有依賴此任務的任務可以開始
                this.checkDependencies(taskId);
            }

            this.saveProgress();
        }
    }

    // 檢查任務依賴
    checkDependencies(completedTaskId) {
        this.aiTasks.forEach(task => {
            if (task.dependencies && task.dependencies.includes(completedTaskId)) {
                const allDependenciesComplete = task.dependencies.every(depId => {
                    const depTask = this.aiTasks.find(t => t.id === depId);
                    return depTask && depTask.status === "completed";
                });

                if (allDependenciesComplete) {
                    task.status = "ready";
                    this.notifyTaskReady(task.id);
                }
            }
        });
    }

    // 通知任務準備就緒
    notifyTaskReady(taskId) {
        const task = this.aiTasks.find(t => t.id === taskId);
        if (task && typeof Notification !== 'undefined') {
            new Notification('AI 任務準備就緒', {
                body: `任務 #${task.id}: ${task.name} 可以開始了`,
                icon: '✅'
            });
        }
    }

    // 計算持續時間
    calculateDuration(startTime, endTime) {
        const start = new Date(`2024-01-01 ${startTime}`);
        const end = new Date(`2024-01-01 ${endTime}`);
        const diffMs = end - start;
        const diffMins = Math.floor(diffMs / 60000);
        return `${diffMins}分鐘`;
    }

    // 更新階段進度
    updatePhaseProgress(phase, completed, total) {
        if (this.phaseProgress[phase]) {
            this.phaseProgress[phase].completed = completed;
            this.phaseProgress[phase].total = total;
            this.phaseProgress[phase].percentage = Math.round((completed / total) * 100);
            this.saveProgress();
        }
    }

    // 進入下一個階段
    advanceToNextPhase() {
        const currentPhaseNum = parseInt(this.currentPhase.split(" ")[1]);
        const nextPhaseNum = currentPhaseNum + 1;

        if (nextPhaseNum <= 5) {
            this.currentPhase = `Phase ${nextPhaseNum}`;

            // 檢查當前階段是否完成
            if (this.isCurrentPhaseComplete()) {
                this.updatePhaseProgress(this.currentPhase, 0, this.getPhaseTotalItems(this.currentPhase));
                return { success: true, phase: this.currentPhase };
            } else {
                return { success: false, reason: "當前階段未完成" };
            }
        } else {
            return { success: false, reason: "已經是最後階段" };
        }
    }

    // 檢查當前階段是否完成
    isCurrentPhaseComplete() {
        const phase = this.phaseProgress[this.currentPhase];
        return phase.completed === phase.total && phase.percentage === 100;
    }

    // 獲取階段總項目數
    getPhaseTotalItems(phase) {
        const totals = {
            "Phase 1": 9,
            "Phase 2": 8,
            "Phase 3": 10,
            "Phase 4": 6,
            "Phase 5": 5
        };
        return totals[phase] || 0;
    }

    // 記錄學習成果
    recordLearning(concept, score) {
        if (!this.learningMetrics.learnedConcepts.includes(concept)) {
            this.learningMetrics.learnedConcepts.push(concept);
        }

        if (score) {
            this.learningMetrics.satisfactionScore = Math.max(0, Math.min(100, score));
        }

        this.saveProgress();
    }

    // 獲取個人化建議
    getPersonalizedRecommendations() {
        const recommendations = [];

        // 根據使用者水平調整
        if (this.userLevel === "beginner") {
            recommendations.push({
                priority: "high",
                action: "從基礎功能開始",
                reason: "新手從簡單功能開始能快速建立信心",
                skills: ["brainstorming", "writing-plans"]
            });
        } else if (this.userLevel === "advanced") {
            recommendations.push({
                priority: "medium",
                action: "使用進階功能和自動化",
                reason: "你的經驗可以處理更複雜的工作流",
                skills: ["dispatching-parallel-agents", "finishing-a-development-branch"]
            });
        }

        // 根據使用歷史推薦
        const mostUsedSkills = this.getMostUsedSkills();
        mostUsedSkills.forEach(skill => {
            recommendations.push({
                priority: "medium",
                action: `繼續使用 ${skill}`,
                reason: `你已經成功使用 ${skill} ${this.getSkillUsageCount(skill)} 次`,
                skills: [skill]
            });
        });

        // 根據學習進度推薦
        if (this.learningMetrics.phasesCompleted === 1) {
            recommendations.push({
                priority: "high",
                action: "開始學習 Phase 2 規劃方法",
                reason: "你已完成構思階段，可以進入規劃階段",
                skills: ["writing-plans", "design-consultation"]
            });
        }

        return recommendations;
    }

    // 獲取最常用的 skills
    getMostUsedSkills() {
        // 模擬統計
        return ["brainstorming", "systematic-debugging"];
    }

    // 獲取 skill 使用次數
    getSkillUsageCount(skill) {
        // 模擬統計
        return Math.floor(Math.random() * 10) + 1;
    }

    // 適應性調整
    adaptToUser(userBehavior) {
        // 根據使用者行為調整建議
        if (userBehavior.prefersDetailedGuidance) {
            this.adaptationLevel = "adaptive";
        } else if (userBehavior.prefersQuickResults) {
            this.adaptationLevel = "intelligent";
        }

        // 調整使用者水平評估
        if (userBehavior.showsAdvancedKnowledge) {
            this.userLevel = "advanced";
        } else if (userBehavior.showsBeginnerPatterns) {
            this.userLevel = "beginner";
        }
    }

    // 產生進度報告
    generateProgressReport() {
        const report = {
            timestamp: new Date().toISOString(),
            currentPhase: this.currentPhase,
            overallProgress: this.calculateOverallProgress(),
            phaseProgress: this.phaseProgress,
            aiTasks: this.aiTasks,
            learningMetrics: this.learningMetrics,
            recommendations: this.getPersonalizedRecommendations()
        };

        return report;
    }

    // 計算整體進度
    calculateOverallProgress() {
        let totalCompleted = 0;
        let totalItems = 0;

        Object.values(this.phaseProgress).forEach(phase => {
            totalCompleted += phase.completed;
            totalItems += phase.total;
        });

        return Math.round((totalCompleted / totalItems) * 100);
    }

    // 保存進度到 localStorage
    saveProgress() {
        try {
            const progressData = {
                currentPhase: this.currentPhase,
                phaseProgress: this.phaseProgress,
                aiTasks: this.aiTasks,
                learningMetrics: this.learningMetrics,
                userLevel: this.userLevel,
                adaptationLevel: this.adaptationLevel,
                lastUpdated: new Date().toISOString()
            };

            localStorage.setItem('skillsAssistantProgress', JSON.stringify(progressData));
            console.log('✅ 進度已保存');
        } catch (error) {
            console.error('❌ 保存進度失敗:', error);
        }
    }

    // 從 localStorage 載入進度
    loadProgress() {
        try {
            const savedData = localStorage.getItem('skillsAssistantProgress');
            if (savedData) {
                const progressData = JSON.parse(savedData);

                this.currentPhase = progressData.currentPhase || this.currentPhase;
                this.phaseProgress = progressData.phaseProgress || this.phaseProgress;
                this.aiTasks = progressData.aiTasks || this.aiTasks;
                this.learningMetrics = progressData.learningMetrics || this.learningMetrics;
                this.userLevel = progressData.userLevel || this.userLevel;
                this.adaptationLevel = progressData.adaptationLevel || this.adaptationLevel;

                console.log('✅ 進度已載入');
                return true;
            }
        } catch (error) {
            console.error('❌ 載入進度失敗:', error);
            return false;
        }
        return false;
    }

    // 匯出進度報告
    exportProgressReport() {
        const report = this.generateProgressReport();

        const reportText = `
Skills 學習助手 - 專案進度報告
═══════════════════════════════════════════
報告時間: ${report.timestamp}

🎯 當前階段: ${report.currentPhase}
📊 整體進度: ${report.overallProgress}%

📋 各階段進度:
${Object.entries(report.phaseProgress).map(([phase, data]) =>
    `${phase}: ${data.completed}/${data.total} (${data.percentage}%)`
).join('\n')}

🤖 AI 任務狀態:
${report.aiTasks.map(task =>
    `任務 #${task.id}: ${task.name} - ${task.status}`
).join('\n')}

🎓 學習指標:
- 完成階段: ${report.learningMetrics.phasesCompleted}/${report.learningMetrics.totalPhases}
- 使用次數: ${report.learningMetrics.skillsUsed}
- 滿意度: ${report.learningMetrics.satisfactionScore}%

💡 個人化建議:
${report.recommendations.map((rec, i) =>
    `${i + 1}. ${rec.action} (優先級: ${rec.priority})`
).join('\n')}
        `;

        // 創建下載
        const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `skills-progress-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        console.log('✅ 進度報告已匯出');
    }

    // === Enhanced Features ===

    // GitHub Integration
    configureGitHub(username, repo, token) {
        this.githubConfig = {
            username,
            repo,
            token
        };
        this.saveProgress();
        console.log('✅ GitHub 配置已保存');
    }

    async createGitHubIssue(task) {
        if (!this.githubConfig.token || !this.githubConfig.repo) {
            console.error('❌ GitHub 未配置');
            return null;
        }

        try {
            const issueData = {
                title: `Task: ${task.name}`,
                body: `## Task Details\n\n` +
                      `**Status**: ${task.status}\n` +
                      `**Progress**: ${task.progress || 0}%\n` +
                      `**Output**: ${task.output || 'N/A'}\n\n` +
                      `## Dependencies\n\n` +
                      `${task.dependencies ? task.dependencies.map(depId => `Task #${depId}`).join(', ') : 'None'}`,
                labels: [task.status, 'skills-assistant']
            };

            const response = await fetch(`https://api.github.com/repos/${this.githubConfig.username}/${this.githubConfig.repo}/issues`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.githubConfig.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(issueData)
            });

            if (response.ok) {
                const issue = await response.json();
                console.log(`✅ GitHub Issue created: #${issue.number}`);
                return issue;
            } else {
                throw new Error('GitHub API request failed');
            }
        } catch (error) {
            console.error('❌ Failed to create GitHub Issue:', error);
            return null;
        }
    }

    async syncTasksWithGitHub() {
        if (!this.githubConfig.token) {
            console.log('ℹ️ GitHub 未配置，跳過同步');
            return;
        }

        console.log('🔄 正在同步任務到 GitHub...');
        for (const task of this.aiTasks) {
            if (task.status !== 'completed' && !task.githubIssue) {
                const issue = await this.createGitHubIssue(task);
                if (issue) {
                    task.githubIssue = {
                        number: issue.number,
                        url: issue.html_url
                    };
                }
            }
        }
        this.saveProgress();
    }

    // Pomodoro Timer
    startPomodoro(taskId) {
        const task = this.aiTasks.find(t => t.id === taskId);
        if (!task) {
            console.error('❌ Task not found');
            return;
        }

        if (this.pomodoroTimer.isActive) {
            console.log('⚠️ Timer already running');
            return;
        }

        this.pomodoroTimer.isActive = true;
        this.pomodoroTimer.currentTask = taskId;
        this.pomodoroTimer.timeRemaining = this.pomodoroTimer.duration;

        console.log(`🍅 Pomodoro started for task: ${task.name}`);

        this.pomodoroInterval = setInterval(() => {
            this.pomodoroTimer.timeRemaining--;

            if (this.pomodoroTimer.timeRemaining <= 0) {
                this.completePomodoroSession();
            }

            // Auto-save every minute
            if (this.pomodoroTimer.timeRemaining % 60 === 0) {
                this.saveProgress();
            }
        }, 1000);
    }

    pausePomodoro() {
        if (this.pomodoroInterval) {
            clearInterval(this.pomodoroInterval);
            this.pomodoroTimer.isActive = false;
            console.log('⏸️ Pomodoro paused');
        }
    }

    resumePomodoro() {
        if (this.pomodoroTimer.currentTask && !this.pomodoroTimer.isActive) {
            this.pomodoroTimer.isActive = true;
            this.pomodoroInterval = setInterval(() => {
                this.pomodoroTimer.timeRemaining--;

                if (this.pomodoroTimer.timeRemaining <= 0) {
                    this.completePomodoroSession();
                }
            }, 1000);
            console.log('▶️ Pomodoro resumed');
        }
    }

    completePomodoroSession() {
        clearInterval(this.pomodoroInterval);
        this.pomodoroTimer.isActive = false;
        this.pomodoroTimer.sessionsCompleted++;

        console.log(`🎉 Pomodoro session completed! Total sessions: ${this.pomodoroTimer.sessionsCompleted}`);

        // Start break time
        setTimeout(() => {
            console.log('☕ Break time! Take 5 minutes to rest.');
            this.pomodoroTimer.timeRemaining = this.pomodoroTimer.breakTime;
        }, 1000);
    }

    getPomodoroStatus() {
        const minutes = Math.floor(this.pomodoroTimer.timeRemaining / 60);
        const seconds = this.pomodoroTimer.timeRemaining % 60;
        return {
            isActive: this.pomodoroTimer.isActive,
            currentTask: this.pomodoroTimer.currentTask,
            timeRemaining: `${minutes}:${seconds.toString().padStart(2, '0')}`,
            sessionsCompleted: this.pomodoroTimer.sessionsCompleted
        };
    }

    // Task Notes System
    addTaskNote(taskId, note) {
        const task = this.aiTasks.find(t => t.id === taskId);
        if (task) {
            if (!task.notes) {
                task.notes = [];
            }
            task.notes.push({
                content: note,
                timestamp: new Date().toISOString()
            });
            this.saveProgress();
            console.log(`📝 Note added to task #${taskId}`);
        }
    }

    getTaskNotes(taskId) {
        const task = this.aiTasks.find(t => t.id === taskId);
        return task ? task.notes || [] : [];
    }

    // Task Templates
    createTaskFromTemplate(templateName, customDetails = {}) {
        const template = this.taskTemplates.find(t => t.name === templateName);
        if (!template) {
            console.error('❌ Template not found');
            return null;
        }

        const newTask = {
            id: this.aiTasks.length + 1,
            name: customDetails.name || template.name,
            status: 'pending',
            startTime: null,
            endTime: null,
            duration: template.duration,
            output: null,
            skills: template.skills,
            checklist: template.checklist.map(item => ({ item, completed: false })),
            notes: [],
            progress: 0,
            ...customDetails
        };

        this.aiTasks.push(newTask);
        this.saveProgress();
        console.log(`✅ Task created from template: ${templateName}`);
        return newTask;
    }

    getAvailableTemplates() {
        return this.taskTemplates;
    }

    // Task Dependency Visualization
    getDependencyGraph() {
        const graph = {
            nodes: this.aiTasks.map(task => ({
                id: task.id,
                name: task.name,
                status: task.status
            })),
            edges: []
        };

        this.aiTasks.forEach(task => {
            if (task.dependencies) {
                task.dependencies.forEach(depId => {
                    graph.edges.push({
                        from: depId,
                        to: task.id
                    });
                });
            }
        });

        return graph;
    }

    // Automatic Progress Detection
    detectProgressFromFiles(filePatterns) {
        // This would integrate with a file watcher
        console.log('🔍 Detecting progress from file patterns:', filePatterns);

        // Mock implementation - in real use, this would check file timestamps
        const detectedChanges = filePatterns.map(pattern => ({
            pattern,
            lastModified: new Date(),
            status: 'modified'
        }));

        return detectedChanges;
    }

    // Skill Usage Statistics
    getSkillUsageStats() {
        const skillStats = {};

        this.aiTasks.forEach(task => {
            if (task.skills) {
                task.skills.forEach(skill => {
                    if (!skillStats[skill]) {
                        skillStats[skill] = {
                            count: 0,
                            successRate: 0,
                            lastUsed: null
                        };
                    }
                    skillStats[skill].count++;
                    if (task.status === 'completed') {
                        skillStats[skill].successRate++;
                    }
                    skillStats[skill].lastUsed = task.endTime || new Date().toISOString();
                });
            }
        });

        // Calculate success rates
        Object.keys(skillStats).forEach(skill => {
            const totalTasks = this.aiTasks.filter(t => t.skills && t.skills.includes(skill)).length;
            const completedTasks = this.aiTasks.filter(t =>
                t.skills && t.skills.includes(skill) && t.status === 'completed'
            ).length;
            skillStats[skill].successRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0;
        });

        return skillStats;
    }

    // Advanced Personalization
    personalizeForUser() {
        const recommendations = [];

        // Based on skill usage patterns
        const skillStats = this.getSkillUsageStats();
        const mostUsedSkills = Object.entries(skillStats)
            .sort(([,a], [,b]) => b.count - a.count)
            .slice(0, 3);

        mostUsedSkills.forEach(([skill, stats]) => {
            recommendations.push({
                type: 'skill_optimization',
                message: `Continue using ${skill} - ${stats.successRate}% success rate`,
                priority: 'medium'
            });
        });

        // Based on learning progress
        if (this.learningMetrics.phasesCompleted === 1 && this.userLevel === 'beginner') {
            recommendations.push({
                type: 'level_progression',
                message: 'Ready to advance to intermediate features',
                priority: 'high'
            });
        }

        // Based on task completion patterns
        const completionRate = this.aiTasks.filter(t => t.status === 'completed').length / this.aiTasks.length;
        if (completionRate > 0.8 && this.userLevel === 'intermediate') {
            recommendations.push({
                type: 'level_progression',
                message: 'Excellent progress! Consider advanced features',
                priority: 'high'
            });
        }

        return recommendations;
    }
}

// 全域實例
const skillsTracker = new SkillsProgressTracker();

// 頁面載入時嘗試載入進度
document.addEventListener('DOMContentLoaded', () => {
    skillsTracker.loadProgress();

    // 設置自動保存（每30秒）
    setInterval(() => {
        skillsTracker.saveProgress();
    }, 30000);
});

// 暴露給全域使用
window.skillsTracker = skillsTracker;
window.SkillsProgressTracker = SkillsProgressTracker;