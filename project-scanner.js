// Real Project Scanner for Skills Assistant Dashboard
// 掃描並讀取真實的專案進度資料

class RealProjectScanner {
    constructor() {
        this.projectsBasePath = 'C:/Users/ntpud/.claude/projects';
        this.projects = [];
    }

    // 掃描所有專案目錄
    async scanAllProjects() {
        console.log('🔍 開始掃描專案...');

        const projectTypes = [
            'admission-master',
            'social',
            'activity-master',
            'knowledge-master'
        ];

        const projects = [];

        // 首先嘗試使用實際存在的專案檔案
        const existingProjects = await this.discoverExistingProjects();
        console.log('📁 發現專案:', existingProjects);

        for (const projectName of existingProjects) {
            const projectData = await this.scanProject(projectName);
            if (projectData) {
                projects.push(projectData);
                console.log('✅ 成功載入專案:', projectData.displayName);
            }
        }

        // 如果沒有找到任何專案，使用示例資料
        if (projects.length === 0) {
            console.log('⚠️ 未找到真實專案，使用示例資料');
            return this.getSampleProjectData();
        }

        console.log(`🎉 專案掃描完成: ${projects.length} 個專案`);
        return projects;
    }

    // 發現實際存在的專案
    async discoverExistingProjects() {
        const projectTypes = [
            'admission-master',
            'social',
            'activity-master',
            'knowledge-master'
        ];

        const existingProjects = [];

        // 檢查當前目錄下的專案檔案
        for (const projectName of projectTypes) {
            const progressFile = `./${projectName}_PROGRESS.json`;

            try {
                // 嘗試檢查檔案是否存在
                const response = await fetch(progressFile, { method: 'HEAD' });
                if (response.ok) {
                    existingProjects.push(projectName);
                    console.log(`✅ 發現專案: ${projectName}`);
                } else {
                    console.log(`⏭️ 專案檔案不存在: ${projectName}`);
                }
            } catch (error) {
                // 無法訪問，跳過此專案
                console.log(`⏭️ 跳過專案: ${projectName} (無法訪問)`);
            }
        }

        return existingProjects;
    }

    // 掃描單個專案
    async scanProject(projectName) {
        // 使用當前目錄下的檔案（通過HTTP服務器）
        const progressFile = `./${projectName}_PROGRESS.json`;
        const planFile = `./${projectName}_YC_PLAN.md`;

        try {
            console.log(`🔍 開始掃描專案: ${projectName}`);

            // 嘗試讀取專案的進度檔案
            const progressData = await this.readProjectProgress(progressFile);
            if (!progressData) {
                console.log(`⚠️ 專案 ${projectName} 無有效的進度資料`);
                return null;
            }

            // 讀取專案計畫書
            const planData = await this.readProjectPlan(planFile);

            // 從進度資料中獲取正確的專案名稱
            const actualProjectName = progressData.project_info?.name || projectName;

            // 組合專案資料
            const projectData = {
                name: actualProjectName,
                displayName: this.getProjectDisplayName(actualProjectName),
                currentPhase: progressData.project_info.current_phase,
                progress: this.calculateOverallProgress(progressData),
                phases: this.extractPhaseData(progressData),
                lastUpdated: progressData.project_info.last_updated,
                planSummary: planData ? this.extractPlanSummary(planData) : null
            };

            console.log(`✅ 專案 ${projectName} 掃描完成:`, projectData.displayName);
            return projectData;

        } catch (error) {
            console.log(`❌ 無法讀取專案 ${projectName}:`, error.message);
            return null;
        }
    }


    // 讀取專案計畫書
    async readProjectPlan(projectPath) {
        const planFile = `${projectPath}/${this.getProjectNameFromPath(projectPath)}_YC_PLAN.md`;

        try {
            const response = await fetch(planFile);
            if (!response.ok) return null;
            const text = await response.text();
            return { content: text };
        } catch (error) {
            // 如果是file://協議，嘗試不同的方法
            return this.readLocalMdFile(planFile);
        }
    }

