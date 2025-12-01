import React, { useState } from 'react';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { FaCog, FaSave, FaSpinner, FaUserShield, FaBell, FaDatabase, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    autoBackup: false,
    twoFactorAuth: false
  });
  const [saving, setSaving] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  const settingGroups = [
    {
      title: 'Security Settings',
      icon: FaShieldAlt,
      settings: [
        { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Enable 2FA for enhanced security' }
      ]
    },
    {
      title: 'Notification Settings',
      icon: FaBell,
      settings: [
        { key: 'notifications', label: 'Push Notifications', description: 'Receive real-time notifications' },
        { key: 'emailAlerts', label: 'Email Alerts', description: 'Get notified via email' }
      ]
    },
    {
      title: 'System Settings',
      icon: FaDatabase,
      settings: [
        { key: 'autoBackup', label: 'Automatic Backup', description: 'Automatically backup data daily' }
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage system and account settings</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white hover:bg-primary-600"
          >
            {saving ? (
              <>
                <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="space-y-6">
          {settingGroups.map((group, idx) => {
            const Icon = group.icon;
            return (
              <Card key={idx} className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{group.title}</h2>
                </div>
                <div className="space-y-4">
                  {group.settings.map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{setting.label}</p>
                        <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[setting.key]}
                          onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

