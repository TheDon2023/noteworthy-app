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
  ArrowLeft, Plus, Phone, Mail, MapPin, Home, DollarSign,
  TrendingUp, Filter, Search, Trash2, Edit3, Sparkles
} from 'lucide-react';

const statusColors: Record<string, string> = {
  'new-lead': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'contacted': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'qualified': 'bg-green-500/20 text-green-400 border-green-500/30',
  'under-contract': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'closed-won': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'closed-lost': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const priorityColors: Record<string, string> = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
};

export default function SellerTracker() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const sellersQuery = trpc.ops.sellerList.useQuery();
  const summaryQuery = trpc.ops.crmSummary.useQuery();
  const createSeller = trpc.ops.sellerCreate.useMutation({ onSuccess: () => { utils.ops.sellerList.invalidate(); utils.ops.crmSummary.invalidate(); } });
  const updateSeller = trpc.ops.sellerUpdate.useMutation({ onSuccess: () => { utils.ops.sellerList.invalidate(); utils.ops.crmSummary.invalidate(); } });
  const deleteSeller = trpc.ops.sellerDelete.useMutation({ onSuccess: () => { utils.ops.sellerList.invalidate(); utils.ops.crmSummary.invalidate(); } });
  const sellers = sellersQuery.data || [];
  const summary = summaryQuery.data;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const filtered = sellers.filter(s => {
    const matchSearch = !search || s.fullName.toLowerCase().includes(search.toLowerCase()) || (s.propertyAddress || '').toLowerCase().includes(search.toLowerCase()) || (s.state || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', propertyAddress: '', city: '', state: '',
    noteType: '', upb: '', interestRate: '', monthlyPayment: '', remainingTerm: '', ltv: '',
    source: 'cold-call', priority: 'medium', notes: '',
  });

  const resetForm = () => {
    setForm({ fullName: '', email: '', phone: '', propertyAddress: '', city: '', state: '',
      noteType: '', upb: '', interestRate: '', monthlyPayment: '', remainingTerm: '', ltv: '',
      source: 'cold-call', priority: 'medium', notes: '' });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.fullName) return;
    if (editingId) {
      updateSeller.mutate({ id: editingId, ...form });
    } else {
      createSeller.mutate(form);
    }
    resetForm();
    setShowAdd(false);
  };

  const startEdit = (s: any) => {
    setForm({
      fullName: s.fullName || '', email: s.email || '', phone: s.phone || '',
      propertyAddress: s.propertyAddress || '', city: s.city || '', state: s.state || '',
      noteType: s.noteType || '', upb: s.upb || '', interestRate: s.interestRate || '',
      monthlyPayment: s.monthlyPayment || '', remainingTerm: s.remainingTerm || '',
      ltv: s.ltv || '', source: s.source || 'cold-call', priority: s.priority || 'medium', notes: s.notes || '',
    });
    setEditingId(s.id);
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
            <h1 className="text-lg font-bold text-[#f8f6f1]">Seller Tracker</h1>
            <p className="text-xs text-[#c9a84c]">Note Seller Lead Management</p>
          </div>
          <Button onClick={() => { resetForm(); setShowAdd(true); }} className="gold-gradient text-[#1a2744] font-semibold text-sm">
            <Plus className="w-4 h-4 mr-2" />Add Seller
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Sellers" value={summary?.totalSellers || 0} icon={<Home className="w-5 h-5 text-blue-400" />} />
          <StatCard label="New Leads" value={summary?.sellerByStatus?.['new-lead'] || 0} icon={<TrendingUp className="w-5 h-5 text-yellow-400" />} />
          <StatCard label="Qualified" value={summary?.sellerByStatus?.['qualified'] || 0} icon={<BadgeCheck className="w-5 h-5 text-green-400" />} />
          <StatCard label="Under Contract" value={summary?.sellerByStatus?.['under-contract'] || 0} icon={<DollarSign className="w-5 h-5 text-purple-400" />} />
        </div>

        {/* Mr. GetMoney — Ask for Help */}
        <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-xs font-semibold text-[#c9a84c]">Ask Mr. GetMoney</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "How do I qualify a seller with a performing note?",
              "What docs do I need before making an offer on a note?",
              "Write a cold call script for note sellers",
              "How do I calculate my max offer price on a note?",
              "What red flags should I watch for with seller leads?",
            ].map((prompt, i) => (
              <button key={i} onClick={() => navigate(`/mentor?prompt=${encodeURIComponent(prompt)}`)}
                className="px-3 py-1.5 text-xs rounded-full bg-[#1a2744] border border-[#c9a84c]/20 text-[#f8f6f1]/60 hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all">
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#f8f6f1]/30" />
            <Input placeholder="Search sellers..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1] placeholder:text-[#f8f6f1]/30" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]">
              <Filter className="w-4 h-4 mr-2 text-[#c9a84c]" /><SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new-lead">New Lead</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="under-contract">Under Contract</SelectItem>
              <SelectItem value="closed-won">Closed Won</SelectItem>
              <SelectItem value="closed-lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Seller List */}
        <div className="grid grid-cols-1 gap-3">
          {filtered.length === 0 && (
            <Card className="glass-panel border-[#c9a84c]/20 p-8 text-center">
              <Home className="w-12 h-12 text-[#c9a84c]/20 mx-auto mb-3" />
              <p className="text-[#f8f6f1]/40">No sellers yet. Click "Add Seller" to log your first lead.</p>
            </Card>
          )}
          {filtered.map(s => (
            <Card key={s.id} className="glass-panel border-[#c9a84c]/10 hover:border-[#c9a84c]/30 transition-all">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#f8f6f1]">{s.fullName}</h3>
                      <Badge variant="outline" className={statusColors[s.status] || 'text-[#f8f6f1]/40'}>{s.status}</Badge>
                      <span className={`text-xs font-semibold ${priorityColors[s.priority] || ''}`}>{s.priority?.toUpperCase()}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[#f8f6f1]/50">
                      {s.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.phone}</span>}
                      {s.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{s.email}</span>}
                      {s.propertyAddress && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.propertyAddress}{s.city ? `, ${s.city}` : ''}{s.state ? ` ${s.state}` : ''}</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-[#c9a84c]/70">
                      {s.upb && <span>UPB: ${s.upb}</span>}
                      {s.ltv && <span>LTV: {s.ltv}%</span>}
                      {s.interestRate && <span>Rate: {s.interestRate}%</span>}
                      {s.monthlyPayment && <span>Monthly: ${s.monthlyPayment}</span>}
                      {s.noteType && <span>Type: {s.noteType}</span>}
                      <span>Source: {s.source}</span>
                    </div>
                    {s.notes && <p className="text-xs text-[#f8f6f1]/30 mt-2 line-clamp-2">{s.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(s)} className="text-[#c9a84c]/60 hover:text-[#c9a84c]">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { if (confirm('Delete this seller?')) deleteSeller.mutate({ id: s.id }); }} className="text-red-400/60 hover:text-red-400">
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
            <DialogTitle className="text-[#c9a84c]">{editingId ? 'Edit Seller' : 'Add New Seller Lead'}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">Full Name *</Label>
                <Input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">Email</Label>
                <Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">Phone</Label>
                <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">Source</Label>
                <Select value={form.source} onValueChange={v => setForm({...form, source: v})}>
                  <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                    {['direct-mail', 'referral', 'website', 'cold-call', 'event', 'linkedin', 'other'].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-[#f8f6f1]/70">Property Address</Label>
                <Input value={form.propertyAddress} onChange={e => setForm({...form, propertyAddress: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">City</Label>
                <Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">State</Label>
                <Input value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="OH" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">Note Type</Label>
                <Select value={form.noteType} onValueChange={v => setForm({...form, noteType: v})}>
                  <SelectTrigger className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent className="bg-[#1a2744] border-[#c9a84c]/20">
                    <SelectItem value="performing">Performing</SelectItem>
                    <SelectItem value="sub-performing">Sub-Performing</SelectItem>
                    <SelectItem value="non-performing">Non-Performing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">UPB ($)</Label>
                <Input value={form.upb} onChange={e => setForm({...form, upb: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="75000" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">Interest Rate (%)</Label>
                <Input value={form.interestRate} onChange={e => setForm({...form, interestRate: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="8.5" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">Monthly Payment ($)</Label>
                <Input value={form.monthlyPayment} onChange={e => setForm({...form, monthlyPayment: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="647" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#f8f6f1]/70">LTV (%)</Label>
                <Input value={form.ltv} onChange={e => setForm({...form, ltv: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="66.7" />
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
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-[#f8f6f1]/70">Notes</Label>
                <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1]" placeholder="Any additional details..." />
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#c9a84c]/10">
            <Button variant="outline" onClick={() => setShowAdd(false)} className="border-[#c9a84c]/20 text-[#f8f6f1]/60">Cancel</Button>
            <Button onClick={handleSubmit} className="gold-gradient text-[#1a2744] font-semibold" disabled={!form.fullName}>
              {editingId ? 'Update' : 'Add Seller'}
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

function BadgeCheck(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
