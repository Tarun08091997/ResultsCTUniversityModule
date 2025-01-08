module.exports = {
    apps: [
      {
        name: 'backend',
        script: 'npm',
        args: 'start',
        cwd: './backend',
        watch: true
      },
      {
        name: 'frontend',
        script: 'npm',
        args: 'run dev',
        cwd: './frontend',
        watch: true
      },
      {
        name: 'adminfrontend',
        script: 'npm',
        args: 'start',
        cwd: './adminfrontend',
        watch: true
      }
    ]
  };
  