#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' ../.env | xargs)

# Setup variables
BACKUP_DIR="../backups"
TIMESTAMP=$(date +"%F_%H-%M-%S")
DB_NAME="agriftilizer"
ARCHIVE_NAME="$BACKUP_DIR/$DB_NAME-$TIMESTAMP.archive"

echo "Starting MongoDB backup for $DB_NAME at $TIMESTAMP"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Run mongodump
mongodump --uri="$MONGO_URI" --archive="$ARCHIVE_NAME" --gzip

if [ $? -eq 0 ]; then
  echo "Backup successful! Archive created at $ARCHIVE_NAME"
else
  echo "Backup failed!"
  exit 1
fi

# Optional: Remove backups older than 7 days
find $BACKUP_DIR -type f -name "*.archive" -mtime +7 -exec rm {} \;
echo "Cleaned up old backups."
