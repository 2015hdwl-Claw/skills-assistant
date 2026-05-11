# 🎯 Skills Assistant - 專案管理與學習追蹤系統

## 🚀 在任何 Session 中啟動標準化開發流程

### ⚡ **立即開始（3 秒啟動）**

**在任何 Claude Code session 中，只需說：**

```bash
"啟動標準化開發流程"
```

**或更簡單：**

```bash
"開始工作"
```

### 🤖 **系統會自動為你做什麼**

#### **1. 智能專案檢測**
```
🔍 正在檢測當前工作目錄...
📁 發現專案: admission-master
📍 工作目錄: /path/to/admission-master
```

#### **2. 尋找專案計畫文件**
```
📋 正在查找專案計畫...
✅ 找到專案文件: project-plans/admission-master/
   - admission-master_YC_PLAN.md
   - admission-master_PROGRESS.json  
   - admission-master_VERSIONS.json
   - README.md (檢核表)
```

#### **3. 評估當前階段**
```
📊 正在評估專案狀態...
🎯 當前階段: Phase 4 - 成長與驗證
✅ 已完成: Phase 1-3 (100%)
🔄 進度中: Phase 4 (90%)
📈 整體完成度: 78%
```

#### **4. 提供具體行動指引**
```
⏭️ 下一步行動建議：
🔥 Critical (本週必須完成):
   1. 執行 Supabase 資料庫遷移
   2. 部署到 Vercel 生產環境  
   3. 基本功能測試

📅 推薦 Skills:
   - /andrej-karpathy-perspective (工程審查)
   - /requesting-code-review (代碼審查)
```

### 📋 **不同場景的啟動範例**

#### **場景 A: 全新專案**
```bash
你: "我要開始一個新專案"

系統: 🚀 檢測到新專案構思！
      建議使用 /brainstorming 開始多角色討論
      要開始嗎？
```

#### **場景 B: 已開發專案中途加入**
```bash
你: "這個專案已經開發一半了"

系統: 🔍 檢測到 admission-master 在 Phase 4
      當前任務: 執行生產部署 (90% 完成)
      建議使用 /andrej-karpathy-perspective 分析部署策略
```

#### **場景 C: 功能開發**
```bash
你: "我要開發用戶認證功能"

系統: 🎯 必須使用 TDD 流程！
      "用 /test-driven-development 開發用戶認證功能"
```

---

## 🚨 **專案檔案命名強制規範實際運作**

### ⚠️ **當用戶要求非標準命名時**

```bash
用戶: "幫我創建 admission-plan.md"

AI 的標準化回應:
"⚠️ 我必須遵循全局 CLAUDE.md 的強制規範
   
   請求的檔案名稱: admission-plan.md
   標準檔案名稱: admission-master_YC_PLAN.md
   
   根據專案檔案命名強制規範，我將為你創建正確命名的檔案：
   ✅ 正在創建: admission-master_YC_PLAN.md
   
   這是絕對強制的標準，確保所有專案的一致性。"
```

### ✅ **AI 自我檢查機制**

```bash
AI 內部檢查清單 (每次操作前必須執行):

📋 檔案標準化驗證:
✅ 檔案位置: project-plans/{PROJECT_NAME}/
✅ 資料夾命名: kebab-case，無底線或大寫  
✅ 主計畫書: {PROJECT_NAME}_YC_PLAN.md
✅ 進度檔案: {PROJECT_NAME}_PROGRESS.json
✅ 版本檔案: {PROJECT_NAME}_VERSIONS.json
✅ 檢核表: README.md

⚠️ 如果有任何一項不符合標準:
   → 立即停止操作
   → 創建正確命名的檔案
   → 提醒用戶標準化要求
```

### 🛡️ **AI 絕對不准做的事項**

```bash
❌ 創建非標準命名的檔案
❌ 修改或調整命名規範  
❌ 因為「方便」而違反標準
❌ 因為「用戶要求」而違反規範
❌ 任何情况下變更強制規則
```

