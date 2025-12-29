// PM2 Ecosystem Configuration
// https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [
    {
      // Application name
      name: 'rojgari-backend',
      
      // Entry point
      script: './dist/server.js',
      
      // Execution mode (fork or cluster)
      // Use 'cluster' for multi-core servers to utilize all CPUs
      exec_mode: 'fork',
      
      // Number of instances
      // For cluster mode: 'max' uses all CPU cores, or specify a number
      instances: 1,
      
      // Auto-restart configuration
      autorestart: true,
      watch: false, // Set to true in development to watch file changes
      
      // Maximum memory before restart (helps prevent memory leaks)
      max_memory_restart: '500M',
      
      // Environment variables for production
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      
      // Environment variables for development
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      
      // Log configuration
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true, // Prefix logs with timestamp
      
      // Restart delay
      restart_delay: 4000, // Wait 4 seconds before restart
      
      // Maximum number of restart retries
      max_restarts: 10,
      min_uptime: '10s', // Minimum uptime before considered stable
      
      // Cron restart (optional - restart daily at 3 AM)
      // cron_restart: '0 3 * * *',
      
      // Advanced options
      merge_logs: true,
      autostart: true,
      
      // Kill timeout (how long to wait for graceful shutdown)
      kill_timeout: 5000,
      
      // Listen timeout (how long to wait for app to be ready)
      listen_timeout: 10000,
      
      // Shutdown with message
      shutdown_with_message: true
    }
  ],
  
  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'ubuntu', // Change to your server username
      host: 'api.rojgariindia.com', // Change to your server
      ref: 'origin/main',
      repo: 'git@github.com:PrinceKhimani78/AdminBackend.git',
      path: '/home/api.rojgariindia.com/app',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
