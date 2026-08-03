import { UserCircle, Mail, Briefcase, Key, ShieldCheck, Server } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../auth/authHooks';

export default function Profile() {
  const { user } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          User Account Profile
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">Manage security credentials and view session status.</p>
      </div>

      <Card>
        <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg ring-4 ring-white/10">
              {initial}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user?.name || 'User'}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email || 'user@company.com'}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Active Session
          </span>
        </div>

        <div className="p-6 divide-y divide-slate-100">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 py-4">
            <div>
              <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <UserCircle className="mr-2 h-4 w-4 text-blue-500" />
                Full Name
              </dt>
              <dd className="mt-1 text-sm font-bold text-slate-900">{user?.name || 'User'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <Mail className="mr-2 h-4 w-4 text-blue-500" />
                Email Address
              </dt>
              <dd className="mt-1 text-sm font-bold text-slate-900">{user?.email || 'user@company.com'}</dd>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 py-4">
            <div>
              <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <Briefcase className="mr-2 h-4 w-4 text-blue-500" />
                Role & Permissions
              </dt>
              <dd className="mt-1 text-sm font-bold text-slate-900">{user?.role || 'Authorized User'} (Microservices Access)</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <Server className="mr-2 h-4 w-4 text-blue-500" />
                Authentication Method
              </dt>
              <dd className="mt-1 text-sm font-bold text-slate-900">JWT Token via ALB</dd>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <Button variant="secondary" size="sm">
              <Key className="mr-2 h-4 w-4 text-slate-500" />
              Update Credentials
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
