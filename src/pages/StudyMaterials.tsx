import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, BookOpen, FileText, CheckSquare, 
  MessageSquare, Phone, BarChart3, Scale, Users, ClipboardList
} from 'lucide-react';
import { roles } from '@/data/roles';
import { studyMaterials } from '@/data/studyMaterials';
import { scenarios } from '@/data/scenarios';

const roleIcons: Record<string, React.ReactNode> = {
  acquisition: <Phone className="w-5 h-5" />,
  underwriting: <BarChart3 className="w-5 h-5" />,
  legal: <Scale className="w-5 h-5" />,
  'buyer-relations': <Users className="w-5 h-5" />,
  operations: <ClipboardList className="w-5 h-5" />,
};

const typeIcons: Record<string, React.ReactNode> = {
  script: <MessageSquare className="w-4 h-4" />,
  checklist: <CheckSquare className="w-4 h-4" />,
  template: <FileText className="w-4 h-4" />,
  glossary: <BookOpen className="w-4 h-4" />,
};

export default function StudyMaterials() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  const filteredMaterials = selectedRole === 'all' 
    ? studyMaterials 
    : studyMaterials.filter(m => m.roleId === selectedRole);

  const activeMaterial = studyMaterials.find(m => m.id === selectedMaterial);

  // Render markdown-like content with simple formatting
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-2 text-sm text-[#f8f6f1]/70 ml-2">
            {listItems.map((item, i) => (
              <li key={i}>{item.replace(/^[-*]\s/, '')}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={idx} className="text-xl font-bold text-[#c9a84c] mt-6 mb-3">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={idx} className="text-lg font-semibold text-[#f8f6f1] mt-5 mb-2">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 100) {
        flushList();
        elements.push(
          <h4 key={idx} className="text-sm font-bold text-[#f8f6f1] mt-4 mb-1">
            {trimmed.replace(/\*\*/g, '')}
          </h4>
        );
      } else if (trimmed.startsWith('```')) {
        flushList();
        // Skip code block markers, show content differently
        if (!trimmed.endsWith('```') || trimmed === '```') {
          // Start of code block - we'll render the next lines specially
        }
      } else if (trimmed.startsWith('---')) {
        flushList();
        elements.push(<Separator key={idx} className="my-4 bg-[#c9a84c]/20" />);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (trimmed.includes('[ ]') || trimmed.includes('[x]')) {
          // Checkbox item
          const isChecked = trimmed.includes('[x]');
          const text = trimmed.replace(/[-*]\s*\[[x ]\]\s*/, '');
          elements.push(
            <div key={idx} className="flex items-start gap-2 my-1 ml-2">
              <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isChecked ? 'bg-[#c9a84c] border-[#c9a84c]' : 'border-[#c9a84c]/30'
              }`}>
                {isChecked && <span className="text-[#1a2744] text-xs">✓</span>}
              </div>
              <span className="text-sm text-[#f8f6f1]/70">{text}</span>
            </div>
          );
        } else {
          listItems.push(trimmed);
        }
      } else if (trimmed.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote key={idx} className="border-l-2 border-[#c9a84c] pl-3 my-3 text-sm italic text-[#f8f6f1]/60">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      } else if (trimmed.startsWith('1. ') || /^\d+\.\s/.test(trimmed)) {
        flushList();
        elements.push(
          <div key={idx} className="flex gap-2 my-1 text-sm text-[#f8f6f1]/70">
            <span className="text-[#c9a84c] font-medium flex-shrink-0">{trimmed.match(/^\d+/)?.[0]}.</span>
            <span>{trimmed.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      } else if (trimmed) {
        flushList();
        // Regular paragraph - check for inline bold
        const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
        elements.push(
          <p key={idx} className="text-sm text-[#f8f6f1]/70 my-2 leading-relaxed">
            {parts.map((part, pi) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pi} className="text-[#f8f6f1]">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744]">
      {/* Header */}
      <header className="border-b border-[#c9a84c]/20 bg-[#1a2744]/80 backdrop-blur-sm sticky top-0 z-50">
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
            <BookOpen className="w-5 h-5 text-[#c9a84c]" />
            <div>
              <h1 className="text-lg font-bold text-[#f8f6f1]">Study Materials</h1>
              <p className="text-xs text-[#c9a84c]">Scripts, Checklists & Templates</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {!activeMaterial ? (
          <>
            {/* Role Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Button
                variant={selectedRole === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole('all')}
                className={selectedRole === 'all' ? 'gold-gradient text-[#1a2744]' : 'border-[#c9a84c]/20 text-[#c9a84c]'}
              >
                All Materials
              </Button>
              {roles.map(role => (
                <Button
                  key={role.id}
                  variant={selectedRole === role.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRole(role.id)}
                  className={selectedRole === role.id ? 'gold-gradient text-[#1a2744]' : 'border-[#c9a84c]/20 text-[#f8f6f1]/60'}
                >
                  {roleIcons[role.id]}
                  <span className="ml-2 hidden sm:inline">{role.name}</span>
                </Button>
              ))}
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaterials.map((material) => {
                const role = roles.find(r => r.id === material.roleId);
                return (
                  <Card 
                    key={material.id}
                    className="glass-panel border-[#c9a84c]/15 hover:border-[#c9a84c]/40 transition-all cursor-pointer hover:scale-[1.02]"
                    onClick={() => setSelectedMaterial(material.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-[#c9a84c]">
                            {typeIcons[material.type]}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              material.type === 'script' ? 'border-blue-500/30 text-blue-400' :
                              material.type === 'checklist' ? 'border-green-500/30 text-green-400' :
                              material.type === 'template' ? 'border-purple-500/30 text-purple-400' :
                              'border-yellow-500/30 text-yellow-400'
                            }`}
                          >
                            {material.type}
                          </Badge>
                        </div>
                        {role && (
                          <div 
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{ backgroundColor: `${role.color}20`, color: role.color }}
                          >
                            {roleIcons[role.id]}
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-base text-[#f8f6f1] mt-2">
                        {material.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-[#f8f6f1]/40">
                        {role?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-[#f8f6f1]/50 line-clamp-3">
                        {material.content.substring(0, 150)}...
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Reference Cards */}
            <Separator className="my-8 bg-[#c9a84c]/20" />
            
            <h2 className="text-xl font-bold text-[#f8f6f1] mb-4">Quick Reference</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="glass-panel border-[#c9a84c]/15">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-[#c9a84c] mb-2">LTV Formula</h4>
                  <code className="text-xs bg-[#0f1929] px-2 py-1 rounded text-[#f8f6f1]/70 block">
                    LTV = UPB / Market Value x 100
                  </code>
                  <p className="text-xs text-[#f8f6f1]/40 mt-2">Threshold: ≤70% (green)</p>
                </CardContent>
              </Card>
              <Card className="glass-panel border-[#c9a84c]/15">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-[#c9a84c] mb-2">Yield Formula</h4>
                  <code className="text-xs bg-[#0f1929] px-2 py-1 rounded text-[#f8f6f1]/70 block">
                    Yield = Annual Payments / Price x 100
                  </code>
                  <p className="text-xs text-[#f8f6f1]/40 mt-2">Target: 10-15% for buyers</p>
                </CardContent>
              </Card>
              <Card className="glass-panel border-[#c9a84c]/15">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-[#c9a84c] mb-2">Buy Range</h4>
                  <p className="text-xs text-[#f8f6f1]/70">Purchase: 60-75% of UPB</p>
                  <p className="text-xs text-[#f8f6f1]/70">Assign: 80-85% of UPB</p>
                  <p className="text-xs text-[#f8f6f1]/40 mt-2">Spread = Your profit</p>
                </CardContent>
              </Card>
              <Card className="glass-panel border-[#c9a84c]/15">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-[#c9a84c] mb-2">Ohio Usury</h4>
                  <p className="text-xs text-[#f8f6f1]/70">Cap: 8% for consumer loans</p>
                  <p className="text-xs text-[#f8f6f1]/70">Exemption: ORC 1343.01</p>
                  <p className="text-xs text-[#f8f6f1]/40 mt-2">Seasoned notes {'>'}12mo exempt</p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          /* Material Detail View */
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedMaterial(null)}
              className="mb-4 text-[#f8f6f1]/60 hover:text-[#f8f6f1]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Button>

            <Card className="glass-panel border-[#c9a84c]/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge 
                    variant="outline"
                    className={`${
                      activeMaterial.type === 'script' ? 'border-blue-500/30 text-blue-400' :
                      activeMaterial.type === 'checklist' ? 'border-green-500/30 text-green-400' :
                      activeMaterial.type === 'template' ? 'border-purple-500/30 text-purple-400' :
                      'border-yellow-500/30 text-yellow-400'
                    }`}
                  >
                    {activeMaterial.type}
                  </Badge>
                  {(() => {
                    const role = roles.find(r => r.id === activeMaterial.roleId);
                    return role ? (
                      <Badge variant="outline" style={{ borderColor: `${role.color}40`, color: role.color }}>
                        {role.name}
                      </Badge>
                    ) : null;
                  })()}
                </div>
                <CardTitle className="text-2xl text-[#f8f6f1]">
                  {activeMaterial.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="prose prose-invert max-w-none pr-4">
                    {renderContent(activeMaterial.content)}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Related Scenarios */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#f8f6f1] mb-3">Related Scenarios</h3>
              <div className="flex gap-3 flex-wrap">
                {scenarios
                  .filter(s => s.roleId === activeMaterial.roleId)
                  .map(s => (
                    <Button
                      key={s.id}
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/simulator?role=${s.roleId}`)}
                      className="border-[#c9a84c]/20 text-[#c9a84c] hover:bg-[#c9a84c]/10"
                    >
                      <Phone className="w-3 h-3 mr-2" />
                      {s.title}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