### 🎯 **成功案例：admission-master 完全符合標準**

```bash
📊 admission-master 標準化驗證結果:

✅ 專案資料夾: admission-master/ (kebab-case) ✅
✅ 主計畫書: admission-master_YC_PLAN.md ✅  
✅ 進度檔案: admission-master_PROGRESS.json ✅
✅ 版本檔案: admission-master_VERSIONS.json ✅
✅ 檢核表: README.md ✅

🎯 結果: 100% 符合全局強制規範
💡 可以立即開始標準化開發流程
```

### 💡 **快速指令列表**
```bash
"開始工作"       → 啟動標準化流程
"專案狀態"      → 查看當前進度  
"下一步"        → 獲得行動建議
"當前階段"      → 顯示所在 Phase
"適用 skills"   → 列出推薦 skills
```

---

## 🚀 完整架構說明 (前後端整合)

### 🎯 **核心痛點與解決方案**

```markdown
用戶的三大痛苦：
❌ 被AI帶著走，失去控制權
❌ 不知道專案實際進度  
❌ Skills說法不一致

解決方案：
✅ 標準化 SOP + 透明化進度
✅ AI是助手，不是老闆
✅ 像YC創業團隊那樣的專案管理
```

### 🏗️ **雙層架構設計**

#### 1️⃣ **前端：透明化專案管理**
```
Skills Assistant Dashboard
├── 📊 專案可視化 (當前階段、進度、下一步)
├── 🤖 AI任務透明化 (每個任務獨立卡片、狀態追蹤)
└── 🎓 學習進度追蹤 (YC方法論、個人化適應)
```

#### 2️⃣ **後端：簡化執行架構**  
```
Superpowers + Gstack Skills (按需載入)
           ↓ 按需觸發
    Spider Agent (資料工程)
```

**執行原則**：直接使用Skills，移除多餘agents，保持控制權在用戶

## ⚠️ 重要澄清（2026-05-02 修正）

**這是一個「專案管理面板」+「學習追蹤工具」**

### ✅ 實際功能
- 📊 **專案進度追蹤** - YC 5階段開發流程
- 🎓 **學習進度管理** - Superpowers Skills 使用追蹤
- 📍 **執行指引顯示** - 告訴用戶在哪裡執行什麼 skill
- 💡 **個人化建議** - 基於使用統計的學習建議
- 🔧 **工具整合** - 顯示使用者的開發環境和專案路徑

### 🆕 **2026-05-07 更新：真實專案資料整合**

- ✅ **真實專案進度** - 不再使用假資料，讀取實際專案檔案
- 📊 **多專案支援** - 支援升學大師、社群大師等專案
- 🔧 **HTTP服務器** - 解決瀏覽器安全限制
- 📁 **手動上傳** - 支援檔案選擇器手動載入專案

**使用方法**：
```bash
cd C:\Users\ntpud\.claude\projects\skills-assistant
python -m http.server 8080
# 開啟: http://localhost:8080/skills-assistant-dashboard.html
```

### ❌ 不是的功能（重要！）
- 不是 AI Agent 自動執行引擎
- 不會真實執行 brainstorming 或其他 skills
- 不會調用 Claude Code API
- 不是自動化的開發平台

### 🎯 **完整工作流程整合**

```bash
# 用戶體驗 (前端)
1. 打開 skills-assistant-dashboard.html
2. 看到專案當前在 Phase 1: 構思與確認  
3. 點擊 "開始 brainstorming"
4. 儀表板顯示任務狀態: 🔄 進行中

# 執行架構 (後端)
5. Claude Code 直接使用 /brainstorming skill
6. 不會啟動已刪除的 agents
7. 完成後回到前端: ✅ 任務完成

# 控制權確認
8. 用戶在儀表板看到進度更新
9. 用戶決定下一步: "進入 Phase 2"  
10. 用戶始終保持控制權
```

---

## 📋 **專案管理檔案結構** (2026-05-07 更新)

