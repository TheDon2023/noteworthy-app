import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { trpc } from '@/providers/trpc';
import {
  ArrowLeft, TrendingUp, Users, Home, DollarSign,
  CheckCircle, Phone, Award, Zap
} from 'lucide-react';

// Non-negotiable targets from SOP
const WEEKLY_TARGETS = {
  newSellers: 5,
  newBuyers: 3,
  outreachTouches: 15,
  qualificationCalls: 2,
  dealsAdvanced: 1,
};

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function isThisWeek(d: Date | string | null): boolean {
  if (!d) return false;
  const date = typeof d === 'string' ? new Date(d) : d;
  const weekStart = getWeekStart(new Date());
  return date >= weekStart;
}

export default function WeeklyStats() {
  const navigate = useNavigate();
  const sellersQuery = trpc.ops.sellerList.useQuery();
  const buyersQuery = trpc.ops.buyerList.useQuery();
  const dealsQuery = trpc.ops.dealList.useQuery();

  const sellers = sellersQuery.data || [];
  const buyers = buyersQuery.data || [];
  const deals = dealsQuery.data || [];

  const stats = useMemo(() => {
    const newSellersThisWeek = sellers.filter(s => isThisWeek(s.createdAt)).length;
    const newBuyersThisWeek = buyers.filter(b => isThisWeek(b.createdAt)).length;
    const dealsAdvancedThisWeek = deals.filter(d => isThisWeek(d.updatedAt) && d.stage !== 'sourcing').length;
    const outreachThisWeek = sellers.filter(s => s.status !== 'new-lead' && isThisWeek(s.updatedAt)).length
      + buyers.filter(b => isThisWeek(b.lastContactDate)).length;

    return {
      newSellersThisWeek,
      newBuyersThisWeek,
      dealsAdvancedThisWeek,
      outreachThisWeek,
      totalSellers: sellers.length,
      totalBuyers: buyers.length,
      totalDeals: deals.length,
      activeDeals: deals.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost').length,
      closedWon: deals.filter(d => d.stage === 'closed-won').length,
    };
  }, [sellers, buyers, deals]);

  const scores = useMemo(() => ({
    sellers: Math.min(100, Math.round((stats.newSellersThisWeek / WEEKLY_TARGETS.newSellers) * 100)),
    buyers: Math.min(100, Math.round((stats.newBuyersThisWeek / WEEKLY_TARGETS.newBuyers) * 100)),
    outreach: Math.min(100, Math.round((stats.outreachThisWeek / WEEKLY_TARGETS.outreachTouches) * 100)),
    calls: Math.min(100, Math.round((stats.outreachThisWeek / WEEKLY_TARGETS.qualificationCalls) * 100)),
    deals: Math.min(100, Math.round((stats.dealsAdvancedThisWeek / WEEKLY_TARGETS.dealsAdvanced) * 100)),
  }), [stats]);

  const overall = Math.round((scores.sellers + scores.buyers + scores.outreach + scores.calls + scores.deals) / 5);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744]">
      {/* Header */}
      <header className="border-b border-[#c9a84c]/20 bg-[#1a2744]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-[#f8f6f1]/60 hover:text-[#f8f6f1]">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#f8f6f1]">Weekly Scorecard</h1>
            <p className="text-xs text-[#c9a84c]">Non-Negotiables & KPI Tracking</p>
          </div>
          <Badge className="gold-gradient text-[#1a2744] font-bold">
            <Award className="w-3 h-3 mr-1" />
            Score: {overall}/100
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Overall Progress */}
        <Card className="glass-panel border-[#c9a84c]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-[#f8f6f1]">Weekly Commitment Score</h3>
              <span className={`text-2xl font-bold ${getScoreColor(overall)}`}>{overall}%</span>
            </div>
            <Progress value={overall} className="h-3 bg-[#0f1929]" />
            <p className="text-xs text-[#f8f6f1]/40 mt-2">
              {overall >= 80 ? 'Strong week! Keep the momentum.' : overall >= 60 ? 'Solid progress. Push for the non-negotiables.' : 'Below target. Focus on daily outreach.'}
            </p>
          </CardContent>
        </Card>

        {/* Non-Negotiables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Seller Metric */}
          <Card className="glass-panel border-[#c9a84c]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#f8f6f1]/70 flex items-center gap-2">
                <Home className="w-4 h-4 text-green-400" />
                New Seller Leads
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-[#f8f6f1]">{stats.newSellersThisWeek}</span>
                <span className="text-xs text-[#f8f6f1]/40">Target: {WEEKLY_TARGETS.newSellers}</span>
              </div>
              <Progress value={scores.sellers} className="h-2 bg-[#0f1929]" />
              <div className="flex justify-between mt-1">
                <span className={`text-xs font-semibold ${getScoreColor(scores.sellers)}`}>{scores.sellers}%</span>
                <span className="text-xs text-[#f8f6f1]/30">{stats.totalSellers} total</span>
              </div>
            </CardContent>
          </Card>

          {/* Buyer Metric */}
          <Card className="glass-panel border-[#c9a84c]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#f8f6f1]/70 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                New Buyers Added
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-[#f8f6f1]">{stats.newBuyersThisWeek}</span>
                <span className="text-xs text-[#f8f6f1]/40">Target: {WEEKLY_TARGETS.newBuyers}</span>
              </div>
              <Progress value={scores.buyers} className="h-2 bg-[#0f1929]" />
              <div className="flex justify-between mt-1">
                <span className={`text-xs font-semibold ${getScoreColor(scores.buyers)}`}>{scores.buyers}%</span>
                <span className="text-xs text-[#f8f6f1]/30">{stats.totalBuyers} total</span>
              </div>
            </CardContent>
          </Card>

          {/* Outreach Metric */}
          <Card className="glass-panel border-[#c9a84c]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#f8f6f1]/70 flex items-center gap-2">
                <Phone className="w-4 h-4 text-yellow-400" />
                Outreach Touchpoints
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-[#f8f6f1]">{stats.outreachThisWeek}</span>
                <span className="text-xs text-[#f8f6f1]/40">Target: {WEEKLY_TARGETS.outreachTouches}</span>
              </div>
              <Progress value={scores.outreach} className="h-2 bg-[#0f1929]" />
              <div className="flex justify-between mt-1">
                <span className={`text-xs font-semibold ${getScoreColor(scores.outreach)}`}>{scores.outreach}%</span>
                <span className="text-xs text-[#f8f6f1]/30">calls + emails</span>
              </div>
            </CardContent>
          </Card>

          {/* Qualification Calls */}
          <Card className="glass-panel border-[#c9a84c]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#f8f6f1]/70 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                Qualification Calls
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-[#f8f6f1]">{Math.min(stats.outreachThisWeek, WEEKLY_TARGETS.qualificationCalls)}</span>
                <span className="text-xs text-[#f8f6f1]/40">Target: {WEEKLY_TARGETS.qualificationCalls}</span>
              </div>
              <Progress value={scores.calls} className="h-2 bg-[#0f1929]" />
              <div className="flex justify-between mt-1">
                <span className={`text-xs font-semibold ${getScoreColor(scores.calls)}`}>{scores.calls}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Deals Advanced */}
          <Card className="glass-panel border-[#c9a84c]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#f8f6f1]/70 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#c9a84c]" />
                Deals Advanced
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-[#f8f6f1]">{stats.dealsAdvancedThisWeek}</span>
                <span className="text-xs text-[#f8f6f1]/40">Target: {WEEKLY_TARGETS.dealsAdvanced}</span>
              </div>
              <Progress value={scores.deals} className="h-2 bg-[#0f1929]" />
              <div className="flex justify-between mt-1">
                <span className={`text-xs font-semibold ${getScoreColor(scores.deals)}`}>{scores.deals}%</span>
                <span className="text-xs text-[#f8f6f1]/30">{stats.activeDeals} active</span>
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Value */}
          <Card className="glass-panel border-[#c9a84c]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#f8f6f1]/70 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Pipeline Value
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-[#f8f6f1]">
                  ${(deals.reduce((sum, d) => sum + (parseFloat(d.upb || '0') || 0), 0) / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-[#f8f6f1]/30">{stats.totalDeals} total deals</span>
                <span className="text-xs text-emerald-400">{stats.closedWon} closed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button onClick={() => navigate('/sellers')} className="bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 h-auto py-3">
            <Home className="w-4 h-4 mr-2" />Add Seller
          </Button>
          <Button onClick={() => navigate('/buyers')} className="bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 h-auto py-3">
            <Users className="w-4 h-4 mr-2" />Add Buyer
          </Button>
          <Button onClick={() => navigate('/deals')} className="bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 h-auto py-3">
            <DollarSign className="w-4 h-4 mr-2" />Add Deal
          </Button>
          <Button onClick={() => navigate('/simulator')} className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] hover:bg-[#c9a84c]/20 h-auto py-3">
            <Zap className="w-4 h-4 mr-2" />Practice Call
          </Button>
        </div>
      </main>
    </div>
  );
}
