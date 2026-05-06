import { useState, useCallback, useRef } from 'react';

interface SpeechState {
  isSpeaking: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
  supportsSpeech: boolean;
}

export function useSpeech() {
  const [state, setState] = useState<SpeechState>({
    isSpeaking: false,
    isListening: false,
    transcript: '',
    error: null,
    supportsSpeech: typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && 'speechSynthesis' in window
  });

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  const getSynth = useCallback(() => {
    if (!synthRef.current && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return synthRef.current;
  }, []);

  // Speak text using TTS
  const speak = useCallback((text: string, onEnd?: () => void): Promise<void> => {
    return new Promise((resolve) => {
      const synth = getSynth();
      if (!synth) {
        setState(prev => ({ ...prev, error: 'Text-to-speech not supported in this browser' }));
        onEnd?.();
        resolve();
        return;
      }

      // Cancel any ongoing speech
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for professionalism
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to find a good voice
      const voices = synth.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.includes('Google US English') || 
        v.name.includes('Samantha') ||
        v.name.includes('Microsoft David') ||
        (v.lang === 'en-US' && v.name.includes('Male'))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setState(prev => ({ ...prev, isSpeaking: true, error: null }));
      };

      utterance.onend = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
        onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        setState(prev => ({ ...prev, isSpeaking: false, error: `Speech error: ${event.error}` }));
        onEnd?.();
        resolve();
      };

      synth.speak(utterance);
    });
  }, [getSynth]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    const synth = getSynth();
    if (synth) {
      synth.cancel();
    }
    setState(prev => ({ ...prev, isSpeaking: false }));
  }, [getSynth]);

  // Start listening with STT
  const startListening = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Browser environment required'));
        return;
      }

      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        setState(prev => ({ ...prev, error: 'Speech recognition not supported', isListening: false }));
        reject(new Error('Speech recognition not supported'));
        return;
      }

      // Clean up previous recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      let finalTranscript = '';

      recognition.onstart = () => {
        setState(prev => ({ ...prev, isListening: true, error: null, transcript: '' }));
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interim += transcript;
          }
        }
        setState(prev => ({ 
          ...prev, 
          transcript: finalTranscript + interim 
        }));
      };

      recognition.onerror = (event: any) => {
        let errorMsg = 'Speech recognition error';
        switch (event.error) {
          case 'no-speech':
            errorMsg = 'No speech detected. Please try speaking louder or check your microphone.';
            break;
          case 'audio-capture':
            errorMsg = 'Could not access microphone. Please check your audio settings.';
            break;
          case 'not-allowed':
            errorMsg = 'Microphone permission denied. Please allow microphone access in your browser.';
            break;
          case 'network':
            errorMsg = 'Network error. Please check your internet connection.';
            break;
          case 'aborted':
            // User aborted, not a real error
            setState(prev => ({ ...prev, isListening: false }));
            return;
        }
        setState(prev => ({ ...prev, isListening: false, error: errorMsg }));
        
        // For no-speech, don't reject - just return what we have
        if (event.error === 'no-speech') {
          resolve(finalTranscript.trim());
        } else {
          reject(new Error(errorMsg));
        }
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
        resolve(finalTranscript.trim());
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch (err) {
        setState(prev => ({ ...prev, isListening: false, error: 'Failed to start speech recognition' }));
        reject(err);
      }
    });
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Already stopped
      }
      recognitionRef.current = null;
    }
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', error: null }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    clearTranscript,
    clearError,
    recognitionRef
  };
}
