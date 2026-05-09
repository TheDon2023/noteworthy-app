import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { trpc } from '@/providers/trpc';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router';
import {
  Target, BookOpen, Users, Home, DollarSign, AlertTriangle,
  TrendingUp, Zap, GraduationCap, ChevronRight, Clock, CheckCircle
} from 'lucide-react';

const skillLabel = (area: string) => area.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const actionConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  train: { icon: <GraduationCap className="w-5 h-5" />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  'source-buyers': { icon: <Users className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  'source-sellers': { icon: <Home className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  'push-deals': { icon: <DollarSign className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  earn: { icon: <Zap className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

export default function WarRoomBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id ?? 0;

  const briefingQuery = trpc.employee.dailyBriefing.useQuery(
    { userId },
    { enabled: userId > 0, staleTime: 1000 * 60 * 2 }
  );

  const b = briefingQuery.data;

  // Only show during working hours and when logged in
  const shouldShow = userId > 0 && b?.inWorkingHours;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  if (!shouldShow) return null;
  if (!b) return null;

  const action = actionConfig[b.priority.primaryAction] || actionConfig.earn;

  return (
    <section className="max-w-7xl mx-auto px-4 pt-6">
      <Card className={`border ${action.bg} relative overflow-hidden`}>
        {/* Animated pulse line on top for urgency */}
        {b.priority.shouldTrain && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse" />
        )}
        {!b.priority.shouldTrain && b.priority.primaryAction !== 'earn' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500 animate-pulse" />
        )}

        <CardContent className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center flex-shrink-0`}>
              <div className={action.color}>{action.icon}</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-[#f8f6f1]">
                  {greeting}, {b.employee.name?.split(' ')[0] || 'Agent'}.
                </h2>
                <Badge variant="outline" className={`${action.bg} ${action.color} text-xs`}>
                  {b.priority.actionTitle}
                </Badge>
              </div>
              <p className="text-sm text-[#f8f6f1]/60 mt-1">{b.priority.actionDescription}</p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                if (b.priority.shouldTrain) navigate('/training');
                else if (b.priority.shouldSourceBuyers) navigate('/buyers');
                else if (b.priority.shouldSourceSellers) navigate('/sellers');
                else if (b.priority.shouldPushDeals) navigate('/deals');
                else navigate('/simulator');
              }}
              className={`${action.bg} ${action.color} border hover:brightness-110 flex-shrink-0`}
            >
              <Target className="w-4 h-4 mr-2" />
              {b.priority.shouldTrain ? 'Start Training' : 'Take Action'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Three columns: Yesterday | Skill Gaps | Company Flags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Yesterday */}
            <div className="bg-[#0f1929]/50 rounded-lg p-4 border border-[#c9a84c]/10">
              <h3 className="text-xs font-semibold text-[#c9a84c] mb-3 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Yesterday
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#f8f6f1]/50">Scenarios</span>
                  <span className="text-[#f8f6f1] font-semibold">{b.yesterday.scenariosCompleted}</span>
                </div>
                {b.yesterday.scenariosCompleted > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#f8f6f1]/50">Avg Score</span>
                    <span className={`font-semibold ${b.yesterday.avgScore >= 80 ? 'text-emerald-400' : b.yesterday.avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {b.yesterday.avgScore}%
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#f8f6f1]/50">Trainings Done</span>
                  <span className="text-[#f8f6f1] font-semibold">{b.yesterday.trainingsCompleted}</span>
                </div>
                {b.yesterday.wasIdle && (
                  <div className="flex items-center gap-1 text-xs text-yellow-400 mt-1">
                    <AlertTriangle className="w-3 h-3" />
                    No activity recorded
                  </div>
                )}
              </div>
            </div>

            {/* Skill Gaps */}
            <div className="bg-[#0f1929]/50 rounded-lg p-4 border border-[#c9a84c]/10">
              <h3 className="text-xs font-semibold text-[#c9a84c] mb-3 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Skills
              </h3>
              {b.today.skillGaps.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>All skills qualified</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {b.today.skillGaps.map((gap, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#f8f6f1]/70">{skillLabel(gap.skillArea)}</span>
                        <span className="text-red-400 font-semibold">{gap.avgRating}/10</span>
                      </div>
                      <Progress value={gap.avgRating * 10} className="h-1.5 bg-[#1a2744]" />
                    </div>
                  ))}
                  {b.today.overdueTrainings > 0 && (
                    <div className="flex items-center gap-1 text-xs text-yellow-400 mt-2">
                      <AlertTriangle className="w-3 h-3" />
                      {b.today.overdueTrainings} overdue training{b.today.overdueTrainings > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Company Flags */}
            <div className="bg-[#0f1929]/50 rounded-lg p-4 border border-[#c9a84c]/10">
              <h3 className="text-xs font-semibold text-[#c9a84c] mb-3 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Company Health
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#f8f6f1]/50">Sellers</span>
                  <span className="text-[#f8f6f1] font-semibold">{b.companyHealth.totalSellers}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#f8f6f1]/50">Buyers</span>
                  <span className={`font-semibold ${b.companyHealth.buyerPoolLow ? 'text-orange-400' : 'text-[#f8f6f1]'}`}>
                    {b.companyHealth.totalBuyers}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#f8f6f1]/50">Deals</span>
                  <span className={`font-semibold ${b.companyHealth.dealsStalled ? 'text-yellow-400' : 'text-[#f8f6f1]'}`}>
                    {b.companyHealth.totalDeals}
                  </span>
                </div>
                {b.companyHealth.buyerPoolLow && (
                  <div className="flex items-center gap-1 text-xs text-orange-400">
                    <AlertTriangle className="w-3 h-3" /> Buyer pool low
                  </div>
                )}
                {b.companyHealth.sellerLeadsLow && (
                  <div className="flex items-center gap-1 text-xs text-blue-400">
                    <AlertTriangle className="w-3 h-3" /> Need seller leads
                  </div>
                )}
                {b.companyHealth.dealsStalled && (
                  <div className="flex items-center gap-1 text-xs text-yellow-400">
                    <AlertTriangle className="w-3 h-3" /> Deals stalled
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
