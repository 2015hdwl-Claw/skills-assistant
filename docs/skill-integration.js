// Skills Integration Layer - Dynamic Skill Loading and Personalization

class SkillsIntegration {
    constructor() {
        this.skillRegistry = new Map();
        this.usageAnalytics = new Map();
        this.effectivenessScores = new Map();
        this.recommendationEngine = new RecommendationEngine();

        this.initializeSkillRegistry();
        this.loadUsageData();
        this.initializeEffectivenessScoring();
    }

    // Initialize skill registry with metadata
    initializeSkillRegistry() {
        // Core Superpowers Skills
        const coreSkills = [
            {
                id: 'brainstorming',
                name: 'Brainstorming',
                description: 'Turn ideas into fully formed designs through collaborative dialogue',
                category: 'ideation',
                phases: ['Phase 1', 'Phase 2'],
                difficulty: 'beginner',
                duration: '30-45 minutes',
                prerequisites: [],
                tags: ['ideation', 'design', 'collaboration'],
                effectiveness: 0.92
            },
            {
                id: 'writing-plans',
                name: 'Writing Plans',
                description: 'Create detailed implementation plans from specifications',
                category: 'planning',
                phases: ['Phase 2', 'Phase 3'],
                difficulty: 'intermediate',
                duration: '45-60 minutes',
                prerequisites: ['brainstorming'],
                tags: ['planning', 'implementation', 'structure'],
                effectiveness: 0.88
            },
            {
                id: 'test-driven-development',
                name: 'Test Driven Development',
                description: 'Write tests first, then implement functionality',
                category: 'development',
                phases: ['Phase 3'],
                difficulty: 'intermediate',
                duration: 'varies',
                prerequisites: [],
                tags: ['testing', 'development', 'quality'],
                effectiveness: 0.95
            },
            {
                id: 'systematic-debugging',
                name: 'Systematic Debugging',
                description: 'Systematic approach to identifying and fixing bugs',
                category: 'development',
                phases: ['Phase 3', 'Phase 4'],
                difficulty: 'intermediate',
                duration: '15-30 minutes',
                prerequisites: [],
                tags: ['debugging', 'problem-solving', 'development'],
                effectiveness: 0.90
            },
            {
                id: 'dispatching-parallel-agents',
                name: 'Dispatching Parallel Agents',
                description: 'Coordinate multiple AI agents for parallel task execution',
                category: 'orchestration',
                phases: ['Phase 3', 'Phase 4'],
                difficulty: 'advanced',
                duration: 'varies',
                prerequisites: ['subagent-driven-development'],
                tags: ['orchestration', 'parallel', 'advanced'],
                effectiveness: 0.85
            }
        ];

        // Gstack Skills (example integration)
        const gstackSkills = [
            {
                id: 'gstack-architect',
                name: 'Gstack Architect',
                description: 'System design and architecture planning',
                category: 'architecture',
                phases: ['Phase 2'],
                difficulty: 'advanced',
                duration: '60-90 minutes',
                prerequisites: ['brainstorming'],
                tags: ['architecture', 'design', 'gstack'],
                effectiveness: 0.87
            },
            {
                id: 'gstack-dev',
                name: 'Gstack Developer',
                description: 'Code implementation and bug fixes',
                category: 'development',
                phases: ['Phase 3'],
                difficulty: 'intermediate',
                duration: 'varies',
                prerequisites: [],
                tags: ['development', 'coding', 'gstack'],
                effectiveness: 0.91
            }
        ];

        // Register all skills
        [...coreSkills, ...gstackSkills].forEach(skill => {
            this.skillRegistry.set(skill.id, skill);
        });

        console.log(`✅ Registered ${this.skillRegistry.size} skills`);
    }

    // Load usage data from localStorage
    loadUsageData() {
        try {
            const savedData = localStorage.getItem('skillsUsageData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.usageAnalytics = new Map(Object.entries(data));
            }
        } catch (error) {
            console.error('❌ Failed to load usage data:', error);
        }
    }

    // Save usage data to localStorage
    saveUsageData() {
        try {
            const data = Object.fromEntries(this.usageAnalytics);
            localStorage.setItem('skillsUsageData', JSON.stringify(data));
        } catch (error) {
            console.error('❌ Failed to save usage data:', error);
        }
    }