    // 讀取並標準化專案進度檔案
    async readProjectProgress(progressFile) {
        try {
            console.log(`🔍 嘗試讀取: ${progressFile}`);
            const response = await fetch(progressFile);
            if (!response.ok) {
                console.log(`❌ 無法讀取檔案: ${response.status}`);
                return null;
            }

            const rawData = await response.json();
            console.log(`✅ 成功讀取: ${progressFile}`);

            // 標準化格式
            return this.normalizeProgressData(rawData);

        } catch (error) {
            console.log(`❌ 讀取失敗: ${error.message}`);
            return null;
        }
    }

    // 標準化不同格式的進度資料
    normalizeProgressData(rawData) {
        // 檢查資料格式類型
        if (rawData.project_info && rawData.phases) {
            // admission-master 格式 (標準格式)
            console.log('📋 標準格式 (admission-master)');
            return rawData;
        }

        if (rawData.meta && rawData.phases) {
            // social 最新格式 (需要轉換)
            console.log('🔄 轉換 social 最新格式為標準格式');
            return this.convertSocialLatestFormat(rawData);
        }

        if (rawData.project_name && rawData.overall_progress) {
            // social 舊格式 (需要轉換)
            console.log('🔄 轉換 social 舊格式為標準格式');
            return this.convertSocialLegacyFormat(rawData);
        }

        console.warn('⚠️ 未知的資料格式');
        console.log('資料結構:', Object.keys(rawData));
        return null;
    }

    // 轉換 social 最新格式 (meta + phases)
    convertSocialLatestFormat(socialData) {
        console.log('🔄 轉換 social 最新格式...');

        // 建立 phase 映射
        const phaseMapping = {
            'phase_1': 'PHASE_1',
            'phase_2': 'PHASE_2',
            'phase_3': 'PHASE_3',
            'phase_4': 'PHASE_4',
            'phase_5': 'PHASE_5'
        };

        // 建立標準 phases 結構
        const phases = {};
        let currentPhase = 'PHASE_1';

        // 處理 meta.current_phase (數字轉換)
        if (socialData.meta?.current_phase) {
            const phaseNum = socialData.meta.current_phase;
            currentPhase = `PHASE_${phaseNum}`;
        }

        // 處理 phases
        if (socialData.phases) {
            Object.entries(socialData.phases).forEach(([key, phaseData]) => {
                if (key.startsWith('phase_') && typeof phaseData === 'object') {
                    const standardPhaseId = phaseMapping[key];
                    if (standardPhaseId) {
                        phases[standardPhaseId] = {
                            name: phaseData.name,
                            status: this.normalizeStatus(phaseData.status),
                            start_date: phaseData.start_date || null,
                            end_date: phaseData.completed_date || null,
                            progress_percentage: Math.round((phaseData.completion_percentage || 0) * 100),
                            checklist_completion: this.estimateChecklistFromPhase(phaseData)
                        };
                    }
                }
            });
        }

        // 如果 meta.current_phase 沒有對應的 phase (比如 Phase 6)，使用最後一個完成的 phase
        if (!phases[currentPhase]) {
            const phaseIds = Object.keys(phases).sort();
            if (phaseIds.length > 0) {
                currentPhase = phaseIds[phaseIds.length - 1];
            }
        }

        // 回傳標準格式
        return {
            project_info: {
                name: socialData.meta?.project_code || 'social',
                current_phase: currentPhase,
                start_date: socialData.phases?.phase_1?.start_date || null,
                last_updated: socialData.meta?.last_updated || new Date().toISOString()
            },
            phases: phases
        };
    }

