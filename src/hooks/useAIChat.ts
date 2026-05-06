import { useState, useCallback } from "react";
import { trpc } from "@/providers/trpc";

export interface ChatMessage {
  id: string;
  role: "ai" | "user";
  text: string;
  timestamp: number;
}

export interface AIChatState {
  conversationId: number | null;
  personaId: string | null;
  persona: { name: string; title: string; gender: 'male' | 'female' } | null;
  messages: ChatMessage[];
  isLoading: boolean;
  callStage: "select" | "preparing" | "ringing" | "connected" | "ended";
  error: string | null;
  aiMode: "kimi-ai" | "demo";
}

export function useAIChat() {
  const [state, setState] = useState<AIChatState>({
    conversationId: null,
    personaId: null,
    persona: null,
    messages: [],
    isLoading: false,
    callStage: "select",
    error: null,
    aiMode: "demo",
  });

  const utils = trpc.useUtils();
  const startConversation = trpc.ai.startConversation.useMutation();
  const chat = trpc.ai.chat.useMutation();
  const endConversation = trpc.ai.endConversation.useMutation();
  const aiStatus = trpc.ai.checkAIStatus.useQuery();

  const selectPersona = useCallback(
    async (personaId: string, personaData?: { name: string; title: string; gender: 'male' | 'female' }) => {
      setState((prev) => ({
        ...prev,
        personaId,
        persona: personaData || null,
        callStage: "preparing",
        messages: [],
        error: null,
        aiMode: aiStatus.data?.mode === "kimi-ai" ? "kimi-ai" : "demo",
      }));

      try {
        const result = await startConversation.mutateAsync({
          personaId,
          scenarioId: personaId,
        });

        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            callStage: "ringing",
          }));

          setTimeout(() => {
            setState((prev) => ({
              ...prev,
              conversationId: result.conversationId,
              callStage: "connected",
              messages: [
                {
                  id: `msg-${Date.now()}`,
                  role: "ai",
                  text: result.initialMessage,
                  timestamp: Date.now(),
                },
              ],
            }));
          }, 2000);
        }, 1000);
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          callStage: "select",
          error: err.message || "Failed to start conversation",
        }));
      }
    },
    [startConversation, aiStatus.data]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!state.conversationId || !state.personaId || state.isLoading) return;

      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        text,
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
        const result = await chat.mutateAsync({
          conversationId: state.conversationId,
          personaId: state.personaId,
          userMessage: text,
        });

        const aiMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: "ai",
          text: result.response,
          timestamp: Date.now(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, aiMessage],
          isLoading: false,
        }));
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err.message || "Failed to get AI response",
        }));
      }
    },
    [state.conversationId, state.personaId, state.isLoading, chat]
  );

  const endCall = useCallback(async () => {
    if (!state.conversationId) return null;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const result = await endConversation.mutateAsync({
        conversationId: state.conversationId,
      });

      setState((prev) => ({
        ...prev,
        callStage: "ended",
        isLoading: false,
      }));

      utils.ai.getResults.invalidate();

      return result;
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "Failed to end conversation",
      }));
      return null;
    }
  }, [state.conversationId, endConversation, utils]);

  const reset = useCallback(() => {
    setState({
      conversationId: null,
      personaId: null,
      persona: null,
      messages: [],
      isLoading: false,
      callStage: "select",
      error: null,
      aiMode: aiStatus.data?.mode === "kimi-ai" ? "kimi-ai" : "demo",
    });
  }, [aiStatus.data]);

  return {
    ...state,
    selectPersona,
    sendMessage,
    endCall,
    reset,
    aiStatus,
  };
}
