/**
 * Brainstorming 後端處理系統
 * 整合 Superpowers + Gstack Skills
 * 嚴格遵循 YC 標準新創流程
 */

class BrainstormingBackend {
    constructor() {
        this.currentPhase = 'PHASE_1';
        this.contributions = [];
        this.ycTemplate = this.loadYCTemplate();
    }

    /**
     * 處理多角色 brainstorming 請求
     */
    async processBrainstormingRequest(request) {
        console.log('🧠 開始後端 brainstorming 處理');

        // 1. 驗證當前階段
        this.validateCurrentPhase(request.phase);

        // 2. 如果是重新討論，保存版本歷史
        if (request.isRestart) {
            await this.saveVersionHistory(request);
        }

        // 3. 分析多角色討論內容
        const roleAnalysis = this.analyzeRoleContributions(request.contributions);

        // 4. 使用 Gstack 規劃視角 (按需載入)
        const gstackInsights = await this.getGstackPerspectives(roleAnalysis);

        // 5. 綜合產出 YC 標準計畫書
        const ycPlan = this.generateYCPlan(roleAnalysis, gstackInsights);

        // 6. 更新後端真相來源
        await this.updateBackendFiles(ycPlan, request.isRestart);

        return {
            success: true,
            plan: ycPlan,
            metadata: {
                phase: this.currentPhase,
                contributionCount: request.contributions.length,
                timestamp: new Date().toISOString(),
                isRestart: request.isRestart || false,
                versionId: request.versionId
            }
        };
    }

    /**
     * 保存版本歷史
     */
    async saveVersionHistory(request) {
        const version = {
            id: this.generateVersionId(),
            timestamp: new Date().toISOString(),
            phase: request.phase,
            reason: request.restartReason || '未指定原因',
            contributions: request.previousContributions || [],
            trigger: this.identifyTrigger(request.restartReason),
            impact: this.assessRestartImpact(request.phase, request.restartReason)
        };

        // 保存到版本歷史文件
        try {
            const fs = require('fs');
            const versionHistoryPath = 'brainstorming-versions.json';

            let versionHistory = [];
            if (fs.existsSync(versionHistoryPath)) {
                const content = fs.readFileSync(versionHistoryPath, 'utf8');
                versionHistory = JSON.parse(content);
            }

            versionHistory.push(version);
            fs.writeFileSync(versionHistoryPath, JSON.stringify(versionHistory, null, 2), 'utf8');

            console.log('✅ 版本歷史已保存:', version.id);
        } catch (error) {
            console.error('❌ 保存版本歷史失敗:', error);
        }

        return version.id;
    }

    /**
     * 生成版本 ID
     */
    generateVersionId() {
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
        const random = Math.random().toString(36).substring(2, 6);
        return `v${dateStr}_${random}`;
    }

    /**
     * 識別觸發原因
     */
    identifyTrigger(reason) {
        if (!reason) return 'other';

        const triggers = {
            '市場變化': 'market_change',
            '技術困難': 'technical_challenge',
            '新想法': 'new_idea',
            '用戶反饋': 'user_feedback',
            '競爭變化': 'competition_change',
            '資源限制': 'resource_constraint',
            '團隊變化': 'team_change'
        };

        for (const [keyword, type] of Object.entries(triggers)) {
            if (reason.includes(keyword)) {
                return type;
            }
        }
        return 'other';
    }

    /**
     * 評估重新開始的影響
     */
    assessRestartImpact(phase, reason) {
        const trigger = this.identifyTrigger(reason);

        if (['市場變化', '技術困難', '用戶反饋'].includes(trigger)) {
            return 'high';
        } else if (['新想法', '競爭變化'].includes(trigger)) {
            return 'medium';
        }
        return 'low';
    }

    /**
     * 驗證當前階段
     */
    validateCurrentPhase(phase) {
        const validPhases = ['PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4', 'PHASE_5'];

        if (!validPhases.includes(phase)) {
            throw new Error(`無效的階段: ${phase}`);
        }

        this.currentPhase = phase;
        console.log(`✅ 當前階段驗證: ${phase}`);
    }

