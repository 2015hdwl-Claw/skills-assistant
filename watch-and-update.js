/**
 * Skills Assistant - 自動監控與更新系統
 *
 * 功能：
 * 1. 監控專案目錄中的 PROGRESS.json 文件變化
 * 2. 自動執行掃描和更新流程
 * 3. 支援手動和定時執行
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const CONFIG = {
    projectsRoot: 'C:\\Users\\ntpud\\.claude\\projects',
    skillsAssistantDir: 'C:\\Users\\ntpud\\.claude\\projects\\skills-assistant',
    checkInterval: 5 * 60 * 1000, // 5 分鐘檢查一次
    watchFiles: [
        'admission-master_PROGRESS.json',
        'social-master_PROGRESS.json',
        'project-planning-master_PROGRESS.json'
    ]
};

// 日誌系統
function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const icon = {
        'info': 'ℹ️',
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'update': '🔄'
    }[type] || 'ℹ️';

    console.log(`[${timestamp}] ${icon} ${message}`);
}

// 檢查專案數據是否有變化
function checkForChanges() {
    const cacheFile = path.join(CONFIG.skillsAssistantDir, '.last-scan-cache.json');
    let lastScanData = {};

    // 讀取上次掃描的緩存
    if (fs.existsSync(cacheFile)) {
        try {
            lastScanData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
        } catch (error) {
            log('無法讀取緩存文件，將執行完整掃描', 'warning');
        }
    }

    let hasChanges = false;
    const currentData = {};

    // 檢查每個專案的 PROGRESS.json
    CONFIG.watchFiles.forEach(filename => {
        const filePath = path.join(CONFIG.projectsRoot, filename.replace('_PROGRESS.json', ''), filename);

        if (fs.existsSync(filePath)) {
            try {
                const stats = fs.statSync(filePath);
                const content = fs.readFileSync(filePath, 'utf8');
                const hash = require('crypto').createHash('md5').update(content).digest('hex');

                currentData[filename] = {
                    mtime: stats.mtime.getTime(),
                    hash: hash
                };

                // 比較是否有變化
                if (!lastScanData[filename] ||
                    lastScanData[filename].hash !== hash ||
                    lastScanData[filename].mtime !== stats.mtime.getTime()) {
                    hasChanges = true;
                    log(`偵測到變化: ${filename}`, 'update');
                }
            } catch (error) {
                log(`無法讀取 ${filename}: ${error.message}`, 'error');
            }
        }
    });

    return { hasChanges, currentData };
}

// 執行掃描和更新
async function executeUpdate() {
    log('開始執行更新流程...', 'update');

    try {
        // 切換到 skills-assistant 目錄
        process.chdir(CONFIG.skillsAssistantDir);

        // 執行掃描腳本
        log('執行專案掃描...', 'info');
        execSync('node scan-all-projects.js', { stdio: 'inherit' });

        // Git 提交和推送
        log('提交變更到 Git...', 'info');
        try {
            execSync('git add all-projects-index.json project-detail.html all-projects-progress.html', { stdio: 'inherit' });
            execSync(`git commit -m "auto: update project data ${new Date().toISOString()}"`, { stdio: 'inherit' });
            log('變更已提交', 'success');
        } catch (error) {
            if (error.message.includes('nothing to commit')) {
                log('沒有新變更需要提交', 'info');
            } else {
                throw error;
            }
        }

        // 推送到 GitHub
        log('推送到 GitHub...', 'info');
        execSync('git push origin main', { stdio: 'inherit' });

        log('✅ 更新完成！Vercel 將自動部署', 'success');
        return true;

    } catch (error) {
        log(`更新失敗: ${error.message}`, 'error');
        return false;
    }
}

// 更新緩存
function updateCache(currentData) {
    const cacheFile = path.join(CONFIG.skillsAssistantDir, '.last-scan-cache.json');
    fs.writeFileSync(cacheFile, JSON.stringify(currentData, null, 2));
}

// 主監控循環
async function startMonitoring() {
    log('🚀 Skills Assistant 自動監控系統啟動', 'success');
    log(`📁 監控目錄: ${CONFIG.projectsRoot}`, 'info');
    log(`⏱️ 檢查間隔: ${CONFIG.checkInterval / 1000} 秒`, 'info');
    log('📋 監控文件:', 'info');
    CONFIG.watchFiles.forEach(file => log(`   - ${file}`, 'info'));

    log('按 Ctrl+C 停止監控', 'warning');
    log('', 'info');

    // 立即執行一次檢查
    const { hasChanges, currentData } = checkForChanges();
    if (hasChanges) {
        await executeUpdate();
        updateCache(currentData);
    } else {
        updateCache(currentData);
        log('沒有偵測到變化，等待下次檢查...', 'info');
    }

    // 定時監控循環
    setInterval(async () => {
        const { hasChanges, currentData } = checkForChanges();

        if (hasChanges) {
            await executeUpdate();
            updateCache(currentData);
        } else {
            updateCache(currentData);
        }
    }, CONFIG.checkInterval);
}

// 手動執行模式
async function manualUpdate() {
    log('🔄 手動執行更新模式', 'update');
    const success = await executeUpdate();
    process.exit(success ? 0 : 1);
}

// 命令行參數處理
const args = process.argv.slice(2);
if (args.includes('--manual') || args.includes('-m')) {
    manualUpdate();
} else if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Skills Assistant - 自動監控與更新系統

用法：
  node watch-and-update.js           # 啟動自動監控
  node watch-and-update.js --manual  # 手動執行一次更新
  node watch-and-update.js --help    # 顯示幫助

功能：
  - 自動監控專案進度文件變化
  - 自動執行掃描和更新流程
  - 自動提交到 Git 並推送
  - 觸發 Vercel 自動部署
    `);
} else {
    startMonitoring();
}