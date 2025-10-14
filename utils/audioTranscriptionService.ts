/**
 * Audio Transcription Service
 * Servicio reutilizable para transcribir archivos de audio usando Deepgram API
 * Basado en la implementación exitosa de quick notes
 */

import { File } from 'expo-file-system';

export interface TranscriptionResult {
  success: boolean;
  transcript?: string;
  detectedLanguage?: string;
  error?: string;
}

/**
 * Transcribe un archivo de audio local usando Deepgram API
 * @param audioUri - URI del archivo de audio local
 * @returns Resultado de la transcripción con texto y idioma detectado
 */
export const transcribeAudioFile = async (audioUri: string): Promise<TranscriptionResult> => {
  try {
    console.log('🎤 [AudioTranscription] Reading audio file from:', audioUri);

    // Usar la nueva API de File de Expo SDK 54
    const audioFile = new File(audioUri);

    // Leer el archivo como base64 usando la nueva API
    const audioData = await audioFile.base64();

    // Convertir base64 a binary (Uint8Array)
    const binaryAudio = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));

    console.log('🎤 [AudioTranscription] Audio file size:', binaryAudio.length, 'bytes');

    // 🔒 USANDO CLOUDFLARE WORKER (API keys protegidas)
    const response = await fetch(
      'https://fastnote-api-proxy.fastvoiceapp.workers.dev/api/transcribe',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/m4a',
        },
        body: binaryAudio,
      }
    );

    const result = await response.json();

    console.log('🎤 [AudioTranscription] Deepgram response:', JSON.stringify(result, null, 2));

    // Validar respuesta exitosa
    if (response.ok && result.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
      const transcript = result.results.channels[0].alternatives[0].transcript;
      const detectedLanguage = result.results?.channels?.[0]?.detected_language;

      console.log('🎤 [AudioTranscription] Success!');
      console.log('   - Detected language:', detectedLanguage);
      console.log('   - Transcript:', transcript);

      return {
        success: true,
        transcript,
        detectedLanguage,
      };
    } else {
      console.warn('🎤 [AudioTranscription] Failed - Invalid response format');
      return {
        success: false,
        error: 'INVALID_RESPONSE',
      };
    }
  } catch (error) {
    console.error('🎤 [AudioTranscription] Error:', error instanceof Error ? error.message : 'Unknown error');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };
  }
};