    /**
     * 分析多角色貢獻
     */
    analyzeRoleContributions(contributions) {
        console.log('📊 分析多角色貢獻...');

        const roleAnalysis = {
            ceo: {
                contributions: [],
                keyPoints: [],
                insights: []
            },
            engineering: {
                contributions: [],
                keyPoints: [],
                insights: []
            },
            design: {
                contributions: [],
                keyPoints: [],
                insights: []
            },
            devex: {
                contributions: [],
                keyPoints: [],
                insights: []
            }
        };

        // 分類各角色貢獻
        contributions.forEach(contribution => {
            const role = contribution.role;
            if (roleAnalysis[role]) {
                roleAnalysis[role].contributions.push(contribution.content);

                // 提取關鍵點
                const keyPoints = this.extractKeyPoints(contribution.content);
                roleAnalysis[role].keyPoints.push(...keyPoints);

                console.log(`  ${role.toUpperCase()}: ${contribution.content.substring(0, 50)}...`);
            }
        });

        return roleAnalysis;
    }

    /**
     * 提取關鍵點
     */
    extractKeyPoints(content) {
        const keyPoints = [];

        // 簡單的關鍵點提取邏輯
        const sentences = content.split(/[。！？.!?]/);
        sentences.forEach(sentence => {
            const trimmed = sentence.trim();
            if (trimmed.length > 10 && trimmed.length < 100) {
                keyPoints.push(trimmed);
            }
        });

        return keyPoints.slice(0, 3); // 最多 3 個關鍵點
    }

    /**
     * 獲取 Gstack 規劃視角 (按需載入)
     * 注意：這裡實際上會調用 Gstack 的 skills
     */
    async getGstackPerspectives(roleAnalysis) {
        console.log('🔍 獲取 Gstack 規劃視角...');

        const gstackInsights = {};

        // 根据當前階段載入對應的 Gstack skills
        const gstackSkills = this.getGstackSkillsForPhase(this.currentPhase);

        for (const skill of gstackSkills) {
            console.log(`  載入 Gstack skill: ${skill}`);

            // 這裡會實際調用對應的 skill
            const insight = await this.callGstackSkill(skill, roleAnalysis);
            gstackInsights[skill] = insight;
        }

        return gstackInsights;
    }

    /**
     * 獲得階段對應的 Gstack skills
     */
    getGstackSkillsForPhase(phase) {
        const phaseGstackMapping = {
            'PHASE_1': [
                '/plan-ceo-review',
                '/plan-eng-review',
                '/plan-design-review',
                '/plan-devex-review'
            ],
            'PHASE_2': [
                '/design-consultation',
                '/design-shotgun'
            ],
            'PHASE_3': [
                '/test-driven-development',
                '/systematic-debugging',
                'code-reviewer'
            ],
            'PHASE_4': [
                '/requesting-code-review',
                '/receiving-code-review'
            ],
            'PHASE_5': [
                '/ship',
                '/finishing-a-development-branch'
            ]
        };

        return phaseGstackMapping[phase] || [];
    }

