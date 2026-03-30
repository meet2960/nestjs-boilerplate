export const cronJobsData = {
  updateTransactions: {
    name: 'update-transactions',
    description:
      'Cron job to update transactions every minute and mark status according to the response from status check API',
    isDisabled: true,
    schedule: '* * * * *',
  },
  backupDatabase: {
    name: 'backup-database',
    description: 'Cron job to backup database daily at midnight',
    isDisabled: true,
    schedule: '0 0 * * *',
  },
};
