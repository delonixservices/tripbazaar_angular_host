module.exports = {
  apps : [{
    name: 'Delonix Frontend',
    script: 'node_modules/@angular/cli/bin/ng',
    args: 'serve --disable-host-check --live-reload false',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
  }
};