### 🎯 **標準專案檔案系統**

**所有專案都必須遵循的檔案結構**:

```
{PROJECT_NAME}/
├── README.md                          # 綜合檢核表 (5-Phase)
├── {PROJECT_NAME}_YC_PLAN.md          # 主計畫書
├── {PROJECT_NAME}_PROGRESS.json       # 進度追蹤
└── {PROJECT_NAME}_VERSIONS.json       # 版本歷史
```

### ✅ **已標準化的專案**

#### **升學大師** (`admission-master/`)
- 🎯 **Phase 4**: 成長與驗證 (90% 完成)
- 📊 **整體進度**: 78%
- ✅ **檔案**: README.md, admission-master_YC_PLAN.md, admission-master_PROGRESS.json, admission-master_VERSIONS.json

#### **社群經營大師** (`social/`)
- 🎯 **Phase 2**: 規劃與設計 (30% 完成)
- ✅ **Phase 1**: 已完成 (100%)
- ✅ **檔案**: README.md, social_YC_PLAN.md, social_PROGRESS.json, social_VERSIONS.json

### 🔄 **檔案功能說明**

1. **README.md** - 5個 Phase 的完整檢核表
2. **{PROJECT_NAME}_YC_PLAN.md** - YC 標準開發計畫
3. **{PROJECT_NAME}_PROGRESS.json** - 即時進度追蹤
4. **{PROJECT_NAME}_VERSIONS.json** - 重大決策記錄

### 💡 **Dashboard 整合**

Dashboard 自動讀取這些檔案：
- ✅ 支援多種格式 (admission-master & social 格式)
- ✅ 自動格式轉換和標準化
- ✅ 即時顯示真實進度
- ✅ 專案切換和比較

---

## ✨ Key Features

- **🔍 Transparent Tracking**: Real-time visibility into AI task status and project progress
- **📊 Standardized Process**: Built-in YC development methodology and best practices
- **🎓 Personalized Learning**: Adaptive system that adjusts recommendations based on your skill level
- **🤖 AI Collaboration**: Maintain control while getting intelligent assistance
- **📈 Progress Analytics**: Comprehensive tracking of learning metrics and project milestones
- **🌓 Dark/Light Theme**: Beautiful interface with theme switching
- **⌨️ Keyboard Shortcuts**: Power user features for efficient navigation
- **🍅 Pomodoro Timer**: Built-in focus timer for productive work sessions

## 🚀 系統功能

### Skills 整合功能（重點）

**這裡的「Skills」指的是 Superpowers 和 Gstack 的使用追蹤**：

1. **Skill 註冊表**
   - 維護技能的元數據（名稱、描述、分類、難度等）
   - 包含 brainstorming, writing-plans, TDD, systematic-debugging 等
   - 支援技能篩選和搜尋

2. **使用分析追蹤**
   ```javascript
   // 追蹤資料結構
   {
     "brainstorming": {
       totalUses: 5,           // 使用次數
       successfulUses: 4,      // 成功次數
       averageSuccess: 80.0    // 平均成功率
     }
   }
   ```

3. **效果評分系統**
   - 預設效果 + 使用者實際體驗
   - 動態調整技能推薦
   - 個人化建議生成

4. **學習路徑推薦**
   - beginner → 基礎技能
   - intermediate → 混合技能
   - advanced → 進階技能

5. **執行指引顯示**
   - 告訴用戶在哪裡執行 skill
   - 顯示專案路徑和執行指令
   - 提供預估時間和步驟

### 🚀 使用流程

1. **Onboarding** → 收集使用者資訊（經驗、工具、專案）
2. **Dashboard** → 顯示執行指引：「在你的 VS Code 執行 /brainstorming」
3. **使用者執行** → 在自己的開發環境執行 skill
4. **回來更新** → 在儀表板標記完成，更新追蹤資料
5. **系統推薦** → 基於使用統計推薦下一步

## 📁 Project Structure