    // 轉換 social 舊格式 (project_name + overall_progress)
    convertSocialLegacyFormat(socialData) {
        console.log('🔄 轉換 social 舊格式...');

        // 建立 phase 映射
        const phaseMapping = {
            'phase_1': 'PHASE_1',
            'phase_2': 'PHASE_2',
            'phase_3': 'PHASE_3',
            'phase_4': 'PHASE_4',
            'phase_5': 'PHASE_5'
        };

        // 建立標準 phases 結構
        const phases = {};
        let currentPhase = 'PHASE_1';

        Object.entries(socialData.overall_progress).forEach(([key, phaseData]) => {
            if (key.startsWith('phase_') && typeof phaseData === 'object') {
                const standardPhaseId = phaseMapping[key];
                if (standardPhaseId) {
                    phases[standardPhaseId] = {
                        name: phaseData.name,
                        status: this.normalizeStatus(phaseData.status),
                        start_date: phaseData.start_date || null,
                        end_date: phaseData.end_date || null,
                        progress_percentage: phaseData.progress_percentage || 0,
                        checklist_completion: this.estimateChecklistFromPhase(phaseData)
                    };
                }
            }
        });

        // 回傳標準格式
        return {
            project_info: {
                name: socialData.project_code || 'unknown',
                current_phase: currentPhase,
                start_date: socialData.overall_progress.phase_1?.start_date || null,
                last_updated: socialData.last_updated || new Date().toISOString()
            },
            phases: phases
        };
    }

    // 轉換 social 格式為標準格式
    convertSocialFormat(socialData) {
        // 建立 phase 映射
        const phaseMapping = {
            'phase_1': 'PHASE_1',
            'phase_2': 'PHASE_2',
            'phase_3': 'PHASE_3',
            'phase_4': 'PHASE_4',
            'phase_5': 'PHASE_5'
        };

        // 建立標準 phases 結構
        const phases = {};
        let currentPhase = 'PHASE_1'; // 預設值

        Object.entries(socialData.overall_progress).forEach(([key, phaseData]) => {
            if (key.startsWith('phase_') && typeof phaseData === 'object') {
                const standardPhaseId = phaseMapping[key];
                if (standardPhaseId) {
                    // 確定當前階段 - 優先使用 socialData.current_phase
                    if (phaseData.status === 'in_progress') {
                        currentPhase = standardPhaseId;
                    }

                    phases[standardPhaseId] = {
                        name: phaseData.name,
                        status: this.normalizeStatus(phaseData.status),
                        start_date: phaseData.start_date || null,
                        end_date: phaseData.end_date || null,
                        progress_percentage: phaseData.progress_percentage || 0,
                        checklist_completion: this.estimateChecklistFromPhase(phaseData)
                    };
                }
            }
        });

        // 嘗試從 socialData.current_phase 轉換正確的階段ID
        // 但優先使用狀態為 'in_progress' 的階段
        let foundInProgress = false;
        Object.entries(socialData.overall_progress).forEach(([key, phaseData]) => {
            if (key.startsWith('phase_') && typeof phaseData === 'object') {
                if (phaseData.status === 'in_progress') {
                    const standardPhaseId = phaseMapping[key];
                    if (standardPhaseId) {
                        currentPhase = standardPhaseId;
                        foundInProgress = true;
                    }
                }
            }
        });

        // 只有在沒有找到 'in_progress' 階段時才使用 socialData.current_phase
        if (!foundInProgress && socialData.current_phase) {
            const socialPhaseMatch = socialData.current_phase.toLowerCase().replace('phase', 'phase_');
            const standardPhase = phaseMapping[socialPhaseMatch];
            if (standardPhase) {
                currentPhase = standardPhase;
            }
        }

        // 回傳標準格式
        return {
            project_info: {
                name: socialData.project_code || 'unknown',
                current_phase: currentPhase,
                start_date: socialData.overall_progress.phase_1?.start_date || null,
                last_updated: socialData.last_updated || new Date().toISOString()
            },
            phases: phases
        };
    }

    // 標準化狀態值
    normalizeStatus(status) {
        const statusMap = {
            'completed': 'completed',
            'in_progress': 'in_progress',
            'pending': 'not_started',
            'design_phase': 'in_progress',
            'planning': 'not_started'
        };
        return statusMap[status] || status;
    }

