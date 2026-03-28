#!/bin/bash

# Exit immediately if any command fails
set -e

# Function to log messages with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting the UAT build process..."

# Backup current dist folder
if [ -d dist ]; then
    BACKUP="dist_backup_$(date '+%Y%m%d%H%M%S')"
    mv dist "$BACKUP"
    log "Old dist folder backed up as $BACKUP"
fi

log "Checking current branch..."
git branch

log "Switching to uat branch..."
git checkout uat

log "Pulling latest changes from origin/uat..."
git pull origin uat

log "Removing metadata.ts if exists..."
rm -f src/metadata.ts
log "metadata.ts removed if it existed."

# log "Removing logs folder if exists..."
# rm -rf logs
# log "Logs folder removed."

log "Installing dependencies..."
yarn install
log "Dependencies installed."

log "Building the application..."
if ! yarn run build:prod; then
    log "Build failed! Restoring previous dist folder..."
    rm -rf dist
    if [ -d "$BACKUP" ]; then
        mv "$BACKUP" dist
        log "Old dist restored successfully."
    fi
    exit 1
fi
log "Build succeeded."

# Remove backup after successful build
if [ -d "$BACKUP" ]; then
    rm -rf "$BACKUP"
    log "Backup folder removed after successful build."
fi

log "Reloading PM2..."
pm2 reload be-app
log "PM2 reloaded."

log "Restarting PM2..."
pm2 restart be-app
log "PM2 restarted."

log "Flushing PM2 Logs..."
pm2 flush be-app
log "PM2 logs flushed."

log "Restarting Nginx..."
bash restart_nginx.sh
log "Nginx restarted."

log "Application Up and Running!!!"

pm2 logs be-app
