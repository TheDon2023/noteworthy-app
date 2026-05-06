import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/providers/trpc';
import {
  ArrowLeft, Send, Bot, User, RotateCcw, Sparkles,
  BookOpen, MessageSquare, Lightbulb, Zap, ChevronRight
} from 'lucide-react';

const quickPrompts = [
  { icon: <BookOpen className="w-4 h-4" />, text: "Review my cold call script" },
  { icon: <Lightbulb className="w-4 h-4" />, text: "How do I handle price objections?" },
  { icon: <Zap className="w-4 h-4" />, text: "Walk me through LTV calculation" },
  { icon: <MessageSquare className="w-4 h-4" />, text: "What does compliance require for buyer qualification?" },
  { icon: <BookOpen className="w-4 h-4" />, text: "Explain the Henderson deal structure" },
  { icon: <Lightbulb className="w-4 h-4" />, text: "How should I start as a new hire?" },
];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Mentor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId] = useState(() => `mentor-${Date.now()}`);
  const [isTyping, setIsTyping] = useState(false);
  const [autoSent, setAutoSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mentorChat = trpc.mentor.chat.useMutation();
  const mentorStatus = trpc.mentor.status.useQuery();
  const clearMutation = trpc.mentor.clear.useMutation();

  // Auto-send initial prompt from URL
  useEffect(() => {
    if (initialPrompt && !autoSent) {
      setAutoSent(true);
      handleSend(initialPrompt);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt, autoSent]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await mentorChat.mutateAsync({
        message: text.trim(),
        conversationId,
      });

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleClear = async () => {
    await clearMutation.mutateAsync({ conversationId });
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#c9a84c]/20 bg-[#1a2744]/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-[#f8f6f1]/60 hover:text-[#f8f6f1]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-[#c9a84c]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#c9a84c]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#f8f6f1]">NoteWorthy Mentor</h2>
              <div className="flex items-center gap-2">
                <p className="text-xs text-[#c9a84c]">Business Expert & Coach</p>
                {mentorStatus.data?.botName ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] px-1.5 py-0">
                    {mentorStatus.data.botName}
                  </Badge>
                ) : mentorStatus.data?.clawConfigured ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] px-1.5 py-0">
                    Kimi Claw
                  </Badge>
                ) : (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] px-1.5 py-0">
                    Kimi API
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-[#f8f6f1]/40 hover:text-[#f8f6f1]"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            New Chat
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center max-w-lg">
              <div className="w-16 h-16 rounded-full bg-[#c9a84c]/20 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-8 h-8 text-[#c9a84c]" />
              </div>
              <h2 className="text-2xl font-bold text-[#f8f6f1] mb-3">
                Your NoteWorthy Mentor
              </h2>
              <p className="text-[#f8f6f1]/60 mb-6">
                I'm your expert coach on everything NoteWorthy Capital — scripts, compliance,
                deal analysis, and role-specific training. Ask me anything about the business.
              </p>
              
              {/* Quick Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt.text)}
                    className="flex items-center gap-3 p-3 text-left rounded-lg bg-[#1a2744]/60 border border-[#c9a84c]/15 hover:border-[#c9a84c]/40 hover:bg-[#c9a84c]/5 transition-all text-sm text-[#f8f6f1]/70"
                  >
                    <span className="text-[#c9a84c]">{prompt.icon}</span>
                    <span>{prompt.text}</span>
                    <ChevronRight className="w-3 h-3 ml-auto text-[#c9a84c]/40" />
                  </button>
                ))}
              </div>

              {mentorStatus.data?.botName ? (
                <Alert className="mt-6 bg-green-500/5 border-green-500/20 text-left">
                  <AlertDescription className="text-xs text-green-400/70">
                    <strong>Connected:</strong> {mentorStatus.data.botName} (Kimi Claw) is your active mentor.
                    Conversations route through your deployed agent with persistent memory and personality.
                  </AlertDescription>
                </Alert>
              ) : !mentorStatus.data?.clawConfigured && (
                <Alert className="mt-6 bg-blue-500/5 border-blue-500/20 text-left">
                  <AlertDescription className="text-xs text-blue-400/70">
                    <strong>Pro Tip:</strong> Connect a Kimi Claw agent for persistent memory.
                    Your mentor will remember previous conversations and adapt coaching over time.
                    Add <code className="bg-blue-500/10 px-1 rounded">KIMI_CLAW_BOT_ID</code> to your .env file.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        ) : (
          /* Messages */
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-[#c9a84c]/20'
                        : 'bg-[#c9a84c]/10'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-[#c9a84c]" />
                      ) : (
                        <Bot className="w-4 h-4 text-[#c9a84c]" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-[#c9a84c]/20 text-[#f8f6f1] rounded-br-sm'
                        : 'bg-[#1a2744] border border-[#c9a84c]/15 text-[#f8f6f1] rounded-bl-sm'
                    }`}>
                      {msg.role === 'assistant' && (
                        <p className="text-xs text-[#c9a84c] mb-1 font-medium">NoteWorthy Mentor</p>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-[#c9a84c]" />
                    </div>
                    <div className="bg-[#1a2744] border border-[#c9a84c]/15 rounded-2xl rounded-bl-sm px-4 py-3">
                      <p className="text-xs text-[#c9a84c] mb-1">NoteWorthy Mentor</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}

        {/* Input Area */}
        <div className="border-t border-[#c9a84c]/20 bg-[#1a2744]/50 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your mentor anything about NoteWorthy Capital..."
              className="flex-1 bg-[#0f1929] border-[#c9a84c]/20 text-[#f8f6f1] placeholder:text-[#f8f6f1]/30 min-h-[50px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="gold-gradient text-[#1a2744] self-end px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-[#f8f6f1]/20 mt-2 text-center">
            NoteWorthy Capital Mentor — for training purposes only. Not legal or investment advice.
          </p>
        </div>
      </div>
    </div>
  );
}
