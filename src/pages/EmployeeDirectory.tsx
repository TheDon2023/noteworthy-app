import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { trpc } from '@/providers/trpc';
import {
  ArrowLeft, Users, Search, Award, TrendingUp, Target,
  Star, GraduationCap, Activity, ChevronRight
} from 'lucide-react';

const roleColors: Record<string, string> = {
  acquisition: 'bg-blue-500/20 text-blue-400',
  underwriting: 'bg-purple-500/20 text-purple-400',
  legal: 'bg-red-500/20 text-red-400',
  'buyer-relations': 'bg-green-500/20 text-green-400',
  operations: 'bg-yellow-500/20 text-yellow-400',
  'buyer-pool': 'bg-amber-500/20 text-amber-400',
  'referral-partner': 'bg-pink-500/20 text-pink-400',
};

const getRoleLabel = (role: string) => {
  return role.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getInitials = (name: string) => {
  return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
};

export default function EmployeeDirectory() {
  const navigate = useNavigate();
  const dashboardQuery = trpc.employee.getTeamDashboard.useQuery();

  const dashboard = dashboardQuery.data || [];
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = dashboard.filter(e => {
    const matchSearch = !search || (e.name || '').toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || e.jobRole === roleFilter;
    return matchSearch && matchRole;
  });

  const avgTeamScore = dashboard.length > 0
    ? Math.round(dashboard.reduce((sum, e) => sum + e.avgScore, 0) / dashboard.length)
    : 0;

  const totalScenarios = dashboard.reduce((sum, e) => sum + e.totalScenarios, 0);
  const totalPendingTrainings = dashboard.reduce((sum, e) => sum + e.pendingTrainings, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744]">
      <header className="border-b border-[#c9a84c]/20 bg-[#1a2744]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-[#f8f6f1]/60 hover:text-[#f8f6f1]">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#f8f6f1]">Employee Directory</h1>
            <p className="text-xs text-[#c9a84c]">Team Performance & Skill Tracking</p>
          </div>
          <Badge className="gold-gradient text-[#1a2744] font-bold">
            <Users className="w-3 h-3 mr-1" />
            {dashboard.length} Members
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Team Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Team Avg Score" value={`${avgTeamScore}%`} icon={<TrendingUp className="w-5 h-5 text-[#c9a84c]" />} />
          <StatCard label="Total Scenarios" value={totalScenarios} icon={<Activity className="w-5 h-5 text-blue-400" />} />
          <StatCard label="Pending Training" value={totalPendingTrainings} icon={<GraduationCap className="w-5 h-5 text-yellow-400" />} />
          <StatCard label="Active Members" value={dashboard.filter(e => e.status === 'active').length} icon={<Users className="w-5 h-5 text-green-400" />} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#f8f6f1]/30" />
            <Input
              placeholder="Search employees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1] placeholder:text-[#f8f6f1]/30"
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-[#0f1929] border border-[#c9a84c]/20 text-[#f8f6f1] rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Roles</option>
            {['acquisition', 'underwriting', 'legal', 'buyer-relations', 'operations', 'buyer-pool', 'referral-partner'].map(r => (
              <option key={r} value={r}>{getRoleLabel(r)}</option>
            ))}
          </select>
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 gap-3">
          {filtered.length === 0 && (
            <Card className="glass-panel border-[#c9a84c]/20 p-8 text-center">
              <Users className="w-12 h-12 text-[#c9a84c]/20 mx-auto mb-3" />
              <p className="text-[#f8f6f1]/40">No employees found.</p>
            </Card>
          )}
          {filtered.map(e => (
            <Card key={e.id} className="glass-panel border-[#c9a84c]/10 hover:border-[#c9a84c]/30 transition-all cursor-pointer" onClick={() => navigate(`/employee/${e.id}`)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 bg-[#c9a84c]/20 border border-[#c9a84c]/30">
                    <AvatarFallback className="text-[#c9a84c] font-bold text-lg">{getInitials(e.name || '')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#f8f6f1]">{e.name || 'Unknown'}</h3>
                      <Badge variant="outline" className={roleColors[e.jobRole] || 'text-[#f8f6f1]/40'}>
                        {getRoleLabel(e.jobRole)}
                      </Badge>
                      <Badge variant="outline" className={e.status === 'active' ? 'border-green-500/30 text-green-400' : 'border-gray-500/30 text-gray-400'}>
                        {e.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[#f8f6f1]/50">
                      <span className="flex items-center gap-1"><Activity className="w-3 h-3" />{e.totalScenarios} scenarios</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#c9a84c]" />{e.avgScore}% avg</span>
                      <span className="flex items-center gap-1"><Award className="w-3 h-3 text-blue-400" />{e.skillAvg}/10 skills</span>
                      <span className="flex items-center gap-1"><Target className="w-3 h-3 text-green-400" />{e.completionRate}% training</span>
                      {e.pendingTrainings > 0 && (
                        <span className="flex items-center gap-1 text-yellow-400"><GraduationCap className="w-3 h-3" />{e.pendingTrainings} pending</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#f8f6f1]/20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <Card className="glass-panel border-[#c9a84c]/20">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center">{icon}</div>
        <div>
          <p className="text-xs text-[#f8f6f1]/50">{label}</p>
          <p className="text-xl font-bold text-[#f8f6f1]">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
