import React, { useState, useEffect } from 'react';
import { CheckCircle, Rocket, Github, Server, Settings, ArrowRight, ExternalLink, Star, Users, Zap } from 'lucide-react';

const OnboardingFinish = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const project = {
    name: 'My Web App',
    repository: 'johndoe/my-web-app',
    framework: 'React',
    status: 'Ready for deployment'
  };

  const nextSteps = [
    {
      icon: <Rocket className="h-6 w-6" />,
      title: 'Deploy Your First Release',
      description: 'Push to your main branch or manually trigger your first deployment',
      action: 'Go to Dashboard',
      href: '/dashboard'
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: 'Configure Environment Variables',
      description: 'Set up production environment variables for your application',
      action: 'Project Settings',
      href: '/dashboard/projects/my-web-app/settings'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Invite Team Members',
      description: 'Collaborate with your team on deployments and monitoring',
      action: 'Team Settings',
      href: '/settings/team'
    }
  ];

  const features = [
    {
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      title: 'Automatic Deployments',
      description: 'Deploy on every push to your main branch'
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      title: 'Health Monitoring',
      description: 'Monitor your application health and performance'
    },
    {
      icon: <Github className="h-5 w-5 text-gray-900" />,
      title: 'GitHub Integration',
      description: 'Seamless integration with your GitHub workflows'
    },
    {
      icon: <Server className="h-5 w-5 text-blue-500" />,
      title: 'Secure Deployments',
      description: 'End-to-end encrypted deployment pipeline'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Setup Complete! 🎉</h1>
              <p className="text-gray-600 mt-1">Step 4 of 4 - Your deployment pipeline is ready</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-sm text-green-600">Connect GitHub</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-sm text-green-600">Project Setup</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-sm text-green-600">Server Setup</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-green-600">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Congratulations! Your deployment pipeline is ready
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You've successfully connected your GitHub repository and configured your server. 
            Your application is now ready for automated deployments.
          </p>
        </div>

        {/* Project Summary */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Project Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Project Name:</span>
                <span className="font-medium">{project.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Repository:</span>
                <span className="font-medium">{project.repository}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Framework:</span>
                <span className="font-medium">{project.framework}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {project.status}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Rocket className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-sm text-gray-600">Ready for</div>
                <div className="font-medium text-gray-900">First Deployment</div>
              </div>
            </div>
          </div>
        </div>

        {/* What You've Enabled */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">What You've Enabled</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {feature.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{feature.title}</div>
                  <div className="text-sm text-gray-600">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">What's Next?</h3>
          <div className="space-y-4">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                <a
                  href={step.href}
                  className="btn-outline inline-flex items-center space-x-2"
                >
                  <span>{step.action}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Documentation</h3>
            <div className="space-y-3">
              <a
                href="https://docs.deploy-bot.com/getting-started"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Getting Started Guide</span>
              </a>
              <a
                href="https://docs.deploy-bot.com/deployment-config"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Deployment Configuration</span>
              </a>
              <a
                href="https://docs.deploy-bot.com/environment-variables"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Environment Variables</span>
              </a>
              <a
                href="https://docs.deploy-bot.com/troubleshooting"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Troubleshooting</span>
              </a>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Support & Community</h3>
            <div className="space-y-3">
              <a
                href="https://discord.gg/deploy-bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Join our Discord</span>
              </a>
              <a
                href="https://github.com/deploy-bot/examples"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Example Projects</span>
              </a>
              <a
                href="mailto:support@deploy-bot.com"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Contact Support</span>
              </a>
              <a
                href="https://status.deploy-bot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Service Status</span>
              </a>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <a
            href="/dashboard"
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <Rocket className="h-5 w-5" />
            <span>Go to Dashboard</span>
          </a>
          <p className="text-sm text-gray-600 mt-4">
            Ready to deploy? Your dashboard is waiting for you!
          </p>
        </div>

        {/* Feedback */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <Star className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-blue-900">
              Enjoying Auto Deploy Bot? We'd love your feedback!
            </span>
            <a
              href="https://deploy-bot.com/feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Share Feedback
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .confetti-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #f0f0f0;
          animation: confetti-fall 3s linear infinite;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default OnboardingFinish;
