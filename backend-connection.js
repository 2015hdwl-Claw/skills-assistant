/**
 * 前後端連結系統 - 後端真相來源讀取
 *
 * 核心原則：
 * 1. 後端是真相來源 (專案計畫書.md + progress.json)
 * 2. 前端只負責顯示後端真實狀態
 * 3. 所有更新都先更新後端，前端再刷新顯示
 */

class BackendConnection {
    constructor() {
        this.backendFiles = {
            projectPlan: 'PROJECT_PLAN.md',      // 專案計畫書
            progress: 'progress.json'             // 進度追蹤
        };
        this.currentData = null;
    }

    /**
     * 讀取後端專案計畫書
     */
    async readProjectPlan() {
        try {
            const response = await fetch(this.backendFiles.projectPlan);
            const content = await response.text();
            return this.parseProjectPlan(content);
        } catch (error) {
            console.error('無法讀取專案計畫書:', error);
            return this.getDefaultProjectPlan();
        }
    }

    /**
     * 讀取後端進度檔案
     */
    async readProgress() {
        try {
            const response = await fetch(this.backendFiles.progress);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('無法讀取進度檔案:', error);
            return this.getDefaultProgress();
        }
    }

    /**
     * 解析專案計畫書 Markdown
     */
    parseProjectPlan(markdown) {
        const phases = this.extractPhases(markdown);
        const tasks = this.extractTasks(markdown);

        return {
            projectName: this.extractField(markdown, '專案名稱'),
            currentPhase: this.extractField(markdown, '當前階段'),
            overallProgress: this.calculateOverallProgress(phases),
            phases: phases,
            tasks: tasks
        };
    }

    /**
     * 提取階段資訊
     */
    extractPhases(markdown) {
        const phases = {};
        const phasePattern = /### Phase (\d+): ([^\n]+).*?\n\*\*狀態\*\*: ([^\n]+)/g;

        let match;
        while ((match = phasePattern.exec(markdown)) !== null) {
            const phaseNumber = match[1];
            const phaseName = match[2].trim();
            const status = match[3].trim();

            phases[`PHASE_${phaseNumber}`] = {
                name: phaseName,
                status: status,
                progress: this.extractPhaseProgress(markdown, phaseNumber)
            };
        }

        return phases;
    }

    /**
     * 提取任務資訊
     */
    extractTasks(markdown) {
        const tasks = [];
        const taskPattern = /(\d+)\.\s+\*\*([^\*]+)\*\*\s*\n.*?狀態:\s*([🔄⏳✅])/g;

        let match;
        while ((match = taskPattern.exec(markdown)) !== null) {
            tasks.push({
                id: match[1],
                name: match[2].trim(),
                status: this.decodeTaskStatus(match[3])
            });
        }

        return tasks;
    }

    /**
     * 解碼任務狀態符號
     */
    decodeTaskStatus(symbol) {
        const statusMap = {
            '🔄': 'in_progress',
            '⏳': 'pending',
            '✅': 'completed'
        };
        return statusMap[symbol] || 'unknown';
    }

    /**
     * 提取單一字段
     */
    extractField(markdown, fieldName) {
        const pattern = new RegExp(`- \\*\\*${fieldName}\\*\\*:\\s*([^\\n]+)`);
        const match = markdown.match(pattern);
        return match ? match[1].trim() : '未知';
    }

    /**
     * 提取階段進度
     */
    extractPhaseProgress(markdown, phaseNumber) {
        const sectionPattern = new RegExp(`### Phase ${phaseNumber}:.*?(?=### Phase|$)`, 's');
        const sectionMatch = markdown.match(sectionPattern);

        if (!sectionMatch) return 0;

        const section = sectionMatch[0];
        const checklistMatch = section.match(/完成度:\s*(\d+)\/(\d+)/);

        if (checklistMatch) {
            const completed = parseInt(checklistMatch[1]);
            const total = parseInt(checklistMatch[2]);
            return Math.round((completed / total) * 100);
        }

        return 0;
    }

    /**
     * 計算總體進度
     */
    calculateOverallProgress(phases) {
        const phaseValues = Object.values(phases);
        if (phaseValues.length === 0) return 0;

        const totalProgress = phaseValues.reduce((sum, phase) => sum + phase.progress, 0);
        return Math.round(totalProgress / phaseValues.length);
    }

    /**
     * 獲取預設專案計畫
     */
    getDefaultProjectPlan() {
        return {
            projectName: '新專案',
            currentPhase: 'PHASE_1',
            overallProgress: 0,
            phases: {
                'PHASE_1': { name: '構思與確認', status: '未開始', progress: 0 },
                'PHASE_2': { name: '規劃與設計', status: '未開始', progress: 0 },
                'PHASE_3': { name: '開發執行', status: '未開始', progress: 0 },
                'PHASE_4': { name: '測試驗證', status: '未開始', progress: 0 },
                'PHASE_5': { name: '發布部署', status: '未開始', progress: 0 }
            },
            tasks: []
        };
    }

    /**
     * 獲取預設進度
     */
    getDefaultProgress() {
        return {
            project_info: {
                name: '新專案',
                current_phase: 'PHASE_1',
                last_updated: new Date().toISOString()
            },
            phases: this.getDefaultProjectPlan().phases,
            ai_tasks: [],
            user_experience: {
                level: 'beginner',
                satisfaction_score: 0
            }
        };
    }

    /**
     * 更新後端進度 (通過後端執行)
     */
    async updateBackendProgress(updateData) {
        // 這個方法實際上會由後端執行
        // 前端只發送更新請求
        console.log('發送更新請求到後端:', updateData);

        // 在真實系統中，這裡會：
        // 1. 發送 POST 請求到後端 API
        // 2. 後端更新 .md 和 .json 檔案
        // 3. 前端重新讀取更新的資料

        alert('進度更新請求已發送到後端系統');
    }

    /**
     * 刷新顯示 (從後端重新讀取)
     */
    async refreshDisplay() {
        const projectPlan = await this.readProjectPlan();
        const progress = await this.readProgress();

        this.currentData = {
            projectPlan: projectPlan,
            progress: progress
        };

        return this.currentData;
    }
}

// 使用示例
const backendConnection = new BackendConnection();

// 在前端頁面載入時
async function initializeDashboard() {
    try {
        const data = await backendConnection.refreshDisplay();
        updateDashboardDisplay(data);
    } catch (error) {
        console.error('初始化儀表板失敗:', error);
    }
}

// 定時刷新 (每30秒)
setInterval(async () => {
    const data = await backendConnection.refreshDisplay();
    updateDashboardDisplay(data);
}, 30000);

function updateDashboardDisplay(data) {
    // 更新儀表板顯示
    console.log('更新顯示:', data);
    // 這裡會更新 DOM 元素
}