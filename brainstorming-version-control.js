/**
 * Brainstorming 版本控制系統
 * 支援階段重新討論和計畫書修正
 */

class BrainstormingVersionControl {
    constructor() {
        this.versions = [];
        this.currentVersion = null;
    }

    /**
     * 創建新版本
     */
    createVersion(phase, reason, contributions, previousVersion = null) {
        const version = {
            id: this.generateVersionId(),
            timestamp: new Date().toISOString(),
            phase: phase,
            reason: reason,                    // 為什麼需要重新討論
            contributions: contributions,
            previousVersion: previousVersion,  // 上一個版本 ID
            status: 'draft',                  // draft, active, archived
            metadata: {
                trigger: this.identifyTrigger(reason),
                impact: this.assessImpact(phase, reason),
                recommendations: this.getRecommendations(phase, reason)
            }
        };

        this.versions.push(version);
        this.currentVersion = version.id;

        return version;
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
        const triggers = {
            '市場變化': 'market_change',
            '技術困難': 'technical_challenge',
            '新想法': 'new_idea',
            '用戶反饋': 'user_feedback',
            '競爭變化': 'competition_change',
            '資源限制': 'resource_constraint',
            '團隊變化': 'team_change',
            '其他': 'other'
        };

        for (const [keyword, type] of Object.entries(triggers)) {
            if (reason.includes(keyword)) {
                return type;
            }
        }

        return 'other';
    }

    /**
     * 評估影響範圍
     */
    assessImpact(currentPhase, reason) {
        const impactLevels = {
            'PHASE_1': {
                low: ['新想法', '團隊變化'],
                medium: ['市場變化', '競爭變化'],
                high: ['技術困難', '用戶反饋', '資源限制']
            },
            'PHASE_2': {
                low: ['團隊變化'],
                medium: ['新想法', '競爭變化'],
                high: ['市場變化', '技術困難', '用戶反饋', '資源限制']
            },
            'PHASE_3': {
                low: [],
                medium: ['新想法', '競爭變化'],
                high: ['市場變化', '技術困難', '用戶反饋', '資源限制', '團隊變化']
            },
            'PHASE_4': {
                low: [],
                medium: ['新想法'],
                high: ['市場變化', '技術困難', '用戶反饋', '競爭變化', '資源限制']
            },
            'PHASE_5': {
                low: [],
                medium: ['新想法'],
                high: ['市場變化', '技術困難', '用戶反饋', '競爭變化', '資源限制']
            }
        };

        const trigger = this.identifyTrigger(reason);
        const phaseImpacts = impactLevels[currentPhase] || {};

        if (phaseImpacts.low?.includes(trigger)) return 'low';
        if (phaseImpacts.medium?.includes(trigger)) return 'medium';
        return 'high';
    }

    /**
     * 獲取建議
     */
    getRecommendations(phase, reason) {
        const trigger = this.identifyTrigger(reason);
        const impact = this.assessImpact(phase, reason);

        const recommendations = {
            'market_change': {
                high: [
                    '立即回到 Phase 1 重新評估市場機會',
                    '進行新的用戶訪談驗證',
                    '更新競爭分析',
                    '考慮調整目標用戶群體'
                ],
                medium: [
                    '更新市場分析和規模評估',
                    '驗證新發現的市場機會',
                    '調整商業模式'
                ],
                low: [
                    '記錄市場變化觀察',
                    '在下一階段考慮調整'
                ]
            },
            'technical_challenge': {
                high: [
                    '回到 Phase 1 重新評估產品可行性',
                    '尋求技術專家意見',
                    '考慮技術替代方案',
                    '可能需要調整產品功能範圍'
                ],
                medium: [
                    '在 Phase 2 更新技術架構',
                    '進行技術驗證測試',
                    '調整開發時間表'
                ],
                low: [
                    '記錄技術挑戰',
                    '在技術審查時處理'
                ]
            },
            'new_idea': {
                high: [
                    '回到 Phase 1 評估新想法的優先級',
                    '比較新想法與原方向',
                    '可能需要重新定義產品'
                ],
                medium: [
                    '在當前階段評估新想法',
                    '考慮是否作為未來功能',
                    '不影響當前開發進度'
                ],
                low: [
                    '記錄想法供將來參考',
                    '在產品路徑圖中考慮'
                ]
            },
            'user_feedback': {
                high: [
                    '立即回應重要用戶反饋',
                    '可能回到 Phase 1/2 重新設計',
                    '優先處理用戶痛點'
                ],
                medium: [
                    '在當前迭代中納入反饋',
                    '調整功能優先級',
                    '更新用戶體驗設計'
                ],
                low: [
                    '記錄反饋供未來改進',
                    '在產品更新時考慮'
                ]
            }
        };

        return recommendations[trigger]?.[impact] || [
            '記錄變化原因',
            '評估對當前階段的影響',
            '決定是否需要調整方向'
        ];
    }

    /**
     * 比較兩個版本的差異
     */
    compareVersions(versionId1, versionId2) {
        const version1 = this.versions.find(v => v.id === versionId1);
        const version2 = this.versions.find(v => v.id === versionId2);

        if (!version1 || !version2) {
            throw new Error('找不到指定的版本');
        }

        return {
            version1: {
                id: version1.id,
                phase: version1.phase,
                timestamp: version1.timestamp
            },
            version2: {
                id: version2.id,
                phase: version2.phase,
                timestamp: version2.timestamp
            },
            differences: this.identifyDifferences(version1, version2),
            impact: this.compareImpact(version1, version2)
        };
    }