```
skills-assistant/
├── skills-assistant-dashboard.html    # 主儀表板介面
├── onboarding.html                     # 用戶引導流程
├── progress-tracker.js                 # 進度追蹤系統
├── skill-integration.js                # Skill 管理和推薦
├── PLAN-skills-assistant.md            # 開發計劃
├── README.md                           # 專案說明 (本文件)
│
└── docs/                               # 部署版本
    ├── index.html
    ├── onboarding.html
    ├── skills-assistant-dashboard.html
    ├── progress-tracker.js
    └── skill-integration.js
```

### 🎯 簡化架構說明

**本專案現已採用簡化架構**，不包含複雜的整合系統：

- ✅ **直接使用** Superpowers + Gstack Skills
- ✅ **按需載入** Spider Agent (資料工程)  
- ✅ **無額外** 管理層或中間件
- ✅ **Context 節省** 移除常駐 agents

## 🎯 How It Works

### Phase-Based Development
The system follows Y Combinator's 5-phase development process:

1. **Phase 1: 構思與確認** - Turn ideas into clear project definitions
2. **Phase 2: 規劃與設計** - Create detailed implementation plans
3. **Phase 3: 開發執行** - Build with TDD and systematic debugging
4. **Phase 4: 測試驗證** - Comprehensive testing and quality assurance
5. **Phase 5: 發布部署** - Deploy and monitor production systems

---

## 🎯 簡化架構說明（2026-05-02 修正）

**根據「後端討論」建議執行的架構簡化**

### ✅ 真實的簡化架構

```
直接使用 Superpowers + Gstack Skills
                ↓
需要資料工程時 → 臨時載入 Spider Agent
```

#### 🔧 實際建置
- **Agents**: 只有 1 個 `spider-data-engineering.md` (按需載入)
- **Skills**: 直接在 Claude Code 中調用 Superpowers 和 Gstack skills
- **原則**: 按需載入，用完即釋放，不保留常駐管理系統

### 🚀 實際使用方式

#### 開發流程 (直接調用 Skills)
```bash
# 規劃階段
"用 /brainstorming 規劃這個功能"
"用 /plan-ceo-review 分析市場機會"

# 開發階段  
"用 /test-driven-development 開發這個功能"
"用 /systematic-debugging 修復這個 bug"

# 審查階段
"用 /requesting-code-review 審查代碼"

# 發布階段
"用 /ship 發布這個產品"
```

#### 需要資料工程時
```bash
# 臨時載入 Spider
Agent({ subagent_type: "spider-data-engineering" })
# 或在 Claude Code 中直接指定
```

#### ✨ 主要特色

- **🔧 按需載入** - 只在需要時載入相關 Skills，節省 20-25% Context
- **⚡ 階段性釋放** - 完成階段後立即釋放相關 Skills，保持系統輕量
- **📊 智能監控** - 實時監控 Context 使用情況，提供優化建議
- **🕷️ Spider 整合** - 按需載入資料工程專家，處理複雜資料任務
- **🎯 五階段管理** - 自動化的開發流程管理和 Skills 推薦

#### 🏗️ 新增檔案說明

| 檔案 | 功能 | 說明 |
|------|------|------|
| `architecture.html` | 架構文檔 | 完整的系統架構視覺化展示 |
| `superpowers-gstack-integration.js` | 核心引擎 | 五階段管理 + Skills 按需載入系統 |
| `spider-integration.js` | 資料工程 | Spider Agent 的三階段資料處理流程 |
| `integration-dashboard.html` | 控制台 | 可視化的整合系統操作介面 |
| `INTEGRATION_GUIDE.html` | 使用指南 | 詳細的系統使用說明和最佳實踐 |

#### 🚀 快速開始

1. **查看架構**：打開 `architecture.html` 了解系統設計
2. **使用控制台**：打開 `integration-dashboard.html` 開始使用
3. **閱讀指南**：查看 `INTEGRATION_GUIDE.html` 學習最佳實踐

