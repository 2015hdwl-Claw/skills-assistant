// 全專案掃描器 - 掃描所有專案目錄並生成索引
const fs = require('fs');
const path = require('path');

const PROJECTS_BASE_PATH = 'C:\\Users\\ntpud\\.claude\\projects';
const OUTPUT_FILE = path.join(__dirname, 'all-projects-index.json');

console.log('🔍 開始掃描所有專案...\n');

class AllProjectsScanner {
    constructor() {
        this.projectsFound = [];
        this.scannedDirectories = [];
        this.errors = [];
    }

    // 主要掃描方法
    async scanAllProjects() {
        console.log('📁 掃描基礎路徑:', PROJECTS_BASE_PATH);

        try {
            // 1. 掃描所有標準化專案（直接在 projects 根目錄下）
            await this.scanStandardFormatProjects();

            // 2. 生成索引檔案
            await this.generateIndex();

            // 3. 顯示掃描結果
            this.displayResults();

        } catch (error) {
            console.error('❌ 掃描過程中發生錯誤:', error);
        }
    }

    // 掃描所有標準化專案（直接在 projects 根目錄下）
    async scanStandardFormatProjects() {
        console.log('\n📋 掃描標準化專案目錄...');

        const entries = fs.readdirSync(PROJECTS_BASE_PATH, { withFileTypes: true });

        const excludeDirs = [
            'skills-assistant',
            'c--Users-ntpud--claude-projects',
            '.next',
            '.vercel',
            'node_modules',
            'logs',
            'config',
            '.gstack',
            '.vscode',
            'docs'
        ];

        for (const entry of entries) {
            if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
                // 檢查是否有標準格式檔案
                const hasStandardFiles = this.checkStandardFiles(entry.name);
                if (hasStandardFiles) {
                    await this.scanStandardFormatProject(entry.name);
                } else {
                    console.log(`  ⏭️ ${entry.name} - 無標準格式檔案，跳過`);
                }
            }
        }
    }

    // 掃描標準化專案
    async scanStandardProject(basePath, projectName) {
        const projectPath = path.join(basePath, projectName);
        console.log(`  🔍 檢查標準專案: ${projectName}`);

        try {
            // 檢查標準化檔案
            const progressFile = path.join(projectPath, `${projectName}_PROGRESS.json`);
            const planFile = path.join(projectPath, `${projectName}_YC_PLAN.md`);
            const versionsFile = path.join(projectPath, `${projectName}_VERSIONS.json`);
            const readmeFile = path.join(projectPath, 'README.md');
            const claudeFile = path.join(projectPath, 'CLAUDE.md');

            if (!fs.existsSync(progressFile)) {
                console.log(`    ⏭️ 進度檔案不存在，跳過`);
                return;
            }

            // 讀取專案資料
            const progressData = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
            const planData = this.readProjectPlan(planFile);
            const versionsData = this.readVersions(versionsFile);
            const readmeData = this.readReadme(readmeFile);
            const claudeData = this.readClaude(claudeFile);

            // 提取專案資訊
            const projectInfo = this.extractProjectInfo({
                name: projectName,
                path: projectPath,
                type: 'standard-format',
                progressData,
                planData,
                versionsData,
                readmeData,
                claudeData
            });

            // 確定資料來源
            const sourceFiles = [];
            if (hasProgress) sourceFiles.push('progress');
            if (hasPlan) sourceFiles.push('plan');
            projectInfo.sourceFiles = sourceFiles;

            this.projectsFound.push(projectInfo);
            console.log(`    ✅ 成功載入標準專案: ${projectInfo.displayName}`);
            console.log(`       資料來源: ${sourceFiles.join(', ')}`);

        } catch (error) {
            console.log(`    ❌ 載入失敗: ${error.message}`);
            this.errors.push({ project: projectName, error: error.message });
        }
    }

    // 檢查是否有標準格式檔案
    checkStandardFiles(projectName) {
        const projectPath = path.join(PROJECTS_BASE_PATH, projectName);

        if (!fs.existsSync(projectPath)) {
            return false;
        }

        const entries = fs.readdirSync(projectPath);

        // 檢查是否有 XXX_PROGRESS.json 和 XXX_YC_PLAN.md 格式
        const hasProgressJson = entries.some(file =>
            file === `${projectName}_PROGRESS.json`
        );

        const hasPlanMd = entries.some(file =>
            file === `${projectName}_YC_PLAN.md`
        );

        return hasProgressJson || hasPlanMd;
    }

    // 掃描標準格式專案
    async scanStandardFormatProject(projectName) {
        const projectPath = path.join(PROJECTS_BASE_PATH, projectName);
        console.log(`  🔍 檢查標準格式專案: ${projectName}`);

        try {
            // 讀取標準格式檔案
            const progressFile = path.join(projectPath, `${projectName}_PROGRESS.json`);
            const planFile = path.join(projectPath, `${projectName}_YC_PLAN.md`);

            // 檢查檔案存在性
            const hasProgress = fs.existsSync(progressFile);
            const hasPlan = fs.existsSync(planFile);

            if (!hasProgress && !hasPlan) {
                console.log(`    ⏭️ 無標準格式檔案，跳過`);
                return;
            }

            // 讀取專案資料
            const progressData = hasProgress ? JSON.parse(fs.readFileSync(progressFile, 'utf8')) : null;
            const planData = hasPlan ? this.readProjectPlan(planFile) : null;

            // 如果兩個檔案都不存在，跳過
            if (!progressData && !planData) {
                console.log(`    ⏭️ 無法讀取專案資料，跳過`);
                return;
            }

            // 提取專案資訊
            const projectInfo = this.extractProjectInfo({
                name: projectName,
                path: projectPath,
                type: 'standard-format',
                progressData,
                planData,
                versionsData: null,
                readmeData: null,
                claudeData: null
            });

            // 確定資料來源
            const sourceFiles = [];
            if (hasProgress) sourceFiles.push('progress');
            if (hasPlan) sourceFiles.push('plan');
            projectInfo.sourceFiles = sourceFiles;

            this.projectsFound.push(projectInfo);
            console.log(`    ✅ 成功載入標準格式專案: ${projectInfo.displayName}`);
            console.log(`       資料來源: ${sourceFiles.join(', ')}`);

        } catch (error) {
            console.log(`    ❌ 載入失敗: ${error.message}`);
            this.errors.push({ project: projectName, error: error.message });
        }
    }

    // 讀取專案計畫
    readProjectPlan(filePath) {
        if (!fs.existsSync(filePath)) return null;

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return this.parseMarkdownPlan(content);
        } catch (error) {
            return null;
        }
    }

    // 解析 Markdown 計畫
    parseMarkdownPlan(content) {
        const lines = content.split('\n');

        return {
            rawContent: content,
            title: this.extractTitle(lines),
            description: this.extractDescription(content),
            phases: this.extractPhases(content),
            currentPhase: this.extractCurrentPhase(content)
        };
    }

    // 提取標題
    extractTitle(lines) {
        for (const line of lines) {
            if (line.startsWith('# ')) {
                return line.substring(2).trim();
            }
        }
        return '未命名專案';
    }

    // 提取描述
    extractDescription(content) {
        // 尋找專案概述或描述部分
        const overviewMatch = content.match(/## 專案概述[\s\S]*?(?=\n##|\n*$)/);
        if (overviewMatch) {
            return overviewMatch[0].substring(2).trim();
        }

        // 尋找第一段文字作為描述
        const firstParagraph = content.match(/^#\s+\S+\s*\n+([\s\S]*?)(?=\n#|\n*$)/);
        if (firstParagraph && firstParagraph[1].trim().length > 20) {
            return firstParagraph[1].trim();
        }

        return '無詳細描述';
    }

    // 提取階段資訊
    extractPhases(content) {
        const phases = [];
        const phaseRegex = /## Phase \d+:\s*([^\n]+)/g;
        let match;

        while ((match = phaseRegex.exec(content)) !== null) {
            phases.push({
                name: match[1].trim(),
                content: this.extractPhaseContent(content, match[0])
            });
        }

        return phases;
    }

    // 提取階段內容
    extractPhaseContent(content, phaseHeader) {
        const startIndex = content.indexOf(phaseHeader);
        const nextPhaseIndex = content.indexOf('\n## Phase ', startIndex + phaseHeader.length);

        if (nextPhaseIndex === -1) {
            return content.substring(startIndex + phaseHeader.length).trim();
        }

        return content.substring(startIndex + phaseHeader.length, nextPhaseIndex).trim();
    }

    // 提取當前階段
    extractCurrentPhase(content) {
        const currentPhaseMatch = content.match(/當前階段.*?:\s*(Phase \d+|PHASE_\d+)/i);
        return currentPhaseMatch ? currentPhaseMatch[1].toUpperCase() : null;
    }

    // 讀取版本資訊
    readVersions(filePath) {
        if (!fs.existsSync(filePath)) return null;

        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            return null;
        }
    }

    // 讀取 README
    readReadme(filePath) {
        if (!fs.existsSync(filePath)) return null;

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return {
                rawContent: content,
                title: this.extractTitle(content.split('\n')),
                description: this.extractDescription(content)
            };
        } catch (error) {
            return null;
        }
    }

    // 讀取 CLAUDE.md
    readClaude(filePath) {
        if (!fs.existsSync(filePath)) return null;

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return {
                rawContent: content,
                sections: this.extractClaudeSections(content)
            };
        } catch (error) {
            return null;
        }
    }

    // 提取 CLAUDE.md 區段
    extractClaudeSections(content) {
        const sections = [];
        const lines = content.split('\n');
        let currentSection = null;

        for (const line of lines) {
            if (line.startsWith('## ')) {
                if (currentSection) {
                    sections.push(currentSection);
                }
                currentSection = {
                    title: line.substring(3).trim(),
                    content: ''
                };
            } else if (currentSection) {
                currentSection.content += line + '\n';
            }
        }

        if (currentSection) {
            sections.push(currentSection);
        }

        return sections;
    }

    // 讀取通用檔案
    readGenericFile(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            return null;
        }
    }

    // 提取專案資訊
    extractProjectInfo(data) {
        const info = {
            id: data.name,
            name: data.name,
            displayName: this.getDisplayName(data.name),
            path: data.path,
            type: data.type,

            // 從進度資料提取
            currentPhase: null,
            progress: 0,
            phases: [],
            lastUpdated: null,

            // 從計畫資料提取
            description: null,
            plan: null,
            phasesFromPlan: [],

            // 從其他文檔提取
            readme: null,
            claude: null,
            versions: null,

            // 元資料
            sourceFiles: [],
            tags: [],
            status: 'unknown'
        };

        // 處理進度資料
        if (data.progressData) {
            // 檢查資料格式並相應處理
            if (data.progressData.project_info) {
                // 標準格式 (admission-master)
                info.currentPhase = data.progressData.project_info.current_phase;
                info.lastUpdated = data.progressData.project_info.last_updated;
                if (data.progressData.phases) {
                    info.phases = this.normalizePhases(data.progressData.phases);
                    info.progress = this.calculateProgress(info.phases);
                }
            } else if (data.progressData.meta) {
                // social 格式 (需要轉換)
                const converted = this.convertSocialFormat(data.progressData);
                info.currentPhase = converted.currentPhase;
                info.lastUpdated = converted.lastUpdated;
                info.phases = converted.phases;
                info.progress = this.calculateProgress(info.phases);
            } else if (data.progressData.current_phase) {
                // project-planning-master 格式
                const converted = this.convertPlanningMasterFormat(data.progressData);
                info.currentPhase = converted.currentPhase;
                info.lastUpdated = converted.lastUpdated;
                info.phases = converted.phases;
                info.progress = converted.progress;
            }
        }

        // 處理計畫資料
        if (data.planData) {
            info.description = data.planData.description;
            info.plan = data.planData;
            info.phasesFromPlan = data.planData.phases || [];
        }

        // 處理其他文檔
        if (data.readmeData) {
            info.readme = data.readmeData;
        }
        if (data.claudeData) {
            info.claude = data.claudeData;
        }
        if (data.versionsData) {
            info.versions = data.versionsData;
        }

        // 設置狀態
        info.status = this.determineStatus(info);

        return info;
    }

    // 獲取顯示名稱
    getDisplayName(name) {
        const displayNames = {
            'admission-master': '升學大師',
            'social': '社群經營大師',
            'social-master': '社群經營大師',
            'activity-master': '活動大師',
            'knowledge-master': '知識大師',
            'project-planning-master': '專案規劃大師',
            'direct-sales-master': '直銷大師',
            'venue-master': '活動大師',
            'community-master': '社群大師'
        };
        return displayNames[name] || name;
    }

    // 轉換 project-planning-master 格式為標準格式
    convertPlanningMasterFormat(planningData) {
        const phaseMapping = {
            'phase_1': 'PHASE_1',
            'phase_2': 'PHASE_2',
            'phase_3': 'PHASE_3',
            'phase_4': 'PHASE_4',
            'phase_5': 'PHASE_5'
        };

        const phases = [];

        // 處理 phases
        if (planningData.phases) {
            Object.entries(planningData.phases).forEach(([key, phaseData]) => {
                if (key.startsWith('phase_') && typeof phaseData === 'object') {
                    const standardPhaseId = phaseMapping[key];
                    if (standardPhaseId) {
                        phases.push({
                            id: standardPhaseId,
                            name: phaseData.name,
                            status: this.normalizeStatus(phaseData.status),
                            progress: this.parseProgress(phaseData.progress),
                            checklist: phaseData.tasks ? this.calculateChecklistFromTasks(phaseData.tasks) : '0/0'
                        });
                    }
                }
            });
        }

        return {
            currentPhase: planningData.current_phase || 'PHASE_1',
            lastUpdated: planningData.last_updated || new Date().toISOString(),
            phases: phases,
            progress: this.parseProgress(planningData.overall_progress)
        };
    }

    // 解析進度百分比
    parseProgress(progressString) {
        if (typeof progressString === 'number') return progressString;
        if (typeof progressString === 'string') {
            const match = progressString.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
        }
        return 0;
    }

    // 從任務計算檢核表
    calculateChecklistFromTasks(tasks) {
        if (!Array.isArray(tasks)) return '0/0';
        const completed = tasks.filter(t => t.status === 'completed').length;
        const total = tasks.length;
        return `${completed}/${total}`;
    }

    // 轉換 social 格式為標準格式
    convertSocialFormat(socialData) {
        const phaseMapping = {
            'phase_1': 'PHASE_1',
            'phase_2': 'PHASE_2',
            'phase_3': 'PHASE_3',
            'phase_4': 'PHASE_4',
            'phase_5': 'PHASE_5'
        };

        const phases = {};
        let currentPhase = 'PHASE_1';

        // 處理 meta.current_phase
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

        return {
            currentPhase: currentPhase,
            lastUpdated: socialData.meta?.last_updated || new Date().toISOString(),
            phases: this.normalizePhases(phases)
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

    // 標準化階段資料
    normalizePhases(phases) {
        return Object.entries(phases).map(([id, phase]) => ({
            id: id,
            name: phase.name,
            status: phase.status || 'unknown',
            progress: phase.progress_percentage || 0,
            checklist: phase.checklist_completion || '0/0'
        }));
    }

    // 計算進度
    calculateProgress(phases) {
        if (!phases || phases.length === 0) return 0;
        const totalProgress = phases.reduce((sum, phase) => sum + (phase.progress || 0), 0);
        return Math.round(totalProgress / phases.length);
    }

    // 決定狀態
    determineStatus(info) {
        if (info.progress >= 100) return 'completed';
        if (info.progress > 0) return 'in_progress';
        if (info.phasesFromPlan.length > 0) return 'planning';
        return 'unknown';
    }

    // 生成索引檔案
    async generateIndex() {
        console.log('\n📝 生成專案索引檔案...');

        // 精簡輸出：只保留儀表板需要的數據
        const slimProjects = this.projectsFound.map(p => ({
            id: p.id,
            name: p.name,
            displayName: p.displayName,
            type: p.type,
            currentPhase: p.currentPhase,
            progress: p.progress,
            phases: p.phases,
            lastUpdated: p.lastUpdated,
            description: p.description ? (typeof p.description === 'string' ? p.description : p.description.substring?.(0, 200)) : null,
            status: p.status,
            sourceFiles: p.sourceFiles || []
        }));

        const indexData = {
            generatedAt: new Date().toISOString(),
            totalProjects: slimProjects.length,
            projects: slimProjects,
            scanPath: PROJECTS_BASE_PATH
        };

        try {
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(indexData, null, 2), 'utf8');
            console.log(`✅ 索引檔案已生成: ${OUTPUT_FILE}`);
        } catch (error) {
            console.error(`❌ 生成索引檔案失敗: ${error.message}`);
        }
    }

    // 顯示結果
    displayResults() {
        console.log('\n📊 掃描結果摘要:');
        console.log(`  總專案數: ${this.projectsFound.length}`);
        console.log(`  錯誤數: ${this.errors.length}`);

        console.log('\n📋 發現的專案:');
        this.projectsFound.forEach(project => {
            console.log(`  • ${project.displayName} (${project.name})`);
            console.log(`    進度: ${project.progress}% | 狀態: ${project.status}`);
            console.log(`    當前階段: ${project.currentPhase || '未知'}`);
            console.log(`    資料來源: ${project.sourceFiles.join(', ')}`);
        });

        if (this.errors.length > 0) {
            console.log('\n⚠️ 錯誤:');
            this.errors.forEach(error => {
                console.log(`  • ${error.project}: ${error.error}`);
            });
        }

        console.log(`\n✅ 掃描完成！索引已儲存至: ${OUTPUT_FILE}`);
    }
}

// 執行掃描
const scanner = new AllProjectsScanner();
scanner.scanAllProjects().catch(console.error);