// PM2 Ecosystem Configuration for Hope Physicians
module.exports = {
  apps: [
    {
      name: 'hope-physicians-backend',
      script: './backend/server.js',
      cwd: '/home/ubuntu/hope-physicians',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }
  ]
};

