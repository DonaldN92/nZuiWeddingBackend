// ecosystem.config.js - Configuration PM2
module.exports = {
  apps: [
    {
      name: 'nZuiParty-backend',
      script: './server.js',
      instances: 'max', // Use all avilable CPU
      exec_mode: 'cluster',
      
      // monitoring and restart
      watch: false,
      ignore_watch: [
        'node_modules',
        'images',
        'logs',
        '.git'
      ],
      
      // auto restart
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      
      // Logs
      log_file: './logs/app.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Performance
      node_args: '--max-old-space-size=512',
      
      // Error management 
      kill_timeout: 5000,
      listen_timeout: 8000,
      
      // Cron restart (every 3:00 AM)
      cron_restart: '0 3 * * *',
      
      // Merge logs
      merge_logs: true,
      
      // Auto restart on file change (dev only)
      watch_delay: 1000,
      
      // Source map support
      source_map_support: true,
      
      // Disable auto restart on crash in production
      autorestart: true,
      
      // Wait time before restart
      wait_ready: true,
      
      // Listen timeout
      listen_timeout: 8000,
      
      // Kill timeout
      kill_timeout: 5000
    }
  ],

  // Configuration de déploiement
  /*deploy: {
    production: {
      user: 'node',
      host: ['your-server.com'], // Remplacez par votre serveur
      ref: 'origin/main',
      repo: 'git@github.com:username/wedding-backend.git', // Votre repo
      path: '/var/www/wedding-backend',
      
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    },
    
    staging: {
      user: 'node',
      host: ['staging-server.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:username/wedding-backend.git',
      path: '/var/www/wedding-backend-staging',
      
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env staging',
      'ssh_options': 'StrictHostKeyChecking=no'
    }
  }*/
};