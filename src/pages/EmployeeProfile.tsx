import { useNavigate, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { trpc } from '@/providers/trpc';
import {
  ArrowLeft, Star, TrendingUp, Activity,
  CheckCircle, AlertTriangle, ChevronRight
} from 'lucide-react';

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0');

  const employeeQuery = trpc.employee.getEmployee.useQuery({ userId });
  const performanceQuery = trpc.employee.getPerformanceSummary.useQuery({ userId });
  const trainingsQuery = trpc.employee.listTrainings.useQuery({ userId });
  const skillsQuery = trpc.employee.getSkillRatings.useQuery({ userId });

  const data = employeeQuery.data;
  const perf = performanceQuery.data;
  const trainings = trainingsQuery.data || [];
  const skills = skillsQuery.data || [];

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744] flex items-center justify-center">
        <p className="text-[#f8f6f1]/40">Loading...</p>
      </div>
    );
  }

  const { user, profile, results } = data;

  const skillAvg = perf?.skillAverages && perf.skillAverages.length > 0
    ? Math.round(perf.skillAverages.reduce((s, sk) => s + (sk.avgRating || 0), 0) / perf.skillAverages.length * 10) / 10
    : 0;

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744]">
      <header className="border-b border-[#c9a84c]/20 bg-[#1a2744]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/employees')} className="text-[#f8f6f1]/60 hover:text-[#f8f6f1]">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#f8f6f1]">{user.name || 'Employee'}</h1>
            <p className="text-xs text-[#c9a84c]">{profile?.jobRole?.replace(/-/g, ' ') || 'Unassigned Role'}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="glass-panel border-[#c9a84c]/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 bg-[#c9a84c]/20 border border-[#c9a84c]/30">
                <AvatarFallback className="text-[#c9a84c] font-bold text-xl">{getInitials(user.name || '')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#f8f6f1]">{user.name || 'Unknown'}</h2>
                <p className="text-sm text-[#f8f6f1]/50">{user.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="border-[#c9a84c]/20 text-[#c9a84c]">{profile?.jobRole?.replace(/-/g, ' ') || 'No Role'}</Badge>
                  <Badge variant="outline" className={profile?.status === 'active' ? 'border-green-500/30 text-green-400' : 'border-gray-500/30 text-gray-400'}>
                    {profile?.status || 'Unknown'}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#c9a84c]">{perf?.overallAverage || 0}%</p>
                <p className="text-xs text-[#f8f6f1]/40">Overall Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Scenarios" value={perf?.totalScenarios || 0} icon={<Activity className="w-5 h-5 text-blue-400" />} />
          <StatCard label="Avg Score" value={`${perf?.overallAverage || 0}%`} icon={<TrendingUp className="w-5 h-5 text-[#c9a84c]" />} />
          <StatCard label="Skill Avg" value={`${skillAvg}/10`} icon={<Star className="w-5 h-5 text-yellow-400" />} />
          <StatCard label="Training Done" value={`${perf?.trainingCompletionRate || 0}%`} icon={<CheckCircle className="w-5 h-5 text-green-400" />} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="performance">
          <TabsList className="bg-[#0f1929] border border-[#c9a84c]/20 h-auto flex-wrap w-full">
            <TabsTrigger value="performance" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">Performance</TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">Skills</TabsTrigger>
            <TabsTrigger value="training" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">Training</TabsTrigger>
            <TabsTrigger value="scenarios" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">Scenarios</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-6 space-y-4">
            <h3 className="text-lg font-bold text-[#c9a84c]">Role Performance</h3>
            {perf?.roleAverages?.map((role, i) => (
              <Card key={i} className="glass-panel border-[#c9a84c]/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#f8f6f1] capitalize">{role.roleId.replace(/-/g, ' ')}</span>
                    <span className={`text-sm font-bold ${role.avgScore >= 80 ? 'text-emerald-400' : role.avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{role.avgScore}%</span>
                  </div>
                  <Progress value={role.avgScore} className="h-2 bg-[#0f1929]" />
                  <p className="text-xs text-[#f8f6f1]/30 mt-1">{role.attempts} attempts</p>
                </CardContent>
              </Card>
            )) || <p className="text-[#f8f6f1]/30">No scenario data yet.</p>}

            {perf?.skillGaps && perf.skillGaps.length > 0 && (
              <>
                <h3 className="text-lg font-bold text-red-400 mt-6">Skill Gaps</h3>
                <div className="space-y-2">
                  {perf.skillGaps.map((gap, i) => (
                    <div key={i} className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-[#f8f6f1]/60 capitalize">{gap.replace(/-/g, ' ')}</span>
                      <Badge variant="outline" className="border-red-500/30 text-red-400 text-xs ml-auto">Needs Work</Badge>
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-6 space-y-4">
            {skills.length === 0 && <p className="text-[#f8f6f1]/30">No skill assessments yet.</p>}
            {skills.map((skill, i) => (
              <Card key={i} className="glass-panel border-[#c9a84c]/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#f8f6f1] capitalize">{skill.skillArea.replace(/-/g, ' ')}</span>
                    <span className={`text-sm font-bold ${skill.rating >= 7 ? 'text-emerald-400' : skill.rating >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>{skill.rating}/10</span>
                  </div>
                  <Progress value={skill.rating * 10} className="h-2 bg-[#0f1929]" />
                  {skill.notes && <p className="text-xs text-[#f8f6f1]/30 mt-1">{skill.notes}</p>}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#c9a84c]">Assigned Training</h3>
              <Badge variant="outline" className="border-[#c9a84c]/20 text-[#c9a84c]">{trainings.filter(t => t.status !== 'completed').length} Pending</Badge>
            </div>
            {trainings.length === 0 && <p className="text-[#f8f6f1]/30">No training assignments yet.</p>}
            {trainings.map((training, i) => (
              <Card key={i} className="glass-panel border-[#c9a84c]/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#f8f6f1]">{training.title}</h4>
                      <p className="text-xs text-[#f8f6f1]/40 mt-1">{training.description || training.trainingType}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className={training.status === 'completed' ? 'border-green-500/30 text-green-400' : training.status === 'in-progress' ? 'border-blue-500/30 text-blue-400' : 'border-yellow-500/30 text-yellow-400'}>
                          {training.status}
                        </Badge>
                        <Badge variant="outline" className={training.priority === 'high' ? 'border-red-500/30 text-red-400' : training.priority === 'medium' ? 'border-yellow-500/30 text-yellow-400' : 'border-green-500/30 text-green-400'}>
                          {training.priority}
                        </Badge>
                        {training.relatedRole && <Badge variant="outline" className="border-[#c9a84c]/20 text-[#c9a84c]">{training.relatedRole}</Badge>}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-[#c9a84c]">
                      {training.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="mt-6 space-y-4">
            {results.length === 0 && <p className="text-[#f8f6f1]/30">No completed scenarios yet.</p>}
            {results.slice(0, 10).map((result, i) => (
              <Card key={i} className="glass-panel border-[#c9a84c]/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[#f8f6f1] capitalize">{result.scenarioId.replace(/-/g, ' ')}</h4>
                      <p className="text-xs text-[#f8f6f1]/40">{result.roleId.replace(/-/g, ' ')}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${result.overallScore >= 80 ? 'text-emerald-400' : result.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{result.overallScore}%</span>
                      <p className="text-xs text-[#f8f6f1]/30">{Math.round(result.timeSpent / 60)} min</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
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
