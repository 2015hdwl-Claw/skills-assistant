// console 測試格式轉換

// 模擬 social 格式資料
const socialData = {
    "project_name": "social-master",
    "project_code": "social",
    "last_updated": "2026-05-03T22:30:00Z",
    "current_phase": "Phase 3",
    "overall_progress": {
        "phase_1": {
            "name": "構思與確認",
            "status": "completed",
            "progress_percentage": 100,
            "start_date": "2026-04-27",
            "end_date": "2026-05-10"
        },
        "phase_2": {
            "name": "規劃與設計",
            "status": "in_progress",
            "progress_percentage": 30,
            "start_date": "2026-05-11"
        }
    }
};

console.log('🧪 測試 Social 格式轉換...');
console.log('原始資料:', JSON.stringify(socialData, null, 2));

// 格式轉換邏輯
const phaseMapping = {
    'phase_1': 'PHASE_1',
    'phase_2': 'PHASE_2',
    'phase_3': 'PHASE_3',
    'phase_4': 'PHASE_4',
    'phase_5': 'PHASE_5'
};

const phases = {};
let currentPhase = 'PHASE_1';

Object.entries(socialData.overall_progress).forEach(([key, phaseData]) => {
    if (key.startsWith('phase_') && typeof phaseData === 'object') {
        const standardPhaseId = phaseMapping[key];
        if (standardPhaseId) {
            if (phaseData.status === 'in_progress') {
                currentPhase = standardPhaseId;
            }

            phases[standardPhaseId] = {
                name: phaseData.name,
                status: phaseData.status,
                start_date: phaseData.start_date || null,
                end_date: phaseData.end_date || null,
                progress_percentage: phaseData.progress_percentage || 0,
                checklist_completion: '0/0'
            };
        }
    }
});

// 處理 current_phase
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

const normalized = {
    project_info: {
        name: socialData.project_code || 'unknown',
        current_phase: currentPhase,
        start_date: socialData.overall_progress.phase_1?.start_date || null,
        last_updated: socialData.last_updated || new Date().toISOString()
    },
    phases: phases
};

console.log('✅ 轉換結果:', JSON.stringify(normalized, null, 2));
console.log('✅ 當前階段:', currentPhase);
console.log('✅ 專案名稱:', normalized.project_info.name);
console.log('✅ 階段數量:', Object.keys(phases).length);