import React, { useState } from 'react';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/forms/Input';
import Badge from '../../../components/common/Badge';
import { User, Lock, Bell, Palette, ShieldCheck, Mail, Save } from 'lucide-react';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      {/* Dev & Figma Scope Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-brand-50/70 border border-brand-200/60 rounded-xl text-xs text-brand-900">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">Figma 10 Profile/Settings</Badge>
          <span className="font-medium">Assigned to: Developer 1 (Architecture & Auth)</span>
        </div>
        <span className="text-brand-700 text-[11px]">Route: <code className="bg-white px-1.5 py-0.5 rounded border border-brand-200">/settings</code></span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">Account & Settings</h2>
        <p className="text-xs text-slate-500 mt-1">Manage your student credentials, security, and notification preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-xs font-semibold">
        {[
          { id: 'profile', label: 'Profile Information', icon: User },
          { id: 'security', label: 'Password & Security', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Form */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardBody className="p-6 space-y-4 max-w-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-brand-600 text-white font-bold text-lg flex items-center justify-center">
                ER
              </div>
              <div>
                <Button variant="outline" size="sm">Change Avatar</Button>
                <p className="text-[11px] text-slate-400 mt-1">JPG, GIF or PNG. Max 2MB</p>
              </div>
            </div>

            <Input label="Full Name" defaultValue="Eman R." icon={User} />
            <Input label="University Email" defaultValue="eman.student@dsp-academy.edu" icon={Mail} />
            <Input label="Student ID" defaultValue="DSP-2024-402" disabled />

            <Button variant="primary" icon={Save}>
              Save Changes
            </Button>
          </CardBody>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardBody className="p-6 space-y-4 max-w-xl">
            <Input label="Current Password" type="password" placeholder="••••••••" icon={Lock} />
            <Input label="New Password" type="password" placeholder="••••••••" icon={Lock} />
            <Input label="Confirm New Password" type="password" placeholder="••••••••" icon={Lock} />
            <Button variant="primary">Update Password</Button>
          </CardBody>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Alerts</CardTitle>
          </CardHeader>
          <CardBody className="p-6 space-y-3 text-xs text-slate-700">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-brand-600" />
              <span>Email notification for new lecture releases</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-brand-600" />
              <span>Exam countdown reminders 24 hours prior to deadline</span>
            </label>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default SettingsPage;
