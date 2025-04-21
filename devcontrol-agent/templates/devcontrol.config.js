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
    message: ({ branch, user }) =>
      `🔔 ${user} pushed to branch ${branch}. Do you want to deploy?`,
  };
  