#### 💡 核心概念 (真實的簡化)

```javascript
// 簡化原則
❌ 不需要：複雜的管理系統、多個 agents、自動載入機制
✅ 只需要：直接調用 Skills + 1 個按需 Agent

// Context 節省
優化前: 4 個 agents 常駐 = 20-25% Context 浪費
優化後: 1 個按需 agent = 實際使用時才占用 Context

// 開發流程 (直接用 Skills，不需要中間層)
規劃: /brainstorming + Gstack 規劃視角
開發: /test-driven-development + /systematic-debugging + code-reviewer
審查: /requesting-code-review
發布: /ship

// 資料工程 (臨時載入 Spider)
需要時: Agent({ subagent_type: "spider-data-engineering" })
完成後: 自動釋放 Context
```

#### 🎯 實際使用示例 (簡化架構)

```bash
# 開始新專案 - 直接調用 Skills
"用 /brainstorming 規劃這個專案的架構"

# 進入開發 - 直接在 Claude Code 中使用
"用 /test-driven-development 開發用戶登入功能"
"用 /systematic-debugging 修復 API 錯誤"

# 需要資料工程 - 臨時載入 Spider
"用 Agent({ subagent_type: 'spider-data-engineering' }) 處理網頁抓取"

# 完成後 - Spider 自動釋放，無需手動管理
```

### Skill-Based Learning
The system integrates Superpowers and Gstack skills with:
- **Dynamic loading**: Load skills based on current project phase
- **Usage analytics**: Track effectiveness and success rates
- **Personalized recommendations**: Get suggestions based on your patterns
- **Learning paths**: Structured progression from beginner to advanced

### Transparent AI Integration
Unlike being "led by AI", this system provides:
- **Real-time status**: See what AI tasks are running
- **Progress visibility**: Track AI work completion and outputs
- **User control**: You decide what to do next
- **Dependency tracking**: Understand task relationships

## 🎮 Features Guide

### Dashboard Features
- **Drag & Drop**: Reorder tasks by dragging them
- **Theme Toggle**: Switch between light/dark mode (Press 'T')
- **Keyboard Shortcuts**: Press '?' for available shortcuts
- **Real-time Updates**: Automatic progress updates without page refresh
- **Task Animations**: Visual feedback for task completion

### Progress Tracking
- **GitHub Integration**: Create issues from tasks
- **Pomodoro Timer**: Built-in 25-minute focus sessions
- **Task Notes**: Add comments and thoughts to tasks
- **Dependency Visualization**: See task relationships
- **Templates**: Use pre-built task templates

### Skill Management
- **Usage Statistics**: Track which skills work best for you
- **Effectiveness Scoring**: Skills are rated by your success rate
- **Adaptive Recommendations**: Get personalized suggestions
- **Learning Paths**: Follow structured skill progression

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `T` | Toggle theme |
| `R` | Refresh tasks |
| `E` | Export progress report |
| `D` | View task details |
| `?` | Show all shortcuts |
| `Ctrl/Cmd + ↓` | Next card |
| `Ctrl/Cmd + ↑` | Previous card |
| `ESC` | Close dialogs |

## 🔧 Configuration

### GitHub Integration
To enable GitHub issue creation:
```javascript
skillsTracker.configureGitHub(
    'your-username',
    'your-repo',
    'your-personal-access-token'
);
```

### Custom Skill Templates
Add your own task templates:
```javascript
skillsTracker.createTaskFromTemplate('Development Sprint', {
    name: 'My Custom Task',
    skills: ['tdd', 'debugging']
});
```

## 📊 Data Storage

All data is stored locally in your browser:
- **Progress Data**: `skillsAssistantProgress` in localStorage
- **User Settings**: Theme preferences, keyboard shortcuts
- **Usage Analytics**: Skill usage and effectiveness data
- **Onboarding Data**: User profile and project setup

### Export/Import
You can export your progress data:
1. Click "📤 匯出進度報告" button
2. Save the generated report file
3. Import it later to restore your progress

