import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GitBranch, Shield, Zap, Users, Clock, CheckCircle, Code, Rocket, Sparkles } from 'lucide-react';

const Home = () => {  const features = [
    {
      icon: <Zap className="h-8 w-8 text-indigo-400" />,
      title: "Lightning Setup",
      description: "Get your deployment pipeline up and running in under 60 seconds with our AI-powered setup wizard."
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-400" />,
      title: "Enterprise Security",
      description: "Military-grade encryption with zero-trust architecture and SOC 2 Type II compliance."
    },
    {
      icon: <GitBranch className="h-8 w-8 text-purple-400" />,
      title: "GitHub Native",
      description: "Seamless integration with GitHub repositories, actions, and automated webhook configuration."
    },
    {
      icon: <Rocket className="h-8 w-8 text-cyan-400" />,
      title: "Real-Time Intelligence",
      description: "AI-powered monitoring with predictive analytics, detailed logs and instant rollback capabilities."
    }
  ];
  const benefits = [
    "Zero-configuration deployment",
    "Unlimited deployments included",
    "AI-powered automation",
    "Enterprise-grade security",
    "Multi-cloud platform support",
    "Full source transparency"
  ];
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950"></div>
      <div className="grid-bg absolute inset-0"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>      {/* Header */}
      <header className="relative z-10 sticky top-0">
        <div className="glass-dark backdrop-blur-strong border-b border-slate-700/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-xl border border-slate-700 group-hover:border-indigo-500/50 transition-all duration-300">
                    <GitBranch className="h-8 w-8 text-indigo-400 glow-text transition-all duration-300 group-hover:text-indigo-300" />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-xl font-bold text-white glow-text tracking-tight">
                    Auto-Deploy-Bot
                  </h1>
                  <p className="text-xs text-slate-400 font-medium">Enterprise Deployment Platform</p>
                </div>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="btn-ghost transition-all duration-300 text-sm font-medium">Features</a>
                <a href="#pricing" className="btn-ghost transition-all duration-300 text-sm font-medium">Pricing</a>
                <a href="#docs" className="btn-ghost transition-all duration-300 text-sm font-medium">Documentation</a>
                <a href="#enterprise" className="btn-ghost transition-all duration-300 text-sm font-medium">Enterprise</a>
              </nav>
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/onboarding" className="btn-primary text-sm">
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>      {/* Hero Section */}
      <section className="relative z-10 section-padding-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-8 py-4 rounded-full glass border-glow mb-16 group transition-all duration-300 hover:scale-105">
              <Sparkles className="h-5 w-5 text-indigo-400 mr-3 group-hover:text-indigo-300 transition-colors duration-300" />
              <span className="text-indigo-400 text-sm font-semibold tracking-wide group-hover:text-indigo-300 transition-colors duration-300">
                Trusted by 10,000+ Enterprise Teams
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-16 leading-tight text-shadow">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent glow-text animate-gradient-x bg-300% tracking-tight">
                Deploy
              </span>
              <br />
              <span className="text-white tracking-tight">with</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent glow-text tracking-tight">
                Confidence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-20 text-slate-300 max-w-5xl mx-auto leading-relaxed font-light">
              The enterprise deployment platform that scales with your team. 
              <br className="hidden md:block" />
              AI-powered automation, enterprise security, and 
              <span className="font-semibold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"> 
                zero-downtime deployments
              </span> 
              —all in one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/onboarding" className="btn-primary text-lg px-12 py-6 group border-glow">
                <Rocket className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                Start Free Trial
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <button className="btn-outline text-lg px-12 py-6 group">
                <Code className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                View Live Demo
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-slate-400 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
                <span>SOC 2 Type II compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Features Section */}
      <section id="features" className="relative z-10 section-padding-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
              <span className="text-indigo-400 text-sm font-semibold tracking-wide">Platform Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight text-shadow">
              Enterprise-Grade 
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> Deployment Platform</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto font-light leading-relaxed">
              Built for scale, designed for developers. Our platform combines the power of AI 
              with enterprise security to deliver unmatched deployment reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="gradient-border card-hover-lift p-12 text-center group cursor-pointer rounded-2xl">
                <div className="flex justify-center mb-10 transform group-hover:scale-125 transition-all duration-500">
                  <div className="relative">
                    <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700 group-hover:border-indigo-500/50 transition-all duration-300 shadow-2xl">
                      {feature.icon}
                    </div>
                    <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500">
                      <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-6 group-hover:text-indigo-400 transition-colors duration-300 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed font-light text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>{/* Benefits Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-12 tracking-tight leading-tight">
                Everything you need for 
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  secure deployments
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-12 leading-relaxed font-light">
                Auto-Deploy-Bot addresses modern developer challenges with enterprise-grade security, 
                AI-powered simplicity, and cloud-native infrastructure flexibility.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center group p-3 rounded-lg hover:bg-slate-800/30 transition-all duration-300">
                    <div className="relative mr-4">
                      <CheckCircle className="h-6 w-6 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
                      <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-slate-300 group-hover:text-white transition-colors duration-300 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card-glow p-12">
              <h3 className="text-3xl font-bold text-white mb-12 text-center tracking-tight">
                How it works
              </h3>
              <div className="space-y-12">
                <div className="flex items-start group">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mr-8 glow-border group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-white text-xl mb-3 group-hover:text-indigo-400 transition-colors duration-300">Connect your repository</p>
                    <p className="text-slate-300 leading-relaxed">AI-powered GitHub integration with automatic webhook generation and intelligent branch detection</p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mr-8 glow-border group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-white text-xl mb-3 group-hover:text-purple-400 transition-colors duration-300">Deploy secure agent</p>
                    <p className="text-slate-300 leading-relaxed">Install our lightweight, encrypted node package on your infrastructure with zero configuration</p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="bg-gradient-to-r from-pink-500 to-emerald-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mr-8 glow-border group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-white text-xl mb-3 group-hover:text-emerald-400 transition-colors duration-300">Experience autonomous deployments</p>
                    <p className="text-slate-300 leading-relaxed">Push code and watch AI-orchestrated deployments happen instantly with real-time monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* CTA Section */}
      <section className="relative z-10 section-padding-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="gradient-border card-hover-lift p-20 rounded-3xl">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-12">
              <span className="text-indigo-400 text-sm font-semibold tracking-wide">Ready to Deploy?</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-10 tracking-tight leading-tight text-shadow">
              Join the Future of 
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Enterprise Deployment
              </span>
            </h2>
            <p className="text-xl mb-16 text-slate-300 font-light max-w-4xl mx-auto leading-relaxed">
              Trusted by industry leaders for mission-critical deployments. 
              Experience the platform that's redefining how enterprises ship code.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link to="/onboarding" className="btn-primary text-xl px-16 py-8 group border-glow">
                <Rocket className="mr-3 h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
                Start Enterprise Trial
                <ArrowRight className="ml-3 h-7 w-7 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <button className="btn-outline text-xl px-16 py-8 group">
                <Users className="mr-3 h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
                Schedule Demo
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-slate-400 text-sm">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-emerald-400 mr-2" />
                <span>Enterprise SSO & RBAC</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-emerald-400 mr-2" />
                <span>99.99% uptime SLA</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-emerald-400 mr-2" />
                <span>24/7 dedicated support</span>
              </div>
            </div>
          </div>
        </div>
      </section>{/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/50 backdrop-blur-sm bg-black/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center mb-8">
                <GitBranch className="h-8 w-8 text-indigo-400 glow-text mr-3" />
                <span className="text-xl font-bold text-white tracking-tight">Auto-Deploy-Bot</span>
              </div>
              <p className="text-slate-400 leading-relaxed font-light">
                Next-generation deployment automation for the modern era. 
                Secure, intelligent, and enterprise-ready.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-8 text-lg tracking-tight">Product</h3>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300 font-medium">Features</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300 font-medium">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300 font-medium">Documentation</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300 font-medium">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-8 text-lg tracking-tight">Company</h3>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300 font-medium">About</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300 font-medium">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300 font-medium">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300 font-medium">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-8 text-lg tracking-tight">Community</h3>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300 font-medium">Discord</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300 font-medium">GitHub</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300 font-medium">Twitter</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300 font-medium">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 mt-16 pt-12 text-center text-slate-400">
            <p className="font-light">&copy; 2025 Auto-Deploy-Bot. Building the future of deployment automation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
