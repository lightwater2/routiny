#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// 오늘 날짜 (YYYYMMDD)
const today = new Date();
const dateStr = today.getFullYear().toString() +
  String(today.getMonth() + 1).padStart(2, '0') +
  String(today.getDate()).padStart(2, '0');

// 버전 파일 경로
const versionFilePath = join(rootDir, '.ait-version.json');
const graniteAppPath = join(rootDir, '.granite', 'app.json');

// 버전 정보 읽기/생성
let versionInfo = { date: '', buildNumber: 0 };
if (existsSync(versionFilePath)) {
  versionInfo = JSON.parse(readFileSync(versionFilePath, 'utf-8'));
}

// 같은 날짜면 빌드 번호 증가, 다른 날짜면 1부터 시작
if (versionInfo.date === dateStr) {
  versionInfo.buildNumber += 1;
} else {
  versionInfo.date = dateStr;
  versionInfo.buildNumber = 1;
}

const version = `${dateStr}-${versionInfo.buildNumber}`;

// 버전 정보 저장
writeFileSync(versionFilePath, JSON.stringify(versionInfo, null, 2));

// .granite/app.json 업데이트
if (existsSync(graniteAppPath)) {
  const appJson = JSON.parse(readFileSync(graniteAppPath, 'utf-8'));
  appJson.version = version;
  writeFileSync(graniteAppPath, JSON.stringify(appJson));
  console.log(`📄 .granite/app.json version updated to ${version}`);
}

console.log(`\n📦 Building AIT package...`);
console.log(`📌 Version: ${version}\n`);

// Granite 빌드 (네이티브 번들 + 웹 에셋 포함)
try {
  execSync('npx granite build', { stdio: 'inherit', cwd: rootDir });
  console.log(`\n✅ my-miniapp-rutini.ait 생성 완료`);
  console.log(`📌 Version: ${version}`);
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}
