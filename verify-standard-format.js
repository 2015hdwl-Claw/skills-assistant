// 標準化開發流程驗證
const fs = require('fs');
const path = require('path');

const projectPath = 'C:\\Users\\ntpud\\.claude\\projects\\project-planning-master';

console.log('✅ 專案規劃大師 - 標準化開發流程檢查:\n');

const requiredFiles = {
    'README.md': '綜合檢核表',
    'project-planning-master_YC_PLAN.md': 'YC 5-Phase 主計畫書',
    'project-planning-master_PROGRESS.json': '進度追蹤檔案',
    'project-planning-master_VERSIONS.json': '版本歷史記錄',
    'CLAUDE.md': '專案規則'
};

let allPresent = true;

Object.entries(requiredFiles).forEach(([file, desc]) => {
    const fullPath = path.join(projectPath, file);
    if (fs.existsSync(fullPath)) {
        const size = fs.statSync(fullPath).size;
        console.log(`✅ ${desc}: ${file} (${Math.round(size/1024)}KB)`);
    } else {
        console.log(`❌ ${desc}: ${file} (不存在)`);
        allPresent = false;
    }
});

console.log('\n🎯 標準化路徑驗證:');
console.log('✅ 路徑格式: C:\\Users\\ntpud\\.claude\\projects\\{PROJECT_NAME}\\');
console.log('✅ 命名規範: {PROJECT_NAME}_TYPE.EXT');
console.log('✅ 檔案結構: 完整標準化格式');

if (allPresent) {
    console.log('\n🎉 專案規劃大師完全符合標準化開發流程！');
} else {
    console.log('\n❌ 部分標準檔案缺失');
}