    // 估算檢核表完成度
    estimateChecklistFromPhase(phaseData) {
        if (phaseData.completed_tasks && phaseData.pending_tasks) {
            const completed = phaseData.completed_tasks.length;
            const pending = phaseData.pending_tasks.length;
            return `${completed}/${completed + pending}`;
        }
        return '0/0';
    }

    // 獲取專案顯示名稱
    getProjectDisplayName(projectName) {
        const displayNames = {
            'admission-master': '升學大師',
            'social': '社群經營大師',
            'social-master': '社群經營大師',
            'activity-master': '活動大師',
            'knowledge-master': '知識大師'
        };
        return displayNames[projectName] || projectName;
    }

    // 計算整體進度
    calculateOverallProgress(progressData) {
        const phases = Object.values(progressData.phases);
        const totalProgress = phases.reduce((sum, phase) => sum + (phase.progress_percentage || 0), 0);
        return Math.round(totalProgress / phases.length);
    }

    // 提取階段資料
    extractPhaseData(progressData) {
        return Object.entries(progressData.phases).map(([phaseId, phaseData]) => ({
            id: phaseId,
            name: phaseData.name,
            status: phaseData.status,
            progress: phaseData.progress_percentage || 0,
            checklist: `${phaseData.checklist_completion || '0/0'}`
        }));
    }

    // 提取計畫摘要
    extractPlanSummary(planData) {
        if (!planData || !planData.content) return null;

        const content = planData.content;
        const lines = content.split('\n');

        // 尋找執行摘要
        const summaryStart = lines.findIndex(line => line.includes('執行摘要'));
        if (summaryStart >= 0) {
            const summaryLines = [];
            for (let i = summaryStart + 1; i < Math.min(summaryStart + 10, lines.length); i++) {
                if (lines[i].trim() && !lines[i].startsWith('#')) {
                    summaryLines.push(lines[i].trim());
                }
            }
            return summaryLines.join(' ').substring(0, 200) + '...';
        }

        return '專案計畫文件';
    }

    // 讀取本地JSON檔案（用於file://協議）
    async readLocalJsonFile(filePath) {
        try {
            // 在瀏覽器環境中，我們無法直接讀取本地檔案
            // 這裡返回示例資料，實際使用時需要後端支援
            console.log(`嘗試讀取本地檔案: ${filePath}`);
            return null;
        } catch (error) {
            return null;
        }
    }

    // 讀取本地MD檔案（用於file://協議）
    async readLocalMdFile(filePath) {
        try {
            // 在瀏覽器環境中，我們無法直接讀取本地檔案
            console.log(`嘗試讀取本地檔案: ${filePath}`);
            return null;
        } catch (error) {
            return null;
        }
    }

    // 獲取示例專案資料（當無法讀取真實檔案時）
    getSampleProjectData() {
        return [
            {
                name: 'admission-master',
                displayName: '升學大師',
                currentPhase: 'PHASE_4',
                progress: 78,
                phases: [
                    { id: 'PHASE_1', name: '構思與確認', status: 'completed', progress: 100, checklist: '6/6' },
                    { id: 'PHASE_2', name: '規劃與設計', status: 'completed', progress: 100, checklist: '8/8' },
                    { id: 'PHASE_3', name: '開發執行', status: 'completed', progress: 100, checklist: '7/7' },
                    { id: 'PHASE_4', name: '成長與驗證', status: 'in_progress', progress: 90, checklist: '6/7' },
                    { id: 'PHASE_5', name: '擴展與規模', status: 'not_started', progress: 0, checklist: '0/7' }
                ],
                lastUpdated: '2026-05-02T23:30:00.000Z',
                planSummary: '升學準備的連結器 + 商管群智能匹配系統...'
            }
        ];
    }
}

// 導出供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealProjectScanner;
}