## 🎓 User Levels

The system adapts to your experience level:

### 🌱 Beginner
- Focus on basic skills and templates
- Step-by-step guidance
- Emphasis on learning fundamentals

### 🌿 Intermediate  
- Balance of features and guidance
- Standard workflow optimization
- Skill building and best practices

### 🌳 Advanced
- Full feature access
- Parallel processing capabilities
- Custom workflow creation

## 🔐 Privacy & Security

- **Local-first**: All data stored in your browser
- **No external calls**: Works offline after initial load
- **GitHub optional**: Integration only when configured
- **Anonymous analytics**: No tracking without consent

## 🛠️ Technical Details

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile Support
- ✅ Responsive design for tablets
- ✅ Touch-friendly interface
- ✅ Mobile theme optimization

### Performance
- <2s initial page load
- <100ms interaction response time
- Efficient localStorage usage
- Lazy loading for skill descriptions

## 📈 Development Roadmap

### MVP (Current)
- ✅ Basic dashboard with progress tracking
- ✅ User onboarding flow
- ✅ Theme system and animations
- ✅ GitHub integration foundation

### Next Iterations
- [ ] Advanced GitHub API integration
- [ ] Real-time collaboration features
- [ ] Mobile app versions
- [ ] Team management capabilities
- [ ] Custom skill marketplace

## 🤝 Contributing

Contributions are welcome! Areas for contribution:
- Additional skill templates
- Language translations
- Mobile responsiveness improvements
- Performance optimizations
- Bug fixes and features

## 📄 License

MIT License - feel free to use for personal and commercial projects.

## 🙏 Acknowledgments

- **YC Methodology**: Based on Y Combinator's startup development process
- **Superpowers Skills**: Integration with obra/superpowers
- **Gstack Agents**: Integration with garrytan/gstack
- **Progressive Enhancement**: Building on modern web standards

## 📞 Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create detailed bug reports
3. Share feature requests with use cases
4. Contribute improvements via PR

---

**Made with ❤️ for developers who want to control their AI-assisted development**

*Stop being led by AI. Start leading with AI.*

---

## 🚀 YC Brainstorming 系統 (新增)

### 🎯 **多角色專案規劃系統**
- **前端**: `brainstorming-system.html` - 多角色討論介面
- **後端**: `brainstorming-backend.js` - 處理和計畫書產出
- **標準**: `YC_PLAN_TEMPLATE.md` - YC 標準計畫書格式

### 🏗️ **系統特色**
- ✅ **多角色參與**: CEO、工程、設計、用戶體驗視角
- ✅ **YC 標準流程**: 嚴格遵循 Phase 1-5 標準格式
- ✅ **自動計畫書**: 從討論到 YC 計畫書的自動生成
- ✅ **前後端整合**: 後端真相來源，前端顯示層分離
- ✅ **準備度評估**: 基於檢查清單而非數字評分的實用評估

### 📋 **使用方式**
```bash
# 1. 開啟系統
open brainstorming-system.html

# 2. 多角色討論
CEO → 商業模式和市場分析
工程 → 技術可行性和架構
設計 → 用戶體驗和介面
用戶體驗 → 痛點和需求驗證

# 3. 產生計畫書
系統自動調用 Superpowers + Gstack skills
產出符合 YC 標準的完整計畫書

# 4. 更新後端真相來源
自動更新 PROJECT_PLAN.md 和 progress.json
```

### 🎯 **YC 標準流程遵循**
- **Phase 1**: 構思與確認 (Idea Validation)
- **Phase 2**: 規劃與設計 (Product & Planning)
- **Phase 3**: 開發執行 (Development)
- **Phase 4**: 成長與驗證 (Growth & Validation)
- **Phase 5**: 擴展與規模 (Scale)