    /**
     * 識別版本差異
     */
    identifyDifferences(version1, version2) {
        const differences = {
            phase: version1.phase !== version2.phase,
            contributionCount: version1.contributions.length !== version2.contributions.length,
            roles: this.compareRoles(version1.contributions, version2.contributions),
            content: this.compareContent(version1.contributions, version2.contributions)
        };

        return differences;
    }

    /**
     * 比較角色參與
     */
    compareRoles(contributions1, contributions2) {
        const roles1 = new Set(contributions1.map(c => c.role));
        const roles2 = new Set(contributions2.map(c => c.role));

        return {
            added: [...roles2].filter(r => !roles1.has(r)),
            removed: [...roles1].filter(r => !roles2.has(r)),
            same: [...roles1].filter(r => roles2.has(r))
        };
    }

    /**
     * 比較內容變化
     */
    compareContent(contributions1, contributions2) {
        const changes = [];

        // 比較相同角色的內容變化
        contributions1.forEach(c1 => {
            const c2 = contributions2.find(c => c.role === c1.role);
            if (c2 && c1.content !== c2.content) {
                changes.push({
                    role: c1.role,
                    oldContent: c1.content.substring(0, 100) + '...',
                    newContent: c2.content.substring(0, 100) + '...',
                    similarity: this.calculateSimilarity(c1.content, c2.content)
                });
            }
        });

        return changes;
    }

    /**
     * 計算文本相似度
     */
    calculateSimilarity(text1, text2) {
        const words1 = text1.split(/\s+/);
        const words2 = text2.split(/\s+/);
        const set1 = new Set(words1);
        const set2 = new Set(words2);
        const intersection = [...set1].filter(x => set2.has(x));
        const union = new Set([...set1, ...set2]);
        return (intersection.length / union.length * 100).toFixed(1) + '%';
    }

    /**
     * 比較影響程度
     */
    compareImpact(version1, version2) {
        const trigger1 = this.identifyTrigger(version1.reason);
        const trigger2 = this.identifyTrigger(version2.reason);
        const impact1 = this.assessImpact(version1.phase, version1.reason);
        const impact2 = this.assessImpact(version2.phase, version2.reason);

        return {
            version1: { trigger: trigger1, impact: impact1 },
            version2: { trigger: trigger2, impact: impact2 },
            trend: this.compareImpactTrend(impact1, impact2)
        };
    }

    /**
     * 比較影響趨勢
     */
    compareImpactTrend(impact1, impact2) {
        const levels = { low: 1, medium: 2, high: 3 };
        const level1 = levels[impact1] || 1;
        const level2 = levels[impact2] || 1;

        if (level2 > level1) return 'increasing';
        if (level2 < level1) return 'decreasing';
        return 'stable';
    }

    /**
     * 獲取版本歷史
     */
    getVersionHistory(limit = 10) {
        return this.versions
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit)
            .map(version => ({
                id: version.id,
                phase: version.phase,
                timestamp: version.timestamp,
                reason: version.reason,
                status: version.status,
                trigger: version.metadata.trigger,
                impact: version.metadata.impact
            }));
    }

    /**
     * 歸檔舊版本
     */
    archiveVersion(versionId) {
        const version = this.versions.find(v => v.id === versionId);
        if (version) {
            version.status = 'archived';
        }
    }

    /**
     * 恢復版本
     */
    restoreVersion(versionId) {
        const version = this.versions.find(v => v.id === versionId);
        if (version) {
            this.currentVersion = versionId;
            return version;
        }
        throw new Error('找不到指定的版本');
    }

    /**
     * 導出版本比較報告
     */
    exportVersionReport(versionId) {
        const version = this.versions.find(v => v.id === versionId);
        if (!version) {
            throw new Error('找不到指定的版本');
        }

        const previousVersion = version.previousVersion ?
            this.versions.find(v => v.id === version.previousVersion) : null;

        let report = `# Brainstorming 版本報告\n\n`;
        report += `## 版本資訊\n`;
        report += `- **版本 ID**: ${version.id}\n`;
        report += `- **階段**: ${version.phase}\n`;
        report += `- **時間**: ${version.timestamp}\n`;
        report += `- **狀態**: ${version.status}\n\n`;

        report += `## 變更原因\n`;
        report += `**${version.reason}**\n\n`;

        report += `## 影響分析\n`;
        report += `- **觸發類型**: ${version.metadata.trigger}\n`;
        report += `- **影響程度**: ${version.metadata.impact}\n\n`;

        if (previousVersion) {
            const comparison = this.compareVersions(versionId, previousVersion.id);
            report += `## 版本比較\n`;
            report += `與前一版本的差異分析\n\n`;
        }

        report += `## 建議行動\n`;
        version.metadata.recommendations.forEach((rec, index) => {
            report += `${index + 1}. ${rec}\n`;
        });

        return report;
    }
}

// 使用示例
const versionControl = new BrainstormingVersionControl();

// 當需要重新討論某個階段時
function restartPhaseBrainstorming(phase, reason, currentContributions) {
    // 1. 創建新版本
    const newVersion = versionControl.createVersion(
        phase,
        reason,
        [], // 新的貢獻將在重新討論中填入
        versionControl.currentVersion
    );

    // 2. 獲取建議
    const recommendations = newVersion.metadata.recommendations;

    // 3. 顯示給用戶
    console.log(`創建版本 ${newVersion.id}`);
    console.log('建議行動:', recommendations);

    return newVersion;
}

// 比較不同版本
function comparePlanVersions(versionId1, versionId2) {
    const comparison = versionControl.compareVersions(versionId1, versionId2);
    return comparison;
}