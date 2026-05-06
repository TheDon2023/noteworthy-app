import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/providers/trpc';
import {
  ArrowLeft, Plus, GraduationCap, CheckCircle, Clock, AlertTriangle,
  Zap, ChevronRight
} from 'lucide-react';

export default function TrainingAssignments() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const trainingsQuery = trpc.employee.listTrainings.useQuery();
  const employeesQuery = trpc.employee.listEmployees.useQuery();

  const trainings = trainingsQuery.data || [];
  const employees = employeesQuery.data || [];
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    userId: '', title: '', description: '', trainingType: 'scenario',
    relatedRole: '', relatedSkill: '', priority: 'medium', dueDate: '',
  });

  const createTraining = trpc.employee.createTraining.useMutation({
    onSuccess: () => {
      utils.employee.listTrainings.invalidate();
      setShowAdd(false);
      setForm({ userId: '', title: '', description: '', trainingType: 'scenario', relatedRole: '', relatedSkill: '', priority: 'medium', dueDate: '' });
    },
  });

  const handleSubmit = () => {
    if (!form.userId || !form.title) return;
    createTraining.mutate({
      userId: parseInt(form.userId),
      title: form.title,
      description: form.description || undefined,
      trainingType: form.trainingType,
      relatedRole: form.relatedRole || undefined,
      relatedSkill: form.relatedSkill || undefined,
      priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
    });
  };

  const byStatus = {
    assigned: trainings.filter(t => t.status === 'assigned'),
    inProgress: trainings.filter(t => t.status === 'in-progress'),
    completed: trainings.filter(t => t.status === 'completed'),
    overdue: trainings.filter(t => t.status === 'overdue'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744]">
      <header className="border-b border-[#c9a84c]/20 bg-[#1a2744]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-[#f8f6f1]/60 hover:text-[#f8f6f1]">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#f8f6f1]">Training Assignments</h1>
            <p className="text-xs text-[#c9a84c]">Mr. GetMoney's Targeted Training Program</p>
          </div>
          <Button onClick={() => setShowAdd(true)} className="gold-gradient text-[#1a2744] font-semibold text-sm">
            <Plus className="w-4 h-4 mr-2" />Assign Training
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Assigned" value={byStatus.assigned.length} icon={<Clock className="w-5 h-5 text-yellow-400" />} />
          <StatCard label="In Progress" value={byStatus.inProgress.length} icon={<Zap className="w-5 h-5 text-blue-400" />} />
          <StatCard label="Completed" value={byStatus.completed.length} icon={<CheckCircle className="w-5 h-5 text-green-400" />} />
          <StatCard label="Overdue" value={byStatus.overdue.length} icon={<AlertTriangle className="w-5 h-5 text-red-400" />} />
        </div>

        {/* Training List by Status */}
        {(['assigned', 'inProgress', 'completed', 'overdue'] as const).map(status => {
          const list = byStatus[status];
          if (list.length === 0) return null;
          const colors = {
            assigned: 'border-yellow-500/20',
            inProgress: 'border-blue-500/20',
            completed: 'border-green-500/20',
            overdue: 'border-red-500/20',
          };
          return (
            <div key={status}>
              <h3 className="text-sm font-semibold text-[#f8f6f1] mb-3 capitalize flex items-center gap-2">
                {status === 'assigned' && <Clock className="w-4 h-4 text-yellow-400" />}
                {status === 'inProgress' && <Zap className="w-4 h-4 text-blue-400" />}
                {status === 'completed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                {status === 'overdue' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                {status.replace(/([A-Z])/g, ' $1')}
                <Badge variant="outline" className="text-xs">{list.length}</Badge>
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {list.map(t => {
                  const emp = employees.find(e => e.id === t.userId);
                  return (
                    <Card key={t.id} className={`glass-panel ${colors[status]}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#f8f6f1]">{t.title}</h4>
                            <p className="text-xs text-[#f8f6f1]/40">{t.description || t.trainingType}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {emp && <Badge variant="outline" className="border-[#c9a84c]/20 text-[#c9a84c] text-xs">{emp.name || 'Unknown'}</Badge>}
                              {t.relatedRole && <Badge variant="outline" className="border-blue-500/20 text-blue-400 text-xs">{t.relatedRole}</Badge>}
                              {t.relatedSkill && <Badge variant="outline" className="border-purple-500/20 text-purple-400 text-xs">{t.relatedSkill}</Badge>}
                              <Badge variant="outline" className={t.priority === 'high' ? 'border-red-500/30 text-red-400' : t.priority === 'medium' ? 'border-yellow-500/30 text-yellow-400' : 'border-green-500/30 text-green-400'}>
                                {t.priority}
                              </Badge>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-[#c9a84c]">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {trainings.length === 0 && (
          <Card className="glass-panel border-[#c9a84c]/20 p-8 text-center">
            <GraduationCap className="w-12 h-12 text-[#c9a84c]/20 mx-auto mb-3" />
            <p className="text-[#f8f6f1]/40">No training assignments yet. Mr. GetMoney can push training based on skill gaps.</p>
          </Card>
        )}
      </main>

      {/* Add Dialog */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="glass-panel border-[#c9a84c]/20 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-[#c9a84c]">Assign Training</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">Employee</Label>
                <Select value={form.userId} onValueChange={v => setForm({...form, userId: v})}>
                  <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]">
                    <SelectValue placeholder="Select employee..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                    {employees.map(e => (
                      <SelectItem key={e.id} value={e.id.toString()}>{e.name || 'Unknown'}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">Title</Label>
                <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="e.g., Master Seller Qualification" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">Description</Label>
                <Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="Why this training is needed..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-[#f8f6f1]/70">Type</Label>
                  <Select value={form.trainingType} onValueChange={v => setForm({...form, trainingType: v})}>
                    <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                      <SelectItem value="scenario">AI Scenario</SelectItem>
                      <SelectItem value="study-material">Study Material</SelectItem>
                      <SelectItem value="sop-review">SOP Review</SelectItem>
                      <SelectItem value="mentor-session">Mentor Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#f8f6f1]/70">Priority</Label>
                  <Select value={form.priority} onValueChange={v => setForm({...form, priority: v})}>
                    <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-[#f8f6f1]/70">Related Role</Label>
                  <Select value={form.relatedRole} onValueChange={v => setForm({...form, relatedRole: v})}>
                    <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                      {['acquisition', 'underwriting', 'legal', 'buyer-relations', 'operations', 'buyer-pool', 'referral-partner'].map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#f8f6f1]/70">Related Skill</Label>
                  <Select value={form.relatedSkill} onValueChange={v => setForm({...form, relatedSkill: v})}>
                    <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                      {['seller-qualification', 'buyer-vetting', 'deal-structuring', 'compliance', 'negotiation', 'closing'].map(s => (
                        <SelectItem key={s} value={s}>{s.replace(/-/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">Due Date</Label>
                <Input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowAdd(false)} className="border-[#c9a84c]/20 text-[#f8f6f1]/60">Cancel</Button>
                <Button onClick={handleSubmit} className="gold-gradient text-[#1a2744] font-semibold" disabled={!form.userId || !form.title}>
                  Assign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
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
