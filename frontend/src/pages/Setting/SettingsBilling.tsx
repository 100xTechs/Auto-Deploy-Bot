import React, { useState } from 'react';
import { CreditCard, Download, Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Star, Zap, Shield, Users } from 'lucide-react';

interface BillingInfo {
  currentPlan: string;
  planPrice: number;
  billingCycle: 'monthly' | 'yearly';
  nextBilling: string;
  paymentMethod: {
    type: 'card';
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
  billingAddress: {
    name: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl: string;
}

interface UsageMetrics {
  deployments: { used: number; limit: number };
  buildMinutes: { used: number; limit: number };
  projects: { used: number; limit: number };
  teamMembers: { used: number; limit: number };
}

const SettingsBilling = () => {
  const [billingInfo] = useState<BillingInfo>({
    currentPlan: 'Pro',
    planPrice: 29,
    billingCycle: 'monthly',
    nextBilling: '2024-02-15',
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025
    },
    billingAddress: {
      name: 'John Doe',
      company: 'Tech Innovations Inc.',
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'United States'
    }
  });

  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV-2024-001',
      date: '2024-01-15',
      amount: 29,
      status: 'paid',
      description: 'Pro Plan - January 2024',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-15',
      amount: 29,
      status: 'paid',
      description: 'Pro Plan - December 2023',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-15',
      amount: 29,
      status: 'paid',
      description: 'Pro Plan - November 2023',
      downloadUrl: '#'
    }
  ]);

  const [usage] = useState<UsageMetrics>({
    deployments: { used: 47, limit: 100 },
    buildMinutes: { used: 1250, limit: 2000 },
    projects: { used: 5, limit: 10 },
    teamMembers: { used: 3, limit: 5 }
  });

  const plans = [
    {
      name: 'Free',
      price: 0,
      billingCycle: 'month',
      features: [
        '3 projects',
        '50 deployments/month',
        '500 build minutes',
        'Community support',
        'Basic monitoring'
      ],
      limits: {
        projects: 3,
        deployments: 50,
        buildMinutes: 500,
        teamMembers: 1
      },
      popular: false
    },
    {
      name: 'Pro',
      price: 29,
      billingCycle: 'month',
      features: [
        '10 projects',
        '100 deployments/month',
        '2000 build minutes',
        'Priority support',
        'Advanced monitoring',
        'Environment variables',
        'Custom domains'
      ],
      limits: {
        projects: 10,
        deployments: 100,
        buildMinutes: 2000,
        teamMembers: 5
      },
      popular: true
    },
    {
      name: 'Enterprise',
      price: 99,
      billingCycle: 'month',
      features: [
        'Unlimited projects',
        'Unlimited deployments',
        'Unlimited build minutes',
        '24/7 dedicated support',
        'Advanced security',
        'SSO integration',
        'Custom SLA',
        'White-label options'
      ],
      limits: {
        projects: -1,
        deployments: -1,
        buildMinutes: -1,
        teamMembers: -1
      },
      popular: false
    }
  ];

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your subscription, billing information, and usage</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Plan */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Current Plan</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {billingInfo.currentPlan}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  ${billingInfo.planPrice}
                </div>
                <div className="text-sm text-gray-600">per {billingInfo.billingCycle}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Next billing</div>
                <div className="font-medium text-gray-900">
                  {new Date(billingInfo.nextBilling).toLocaleDateString()}
                </div>
              </div>
              <div className="text-center">
                <button className="btn-primary w-full">
                  Change Plan
                </button>
              </div>
            </div>
          </div>

          {/* Usage Overview */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Usage This Month</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Deployments</span>
                  <span className="text-sm text-gray-600">
                    {usage.deployments.used}/{usage.deployments.limit === -1 ? '∞' : usage.deployments.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usage.deployments.used, usage.deployments.limit))}`}
                    style={{ width: `${getUsagePercentage(usage.deployments.used, usage.deployments.limit)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Build Minutes</span>
                  <span className="text-sm text-gray-600">
                    {usage.buildMinutes.used}/{usage.buildMinutes.limit === -1 ? '∞' : usage.buildMinutes.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usage.buildMinutes.used, usage.buildMinutes.limit))}`}
                    style={{ width: `${getUsagePercentage(usage.buildMinutes.used, usage.buildMinutes.limit)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Projects</span>
                  <span className="text-sm text-gray-600">
                    {usage.projects.used}/{usage.projects.limit === -1 ? '∞' : usage.projects.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usage.projects.used, usage.projects.limit))}`}
                    style={{ width: `${getUsagePercentage(usage.projects.used, usage.projects.limit)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Team Members</span>
                  <span className="text-sm text-gray-600">
                    {usage.teamMembers.used}/{usage.teamMembers.limit === -1 ? '∞' : usage.teamMembers.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usage.teamMembers.used, usage.teamMembers.limit))}`}
                    style={{ width: `${getUsagePercentage(usage.teamMembers.used, usage.teamMembers.limit)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Available Plans */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Available Plans</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`border rounded-lg p-6 relative ${
                    plan.name === billingInfo.currentPlan
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/{plan.billingCycle}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    className={`w-full ${
                      plan.name === billingInfo.currentPlan
                        ? 'btn-outline'
                        : 'btn-primary'
                    }`}
                    disabled={plan.name === billingInfo.currentPlan}
                  >
                    {plan.name === billingInfo.currentPlan ? 'Current Plan' : 'Choose Plan'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice History */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Invoice History</h2>
              <button className="btn-outline inline-flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download All</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{invoice.id}</div>
                          <div className="text-sm text-gray-600">{invoice.description}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-medium">${invoice.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="btn-outline px-3 py-1 text-sm">
                          <Download className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment Method */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
              <button className="btn-outline text-sm">Update</button>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <CreditCard className="h-8 w-8 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">
                  {billingInfo.paymentMethod.brand} •••• {billingInfo.paymentMethod.last4}
                </div>
                <div className="text-sm text-gray-600">
                  Expires {billingInfo.paymentMethod.expiryMonth}/{billingInfo.paymentMethod.expiryYear}
                </div>
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Billing Address</h3>
              <button className="btn-outline text-sm">Edit</button>
            </div>
            
            <div className="text-sm space-y-1">
              <div className="font-medium">{billingInfo.billingAddress.name}</div>
              {billingInfo.billingAddress.company && (
                <div className="text-gray-600">{billingInfo.billingAddress.company}</div>
              )}
              <div className="text-gray-600">{billingInfo.billingAddress.address}</div>
              <div className="text-gray-600">
                {billingInfo.billingAddress.city}, {billingInfo.billingAddress.state} {billingInfo.billingAddress.zip}
              </div>
              <div className="text-gray-600">{billingInfo.billingAddress.country}</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">This Month</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Deployments</span>
                </div>
                <span className="font-medium">{usage.deployments.used}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Success Rate</span>
                </div>
                <span className="font-medium">98.5%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Avg Build Time</span>
                </div>
                <span className="font-medium">3m 42s</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
            
            <div className="space-y-3">
              <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                Billing FAQ
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                Contact Billing Support
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                Request Invoice
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                Enterprise Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsBilling;