    // Initialize effectiveness scoring
    initializeEffectivenessScoring() {
        try {
            const savedScores = localStorage.getItem('skillsEffectivenessScores');
            if (savedScores) {
                const scores = JSON.parse(savedScores);
                this.effectivenessScores = new Map(Object.entries(scores));
            } else {
                // Initialize with default effectiveness from registry
                this.skillRegistry.forEach((skill, id) => {
                    this.effectivenessScores.set(id, skill.effectiveness);
                });
            }
        } catch (error) {
            console.error('❌ Failed to load effectiveness scores:', error);
        }
    }

    // Save effectiveness scores
    saveEffectivenessScores() {
        try {
            const scores = Object.fromEntries(this.effectivenessScores);
            localStorage.setItem('skillsEffectivenessScores', JSON.stringify(scores));
        } catch (error) {
            console.error('❌ Failed to save effectiveness scores:', error);
        }
    }

    // Get skills for current phase
    getSkillsForPhase(currentPhase, userLevel = 'intermediate') {
        const relevantSkills = [];

        this.skillRegistry.forEach(skill => {
            if (skill.phases.includes(currentPhase)) {
                // Filter by user level
                if (this.isSkillAppropriateForLevel(skill, userLevel)) {
                    relevantSkills.push(skill);
                }
            }
        });

        // Sort by effectiveness
        return relevantSkills.sort((a, b) => {
            const scoreA = this.effectivenessScores.get(a.id) || a.effectiveness;
            const scoreB = this.effectivenessScores.get(b.id) || b.effectiveness;
            return scoreB - scoreA;
        });
    }

    // Check if skill is appropriate for user level
    isSkillAppropriateForLevel(skill, userLevel) {
        const levels = ['beginner', 'intermediate', 'advanced'];
        const skillLevel = levels.indexOf(skill.difficulty);
        const userLevelIndex = levels.indexOf(userLevel);

        // Users can use skills at their level or one level below
        return skillLevel <= userLevelIndex + 1;
    }

    // Track skill usage
    trackSkillUsage(skillId, success = true, duration = 0) {
        if (!this.usageAnalytics.has(skillId)) {
            this.usageAnalytics.set(skillId, {
                totalUses: 0,
                successfulUses: 0,
                totalDuration: 0,
                lastUsed: null,
                averageSuccess: 0
            });
        }

        const analytics = this.usageAnalytics.get(skillId);
        analytics.totalUses++;
        if (success) {
            analytics.successfulUses++;
        }
        analytics.totalDuration += duration;
        analytics.lastUsed = new Date().toISOString();
        analytics.averageSuccess = (analytics.successfulUses / analytics.totalUses * 100).toFixed(1);

        this.usageAnalytics.set(skillId, analytics);
        this.saveUsageData();

        // Update effectiveness score
        this.updateEffectivenessScore(skillId, success);
    }

    // Update effectiveness score based on usage
    updateEffectivenessScore(skillId, success) {
        const currentScore = this.effectivenessScores.get(skillId) || 0.5;
        const baseEffectiveness = this.skillRegistry.get(skillId)?.effectiveness || 0.5;

        // Weighted average: 70% base effectiveness, 30% user experience
        const newScore = success ?
            Math.min(1.0, currentScore + 0.05) :
            Math.max(0.1, currentScore - 0.03);

        const weightedScore = (baseEffectiveness * 0.7 + newScore * 0.3);
        this.effectivenessScores.set(skillId, weightedScore);
        this.saveEffectivenessScores();
    }

    // Get skill usage statistics
    getSkillUsageStats(skillId = null) {
        if (skillId) {
            return this.usageAnalytics.get(skillId) || null;
        }

        // Return stats for all skills
        const allStats = {};
        this.usageAnalytics.forEach((stats, id) => {
            allStats[id] = stats;
        });
        return allStats;
    }

    // Get most used skills
    getMostUsedSkills(limit = 5) {
        return Array.from(this.usageAnalytics.entries())
            .sort(([,a], [,b]) => b.totalUses - a.totalUses)
            .slice(0, limit)
            .map(([id, stats]) => ({
                id,
                ...this.skillRegistry.get(id),
                ...stats
            }));
    }

    // Get personalized recommendations
    getPersonalizedRecommendations(userContext) {
        return this.recommendationEngine.generateRecommendations(
            this.skillRegistry,
            this.usageAnalytics,
            this.effectivenessScores,
            userContext
        );
    }

