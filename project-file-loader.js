// 專案檔案手動載入器 - 解決瀏覽器安全限制

class ProjectFileLoader {
    constructor() {
        this.loadedProjects = [];
    }

    // 創建檔案選擇器
    createFileSelector() {
        const container = document.createElement('div');
        container.className = 'file-upload-container';
        container.innerHTML = `
            <div class="upload-section">
                <h3>📁 選擇專案進度檔案</h3>
                <p>由於瀏覽器安全限制，請手動選擇專案的 JSON 檔案：</p>
                <input type="file" id="projectFileInput" accept=".json" multiple>
                <button onclick="loadSelectedFiles()" class="upload-btn">載入專案檔案</button>
                <div class="file-help">
                    <strong>支援的檔案：</strong>
                    <ul>
                        <li>admission-master_PROGRESS.json</li>
                        <li>social_PROGRESS.json</li>
                        <li>activity-master_PROGRESS.json</li>
                    </ul>
                </div>
            </div>
        `;

        return container;
    }

    // 處理檔案選擇
    async handleFileSelect(fileInput) {
        const files = fileInput.files;
        if (files.length === 0) {
            alert('請選擇至少一個專案檔案');
            return [];
        }

        const projects = [];

        for (const file of files) {
            try {
                const projectData = await this.parseProjectFile(file);
                if (projectData) {
                    projects.push(projectData);
                }
            } catch (error) {
                console.error(`❌ 無法載入檔案 ${file.name}:`, error);
                alert(`無法載入檔案 ${file.name}: ${error.message}`);
            }
        }

        return projects;
    }

    // 解析專案檔案
    async parseProjectFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const projectData = this.extractProjectData(file.name, data);
                    resolve(projectData);
                } catch (error) {
                    reject(new Error(`JSON 解析失敗: ${error.message}`));
                }
            };

            reader.onerror = () => {
                reject(new Error('檔案讀取失敗'));
            };

            reader.readAsText(file);
        });
    }

    // 從檔案名和資料中提取專案資訊
    extractProjectData(filename, data) {
        // 從檔案名提取專案名稱
        const projectNameMatch = filename.match(/^(.+)_PROGRESS\.json$/);
        if (!projectNameMatch) {
            throw new Error('檔案命名格式不符，應為 {PROJECT_NAME}_PROGRESS.json');
        }

        const projectName = projectNameMatch[1];

        // 標準化資料格式
        const normalizedData = this.normalizeProgressData(data);
        if (!normalizedData) {
            throw new Error('無法解析專案資料格式');
        }

        // 計算整體進度
        const phases = Object.values(normalizedData.phases);
        const totalProgress = phases.reduce((sum, phase) => sum + (phase.progress_percentage || 0), 0);
        const overallProgress = Math.round(totalProgress / phases.length);

        return {
            name: normalizedData.project_info.name || projectName,
            displayName: this.getProjectDisplayName(normalizedData.project_info.name || projectName),
            currentPhase: normalizedData.project_info.current_phase,
            progress: overallProgress,
            phases: this.extractPhaseData(normalizedData),
            lastUpdated: normalizedData.project_info.last_updated,
            source: 'file_upload',
            fileName: filename
        };
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

    // 提取階段資料
    extractPhaseData(progressData) {
        return Object.entries(progressData.phases).map(([phaseId, phaseData]) => ({
            id: phaseId,
            name: phaseData.name,
            status: phaseData.status,
            progress: phaseData.progress_percentage || 0,
            checklist: phaseData.checklist_completion || '0/0'
        }));
    }

    // 獲取專案顯示名稱
    getProjectDisplayName(projectName) {
        const displayNames = {
            'admission-master': '升學大師',
            'social': '社群經營大師',
            'activity-master': '活動大師',
            'knowledge-master': '知識大師'
        };
        return displayNames[projectName] || projectName;
    }

    // 創建檔案選擇對話框
    showFileSelector(callback) {
        const modal = document.createElement('div');
        modal.className = 'file-upload-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
        `;

        content.innerHTML = `
            <h2>📁 載入專案檔案</h2>
            <p>請選擇專案的進度檔案 (_PROGRESS.json)：</p>
            <input type="file" id="modalFileInput" accept=".json" multiple style="width: 100%; margin: 15px 0;">
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="cancelBtn" style="padding: 10px 20px; border: none; background: #6b7280; color: white; border-radius: 5px; cursor: pointer;">取消</button>
                <button id="loadBtn" style="padding: 10px 20px; border: none; background: #3b82f6; color: white; border-radius: 5px; cursor: pointer;">載入</button>
            </div>
            <div style="margin-top: 15px; font-size: 12px; color: #6b7280;">
                <strong>檔案位置範例：</strong><br>
                C:\\Users\\ntpud\\.claude\\projects\\admission-master\\admission-master_PROGRESS.json
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // 設置事件處理
        document.getElementById('cancelBtn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('loadBtn').addEventListener('click', async () => {
            const fileInput = document.getElementById('modalFileInput');
            const projects = await this.handleFileSelect(fileInput);
            document.body.removeChild(modal);
            callback(projects);
        });
    }
}

// 導出供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectFileLoader;
}