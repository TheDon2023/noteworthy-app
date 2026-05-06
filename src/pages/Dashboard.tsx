import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Phone, BarChart3, Scale, Users, ClipboardList,
  Play, BookOpen, Award, ChevronRight, Headphones,
  TrendingUp, Shield, Mic, Zap, Sparkles, Target,
  Home, DollarSign, ArrowRight
} from 'lucide-react';
import { roles } from '@/data/roles';
import { trpc } from '@/providers/trpc';

const iconMap: Record<string, React.ReactNode> = {
  Phone: <Phone className="w-6 h-6" />,
  BarChart3: <BarChart3 className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  ClipboardList: <ClipboardList className="w-6 h-6" />,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const resultsQuery = trpc.ai.getResults.useQuery();
  const aiStatus = trpc.ai.checkAIStatus.useQuery();
  const results = resultsQuery.data || [];

  const completedScenarios = results.length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((acc: number, r: any) => acc + (r.overallScore || 0), 0) / results.length)
    : 0;

  const getRoleProgress = (roleId: string) => {
    const roleResults = results.filter((r: any) => r.roleId === roleId);
    return { completed: roleResults.length, total: 6 }; // approximate total
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744]">
      {/* Header */}
      <header className="border-b border-[#c9a84c]/20 bg-[#1a2744]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="NoteWorthy Capital" className="h-10 w-10 rounded-lg" />
            <div>
              <h1 className="text-lg font-bold text-[#f8f6f1]">NoteWorthy Capital</h1>
              <p className="text-xs text-[#c9a84c]">AI Onboarding Simulator</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-[#c9a84c]/80">
              <Zap className="w-4 h-4" />
              <span>{aiStatus.data?.mode === 'kimi-ai' ? 'Kimi AI' : 'Demo Mode'}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/scorecard')}
              className="border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10"
            >
              <Award className="w-4 h-4 mr-2" />
              Scorecard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-banner.jpg')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2744]/60 to-[#0f1929]" />
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/30 hover:bg-[#c9a84c]/30">
                AI Training Mode
              </Badge>
              {aiStatus.data?.kimiAIAvailable ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Zap className="w-3 h-3 mr-1" />
                  Kimi AI Live
                </Badge>
              ) : (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Demo Mode
                </Badge>
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f8f6f1] mb-4">
              Train with <span className="text-[#c9a84c]">AI-Powered Personas</span>
            </h2>
            <p className="text-[#f8f6f1]/70 text-lg mb-6">
              Practice realistic conversations with dynamic AI personas. Each scenario adapts to your
              responses and provides personalized coaching feedback.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate('/simulator')}
                className="gold-gradient text-[#1a2744] font-semibold hover:brightness-110"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Training
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/mentor')}
                className="border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Ask Mentor
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/study')}
                className="border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Study Materials
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Overview */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-panel border-[#c9a84c]/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#f8f6f1]/60">Scenarios Done</p>
                  <p className="text-2xl font-bold text-[#c9a84c]">{completedScenarios}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#c9a84c]" />
                </div>
              </div>
              <Progress value={Math.min(completedScenarios * 10, 100)} className="mt-3 h-2 bg-[#1a2744]" />
            </CardContent>
          </Card>
          <Card className="glass-panel border-[#c9a84c]/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#f8f6f1]/60">Avg Score</p>
                  <p className="text-2xl font-bold text-[#c9a84c]">{avgScore}%</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#c9a84c]" />
                </div>
              </div>
              <Progress value={avgScore} className="mt-3 h-2 bg-[#1a2744]" />
            </CardContent>
          </Card>
          <Card className="glass-panel border-[#c9a84c]/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#f8f6f1]/60">AI Mode</p>
                  <p className="text-2xl font-bold text-[#c9a84c]">
                    {aiStatus.data?.kimiAIAvailable ? 'Kimi AI' : 'Demo'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#c9a84c]" />
                </div>
              </div>
              <p className="text-xs text-[#f8f6f1]/40 mt-3">
                {aiStatus.data?.kimiAIAvailable
                  ? 'Dynamic AI responses powered by Kimi AI'
                  : 'Add OPENAI_API_KEY to .env for full AI'}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* OPERATIONAL TOOLS */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <h3 className="text-lg font-bold text-[#f8f6f1] mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#c9a84c]" />
          Operations Center
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-panel border-green-500/20 hover:border-green-500/40 transition-all cursor-pointer" onClick={() => navigate('/sellers')}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Home className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#f8f6f1] mb-1">Seller Tracker</h4>
                  <p className="text-xs text-[#f8f6f1]/50 mb-3">Log and manage every note seller lead you find.</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400 font-semibold">Manage Leads</span>
                    <ArrowRight className="w-3 h-3 text-green-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer" onClick={() => navigate('/buyers')}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#f8f6f1] mb-1">Buyer CRM</h4>
                  <p className="text-xs text-[#f8f6f1]/50 mb-3">Build and maintain your qualified investor pool.</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-400 font-semibold">Manage Buyers</span>
                    <ArrowRight className="w-3 h-3 text-blue-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => navigate('/deals')}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#f8f6f1] mb-1">Deal Pipeline</h4>
                  <p className="text-xs text-[#f8f6f1]/50 mb-3">Track deals from sourcing through closing.</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-400 font-semibold">View Pipeline</span>
                    <ArrowRight className="w-3 h-3 text-purple-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI Mentor Section */}
      <section className="max-w-7xl mx-auto px-4 pb-6">
        <Card className="border-purple-500/20 bg-gradient-to-r from-[#1a2744] to-[#1a2744]/80">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-[#f8f6f1] mb-2">
                  NoteWorthy AI Mentor
                </h3>
                <p className="text-[#f8f6f1]/60 mb-4">
                  Your personal business expert and coach. Ask about scripts, compliance, deal analysis,
                  or any aspect of the note business. The mentor remembers your conversations and adapts coaching.
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                    <Zap className="w-3 h-3 mr-1" />
                    Script Review
                  </Badge>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                    <Zap className="w-3 h-3 mr-1" />
                    Compliance Advice
                  </Badge>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                    <Zap className="w-3 h-3 mr-1" />
                    Deal Analysis
                  </Badge>
                </div>
              </div>
              <Button
                onClick={() => navigate('/mentor')}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold flex-shrink-0"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Ask Mentor
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Start Call Simulator */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <Card className="border-[#c9a84c]/30 bg-gradient-to-r from-[#1a2744] to-[#1a2744]/80">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#c9a84c]/20 flex items-center justify-center flex-shrink-0 animate-pulse-gold">
                <Headphones className="w-8 h-8 text-[#c9a84c]" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-[#f8f6f1] mb-2">
                  AI Call Simulator
                </h3>
                <p className="text-[#f8f6f1]/60 mb-4">
                  Practice with AI-powered voice scenarios. The AI adapts to your spoken responses
                  and behaves like a real note seller, buyer, or team member.
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Badge variant="outline" className="border-green-500/30 text-green-400">
                    <Mic className="w-3 h-3 mr-1" />
                    Voice Enabled
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                    <Zap className="w-3 h-3 mr-1" />
                    Dynamic AI
                  </Badge>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                    Real-time Coaching
                  </Badge>
                </div>
              </div>
              <Button
                onClick={() => navigate('/simulator')}
                className="gold-gradient text-[#1a2744] font-semibold hover:brightness-110 flex-shrink-0"
              >
                <Play className="w-4 h-4 mr-2" />
                Launch
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="max-w-7xl mx-auto bg-[#c9a84c]/20" />

      {/* Roles Section */}
      <section id="roles-section" className="max-w-7xl mx-auto px-4 py-10">
        <h3 className="text-2xl font-bold text-[#f8f6f1] mb-2">Select Your Role</h3>
        <p className="text-[#f8f6f1]/60 mb-8">
          Choose a role to practice scenarios specifically designed for that position.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const progress = getRoleProgress(role.id);
            const total = progress.total;

            return (
              <Card
                key={role.id}
                className="group glass-panel border-[#c9a84c]/15 hover:border-[#c9a84c]/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                onClick={() => navigate(`/simulator`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${role.color}20`, color: role.color }}
                    >
                      {iconMap[role.icon]}
                    </div>
                    <Badge
                      variant="outline"
                      className="border-[#c9a84c]/20 text-[#c9a84c]/70"
                    >
                      {progress.completed}/{total}
                    </Badge>
                  </div>
                  <CardTitle className="text-[#f8f6f1] mt-3 group-hover:text-[#c9a84c] transition-colors">
                    {role.name}
                  </CardTitle>
                  <CardDescription className="text-[#f8f6f1]/50 text-sm leading-relaxed">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#f8f6f1]/50">Progress</span>
                      <span className="text-[#c9a84c]">
                        {total > 0 ? Math.round((progress.completed / total) * 100) : 0}%
                      </span>
                    </div>
                    <Progress
                      value={total > 0 ? (progress.completed / total) * 100 : 0}
                      className="h-1.5 bg-[#1a2744]"
                    />
                    <div className="flex items-center text-[#c9a84c] text-sm pt-2 group-hover:translate-x-1 transition-transform">
                      <span>Start Training</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Buyer Acquisition SOP CTA */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <Card className="glass-panel border-green-500/20 bg-gradient-to-r from-[#1a2744] to-[#1a2744]/80">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Target className="w-7 h-7 text-green-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-[#f8f6f1] mb-2">
                  Buyer Acquisition SOP
                </h3>
                <p className="text-[#f8f6f1]/60">
                  Complete SOP for building your buyer pool: Top 10 seller financing states,
                  7 sourcing channels, qualification framework, CRM standards, and ready-to-use templates.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/buyer-acquisition')}
                className="border-green-500/30 text-green-400 hover:bg-green-500/10 flex-shrink-0"
              >
                <Target className="w-4 h-4 mr-2" />
                View SOP
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Study Materials CTA */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <Card className="glass-panel border-[#c9a84c]/20">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-14 h-14 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-[#c9a84c]" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-[#f8f6f1] mb-2">
                  Study Before You Practice
                </h3>
                <p className="text-[#f8f6f1]/60">
                  Review professional scripts, checklists, templates, and the complete note investing
                  glossary before jumping into AI training scenarios.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/study')}
                className="border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10 flex-shrink-0"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Open Library
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#c9a84c]/10 bg-[#0f1929] mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-[#f8f6f1]/40">
            NoteWorthy Capital LLC — AI-Powered Onboarding Training
          </p>
          <p className="text-xs text-[#f8f6f1]/20 mt-1">
            For training purposes only. All scenarios are simulated.
          </p>
        </div>
      </footer>
    </div>
  );
}