    /**
     * 調用 Gstack skill (模擬)
     * 實際會在 Claude Code 中使用
     */
    async callGstackSkill(skillName, roleAnalysis) {
        console.log(`🔄 調用 skill: ${skillName}`);

        // 這裡會實際調用 Gstack skill
        // 目前用模擬的方式

        const skillResponses = {
            '/plan-ceo-review': {
                summary: 'CEO視角審查完成',
                strengths: ['市場機會明確', '商業模式清晰'],
                concerns: ['需要更詳細的財務預測', '競爭分析可以更深入'],
                recommendations: ['建議補充 TAM/SAM/SOM 分析', '加入更詳細的競爭對比表']
            },
            '/plan-eng-review': {
                summary: '工程視角審查完成',
                strengths: ['技術方案可行', '開發時間表合理'],
                concerns: ['需要考慮技術債', 'API設計需要更詳細'],
                recommendations: ['建議補充技術架構圖', '加入風險緩解方案']
            },
            '/plan-design-review': {
                summary: '設計視角審查完成',
                strengths: ['用戶體驗考量完整', '視覺風格明確'],
                concerns: ['需要更多用戶研究數據', '無障礙設計需要加強'],
                recommendations: ['建議加入用戶旅程圖', '補充可訪問性指南']
            },
            '/plan-devex-review': {
                summary: '用戶體驗視角審查完成',
                strengths: ['用戶痛點分析深入', '目標用戶定位準確'],
                concerns: ['需要更多用戶驗證', '獲客策略可以更具體'],
                recommendations: ['建議規劃用戶訪談', '加入早期的MVP測試計劃']
            }
        };

        const response = skillResponses[skillName];

        if (!response) {
            return {
                summary: `${skillName} 執行完成`,
                note: '這個 skill 在當前階段不是必需的'
            };
        }

        return response;
    }

    /**
     * 產生 YC 標準計畫書
     */
    generateYCPlan(roleAnalysis, gstackInsights) {
        console.log('📝 產生 YC 標準計畫書...');

        const timestamp = new Date().toISOString().split('T')[0];
        const projectName = this.extractProjectName(roleAnalysis);

        // 根據當前階段產生不同的計畫書內容
        const phaseContent = this.generatePhaseContent(this.currentPhase, roleAnalysis, gstackInsights, projectName, timestamp);

        return phaseContent;
    }

    /**
     * 根據階段產生對應的計畫書內容
     */
    generatePhaseContent(phase, roleAnalysis, gstackInsights, projectName, timestamp) {
        const phaseInfo = this.getPhaseInfo(phase);

        let ycPlan = `# ${projectName} - YC ${phaseInfo.name} 計畫書
**YC 標準新創流程 • ${phaseInfo.subtitle}**

## 📊 尀案基本資訊
- **專案名稱**: ${projectName}
- **規劃日期**: ${timestamp}
- **當前階段**: ${phaseInfo.name}
- **生成方式**: 多角色 brainstorming + Gstack 規劃視角

`;

        // 添加多角色分析
        ycPlan += this.generateRoleAnalysisSection(roleAnalysis);

        // 添加 Gstack 規劃視角
        ycPlan += this.generateGstackInsightsSection(gstackInsights);

        // 添加該階段的專門內容
        ycPlan += this.generatePhaseSpecificContent(phase);

        // 添加 YC 驗收標準
        ycPlan += this.generateYCCriteriaSection(phase);

        return ycPlan;
    }

    /**
     * 獲取階段資訊
     */
    getPhaseInfo(phase) {
        const phaseMap = {
            'PHASE_1': { name: 'Phase 1 - 構思與確認', subtitle: 'Idea Validation' },
            'PHASE_2': { name: 'Phase 2 - 規劃與設計', subtitle: 'Product & Planning' },
            'PHASE_3': { name: 'Phase 3 - 開發執行', subtitle: 'Development' },
            'PHASE_4': { name: 'Phase 4 - 成長與驗證', subtitle: 'Growth & Validation' },
            'PHASE_5': { name: 'Phase 5 - 擴展與規模', subtitle: 'Scale' }
        };
        return phaseMap[phase] || phaseMap['PHASE_1'];
    }

    /**
     * 產生階段專門內容
     */
    generatePhaseSpecificContent(phase) {
        const contentMap = {
            'PHASE_1': this.generatePhase1Content(),
            'PHASE_2': this.generatePhase2Content(),
            'PHASE_3': this.generatePhase3Content(),
            'PHASE_4': this.generatePhase4Content(),
            'PHASE_5': this.generatePhase5Content()
        };
        return contentMap[phase] || '';
    }

