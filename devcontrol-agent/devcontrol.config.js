module.exports = {
  onDeploy: () => ` bash -c " echo '🚀 Deploy Started...' && echo '✅ Deploy Completed.'"`,
  onDeny: () => `
    echo "❌ Deploy Denied."
  `,
  message: ({ branch, user, action }) =>
    `🔔 ${user} pushed to branch ${branch}. and the mode is ${action}`,
};