    // Get skill learning path
    getLearningPath(userLevel = 'beginner', targetSkills = []) {
        const path = [];
        const completedSkills = new Set();

        // If target skills specified, build path to those skills
        if (targetSkills.length > 0) {
            targetSkills.forEach(targetId => {
                const pathToSkill = this.buildPathToSkill(targetId, userLevel);
                pathToSkill.forEach(skill => {
                    if (!completedSkills.has(skill.id)) {
                        path.push(skill);
                        completedSkills.add(skill.id);
                    }
                });
            });
        } else {
            // Build general learning path for user level
            const appropriateSkills = this.getSkillsForPhase('Phase 1', userLevel);
            path.push(...appropriateSkills);
        }

        return path;
    }

    // Build path to a specific skill (including prerequisites)
    buildPathToSkill(skillId, userLevel) {
        const path = [];
        const skill = this.skillRegistry.get(skillId);

        if (!skill) {
            return path;
        }

        // Add prerequisites first
        skill.prerequisites.forEach(prereqId => {
            const prereqPath = this.buildPathToSkill(prereqId, userLevel);
            path.push(...prereqPath);
        });

        // Add the skill itself
        if (this.isSkillAppropriateForLevel(skill, userLevel)) {
            path.push(skill);
        }

        return path;
    }

    // Search skills by tag
    searchSkillsByTag(tag) {
        const results = [];
        this.skillRegistry.forEach(skill => {
            if (skill.tags.includes(tag)) {
                results.push(skill);
            }
        });
        return results;
    }

    // Search skills by category
    searchSkillsByCategory(category) {
        const results = [];
        this.skillRegistry.forEach(skill => {
            if (skill.category === category) {
                results.push(skill);
            }
        });
        return results;
    }

    // Get skill details
    getSkillDetails(skillId) {
        const skill = this.skillRegistry.get(skillId);
        if (!skill) {
            return null;
        }

        const usage = this.usageAnalytics.get(skillId);
        const effectiveness = this.effectivenessScores.get(skillId);

        return {
            ...skill,
            usage: usage || {
                totalUses: 0,
                successfulUses: 0,
                averageSuccess: 0
            },
            effectiveness: effectiveness || skill.effectiveness
        };
    }

    // Export skill data
    exportSkillData() {
        return {
            registry: Array.from(this.skillRegistry.values()),
            usage: Object.fromEntries(this.usageAnalytics),
            effectiveness: Object.fromEntries(this.effectivenessScores),
            exportedAt: new Date().toISOString()
        };
    }

    // Import skill data
    importSkillData(data) {
        try {
            if (data.registry) {
                data.registry.forEach(skill => {
                    this.skillRegistry.set(skill.id, skill);
                });
            }

            if (data.usage) {
                this.usageAnalytics = new Map(Object.entries(data.usage));
            }

            if (data.effectiveness) {
                this.effectivenessScores = new Map(Object.entries(data.effectiveness));
            }

            this.saveUsageData();
            this.saveEffectivenessScores();

            console.log('✅ Skill data imported successfully');
        } catch (error) {
            console.error('❌ Failed to import skill data:', error);
        }
    }
}