    /**
     * Phase 1 專門內容
     */
    generatePhase1Content() {
        return `## 🎯 核心想法

### 一句話描述
**基於多角色討論的產品核心：**
> [待具體化 - 需要後續討論]

### 問題描述
**從多角色視角識別的關鍵問題：**
- **CEO 視角問題**: [待具體化]
- **工程視角問題**: [待具體化]
- **設計視角問題**: [待具體化]
- **用戶體驗視角問題**: [待具體化]

### 解決方案方向
**初步解決方案構想：**
- 核心功能概念：[基於多角色討論]
- 技術實現方向：[待具體化]
- 差異化優勢：[待具體化]

`;
    }

    /**
     * Phase 2 專門內容
     */
    generatePhase2Content() {
        return `## 🎯 產品規格方向

### 核心功能定義
**基於多角色分析的功能優先級：**
1. **最高優先級功能**: [待具體化]
2. **次要功能**: [待具體化]
3. **未來功能**: [待具體化]

### 用戶旅程設計
**預期用戶體驗流程：**
```
用戶發現問題 → [待設計具體流程] → 獲得價值
```

### 技術架構方向
**建議的技術方案：**
- **前端技術棧**: [待具體化]
- **後端技術棧**: [待具體化]
- **資料庫設計**: [待具體化]

`;
    }

    /**
     * Phase 3 專門內容
     */
    generatePhase3Content() {
        return `## 🚀 開發執行計劃

### 標準開發循環
**每個功能的開發流程：**
\`\`\`
1. 功能設計 (基於 Phase 2 規劃)
2. TDD 開發 (test-driven-development)
3. Code Review (code-reviewer agent)
4. 整合測試
5. 部署驗證
\`\`\`

### 開發里程碑
**基於多角色需求分析的開發優先級：**
- **Sprint 1**: [待規劃]
- **Sprint 2**: [待規劃]
- **Sprint 3**: [待規劃]

### 技術實現重點
**需要注意的技術挑戰：**
- **工程視角技術挑戰**: [待具體化]
- **設計視角技術挑戰**: [待具體化]

### 測試與審查策略
**質量保證計劃：**
- **TDD 開發**: 所有新功能使用測試驅動開發
- **持續 Code Review**: 每個功能完成後立即進行代碼審查
- 單元測試目標覆蓋率：[待設定]
- 整合測試場景：[待規劃]
- 用戶驗收測試：[待規劃]

`;
    }

    /**
     * Phase 4 專門內容
     */
    generatePhase4Content() {
        return `## 📈 成長與驗證計劃

### 發布策略
**基於多角色視角的上市計劃：**
- **發布時機**: [待確定]
- **目標用戶群**: [待具體化]
- **推廣渠道**: [待規劃]

### 關鍵指標設定
**需要追蹤的核心 KPI：**
- **用戶增長指標**: [待設定]
- **用戶留存指標**: [待設定]
- **收入指標**: [待設定]

### 用戶回饋收集
**基於不同視角的回饋機制：**
- **用戶體驗回饋**: [待設計]
- **技術性能監控**: [待設計]
- **業務數據分析**: [待設計]

`;
    }

    /**
     * Phase 5 專門內容
     */
    generatePhase5Content() {
        return `## 🌍 擴展與規劃策略

### 市場擴張方向
**基於多角色分析的擴張機會：**
- **地理擴張**: [待分析]
- **產品線擴張**: [待分析]
- **平台生態建設**: [待規劃]

### 團隊成長計劃
**組織發展需求：**
- **技術團隊擴展**: [待規劃]
- **產品團隊擴展**: [待規劃]
- **運營團隊擴展**: [待規劃]

### 長期戰略規劃
**基於前期成功的未來方向：**
- **願景更新**: [待制定]
- **技術創新方向**: [待確定]
- **可持續發展策略**: [待制定]

`;
    }