### 💡 **評估標準理念**
**準備度評估 > 數字評分**
- 🟢 **準備就緒**: 核心指標達成，可以進入下一階段
- 🟡 **需要改進**: 基礎紮實，建議完成選擇性項目
- 🔴 **尚未準備好**: 存在阻礙因素，需要先解決

這種評估方式更符合 YC 的「進度 > 完美」理念和創業的實際情況。

### 🚀 **智能 Skills 推薦系統**
**每個階段自動推薦最適用的 Superpowers 和 Gstack Skills**

#### 推薦邏輯
```javascript
// 系統根據當前階段自動推薦
Phase 1 → /brainstorming, /plan-ceo-review, /plan-eng-review
Phase 2 → /writing-plans, /design-consultation
Phase 3 → /test-driven-development, /systematic-debugging, code-reviewer
Phase 4 → /requesting-code-review, /receiving-code-review
Phase 5 → /ship, /finishing-a-development-branch
```

#### 使用方式
1. **查看推薦**: 系統界面會顯示當前階段的推薦 Skills
2. **查看說明**: 每個 skill 都有詳細的使用場景和範例
3. **直接使用**: 在 Claude Code 中直接輸入指令即可

#### Phase 3 推薦範例
```
🔥 /test-driven-development
   使用時機: 開發新功能時（強烈推薦）
   使用範例:
   • "用 /test-driven-development 開發用戶登入功能"
   • "用 /test-driven-development 實現購物車功能"

🔥 /systematic-debugging
   使用時機: 遇到 bug 或問題時
   使用範例:
   • "用 /systematic-debugging 修復用戶註冊的 bug"
   • "用 /systematic-debugging 解決 API 響應慢的問題"

🔥 code-reviewer agent
   使用時機: 完成功能後立即進行代碼審查
   使用範例:
   • "使用 code-reviewer agent 審查剛完成的用戶認證功能"
   • "用 code-reviewer agent 檢查 API 安全性和性能"

標準開發流程:
功能設計 → TDD 開發 → Code Review → 整合測試 → 完成
```

#### Context 最佳化
- ✅ **按需載入**: 只載入當前階段需要的 skills
- ✅ **自動釋放**: 切換階段時自動釋放舊 skills
- ✅ **大幅節省**: 平均節省 70-80% context 使用

### 🔄 **階段重新討論功能**
**支援專案執行中的方向調整**

#### 使用場景
- 💡 **新想法發現**：執行中發現更好的機會
- 🚫 **假設被推翻**：原本的假設被驗證為錯誤
- 🔄 **市場環境變化**：競爭或用戶需求發生重大變化
- ⚠️ **技術限制**：遇到無法克服的技術困難

#### 功能特色
- ✅ **版本控制**：每次重新討論自動保存版本
- ✅ **原因記錄**：記錄為何需要重新討論
- ✅ **影響評估**：分析變更對專案的影響程度
- ✅ **歷史追蹤**：查看所有版本的演進歷史
- ✅ **智能建議**：根據原因提供相應建議

#### 操作方式
```bash
# 1. 在任何階段點擊「🔁 重新開始當前階段」
# 2. 選擇重新討論的原因：
#    - 市場變化、技術困難、新想法、用戶反饋等
# 3. 系統會：
#    - 保存當前討論為版本歷史
#    - 清空當前討論，重新開始
#    - 生成新的計畫書版本
#    - 重新載入對應階段的 skills
# 4. 點擊「📜 查看版本歷史」查看演進過程
```

#### 版本歷史示例
```
版本 1: v20260502_abc1
  階段: Phase 1
  時間: 2026-05-02 14:30
  原因: 初始版本
  影響: low

版本 2: v20260502_def2
  階段: Phase 1
  時間: 2026-05-02 16:45
  原因: 用戶反饋：發現原本假設的痛點不夠緊迫
  影響: high
  變更: 重新定義目標用戶和核心問題
```

---

## 📁 **專案計畫資料夾結構與命名規範**