// Recommendation Engine
class RecommendationEngine {
    generateRecommendations(skillRegistry, usageAnalytics, effectivenessScores, userContext) {
        const recommendations = [];
        const { currentPhase, userLevel, recentTasks, goals } = userContext;

        // Get skills appropriate for current phase and level
        const phaseSkills = Array.from(skillRegistry.values())
            .filter(skill =>
                skill.phases.includes(currentPhase) &&
                this.isSkillAppropriateForLevel(skill, userLevel)
            );

        // Analyze usage patterns
        const usagePatterns = this.analyzeUsagePatterns(usageAnalytics);

        // Generate different types of recommendations

        // 1. High-effectiveness skills not used recently
        const unusedEffectiveSkills = phaseSkills.filter(skill => {
            const usage = usageAnalytics.get(skill.id);
            const effectiveness = effectivenessScores.get(skill.id) || skill.effectiveness;
            return (!usage || usage.totalUses === 0) && effectiveness > 0.8;
        });

        unusedEffectiveSkills.forEach(skill => {
            recommendations.push({
                type: 'high_effectiveness',
                priority: 'high',
                skill: skill.id,
                reason: `High effectiveness skill (${(effectivenessScores.get(skill.id) * 100).toFixed(0)}%) that you haven't tried yet`,
                confidence: effectivenessScores.get(skill.id)
            });
        });

        // 2. Skills that complement recent successful tasks
        if (recentTasks && recentTasks.length > 0) {
            const complementarySkills = this.findComplementarySkills(recentTasks, phaseSkills, skillRegistry);
            complementarySkills.forEach(skill => {
                recommendations.push({
                    type: 'complementary',
                    priority: 'medium',
                    skill: skill.id,
                    reason: `Complements your recent work with ${recentTasks[0]}`,
                    confidence: 0.75
                });
            });
        }

        // 3. Learning path progression
        if (userLevel === 'beginner' && usagePatterns.totalUsage > 5) {
            const intermediateSkills = phaseSkills.filter(skill => skill.difficulty === 'intermediate');
            intermediateSkills.forEach(skill => {
                recommendations.push({
                    type: 'level_progression',
                    priority: 'medium',
                    skill: skill.id,
                    reason: 'Ready to advance to intermediate skills',
                    confidence: 0.70
                });
            });
        }

        // 4. Goal-oriented recommendations
        if (goals) {
            const goalSkills = this.findSkillsForGoals(goals, phaseSkills);
            goalSkills.forEach(skill => {
                recommendations.push({
                    type: 'goal_oriented',
                    priority: 'high',
                    skill: skill.id,
                    reason: `Aligns with your goal: ${goals.primary}`,
                    confidence: 0.85
                });
            });
        }

        // Sort by priority and confidence
        return recommendations.sort((a, b) => {
            const priorityWeight = { high: 3, medium: 2, low: 1 };
            const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
            if (priorityDiff !== 0) return priorityDiff;
            return b.confidence - a.confidence;
        }).slice(0, 5); // Top 5 recommendations
    }

    isSkillAppropriateForLevel(skill, userLevel) {
        const levels = ['beginner', 'intermediate', 'advanced'];
        const skillLevel = levels.indexOf(skill.difficulty);
        const userLevelIndex = levels.indexOf(userLevel);
        return skillLevel <= userLevelIndex + 1;
    }

    analyzeUsagePatterns(usageAnalytics) {
        let totalUsage = 0;
        let successfulUsage = 0;
        const mostUsedSkill = { id: null, count: 0 };

        usageAnalytics.forEach((stats, id) => {
            totalUsage += stats.totalUses;
            successfulUsage += stats.successfulUses;
            if (stats.totalUses > mostUsedSkill.count) {
                mostUsedSkill.id = id;
                mostUsedSkill.count = stats.totalUses;
            }
        });

        return {
            totalUsage,
            successfulUsage,
            successRate: totalUsage > 0 ? (successfulUsage / totalUsage) : 0,
            mostUsedSkill
        };
    }

    findComplementarySkills(recentTasks, phaseSkills, skillRegistry) {
        const complementary = [];
        const recentTaskSkills = recentTasks.map(task => {
            // Find skill that matches task
            return Array.from(skillRegistry.values()).find(skill =>
                skill.id.includes(task) || skill.name.includes(task)
            );
        }).filter(Boolean);

        phaseSkills.forEach(skill => {
            if (skill.tags.some(tag => recentTaskSkills.some(rs =>
                rs.tags && rs.tags.includes(tag) && rs.id !== skill.id
            ))) {
                complementary.push(skill);
            }
        });

        return complementary;
    }

    findSkillsForGoals(goals, phaseSkills) {
        const goalSkills = [];
        const goalKeywords = goals.primary.toLowerCase().split(/\s+/);

        phaseSkills.forEach(skill => {
            const skillText = `${skill.name} ${skill.description} ${skill.tags.join(' ')}`.toLowerCase();
            if (goalKeywords.some(keyword => skillText.includes(keyword))) {
                goalSkills.push(skill);
            }
        });

        return goalSkills;
    }
}

// Global instance
const skillsIntegration = new SkillsIntegration();

// Export for use in other files
window.skillsIntegration = skillsIntegration;
window.SkillsIntegration = SkillsIntegration;
window.RecommendationEngine = RecommendationEngine;