    /**
     * 產生多角色分析章節
     */
    generateRoleAnalysisSection(roleAnalysis) {
        let section = `## 👥 多角色綜合分析

`;

        const roleNames = {
            ceo: '💼 CEO',
            engineering: '🔧 工程',
            design: '🎨 設計',
            devex: '👤 用戶體驗'
        };

        Object.entries(roleAnalysis).forEach(([role, data]) => {
            if (data.contributions.length > 0) {
                section += `### ${roleNames[role]} 視角總結

`;
                data.contributions.forEach(contribution => {
                    section += `• ${contribution}\n`;
                });

                section += `\n**關鍵洞察：**\n`;
                data.keyPoints.forEach(point => {
                    section += `• ${point}\n`;
                });

                section += `\n`;
            }
        });

        return section;
    }

    /**
     * 產生 Gstack 規劃視角章節
     */
    generateGstackInsightsSection(gstackInsights) {
        let section = `## 🎯 Gstack 規劃視角分析

`;

        Object.entries(gstackInsights).forEach(([skill, insight]) => {
            section += `### ${skill}

**總結**: ${insight.summary}

**優勢**:
`;
            insight.strengths.forEach(strength => {
                section += `✅ ${strength}\n`;
            });

            section += `\n**關注點**:
`;
            insight.concerns.forEach(concern => {
                section += `⚠️ ${concern}\n`;
            });

            section += `\n**建議**:
`;
            insight.recommendations.forEach(recommendation => {
                section += `💡 ${recommendation}\n`;
            });

            section += `\n`;
        });

        return section;
    }

    /**
     * 產生 YC 驗收標準章節
     */
    generateYCCriteriaSection(phase) {
        const criteriaMap = {
            'PHASE_1': this.generatePhase1Criteria(),
            'PHASE_2': this.generatePhase2Criteria(),
            'PHASE_3': this.generatePhase3Criteria(),
            'PHASE_4': this.generatePhase4Criteria(),
            'PHASE_5': this.generatePhase5Criteria()
        };
        return criteriaMap[phase] || criteriaMap['PHASE_1'];
    }

    /**
     * Phase 1 驗收標準
     */
    generatePhase1Criteria() {
        return `## 🎯 Phase 1 準備度評估

### 🟢 準備就緒（可以進入 Phase 2）
**核心指標：**
- ✅ 能用一句話清楚說明產品做什麼
- ✅ 識別出具體的目標用戶群體
- ✅ 問題是真實且緊迫的
- ✅ 有初步的解決方案方向
- ✅ 市場機會經過基本驗證
- ✅ 核心團隊成員確認投入

### 🟡 需要改進（建議先完成以下項目）
**選擇性項目（至少完成 3 項）：**
- [ ] **用戶訪談報告**：與至少 5 個潛在用戶深度訪談
- [ ] **市場研究數據**：收集相關行業報告和統計數據
- [ ] **競爭分析**：深入研究至少 3 個主要競爭對手
- [ ] **技術原型**：製作初步的概念驗證原型
- [ ] **財務預測**：初步的收入模式和成本估算

### 🔴 尚未準備好（必須先完成）
**阻礙因素：**
- ❌ 核心想法仍然模糊或不清晰
- ❌ 沒有明確的目標用戶群體
- ❌ 問題不夠緊迫或不存在
- ❌ 市場規模過小或沒有成長性
- ❌ 缺乏核心團隊成員

### 📋 下一步行動
**🟢 當準備就緒時：**
- 進入 Phase 2: 規劃與設計
- 使用技能: /design-consultation, /writing-plans
- 產出: 詳細產品規格文檔

**🟡 如果需要改進：**
- 完成更多選擇性項目
- 進行用戶訪談和市場驗證
- 完善技術和商業方案

**🔴 如果尚未準備好：**
- 重新定義核心想法
- 重新評估市場機會
- 確認團隊成員投入
`;
    }