### **標準資料夾結構**
```
project-plans/
├── 📁 {PROJECT_NAME}/                    # 具體專案資料夾
│   ├── 📄 {PROJECT_NAME}_YC_PLAN.md       # 專案計畫書
│   ├── ✅ {PROJECT_NAME}_PHASE_{1-5}_CHECKLIST.md  # 各階段檢核表
│   ├── 📊 {PROJECT_NAME}_PROGRESS.json   # 進度追蹤
│   └── 📜 {PROJECT_NAME}_VERSIONS.json    # 版本歷史
```

### **一致性命名方式**
```bash
# 專案資料夾
{PROJECT_NAME}/

# 計畫書
{PROJECT_NAME}_YC_PLAN.md

# 檢核表 (每個階段一個)
{PROJECT_NAME}_PHASE_1_CHECKLIST.md  # 構思與確認
{PROJECT_NAME}_PHASE_2_CHECKLIST.md  # 規劃與設計
{PROJECT_NAME}_PHASE_3_CHECKLIST.md  # 開發執行
{PROJECT_NAME}_PHASE_4_CHECKLIST.md  # 成長與驗證
{PROJECT_NAME}_PHASE_5_CHECKLIST.md  # 擴展與規模

# 進度追蹤
{PROJECT_NAME}_PROGRESS.json

# 版本歷史
{PROJECT_NAME}_VERSIONS.json
```

### **快速查找原則**
```bash
# 找某個專案的所有檔案
cd project-plans/{PROJECT_NAME}/
ls

# 找所有計畫書
find project-plans/ -name "*_YC_PLAN.md"

# 找所有 Phase 1 檢核表
find project-plans/ -name "*_PHASE_1_CHECKLIST.md"

# 找所有進度檔案
find project-plans/ -name "*_PROGRESS.json"
```

---

## 🔄 **自動化更新系統** (2026-05-11 新增)

### 🎯 **混合架構解決方案**

**本地開發 + Vercel 展示** 的數據同步架構：

```
本地專案更新 → 自動監控系統 → 重新掃描 → Git提交 → GitHub → Vercel自動部署 → 全球訪問
```

### 🚀 **三種使用方式**

#### **方式 1: 一鍵自動化（推薦）**
```bash
# 雙擊運行或命令行執行：
auto-update-and-deploy.bat
```

**執行步驟**:
1. ✅ 自動掃描所有專案
2. ✅ 自動提交變更到 Git
3. ✅ 自動推送到 GitHub
4. ✅ Vercel 自動重新部署
5. ✅ 2-3 分鐘後可在線查看最新數據

#### **方式 2: 自動監控模式**
```bash
# 啟動自動監控（每 5 分鐘檢查一次）
node watch-and-update.js
```

**功能特色**:
- 🔍 自動監控專案進度文件變化
- 🔄 偵測到變化自動執行更新流程
- 📦 自動觸發 Vercel 重新部署

#### **方式 3: 手動更新模式**
```bash
node watch-and-update.js --manual
```

### 📋 **監控的專案文件**

自動監控系統追蹤以下文件：
- `admission-master_PROGRESS.json`
- `social-master_PROGRESS.json`
- `project-planning-master_PROGRESS.json`
- 其他標準格式的 `*_PROGRESS.json` 文件

### 🛠️ **故障排除**

#### **掃描失敗**
```bash
# 檢查專案路徑是否正確
node scan-all-projects.js
```

#### **Git 推送失敗**
```bash
# 檢查 Git 設置
git remote -v
git status
```

#### **Vercel 沒有自動部署**
1. 檢查 GitHub 是否有新提交
2. 登入 Vercel Dashboard 查看部署狀態
3. 手動觸發重新部署

### ⏱️ **數據同步時間**

| 操作 | 時間 |
|------|------|
| 本地掃描 | 5-10 秒 |
| Git 提交推送 | 10-30 秒 |
| Vercel 部署 | 1-2 分鐘 |
| **總計** | **2-3 分鐘** |

---

**最後更新**: 2026-05-11 15:30:00 UTC