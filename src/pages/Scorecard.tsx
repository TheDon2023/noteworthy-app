import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Award, TrendingUp, Clock, MessageSquare,
  Phone, BarChart3, Scale, Users, ClipboardList,
  RotateCcw, Play, Star, Target
} from 'lucide-react';
import { roles } from '@/data/roles';
import { trpc } from '@/providers/trpc';

const roleIcons: Record<string, React.ReactNode> = {
  acquisition: <Phone className="w-5 h-5" />,
  underwriting: <BarChart3 className="w-5 h-5" />,
  legal: <Scale className="w-5 h-5" />,
  'buyer-relations': <Users className="w-5 h-5" />,
  operations: <ClipboardList className="w-5 h-5" />,
};

export default function Scorecard() {
  const navigate = useNavigate();
  const resultsQuery = trpc.ai.getResults.useQuery();
  const results = resultsQuery.data || [];

  const completedScenarios = results.length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((acc: number, r: any) => acc + r.overallScore, 0) / results.length)
    : 0;

  const totalTime = results.reduce((acc: number, r: any) => acc + (r.timeSpent || 0), 0);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-500/10 border-green-500/20';
    if (score >= 70) return 'bg-yellow-500/10 border-yellow-500/20';
    if (score >= 50) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744]">
      {/* Header */}
      <header className="border-b border-[#c9a84c]/20 bg-[#1a2744]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-[#f8f6f1]/60 hover:text-[#f8f6f1]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-[#c9a84c]" />
            <div>
              <h1 className="text-lg font-bold text-[#f8f6f1]">Performance Scorecard</h1>
              <p className="text-xs text-[#c9a84c]">Track Your Training Progress</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {results.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-[#c9a84c]/40" />
            </div>
            <h2 className="text-2xl font-bold text-[#f8f6f1] mb-3">No Training Data Yet</h2>
            <p className="text-[#f8f6f1]/50 max-w-md mx-auto mb-8">
              Complete your first training scenario to see your performance metrics and coaching feedback here.
            </p>
            <Button
              onClick={() => navigate('/simulator')}
              className="gold-gradient text-[#1a2744] font-semibold"
            >
              <Play className="w-4 h-4 mr-2" />
              Start First Scenario
            </Button>
          </div>
        ) : (
          /* Scorecard Content */
          <>
            {/* Top Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="glass-panel border-[#c9a84c]/20">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-[#c9a84c]" />
                  </div>
                  <p className="text-3xl font-bold text-[#c9a84c]">{completedScenarios}</p>
                  <p className="text-xs text-[#f8f6f1]/50 mt-1">Scenarios Completed</p>
                  <Progress value={Math.min(completedScenarios * 10, 100)} className="mt-3 h-1.5 bg-[#1a2744]" />
                </CardContent>
              </Card>
              <Card className="glass-panel border-[#c9a84c]/20">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-[#c9a84c]" />
                  </div>
                  <p className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}%</p>
                  <p className="text-xs text-[#f8f6f1]/50 mt-1">Average Score</p>
                  <Progress value={avgScore} className="mt-3 h-1.5 bg-[#1a2744]" />
                </CardContent>
              </Card>
              <Card className="glass-panel border-[#c9a84c]/20">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-[#c9a84c]" />
                  </div>
                  <p className="text-3xl font-bold text-[#f8f6f1]">
                    {Math.floor(totalTime / 60)}:{String(totalTime % 60).padStart(2, '0')}
                  </p>
                  <p className="text-xs text-[#f8f6f1]/50 mt-1">Total Practice Time</p>
                </CardContent>
              </Card>
              <Card className="glass-panel border-[#c9a84c]/20">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6 text-[#c9a84c]" />
                  </div>
                  <p className="text-3xl font-bold text-[#f8f6f1]">
                    {results.reduce((acc: number, r: any) => {
                      try {
                        const points = JSON.parse(r.coachingPoints || '[]');
                        return acc + points.length;
                      } catch { return acc; }
                    }, 0)}
                  </p>
                  <p className="text-xs text-[#f8f6f1]/50 mt-1">Criteria Assessed</p>
                </CardContent>
              </Card>
            </div>

            {/* Scenario History */}
            <h2 className="text-xl font-bold text-[#f8f6f1] mb-4">Scenario History</h2>
            <div className="space-y-3 mb-8">
              {[...results].sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).map((result: any) => {
                const role = roles.find(r => r.id === result.roleId);
                let coachingPoints: any[] = [];
                try {
                  coachingPoints = JSON.parse(result.coachingPoints || '[]');
                } catch { }

                return (
                  <Card key={result.id} className={`glass-panel ${getScoreBg(result.overallScore)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: role ? `${role.color}20` : '#c9a84c20', color: role?.color || '#c9a84c' }}
                        >
                          {role ? roleIcons[role.id] : <Phone className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-[#f8f6f1]">Scenario #{result.id}</h4>
                            <span className={`text-lg font-bold ${getScoreColor(result.overallScore)}`}>
                              {result.overallScore}%
                            </span>
                          </div>
                          <p className="text-xs text-[#f8f6f1]/40 mb-2">
                            {role?.name || 'Unknown'} • {new Date(result.completedAt).toLocaleDateString()} •
                            {' '}{Math.floor((result.timeSpent || 0) / 60)}:{String((result.timeSpent || 0) % 60).padStart(2, '0')} duration
                          </p>
                          <div className="flex flex-wrap gap-4 text-xs text-[#f8f6f1]/50">
                            <span>{coachingPoints.length} criteria assessed</span>
                            <div className="flex gap-1">
                              {coachingPoints.slice(0, 4).map((cp: any, i: number) => (
                                <div key={i} className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <div
                                      key={star}
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        star <= (cp.score || 0) ? 'bg-[#c9a84c]' : 'bg-[#f8f6f1]/10'
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/simulator')}
                          className="border-[#c9a84c]/20 text-[#c9a84c] hover:bg-[#c9a84c]/10 flex-shrink-0 self-center"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Retry
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Coaching Insights */}
            <Separator className="bg-[#c9a84c]/20 mb-8" />
            <h2 className="text-xl font-bold text-[#f8f6f1] mb-4">Coaching Insights</h2>
            <Card className="glass-panel border-[#c9a84c]/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {(() => {
                    const allCriteria: Record<string, { total: number; count: number }> = {};
                    results.forEach((r: any) => {
                      let points: any[] = [];
                      try { points = JSON.parse(r.coachingPoints || '[]'); } catch { }
                      points.forEach((cp: any) => {
                        if (!allCriteria[cp.criterion]) {
                          allCriteria[cp.criterion] = { total: 0, count: 0 };
                        }
                        allCriteria[cp.criterion].total += cp.score || 0;
                        allCriteria[cp.criterion].count++;
                      });
                    });

                    const sorted = Object.entries(allCriteria)
                      .map(([criterion, data]) => ({
                        criterion,
                        avg: Math.round((data.total / data.count) * 20)
                      }))
                      .sort((a, b) => a.avg - b.avg);

                    if (sorted.length === 0) {
                      return <p className="text-sm text-[#f8f6f1]/40">Complete more scenarios to see coaching insights.</p>;
                    }

                    return sorted.map(item => (
                      <div key={item.criterion}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-[#f8f6f1]/70">{item.criterion}</span>
                          <span className={`text-sm font-bold ${getScoreColor(item.avg)}`}>{item.avg}%</span>
                        </div>
                        <Progress value={item.avg} className="h-1.5 bg-[#1a2744]" />
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