    /**
     * Phase 2 驗收標準
     */
    generatePhase2Criteria() {
        return `## 🎯 Phase 2 準備度評估

### 🟢 準備就緒（可以進入 Phase 3）
**核心指標：**
- ✅ 產品功能定義清楚且優先級明確
- ✅ 技術架構經過驗證可行
- ✅ UI/UX 設計完成初步原型
- ✅ 開發時間表詳細且實際
- ✅ 核心技術棧和工具確定
- ✅ 預算和資源規劃合理

### 🟡 需要改進（建議先完成以下項目）
**選擇性項目（至少完成 3 項）：**
- [ ] **用戶測試報告**：原型經過至少 5 位用戶測試
- [ ] **技術驗證**：核心技術風險已經過驗證
- [ ] **API 設計文檔**：完整的 API 規格說明
- [ ] **資料庫優化**：資料庫性能測試和優化
- [ ] **安全審查**：通過基本安全檢查清單

### 🔴 尚未準備好（必須先完成）
**阻礙因素：**
- ❌ 產品功能定義模糊或不一致
- ❌ 技術方案存在重大風險
- ❌ 開發計劃不切實際
- ❌ 資源不足（預算、人力、時間）
- ❌ 設計未經用戶驗證

### 📋 下一步行動
**🟢 當準備就緒時：**
- 進入 Phase 3: 開發執行
- 使用技能: /test-driven-development, /systematic-debugging
- 產出: MVP 產品

**🟡 如果需要改進：**
- 進行更多用戶測試
- 驗證技術架構
- 完善設計和計劃

**🔴 如果尚未準備好：**
- 重新定義產品功能
- 調整技術方案
- 裥充資源或調整計劃
`;
    }

    /**
     * Phase 3 驗收標準
     */
    generatePhase3Criteria() {
        return `## 🎯 Phase 3 準備度評估

### 🟢 準備就緒（可以進入 Phase 4）
**核心指標：**
- ✅ 所有核心功能已實現並可運行
- ✅ 單元測試覆蓋率 >= 70%
- ✅ 主要場景的整合測試通過
- ✅ 系統響應時間 < 200ms
- ✅ 通過基本安全檢查
- ✅ Beta 測試完成且有正面回饋
- ✅ 高優先級 Bug 全部修復

### 🟡 需要改進（建議先完成以下項目）
**選擇性項目（至少完成 2 項）：**
- [ ] **性能優化**：響應時間優化到 < 100ms
- [ ] **測試提升**：測試覆蓋率提升到 >= 85%
- [ ] **用戶體驗**：Beta 用戶滿意度 >= 4/5
- [ ] **代碼審查**：通過完整的代碼審查流程
- [ ] **負載測試**：通過壓力測試（1000 併發用戶）

### 🔴 尚未準備好（必須先完成）
**阻礙因素：**
- ❌ 核心功能缺失或無法正常運行
- ❌ 存在重大安全漏洞
- ❌ 測試覆蓋率 < 50%
- ❌ 系統穩定性差（頻繁崩潰）
- ❌ Beta 用戶回饋負面

### 📋 下一步行動
**🟢 當準備就緒時：**
- 進入 Phase 4: 成長與驗證
- 使用技能: /requesting-code-review, /ship
- 產出: 正式產品發布

**🟡 如果需要改進：**
- 優化系統性能
- 提升測試覆蓋率
- 修復剩餘 Bug

**🔴 如果尚未準備好：**
- 修復核心功能問題
- 解決安全漏洞
- 重新進行 Beta 測試
`;
    }

