module.exports = {
  apps: [
    {
      name: 'be-app',
      script: 'dist/main.js',

      instances: '1',
      watch: false,
      max_memory_restart: '6G',
      autorestart: true,
      restart_delay: 5000,

      listen_timeout: 8000,
      kill_timeout: 5000,

      instance_var: 'INSTANCE_ID',
      node_args: '--enable-source-maps',

      error_file: './logs/pm2/error.log',
      out_file: './logs/pm2/out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',

      env_file: '.env',
    },
  ],
};
