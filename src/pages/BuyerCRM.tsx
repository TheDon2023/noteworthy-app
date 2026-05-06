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
  ArrowLeft, Plus, Users, Trophy, Star, Mail, Phone, Linkedin,
  Search, Filter, Trash2, Edit3, TrendingUp, Shield, Target, Sparkles
} from 'lucide-react';

const statusColors: Record<string, string> = {
  prospect: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  qualified: 'bg-green-500/20 text-green-400 border-green-500/30',
  conditional: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  passive: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  dormant: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  disqualified: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const tierStars = { A: 3, B: 2, C: 1 };

export default function BuyerCRM() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const buyersQuery = trpc.ops.buyerList.useQuery();
  const summaryQuery = trpc.ops.crmSummary.useQuery();
  const createBuyer = trpc.ops.buyerCreate.useMutation({ onSuccess: () => { utils.ops.buyerList.invalidate(); utils.ops.crmSummary.invalidate(); } });
  const updateBuyer = trpc.ops.buyerUpdate.useMutation({ onSuccess: () => { utils.ops.buyerList.invalidate(); utils.ops.crmSummary.invalidate(); } });
  const deleteBuyer = trpc.ops.buyerDelete.useMutation({ onSuccess: () => { utils.ops.buyerList.invalidate(); utils.ops.crmSummary.invalidate(); } });

  const buyers = buyersQuery.data || [];
  const summary = summaryQuery.data;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const filtered = buyers.filter(b => {
    const matchSearch = !search || b.fullName.toLowerCase().includes(search.toLowerCase()) || (b.company || '').toLowerCase().includes(search.toLowerCase()) || (b.email || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchTier = tierFilter === 'all' || b.tier === tierFilter;
    return matchSearch && matchStatus && matchTier;
  });

  const [form, setForm] = useState({
    fullName: '', company: '', title: '', email: '', phone: '', linkedInUrl: '',
    category: 'private', tier: 'C', sourceChannel: 'direct',
    preferredStates: '', minUpb: '', maxUpb: '', targetYield: '', maxLtv: '',
    notePreference: 'performing-only', propertyTypes: 'sfr', pofAmount: '',
    ndaStatus: 'not-sent', accreditedInvestor: undefined as number | undefined,
    notes: '',
  });

  const resetForm = () => {
    setForm({ fullName: '', company: '', title: '', email: '', phone: '', linkedInUrl: '',
      category: 'private', tier: 'C', sourceChannel: 'direct',
      preferredStates: '', minUpb: '', maxUpb: '', targetYield: '', maxLtv: '',
      notePreference: 'performing-only', propertyTypes: 'sfr', pofAmount: '',
      ndaStatus: 'not-sent', accreditedInvestor: undefined, notes: '' });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.fullName || !form.email) return;
    if (editingId) {
      updateBuyer.mutate({ id: editingId, ...form, accreditedInvestor: form.accreditedInvestor });
    } else {
      createBuyer.mutate({ ...form, accreditedInvestor: form.accreditedInvestor });
    }
    resetForm();
    setShowAdd(false);
  };

  const startEdit = (b: any) => {
    setForm({
      fullName: b.fullName || '', company: b.company || '', title: b.title || '',
      email: b.email || '', phone: b.phone || '', linkedInUrl: b.linkedInUrl || '',
      category: b.category || 'private', tier: b.tier || 'C', sourceChannel: b.sourceChannel || 'direct',
      preferredStates: b.preferredStates || '', minUpb: b.minUpb || '', maxUpb: b.maxUpb || '',
      targetYield: b.targetYield || '', maxLtv: b.maxLtv || '', notePreference: b.notePreference || 'performing-only',
      propertyTypes: b.propertyTypes || 'sfr', pofAmount: b.pofAmount || '',
      ndaStatus: b.ndaStatus || 'not-sent', accreditedInvestor: b.accreditedInvestor ?? undefined,
      notes: b.notes || '',
    });
    setEditingId(b.id);
    setShowAdd(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744]">
      <header className="border-b border-[#c9a84c]/20 bg-[#1a2744]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-[#f8f6f1]/60 hover:text-[#f8f6f1]">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#f8f6f1]">Buyer CRM</h1>
            <p className="text-xs text-[#c9a84c]">Qualified Investor Pool</p>
          </div>
          <Button onClick={() => { resetForm(); setShowAdd(true); }} className="gold-gradient text-[#1a2744] font-semibold text-sm">
            <Plus className="w-4 h-4 mr-2" />Add Buyer
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <StatCard label="Total Buyers" value={summary?.totalBuyers || 0} icon={<Users className="w-5 h-5 text-blue-400" />} />
          <StatCard label="Active" value={summary?.buyerByStatus?.['active'] || 0} icon={<TrendingUp className="w-5 h-5 text-green-400" />} />
          <StatCard label="Qualified" value={summary?.buyerByStatus?.['qualified'] || 0} icon={<Shield className="w-5 h-5 text-emerald-400" />} />
          <StatCard label="Prospects" value={summary?.buyerByStatus?.['prospect'] || 0} icon={<Target className="w-5 h-5 text-yellow-400" />} />
          <StatCard label="Tier A" value={buyers.filter(b => b.tier === 'A').length} icon={<Trophy className="w-5 h-5 text-[#c9a84c]" />} />
        </div>

        {/* Mr. GetMoney — Ask for Help */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400">Ask Mr. GetMoney</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "How do I vet a buyer before sharing deal details?",
              "What should my follow-up cadence be for Tier A buyers?",
              "Write a buyer qualification email template",
              "How do I handle a buyer who wants to negotiate my assignment fee?",
              "What NDA terms should I use with new buyers?",
            ].map((prompt, i) => (
              <button key={i} onClick={() => navigate(`/mentor?prompt=${encodeURIComponent(prompt)}`)}
                className="px-3 py-1.5 text-xs rounded-full bg-[#1a2744] border border-blue-500/20 text-[#f8f6f1]/60 hover:border-blue-500/50 hover:text-blue-400 transition-all">
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#f8f6f1]/30" />
            <Input placeholder="Search buyers..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1] placeholder:text-[#f8f6f1]/30" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]">
              <Filter className="w-4 h-4 mr-2 text-[#c9a84c]" /><SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
              <SelectItem value="all">All Statuses</SelectItem>
              {['prospect', 'pending', 'qualified', 'conditional', 'active', 'passive', 'dormant', 'disqualified'].map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-[120px] bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]">
              <Star className="w-4 h-4 mr-2 text-[#c9a84c]" /><SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="A">Tier A</SelectItem>
              <SelectItem value="B">Tier B</SelectItem>
              <SelectItem value="C">Tier C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buyer Cards */}
        <div className="grid grid-cols-1 gap-3">
          {filtered.length === 0 && (
            <Card className="glass-panel border-[#c9a84c]/20 p-8 text-center">
              <Users className="w-12 h-12 text-[#c9a84c]/20 mx-auto mb-3" />
              <p className="text-[#f8f6f1]/40">No buyers yet. Click "Add Buyer" to start building your pool.</p>
            </Card>
          )}
          {filtered.map(b => (
            <Card key={b.id} className="glass-panel border-[#c9a84c]/10 hover:border-[#c9a84c]/30 transition-all">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#f8f6f1]">{b.fullName}</h3>
                      {b.company && <span className="text-xs text-[#f8f6f1]/40">({b.company})</span>}
                      <Badge variant="outline" className={statusColors[b.status] || ''}>{b.status}</Badge>
                      <div className="flex items-center">
                        {Array.from({ length: tierStars[b.tier as keyof typeof tierStars] || 1 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-[#c9a84c] fill-[#c9a84c]" />
                        ))}
                        <span className="text-xs text-[#c9a84c] ml-1">{b.tier}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[#f8f6f1]/50">
                      {b.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{b.phone}</span>}
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{b.email}</span>
                      {b.linkedInUrl && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />LinkedIn</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-[#c9a84c]/70">
                      <span>Cat: {b.category}</span>
                      {b.preferredStates && <span>States: {b.preferredStates}</span>}
                      {b.targetYield && <span>Yield: {b.targetYield}%</span>}
                      {b.maxLtv && <span>Max LTV: {b.maxLtv}%</span>}
                      {b.minUpb && b.maxUpb && <span>UPB: ${b.minUpb} - ${b.maxUpb}</span>}
                      <span>NDA: {b.ndaStatus}</span>
                      {b.accreditedInvestor === 1 && <Badge className="bg-green-500/20 text-green-400 text-[10px] h-4">Accredited</Badge>}
                    </div>
                    {b.notes && <p className="text-xs text-[#f8f6f1]/30 mt-2 line-clamp-2">{b.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(b)} className="text-[#c9a84c]/60 hover:text-[#c9a84c]">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { if (confirm('Delete this buyer?')) deleteBuyer.mutate({ id: b.id }); }} className="text-red-400/60 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-[#1a2744] border-[#c9a84c]/20 text-[#f8f6f1] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-[#c9a84c]">{editingId ? 'Edit Buyer' : 'Add New Buyer'}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Full Name *</Label>
                <Input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Email *</Label>
                <Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Phone</Label>
                <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Company</Label>
                <Input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Category</Label>
                <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                  <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                    {['private', 'institutional', 'ira', 'family-office', 'syndicate'].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Tier</Label>
                <Select value={form.tier} onValueChange={v => setForm({...form, tier: v})}>
                  <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                    <SelectItem value="A">A (Top 10)</SelectItem>
                    <SelectItem value="B">B (Next 15)</SelectItem>
                    <SelectItem value="C">C (Remaining)</SelectItem>
                  </SelectContent>
                </Select></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Source Channel</Label>
                <Select value={form.sourceChannel} onValueChange={v => setForm({...form, sourceChannel: v})}>
                  <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                    {['marketplace', 'linkedin', 'conference', 'referral', 'direct', 'inbound', 'association'].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Preferred States</Label>
                <Input value={form.preferredStates} onChange={e => setForm({...form, preferredStates: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="OH, TX, FL" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Min UPB ($)</Label>
                <Input value={form.minUpb} onChange={e => setForm({...form, minUpb: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Max UPB ($)</Label>
                <Input value={form.maxUpb} onChange={e => setForm({...form, maxUpb: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Target Yield (%)</Label>
                <Input value={form.targetYield} onChange={e => setForm({...form, targetYield: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="11.2" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Max LTV (%)</Label>
                <Input value={form.maxLtv} onChange={e => setForm({...form, maxLtv: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="75" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Note Preference</Label>
                <Select value={form.notePreference} onValueChange={v => setForm({...form, notePreference: v})}>
                  <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                    <SelectItem value="performing-only">Performing Only</SelectItem>
                    <SelectItem value="sub-performing-ok">Sub-Performing OK</SelectItem>
                    <SelectItem value="non-performing-ok">Non-Performing OK</SelectItem>
                  </SelectContent>
                </Select></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">Accredited Investor?</Label>
                <Select value={form.accreditedInvestor?.toString() || ''} onValueChange={v => setForm({...form, accreditedInvestor: v ? parseInt(v) : undefined})}>
                  <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                    <SelectItem value="1">Yes</SelectItem>
                    <SelectItem value="0">No</SelectItem>
                  </SelectContent>
                </Select></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">POF Amount ($)</Label>
                <Input value={form.pofAmount} onChange={e => setForm({...form, pofAmount: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="250000" /></div>
              <div className="space-y-2"><Label className="text-[#f8f6f1]/70">NDA Status</Label>
                <Select value={form.ndaStatus} onValueChange={v => setForm({...form, ndaStatus: v})}>
                  <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                    <SelectItem value="not-sent">Not Sent</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="signed">Signed</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select></div>
              <div className="space-y-2 sm:col-span-2"><Label className="text-[#f8f6f1]/70">Notes</Label>
                <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="Additional details..." /></div>
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#c9a84c]/10">
            <Button variant="outline" onClick={() => setShowAdd(false)} className="border-[#c9a84c]/20 text-[#f8f6f1]/60">Cancel</Button>
            <Button onClick={handleSubmit} className="gold-gradient text-[#1a2744] font-semibold" disabled={!form.fullName || !form.email}>
              {editingId ? 'Update' : 'Add Buyer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
