import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { trpc } from '@/providers/trpc';
import {
  ArrowLeft, Plus, DollarSign, TrendingUp, CheckCircle,
  Search, Trash2, Edit3, Home, ArrowRightCircle, Sparkles
} from 'lucide-react';

const stages = [
  { key: 'sourcing', label: 'Sourcing', color: '#6b7280' },
  { key: 'underwriting', label: 'Underwriting', color: '#3b82f6' },
  { key: 'marketing', label: 'Marketing', color: '#8b5cf6' },
  { key: 'loi-received', label: 'LOI Received', color: '#f59e0b' },
  { key: 'due-diligence', label: 'Due Diligence', color: '#ec4899' },
  { key: 'closing', label: 'Closing', color: '#10b981' },
  { key: 'closed-won', label: 'Closed Won', color: '#059669' },
  { key: 'closed-lost', label: 'Closed Lost', color: '#ef4444' },
];

const stageColors: Record<string, string> = {
  sourcing: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  underwriting: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  marketing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'loi-received': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'due-diligence': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  closing: 'bg-green-500/20 text-green-400 border-green-500/30',
  'closed-won': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'closed-lost': 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function DealPipeline() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const dealsQuery = trpc.ops.dealList.useQuery();
  const sellersQuery = trpc.ops.sellerList.useQuery();
  const buyersQuery = trpc.ops.buyerList.useQuery();
  const summaryQuery = trpc.ops.crmSummary.useQuery();
  const createDeal = trpc.ops.dealCreate.useMutation({ onSuccess: () => { utils.ops.dealList.invalidate(); utils.ops.crmSummary.invalidate(); } });
  const updateDeal = trpc.ops.dealUpdate.useMutation({ onSuccess: () => { utils.ops.dealList.invalidate(); utils.ops.crmSummary.invalidate(); } });
  const deleteDeal = trpc.ops.dealDelete.useMutation({ onSuccess: () => { utils.ops.dealList.invalidate(); utils.ops.crmSummary.invalidate(); } });

  const allDeals = dealsQuery.data || [];
  const sellers = sellersQuery.data || [];
  const buyersList = buyersQuery.data || [];
  const summary = summaryQuery.data;
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const filtered = allDeals.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || (d.propertyAddress || '').toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'all' || d.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const [form, setForm] = useState({
    name: '', sellerId: undefined as number | undefined, propertyAddress: '', city: '', state: '',
    noteType: 'performing', upb: '', assignmentPrice: '', monthlyPayment: '', interestRate: '',
    ltv: '', yield: '', stage: 'sourcing', notes: '',
  });

  const resetForm = () => {
    setForm({ name: '', sellerId: undefined, propertyAddress: '', city: '', state: '',
      noteType: 'performing', upb: '', assignmentPrice: '', monthlyPayment: '', interestRate: '',
      ltv: '', yield: '', stage: 'sourcing', notes: '' });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.name) return;
    if (editingId) {
      updateDeal.mutate({ id: editingId, ...form });
    } else {
      createDeal.mutate({ ...form, sellerId: form.sellerId });
    }
    resetForm();
    setShowAdd(false);
  };

  const startEdit = (d: any) => {
    setForm({
      name: d.name || '', sellerId: d.sellerId || undefined, propertyAddress: d.propertyAddress || '',
      city: d.city || '', state: d.state || '', noteType: d.noteType || 'performing',
      upb: d.upb || '', assignmentPrice: d.assignmentPrice || '', monthlyPayment: d.monthlyPayment || '',
      interestRate: d.interestRate || '', ltv: d.ltv || '', yield: d.yield || '',
      stage: d.stage || 'sourcing', notes: d.notes || '',
    });
    setEditingId(d.id);
    setShowAdd(true);
  };

  const advanceStage = (deal: any) => {
    const idx = stages.findIndex(s => s.key === deal.stage);
    if (idx >= 0 && idx < stages.length - 2) {
      updateDeal.mutate({ id: deal.id, stage: stages[idx + 1].key });
    }
  };

  const totalValue = filtered.reduce((sum, d) => sum + (parseFloat(d.upb || '0') || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744]">
      <header className="border-b border-[#c9a84c]/20 bg-[#1a2744]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-[#f8f6f1]/60 hover:text-[#f8f6f1]">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#f8f6f1]">Deal Pipeline</h1>
            <p className="text-xs text-[#c9a84c]">From Sourcing to Closing</p>
          </div>
          <Button onClick={() => { resetForm(); setShowAdd(true); }} className="gold-gradient text-[#1a2744] font-semibold text-sm">
            <Plus className="w-4 h-4 mr-2" />Add Deal
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Active Deals" value={allDeals.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost').length} icon={<DollarSign className="w-5 h-5 text-[#c9a84c]" />} />
          <StatCard label="Total UPB" value={`$${(totalValue / 1000).toFixed(0)}K`} icon={<TrendingUp className="w-5 h-5 text-green-400" />} />
          <StatCard label="Closed Won" value={summary?.dealByStage?.['closed-won'] || 0} icon={<CheckCircle className="w-5 h-5 text-emerald-400" />} />
          <StatCard label="In Sourcing" value={summary?.dealByStage?.['sourcing'] || 0} icon={<Home className="w-5 h-5 text-blue-400" />} />
        </div>

        {/* Mr. GetMoney — Ask for Help */}
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-400">Ask Mr. GetMoney</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "How do I structure an assignment agreement for this deal?",
              "What's my closing checklist for a note assignment?",
              "How do I calculate yield on a partial note purchase?",
              "What escrow instructions should I give the title company?",
              "How do I handle a seller who wants to back out after LOI?",
            ].map((prompt, i) => (
              <button key={i} onClick={() => navigate(`/mentor?prompt=${encodeURIComponent(prompt)}`)}
                className="px-3 py-1.5 text-xs rounded-full bg-[#1a2744] border border-purple-500/20 text-[#f8f6f1]/60 hover:border-purple-500/50 hover:text-purple-400 transition-all">
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Stage Pipeline */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {stages.map(s => {
              const count = allDeals.filter(d => d.stage === s.key).length;
              return (
                <button key={s.key} onClick={() => setStageFilter(stageFilter === s.key ? 'all' : s.key)}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all whitespace-nowrap ${stageFilter === s.key ? 'border-[#c9a84c] bg-[#c9a84c]/20 text-[#c9a84c]' : 'border-[#c9a84c]/10 bg-[#0f1929] text-[#f8f6f1]/50 hover:border-[#c9a84c]/30'}`}>
                  <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: s.color }} />
                  {s.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#f8f6f1]/30" />
            <Input placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1] placeholder:text-[#f8f6f1]/30" />
          </div>
        </div>

        {/* Deal Cards */}
        <div className="grid grid-cols-1 gap-3">
          {filtered.length === 0 && (
            <Card className="glass-panel border-[#c9a84c]/20 p-8 text-center">
              <DollarSign className="w-12 h-12 text-[#c9a84c]/20 mx-auto mb-3" />
              <p className="text-[#f8f6f1]/40">No deals yet. Click "Add Deal" to create your first pipeline entry.</p>
            </Card>
          )}
          {filtered.map(d => {
            const seller = sellers.find(s => s.id === d.sellerId);
            const buyer = buyersList.find(b => b.id === d.buyerId);
            return (
              <Card key={d.id} className="glass-panel border-[#c9a84c]/10 hover:border-[#c9a84c]/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-[#f8f6f1]">{d.name}</h3>
                        <Badge variant="outline" className={stageColors[d.stage] || ''}>{d.stage}</Badge>
                        {seller && <span className="text-xs text-[#f8f6f1]/30">Seller: {seller.fullName}</span>}
                        {buyer && <span className="text-xs text-[#c9a84c]/50">Buyer: {buyer.fullName}</span>}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[#c9a84c]/70">
                        {d.propertyAddress && <span className="flex items-center gap-1"><Home className="w-3 h-3" />{d.propertyAddress}{d.city ? `, ${d.city}` : ''}{d.state ? ` ${d.state}` : ''}</span>}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-[#f8f6f1]/50">
                        {d.upb && <span>UPB: ${parseFloat(d.upb).toLocaleString()}</span>}
                        {d.assignmentPrice && <span className="text-green-400">Assignment: ${parseFloat(d.assignmentPrice).toLocaleString()}</span>}
                        {d.ltv && <span>LTV: {d.ltv}%</span>}
                        {d.yield && <span>Yield: {d.yield}%</span>}
                        {d.monthlyPayment && <span>Monthly: ${d.monthlyPayment}</span>}
                        {d.interestRate && <span>Rate: {d.interestRate}%</span>}
                        {d.noteType && <span className="capitalize">{d.noteType}</span>}
                      </div>
                      {d.notes && <p className="text-xs text-[#f8f6f1]/30 mt-2 line-clamp-2">{d.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {d.stage !== 'closed-won' && d.stage !== 'closed-lost' && (
                        <Button size="sm" variant="ghost" onClick={() => advanceStage(d)} className="text-green-400/60 hover:text-green-400" title="Advance stage">
                          <ArrowRightCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => startEdit(d)} className="text-[#c9a84c]/60 hover:text-[#c9a84c]">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { if (confirm('Delete this deal?')) deleteDeal.mutate({ id: d.id }); }} className="text-red-400/60 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-[#1a2744] border-[#c9a84c]/20 text-[#f8f6f1] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-[#c9a84c]">{editingId ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
              <div className="space-y-2 sm:col-span-2"><Label className="text-[#f8f6f1]/70">Deal Name *</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="Chillicothe SFH - $76K UPB" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Linked Seller</Label>
                <Select value={form.sellerId?.toString() || ''} onValueChange={v => setForm({...form, sellerId: v ? parseInt(v) : undefined})}>
                  <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue placeholder="Select seller..." /></SelectTrigger>
                  <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                    {sellers.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.fullName}</SelectItem>)}
                  </SelectContent>
                </Select></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Stage</Label>
                <Select value={form.stage} onValueChange={v => setForm({...form, stage: v})}>
                  <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                    {stages.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select></div>
              <div className="space-y-2 sm:col-span-2"><Label className="text-[#f8f6f1]/70">Property Address</Label>
                <Input value={form.propertyAddress} onChange={e => setForm({...form, propertyAddress: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">City</Label>
                <Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">State</Label>
                <Input value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="OH" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Note Type</Label>
                <Select value={form.noteType} onValueChange={v => setForm({...form, noteType: v})}>
                  <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                    <SelectItem value="performing">Performing</SelectItem>
                    <SelectItem value="sub-performing">Sub-Performing</SelectItem>
                    <SelectItem value="non-performing">Non-Performing</SelectItem>
                  </SelectContent>
                </Select></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">UPB ($)</Label>
                <Input value={form.upb} onChange={e => setForm({...form, upb: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="76100" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Assignment Price ($)</Label>
                <Input value={form.assignmentPrice} onChange={e => setForm({...form, assignmentPrice: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="Your buy price" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Monthly Payment ($)</Label>
                <Input value={form.monthlyPayment} onChange={e => setForm({...form, monthlyPayment: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="647" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Interest Rate (%)</Label>
                <Input value={form.interestRate} onChange={e => setForm({...form, interestRate: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="8.5" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">LTV (%)</Label>
                <Input value={form.ltv} onChange={e => setForm({...form, ltv: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="66.7" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Target Yield (%)</Label>
                <Input value={form.yield} onChange={e => setForm({...form, yield: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="11.2" /></div>
              <div className="space-y-2 sm:col-span-2"><Label className="text-[#f8f6f1]/70">Notes</Label>
                <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="Deal notes..." /></div>
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#c9a84c]/10">
            <Button variant="outline" onClick={() => setShowAdd(false)} className="border-[#c9a84c]/20 text-[#f8f6f1]/60">Cancel</Button>
            <Button onClick={handleSubmit} className="gold-gradient text-[#1a2744] font-semibold" disabled={!form.name}>
              {editingId ? 'Update' : 'Add Deal'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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