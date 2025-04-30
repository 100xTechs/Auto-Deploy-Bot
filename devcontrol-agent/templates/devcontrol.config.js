module.exports = {
    onDeploy: () => `
      echo "🚀 Deploy Started..." &&
      git pull origin main &&
      npm install &&
      pm2 restart all
    `,
    onDeny: () => `
      echo "❌ Deploy Denied."
    `,
    message: ({ branch, user, action }) =>
      `🔔 ${user} pushed to branch ${branch}. and the mode is ${action}`,
  };
  