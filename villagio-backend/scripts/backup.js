#!/usr/bin/env node
// ─── Database Backup Script ───────────────────────────────────────────────────
// Run: node scripts/backup.js
// Or schedule with a cron: 0 2 * * * node /path/to/villagio-backend/scripts/backup.js

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, '../backups')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/villagio'
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '30')

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const backupPath = path.join(BACKUP_DIR, `villagio-backup-${timestamp}`)

console.log(`📦 Starting MongoDB backup → ${backupPath}`)

try {
  execSync(`mongodump --uri="${MONGODB_URI}" --out="${backupPath}"`, { stdio: 'inherit' })

  // Compress the backup
  execSync(`cd "${BACKUP_DIR}" && tar -czf "villagio-backup-${timestamp}.tar.gz" "villagio-backup-${timestamp}"`, { stdio: 'inherit', shell: true })

  // Remove uncompressed folder
  fs.rmSync(backupPath, { recursive: true, force: true })

  console.log(`✅ Backup complete: villagio-backup-${timestamp}.tar.gz`)
} catch (err) {
  console.error(`❌ Backup failed: ${err.message}`)
  process.exit(1)
}

// ─── Purge old backups (beyond RETENTION_DAYS) ────────────────────────────────
const cutoffMs = RETENTION_DAYS * 24 * 60 * 60 * 1000
const now = Date.now()

const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.tar.gz'))
files.forEach(file => {
  const filePath = path.join(BACKUP_DIR, file)
  const stats = fs.statSync(filePath)
  if (now - stats.mtimeMs > cutoffMs) {
    fs.unlinkSync(filePath)
    console.log(`🗑️  Purged old backup: ${file}`)
  }
})
