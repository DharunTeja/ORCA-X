import { useState, useCallback } from 'react';
import { LanguageCode } from '../types';

export function useVoice(lang: LanguageCode = 'en') {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');

  const getVoiceLangTag = (code: LanguageCode): string => {
    switch (code) {
      case 'te':
        return 'te-IN';
      case 'hi':
        return 'hi-IN';
      case 'ta':
        return 'ta-IN';
      case 'kn':
        return 'kn-IN';
      case 'ml':
        return 'ml-IN';
      case 'en':
      default:
        return 'en-IN';
    }
  };

  const startListening = useCallback(
    (onResult: (text: string) => void) => {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert('Speech Recognition API is not supported in this browser. Please type your query.');
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.lang = getVoiceLangTag(lang);
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          setTranscript(speechResult);
          onResult(speechResult);
          setIsListening(false);
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error', err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    },
    [lang]
  );

  const speak = useCallback(
    (text: string, customLang?: LanguageCode) => {
      if (!('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getVoiceLangTag(customLang || lang);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [lang]
  );

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    speak,
    stopSpeaking,
  };
}
