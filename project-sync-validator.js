// 專案檔案同步驗證系統
// 確保 PROGRESS.json 和 YC_PLAN.md 保持一致

class ProjectFileSyncValidator {
    constructor() {
        this.syncStatus = {
            isConsistent: false,
            differences: [],
            lastCheck: null
        };
    }

    // 驗證專案檔案同步狀態
    async validateProjectSync(projectName) {
        const results = {
            projectName: projectName,
            timestamp: new Date().toISOString(),
            isConsistent: true,
            differences: [],
            recommendations: []
        };

        try {
            // 讀取兩個檔案
            const progressData = await this.readProgressFile(projectName);
            const planData = await this.readPlanFile(projectName);

            if (!progressData || !planData) {
                results.isConsistent = false;
                results.differences.push('缺少必要的檔案');
                return results;
            }

            // 比較當前階段
            const progressPhase = this.extractCurrentPhase(progressData);
            const planPhase = this.extractCurrentPhaseFromPlan(planData);

            if (progressPhase !== planPhase) {
                results.isConsistent = false;
                results.differences.push({
                    type: 'phase_mismatch',
                    progress: progressPhase,
                    plan: planPhase,
                    severity: 'high'
                });
            }

            // 比較完成度
            const progressCompletion = this.extractCompletion(progressData);
            const planCompletion = this.extractCompletionFromPlan(planData);

            if (Math.abs(progressCompletion - planCompletion) > 10) {
                results.isConsistent = false;
                results.differences.push({
                    type: 'completion_mismatch',
                    progress: progressCompletion,
                    plan: planCompletion,
                    severity: 'medium'
                });
            }

            // 比較更新時間
            const progressDate = new Date(progressData.last_updated || progressData.meta?.last_updated);
            const planDate = this.extractLastUpdateFromPlan(planData);

            if (planDate && progressDate) {
                const daysDiff = Math.abs((progressDate - planDate) / (1000 * 60 * 60 * 24));
                if (daysDiff > 7) {
                    results.differences.push({
                        type: 'update_stale',
                        days: daysDiff,
                        severity: 'medium'
                    });
                }
            }

            // 生成建議
            if (!results.isConsistent) {
                results.recommendations = this.generateRecommendations(results.differences, progressData);
            }

        } catch (error) {
            results.isConsistent = false;
            results.differences.push({
                type: 'validation_error',
                error: error.message,
                severity: 'high'
            });
        }

        return results;
    }

    // 讀取進度檔案
    async readProgressFile(projectName) {
        try {
            const response = await fetch(`./${projectName}_PROGRESS.json`);
            if (!response.ok) return null;
            return await response.json();
        } catch {
            return null;
        }
    }

    // 讀取計畫書
    async readPlanFile(projectName) {
        try {
            const response = await fetch(`./${projectName}_YC_PLAN.md`);
            if (!response.ok) return null;
            const text = await response.text();
            return { content: text };
        } catch {
            return null;
        }
    }

    // 從進度檔案提取當前階段
    extractCurrentPhase(progressData) {
        if (progressData.meta?.current_phase) {
            return `Phase ${progressData.meta.current_phase}`;
        } else if (progressData.project_info?.current_phase) {
            return progressData.project_info.current_phase;
        } else if (progressData.phases) {
            // 尋找最後一個完成的階段
            const phases = Object.values(progressData.phases);
            const lastCompleted = phases.filter(p => p.status === 'completed').pop();
            if (lastCompleted) return `Phase completed: ${lastCompleted.name}`;
        }
        return 'Unknown';
    }

    // 從計畫書提取當前階段
    extractCurrentPhaseFromPlan(planData) {
        const content = planData.content;
        const phaseMatch = content.match(/當前階段.*Phase\s*(\d+)/);
        if (phaseMatch) {
            return `Phase ${phaseMatch[1]}`;
        }

        // 尋找最後一個有更新日期的階段
        const sectionMatches = content.match(/##\s*Phase\s*\d+:[^\n]*([^\n]+)/g);
        if (sectionMatches) {
            return sectionMatches[sectionMatches.length - 1];
        }

        return 'Unknown';
    }

    // 提取完成度
    extractCompletion(progressData) {
        if (progressData.meta?.overall_completion) {
            return Math.round(progressData.meta.overall_completion * 100);
        } else if (progressData.phases) {
            const phases = Object.values(progressData.phases);
            const totalProgress = phases.reduce((sum, phase) =>
                sum + (phase.completion_percentage || phase.progress_percentage || 0), 0);
            return Math.round(totalProgress / phases.length);
        }
        return 0;
    }

    // 從計畫書提取完成度
    extractCompletionFromPlan(planData) {
        const content = planData.content;
        const progressMatch = content.match(/整體進度[：:]\s*(\d+)%/);
        if (progressMatch) {
            return parseInt(progressMatch[1]);
        }

        // 根據完成的檢核項目估算
        const totalChecks = (content.match(/\[x\]/g) || []).length;
        const totalItems = (content.match(/\[[x\s]\]/g) || []).length;
        if (totalItems > 0) {
            return Math.round((totalChecks / totalItems) * 100);
        }

        return 0;
    }

    // 提取最後更新時間
    extractLastUpdateFromPlan(planData) {
        const content = planData.content;
        const updateMatch = content.match(/最後更新[：:]\s*(\d{4}-\d{2}-\d{2})/);
        if (updateMatch) {
            return new Date(updateMatch[1]);
        }
        return null;
    }

    // 生成修正建議
    generateRecommendations(differences, progressData) {
        const recommendations = [];

        differences.forEach(diff => {
            switch (diff.type) {
                case 'phase_mismatch':
                    recommendations.push({
                        priority: 'HIGH',
                        action: '更新 YC_PLAN.md 的當前階段',
                        details: `進度檔案顯示 ${diff.progress}，但計畫書顯示 ${diff.plan}`,
                        solution: `將計畫書中的"當前階段"更新為 ${diff.progress}`
                    });
                    break;

                case 'completion_mismatch':
                    recommendations.push({
                        priority: 'MEDIUM',
                        action: '同步完成度百分比',
                        details: `進度檔案: ${diff.progress}% vs 計畫書: ${diff.plan}%`,
                        solution: `以 PROGRESS.json 為準，更新計畫書進度`
                    });
                    break;

                case 'update_stale':
                    recommendations.push({
                        priority: 'MEDIUM',
                        action: '更新計畫書時間戳',
                        details: `計畫書已 ${diff.days} 天未更新`,
                        solution: `更新計畫書的"最後更新"欄位`
                    });
                    break;
            }
        });

        return recommendations;
    }

    // 顯示驗證結果
    displayValidationResults(results) {
        console.log('📋 專案檔案同步驗證結果:');
        console.log(`專案: ${results.projectName}`);
        console.log(`同步狀態: ${results.isConsistent ? '✅ 一致' : '❌ 不一致'}`);

        if (!results.isConsistent) {
            console.log('發現差異:');
            results.differences.forEach((diff, index) => {
                console.log(`  ${index + 1}. ${diff.type} (${diff.severity})`);
                if (diff.type === 'phase_mismatch') {
                    console.log(`     進度: ${diff.progress} vs 計畫: ${diff.plan}`);
                }
            });

            console.log('建議修正:');
            results.recommendations.forEach((rec, index) => {
                console.log(`  ${index + 1}. [${rec.priority}] ${rec.action}`);
                console.log(`     ${rec.details}`);
                console.log(`     解決: ${rec.solution}`);
            });
        }
    }
}

// 導出供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectFileSyncValidator;
}