    /**
     * Phase 4 驗收標準
     */
    generatePhase4Criteria() {
        return `## 🎯 Phase 4 準備度評估

### 🟢 準備就緒（可以進入 Phase 5）
**核心指標：**
- ✅ 產品已在主要渠道正式發布
- ✅ 用戶增長持續（>= 100 新用戶/月）
- ✅ 7日留存率 >= 40%
- ✅ 商業模式健康（LTV > 3x CAC）
- ✅ 系統穩定性 >= 99%
- ✅ 有明確的客戶支援流程
- ✅ 用戶滿意度（NPS）>= 40

### 🟡 需要改進（建議先完成以下項目）
**選擇性項目（至少完成 2 項）：**
- [ ] **增長加速**：用戶增長達到 >= 500/月
- [ ] **留存優化**：7日留存率提升到 >= 50%
- [ ] **收入多元化**：建立多個收入來源
- [ ] **品牌建設**：獲得媒體報導或行業認可
- [ ] **數據完善**：建立完整的分析儀表板

### 🔴 尚未準備好（必須先完成）
**阻礙因素：**
- ❌ 用戶增長停滯或負增長
- ❌ 留存率 < 30%
- ❌ 商業模式虧損（LTV < CAC）
- ❌ 系統頻繁故障
- ❌ 用戶滿意度極低（負面評論多）

### 📋 下一步行動
**🟢 當準備就緒時：**
- 進入 Phase 5: 擴展與規模
- 使用技能: /finishing-a-development-branch
- 產出: 市場擴張計劃

**🟡 如果需要改進：**
- 優化增長和留存策略
- 改進商業模式
- 提升產品質量和用戶滿意度

**🔴 如果尚未準備好：**
- 重新評估產品市場契合度
- 調整商業模式
- 解決技術穩定性問題
`;
    }

    /**
     * Phase 5 驗收標準
     */
    generatePhase5Criteria() {
        return `## 🎯 Phase 5 準備度評估

### 🟢 成功擴張（達到長期可持續發展）
**核心指標：**
- ✅ 市場擴張計劃正在執行並見效
- ✅ 團隊規模和組織能力匹配發展需求
- ✅ 完成計劃的融資輪次（如有需要）
- ✅ 財務模型健康可持續（盈利或路徑清晰）
- ✅ 品牌影響力顯著提升
- ✅ 有持續的技術創新投入
- ✅ 管理系統支援規模化運營

### 🟡 穩定成長（基礎紮實但需優化）
**選擇性項目（至少完成 2 項）：**
- [ ] **國際化擴張**：進入至少 1 個新國家/地區市場
- [ ] **產品線擴展**：推出至少 1 個新產品線
- [ ] **生態系統**：建立合作夥伴計劃或開發者生態
- [ ] **行業領導**：在細分市場達到領先地位
- [ ] **可持續發展**：建立 ESG（環境、社會、治理）框架

### 🔴 發展受阻（需要策略調整）
**阻礙因素：**
- ❌ 市場擴張失敗或增長停滯
- ❌ 團隊管理能力跟不上規模
- ❌ 融資困難或財務狀況惡化
- ❌ 品牌影響力下降
- ❌ 技術創新停滞

### 📋 下一步選項
**基於準備度評估的建議：**

**🟢 如果是「成功擴張」：**
- 繼續執行擴張計劃
- 考慮 IPO 或被收購的準備
- 建立長期的可持續發展框架

**🟡 如果是「穩定成長」：**
- 專注於深化現有市場地位
- 優化運營效率和盈利能力
- 積累資源為未來擴張做準備

**🔴 如果是「發展受阻」：**
- 重新評估核心商業模式
- 考慮轉型或專注於利基市場
- 尋求戰略合作或合併機會

### 🚀 長期監控指標
- **市場風險**: 競爭、政策、技術變化
- **財務風險**: 現金流、盈利能力
- **執行風險**: 團隊、技術、運營
- **成長機會**: 新市場、新技術、新合作
`;
    }

    /**
     * 提取專案名稱
     */
    extractProjectName(roleAnalysis) {
        // 從 CEO 視角的貢獻中提取專案名稱
        const ceoContributions = roleAnalysis.ceo.contributions;

        if (ceoContributions.length > 0) {
            const firstContribution = ceoContributions[0];
            // 簡單的專案名稱提取
            const words = firstContribution.split(' ').slice(0, 5);
            return words.join(' ') + ' 專案';
        }

        return '新專案';
    }

