import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Phone, PhoneOff, Mic, MicOff, Send, ArrowLeft, Play,
  RotateCcw, Award,
  Volume2, Keyboard, MessageSquare, BarChart3, Scale, Users, ClipboardList,
  Handshake
} from 'lucide-react';
import { useAIChat } from '@/hooks/useAIChat';
import { useSpeech } from '@/hooks/useSpeech';
import { trpc } from '@/providers/trpc';
import { roles } from '@/data/roles';

const roleIcons: Record<string, React.ReactNode> = {
  acquisition: <Phone className="w-5 h-5" />,
  underwriting: <BarChart3 className="w-5 h-5" />,
  legal: <Scale className="w-5 h-5" />,
  'buyer-relations': <Users className="w-5 h-5" />,
  operations: <ClipboardList className="w-5 h-5" />,
  'buyer-pool': <Users className="w-5 h-5" />,
  'referral-partner': <Handshake className="w-5 h-5" />,
};

export default function CallSimulator() {
  const navigate = useNavigate();
  const aiChat = useAIChat();
  const speech = useSpeech();
  const [textInput, setTextInput] = useState('');
  const [showScorecard, setShowScorecard] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [useTextMode, setUseTextMode] = useState(false);
  const [scorecardData, setScorecardData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const personasQuery = trpc.ai.getPersonas.useQuery();
  const personas = personasQuery.data || [];

  const selectedPersona = personas.find((p: any) => p.id === aiChat.personaId);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChat.messages]);

  // TTS for AI messages
  useEffect(() => {
    const lastMessage = aiChat.messages[aiChat.messages.length - 1];
    if (lastMessage?.role === 'ai' && aiChat.callStage === 'connected') {
      speech.speak(lastMessage.text);
    }
  }, [aiChat.messages, aiChat.callStage]);

  const handleStartCall = async (personaId: string) => {
    await aiChat.selectPersona(personaId);
  };

  const handleUserResponse = async (text: string) => {
    if (!text.trim()) return;
    await aiChat.sendMessage(text.trim());
    setTextInput('');
    speech.clearTranscript();
  };

  const handleVoiceResponse = async () => {
    if (speech.isListening) {
      speech.stopListening();
      const capturedText = speech.transcript;
      if (capturedText.trim()) {
        await handleUserResponse(capturedText);
      }
    } else {
      speech.clearTranscript();
      try {
        await speech.startListening();
      } catch (err: any) {
        setUseTextMode(true);
      }
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleUserResponse(textInput);
    }
  };

  const handleEndCall = async () => {
    const endResult = await aiChat.endCall();
    if (endResult) {
      setResult(endResult);
      // Get persona details for scorecard
      const persona = personas.find((p: any) => p.id === aiChat.personaId);
      setScorecardData({
        persona,
        result: endResult,
        messageCount: aiChat.messages.filter(m => m.role === 'user').length,
        duration: Math.round(
          aiChat.messages.length > 0
            ? (Date.now() - aiChat.messages[0].timestamp) / 1000
            : 0
        ),
      });
      setShowScorecard(true);
    }
  };

  const handleReset = () => {
    aiChat.reset();
    setShowScorecard(false);
    setResult(null);
    setScorecardData(null);
    speech.stopSpeaking();
    speech.stopListening();
    speech.clearTranscript();
  };

  // Scenario Selection View
  if (aiChat.callStage === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744]">
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
            <div>
              <h1 className="text-lg font-bold text-[#f8f6f1]">AI Call Simulator</h1>
              <p className="text-xs text-[#c9a84c]">
                {aiChat.aiMode === 'kimi-ai' ? 'Kimi AI Powered' : 'Demo Mode'}
              </p>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#f8f6f1] mb-2">
              Choose a Training Scenario
            </h2>
            <p className="text-[#f8f6f1]/60">
              Select an AI persona to practice with. Each persona represents a realistic
              counterparty you'll encounter in your role.
            </p>
            {aiChat.aiMode === 'demo' && (
              <Alert className="mt-4 bg-yellow-500/5 border-yellow-500/20">
                <AlertDescription className="text-xs text-yellow-400/70">
                  Running in Demo Mode. Kimi AI will be used when available, or the demo keyword-based responses will be used.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {personasQuery.isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-[#f8f6f1]/40 mt-4">Loading scenarios...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {personas.map((persona: any) => {
                const role = roles.find((r: any) => r.id === persona.roleId);
                return (
                  <Card
                    key={persona.id}
                    className="glass-panel border-[#c9a84c]/15 hover:border-[#c9a84c]/40 transition-all cursor-pointer"
                    onClick={() => handleStartCall(persona.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-[#c9a84c]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-[#f8f6f1]">{persona.name}</h3>
                            <Badge variant="outline" className="text-xs border-[#c9a84c]/20 text-[#c9a84c]/70">
                              {persona.title}
                            </Badge>
                            {role && (
                              <Badge variant="outline" style={{ borderColor: `${role.color}40`, color: role.color }} className="text-xs">
                                {role.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-[#f8f6f1]/50 mb-2">{persona.context}</p>
                          <div className="flex items-center gap-3 text-xs text-[#f8f6f1]/40">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              Dynamic conversation
                            </span>
                            <span className="flex items-center gap-1">
                              <Volume2 className="w-3 h-3" />
                              {persona.name}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="gold-gradient text-[#1a2744] font-semibold flex-shrink-0"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-8">
            <Separator className="bg-[#c9a84c]/20 mb-8" />
            <h3 className="text-lg font-bold text-[#f8f6f1] mb-4">Browse by Role</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {roles.map((role: any) => {
                const rolePersonas = personas.filter((p: any) => p.roleId === role.id);
                return (
                  <Card
                    key={role.id}
                    className="glass-panel border-[#c9a84c]/10 cursor-pointer hover:border-[#c9a84c]/30 transition-all"
                  >
                    <CardContent className="p-4 text-center">
                      <div
                        className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                        style={{ backgroundColor: `${role.color}20`, color: role.color }}
                      >
                        {roleIcons[role.id]}
                      </div>
                      <p className="text-sm font-medium text-[#f8f6f1]">{role.name}</p>
                      <p className="text-xs text-[#c9a84c]">{rolePersonas.length} scenarios</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Call Active View
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744] flex flex-col">
      {/* Call Header */}
      <header className="border-b border-[#c9a84c]/20 bg-[#1a2744]/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="text-[#f8f6f1]/60 hover:text-[#f8f6f1]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-sm font-semibold text-[#f8f6f1]">
                {selectedPersona?.name || 'AI Persona'}
              </h2>
              <p className="text-xs text-[#c9a84c]">
                {selectedPersona?.title || ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {aiChat.callStage === 'connected' && (
              <div className="flex items-center gap-1.5 text-green-400 text-xs animate-pulse">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                Live
              </div>
            )}
            <Badge variant="outline" className="border-[#c9a84c]/20 text-[#c9a84c]/70 text-xs">
              {aiChat.aiMode === 'kimi-ai' ? 'Kimi AI' : 'Demo'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEndCall}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <PhoneOff className="w-4 h-4 mr-1" />
              End
            </Button>
          </div>
        </div>
      </header>

      {/* Context Banner */}
      {selectedPersona && aiChat.callStage === 'connected' && (
        <div className="bg-[#c9a84c]/5 border-b border-[#c9a84c]/10">
          <div className="max-w-3xl mx-auto px-4 py-2">
            <p className="text-xs text-[#f8f6f1]/50">
              <span className="text-[#c9a84c] font-medium">Context:</span> {selectedPersona.context}
            </p>
          </div>
        </div>
      )}

      {/* Call Stage Display */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        {(aiChat.callStage === 'preparing' || aiChat.callStage === 'ringing') && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mx-auto">
                  <Phone className="w-10 h-10 text-[#c9a84c]" />
                </div>
                {aiChat.callStage === 'ringing' && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-[#c9a84c]/30 animate-ring" />
                    <div className="absolute inset-0 rounded-full border-2 border-[#c9a84c]/20 animate-ring" style={{ animationDelay: '0.5s' }} />
                  </>
                )}
              </div>
              <h3 className="text-xl font-semibold text-[#f8f6f1] mb-2">
                {aiChat.callStage === 'preparing' ? 'Preparing Call...' : 'Calling...'}
              </h3>
              <p className="text-[#f8f6f1]/50">
                {aiChat.callStage === 'preparing'
                  ? 'Loading AI persona and initializing voice...'
                  : `Connecting to ${selectedPersona?.name}...`}
              </p>
            </div>
          </div>
        )}

        {aiChat.callStage === 'connected' && (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-4">
              <div className="space-y-4">
                {aiChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-[#c9a84c]/20 text-[#f8f6f1] rounded-br-sm'
                          : 'bg-[#1a2744] border border-[#c9a84c]/20 text-[#f8f6f1] rounded-bl-sm'
                      }`}
                    >
                      {msg.role === 'ai' && (
                        <p className="text-xs text-[#c9a84c] mb-1 font-medium">
                          {selectedPersona?.name}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {aiChat.isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#1a2744] border border-[#c9a84c]/20 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-[#c9a84c]/20 bg-[#1a2744]/50 p-4">
              {/* Mode Toggle */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant={useTextMode ? "ghost" : "default"}
                    size="sm"
                    onClick={() => setUseTextMode(false)}
                    disabled={!speech.supportsSpeech}
                    className={!useTextMode ? 'gold-gradient text-[#1a2744]' : 'text-[#f8f6f1]/60'}
                  >
                    <Mic className="w-3 h-3 mr-1" />
                    Voice
                  </Button>
                  <Button
                    variant={useTextMode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setUseTextMode(true)}
                    className={useTextMode ? 'gold-gradient text-[#1a2744]' : 'text-[#f8f6f1]/60'}
                  >
                    <Keyboard className="w-3 h-3 mr-1" />
                    Text
                  </Button>
                </div>
                {speech.isListening && (
                  <div className="flex items-center gap-1.5 text-[#c9a84c] text-xs animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Listening...
                  </div>
                )}
              </div>

              {/* Error Display */}
              {speech.error && !useTextMode && (
                <Alert className="mb-3 bg-red-500/5 border-red-500/20">
                  <AlertDescription className="text-xs text-red-400">
                    {speech.error}
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => { setUseTextMode(true); speech.clearError(); }}
                      className="text-[#c9a84c] ml-2"
                    >
                      Switch to Text
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {aiChat.error && (
                <Alert className="mb-3 bg-red-500/5 border-red-500/20">
                  <AlertDescription className="text-xs text-red-400">
                    {aiChat.error}
                  </AlertDescription>
                </Alert>
              )}

              {useTextMode ? (
                <form onSubmit={handleTextSubmit} className="flex gap-2">
                  <Textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1] placeholder:text-[#f8f6f1]/30 min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleTextSubmit(e);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={!textInput.trim() || aiChat.isLoading}
                    className="gold-gradient text-[#1a2744] self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleVoiceResponse}
                    disabled={aiChat.isLoading}
                    className={`flex-1 ${
                      speech.isListening
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'gold-gradient text-[#1a2744]'
                    }`}
                  >
                    {speech.isListening ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Hold to Speak
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setUseTextMode(true)}
                    className="border-[#c9a84c]/20 text-[#c9a84c]"
                  >
                    <Keyboard className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {speech.isListening && speech.transcript && (
                <p className="mt-2 text-xs text-[#f8f6f1]/40 italic">
                  {speech.transcript}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Scorecard Dialog */}
      <Dialog open={showScorecard} onOpenChange={setShowScorecard}>
        <DialogContent className="max-w-lg bg-[#1a2744] border-[#c9a84c]/30 text-[#f8f6f1]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Award className="w-6 h-6 text-[#c9a84c]" />
              Scenario Complete
            </DialogTitle>
            <DialogDescription className="text-[#f8f6f1]/50">
              {scorecardData?.persona?.name} — {scorecardData?.persona?.title}
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center py-4">
                <div className="relative inline-block">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#1a2744" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="50" fill="none" stroke="#c9a84c" strokeWidth="8"
                      strokeDasharray={`${result.overallScore * 3.14} 314`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[#c9a84c]">{result.overallScore}%</span>
                    <span className="text-xs text-[#f8f6f1]/50">Score</span>
                  </div>
                </div>
              </div>

              {/* Coaching Points */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#c9a84c]">Coaching Feedback</h4>
                {result.coachingPoints.map((point: any, i: number) => (
                  <div key={i} className="bg-[#0f1929] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#f8f6f1]">{point.criterion}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <div
                            key={star}
                            className={`w-2 h-2 rounded-full ${
                              star <= point.score ? 'bg-[#c9a84c]' : 'bg-[#f8f6f1]/10'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#f8f6f1]/50">{point.feedback}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#0f1929] rounded-lg p-3">
                  <p className="text-lg font-bold text-[#c9a84c]">{scorecardData?.messageCount || 0}</p>
                  <p className="text-xs text-[#f8f6f1]/40">Responses</p>
                </div>
                <div className="bg-[#0f1929] rounded-lg p-3">
                  <p className="text-lg font-bold text-[#c9a84c]">
                    {Math.floor((scorecardData?.duration || 0) / 60)}:{String((scorecardData?.duration || 0) % 60).padStart(2, '0')}
                  </p>
                  <p className="text-xs text-[#f8f6f1]/40">Duration</p>
                </div>
                <div className="bg-[#0f1929] rounded-lg p-3">
                  <p className="text-lg font-bold text-[#c9a84c]">{result.coachingPoints.length}</p>
                  <p className="text-xs text-[#f8f6f1]/40">Criteria</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-[#c9a84c]/20 text-[#c9a84c] hover:bg-[#c9a84c]/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Another Scenario
                </Button>
                <Button
                  onClick={() => { setShowScorecard(false); navigate('/scorecard'); }}
                  className="flex-1 gold-gradient text-[#1a2744]"
                >
                  <Award className="w-4 h-4 mr-2" />
                  View Scorecard
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