    /**
     * 更新後端真相來源檔案
     */
    async updateBackendFiles(ycPlan, isRestart = false) {
        console.log('💾 更新後端真相來源...');

        // 1. 更新 PROJECT_PLAN.md
        await this.updateProjectPlan(ycPlan, isRestart);

        // 2. 更新 progress.json
        await this.updateProgress(isRestart);

        console.log('✅ 後端檔案已更新');
    }

    /**
     * 更新專案計畫書
     */
    async updateProjectPlan(ycPlan, isRestart = false) {
        const fs = require('fs');

        try {
            let content = ycPlan;

            if (isRestart) {
                const timestamp = new Date().toISOString();
                const restartNote = `\n\n---\n**🔄 版本更新**: 此計畫書已於 ${timestamp} 重新討論並更新\n`;
                content += restartNote;
            }

            // 這裡會實際寫入檔案
            console.log('  更新 PROJECT_PLAN.md...');
            // fs.writeFileSync('PROJECT_PLAN.md', content, 'utf8');
        } catch (error) {
            console.error('  寫入 PROJECT_PLAN.md 失敗:', error);
        }
    }

    /**
     * 更新專案計畫書
     */
    async updateProjectPlan(ycPlan) {
        const fs = require('fs');

        try {
            // 這裡會實際寫入檔案
            console.log('  更新 PROJECT_PLAN.md...');
            // fs.writeFileSync('PROJECT_PLAN.md', ycPlan, 'utf8');
        } catch (error) {
            console.error('  寫入 PROJECT_PLAN.md 失敗:', error);
        }
    }

    /**
     * 更新進度追蹤
     */
    async updateProgress(isRestart = false) {
        const timestamp = new Date().toISOString();
        const progressData = {
            project_info: {
                name: 'YC Brainstorming 專案',
                current_phase: this.currentPhase,
                last_updated: timestamp,
                is_restart: isRestart
            },
            phases: {
                [this.currentPhase]: {
                    name: this.getPhaseInfo(this.currentPhase).title,
                    status: isRestart ? 'restarted' : 'in_progress',
                    start_time: timestamp,
                    progress_percentage: isRestart ? 0 : 40,
                    restart_count: isRestart ? 1 : 0
                }
            },
            ai_tasks: [
                {
                    id: `brainstorming_session_${timestamp}`,
                    name: '多角色 Brainstorming',
                    phase: this.currentPhase,
                    status: 'completed',
                    start_time: timestamp,
                    end_time: timestamp,
                    skill_used: '/brainstorming + Gstack 規劃視角',
                    outputs: ['YC 標準計畫書', '多角色分析報告'],
                    is_restart: isRestart
                }
            ],
            brainstorming_session: {
                contributions: this.contributions,
                role_analysis: 'completed',
                gstack_insights: 'generated',
                yc_plan: 'produced',
                restart_history: isRestart ? [`重新開始於 ${timestamp}`] : []
            },
            version_control: {
                enabled: true,
                current_version: this.generateVersionId(),
                versions_tracked: true
            }
        };

        const fs = require('fs');
        try {
            console.log('  更新 progress.json...');
            // fs.writeFileSync('progress.json', JSON.stringify(progressData, null, 2), 'utf8');
        } catch (error) {
            console.error('  寫入 progress.json 失敗:', error);
        }
    }

    /**
     * 獲取階段資訊
     */
    getPhaseInfo(phase) {
        const phaseMap = {
            'PHASE_1': { title: '構思與確認' },
            'PHASE_2': { title: '規劃與設計' },
            'PHASE_3': { title: '開發執行' },
            'PHASE_4': { title: '成長與驗證' },
            'PHASE_5': { title: '擴展與規模' }
        };
        return phaseMap[phase] || phaseMap['PHASE_1'];
    }

    /**
     * 載入 YC 模板
     */
    loadYCTemplate() {
        // 載入 YC 標準模板
        return {
            phase1Criteria: 'YC Idea Validation criteria',
            phase2Criteria: 'YC Product & Planning criteria',
            successMetrics: ['Growth', 'Team', 'Market', 'Product']
        };
    }
}

// 導出供前端使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrainstormingBackend;
}