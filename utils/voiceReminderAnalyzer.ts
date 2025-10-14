import { Alert } from 'react-native';

// Palabras clave que indican comando de recordatorio
const REMINDER_KEYWORDS = [
  // Español
  'recordar', 'recordatorio', 'avisar', 'avísame', 'notificar', 'notificación',
  'agregar recordatorio', 'añadir recordatorio', 'crear recordatorio',
  'programar', 'programar recordatorio', 'alarma', 'alerta',
  // Variantes
  'recuérdame', 'recuerda', 'avisa', 'notifícame', 'alértame',
  // Inglés (por si acaso)
  'remind', 'reminder', 'alert', 'notify', 'notification', 'schedule'
];

// Función para detectar si el texto contiene comandos de recordatorio
export const detectReminderCommand = (text: string): boolean => {
  const normalizedText = text.toLowerCase();
  return REMINDER_KEYWORDS.some(keyword => normalizedText.includes(keyword));
};

// Función de testing manual (temporal para debugging)
export const testReminderAnalysis = async (testText: string): Promise<void> => {
  console.log('🧪 TESTING REMINDER ANALYSIS');
  console.log('Test text:', testText);
  
  const result = await extractReminderDetails(testText);
  console.log('Result:', JSON.stringify(result, null, 2));
};

// Función para extraer información de fecha/hora usando OpenAI
export const extractReminderDetails = async (text: string): Promise<{
  hasReminder: boolean;
  reminderTime?: Date;
  cleanText: string;
  originalReminderPhrase?: string;
}> => {
  try {
    console.log('🤖 AI REMINDER ANALYSIS - Starting analysis of text:', text);
    console.log('🤖 AI REMINDER ANALYSIS - Basic keyword detection:', detectReminderCommand(text));

    const now = new Date();
    const currentDate = now.toLocaleDateString('es-ES');
    const currentTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const prompt = `Analiza este texto transcrito por voz para detectar comandos de recordatorio:

TEXTO: "${text}"

FECHA/HORA ACTUAL: ${currentDate} - ${currentTime}

INSTRUCCIONES:
- Busca palabras como: recordar, recordatorio, avisar, alerta, notificar, programar, recuérdame
- Extrae fecha/hora mencionada (hoy, mañana, 9:00, 15:30, etc.)
- Si solo dice hora, usa HOY si no ha pasado, o MAÑANA si ya pasó

RESPUESTA (IMPORTANTE: solo JSON puro, sin markdown ni código de bloques):
{
  "hasReminder": boolean,
  "reminderDateTime": "fecha ISO 8601 si detectas recordatorio",
  "cleanText": "texto sin la parte del recordatorio",
  "reminderPhrase": "frase exacta del recordatorio detectado"
}

EJEMPLOS:
"Lista: pan, leche. Recordar mañana 9:00" → hasReminder: true, reminderDateTime: mañana 9:00 AM
"Reunión con cliente. Avisar hoy 15:30" → hasReminder: true, reminderDateTime: hoy 15:30
"Solo una nota normal" → hasReminder: false`;

    // 🔒 USANDO CLOUDFLARE WORKER (API keys protegidas)
    const response = await fetch('https://fastnote-api-proxy.fastvoiceapp.workers.dev/api/analyze-reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente experto en análisis de texto para extraer comandos de recordatorio del español. SIEMPRE respondes únicamente con JSON válido puro, sin markdown, sin código de bloques, sin explicaciones adicionales. Solo JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1, // Baja temperatura para respuestas más consistentes
        max_tokens: 300
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0]?.message?.content;

    console.log('🤖 AI REMINDER ANALYSIS - Raw AI response:', aiResponse);

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parsear la respuesta JSON con limpieza robusta
    let analysis;
    try {
      console.log('🤖 AI REMINDER ANALYSIS - About to parse JSON...');
      
      // Limpiar la respuesta de markdown y caracteres extra
      let cleanResponse = aiResponse;
      
      // Remover todas las variaciones de markdown
      cleanResponse = cleanResponse.replace(/```json/gi, '');
      cleanResponse = cleanResponse.replace(/```/g, '');
      cleanResponse = cleanResponse.replace(/`/g, '');
      cleanResponse = cleanResponse.trim();
      
      // Extraer solo la parte JSON entre { y }
      const firstBrace = cleanResponse.indexOf('{');
      const lastBrace = cleanResponse.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
        cleanResponse = cleanResponse.substring(firstBrace, lastBrace + 1);
      }
      
      console.log('🤖 AI REMINDER ANALYSIS - Cleaned response for parsing:', cleanResponse);
      
      analysis = JSON.parse(cleanResponse);
      console.log('🤖 AI REMINDER ANALYSIS - Successfully parsed JSON:', JSON.stringify(analysis, null, 2));
      
    } catch (parseError) {
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parse error';
      console.error('🤖 AI REMINDER ANALYSIS - Failed to parse JSON:', errorMessage);
      console.error('🤖 AI REMINDER ANALYSIS - Original response was:', aiResponse);
      throw new Error('Invalid JSON response from AI');
    }

    console.log('🤖 AI REMINDER ANALYSIS - Parsed analysis:', analysis);

    // Validar y procesar la respuesta
    if (analysis.hasReminder && analysis.reminderDateTime) {
      const reminderDate = new Date(analysis.reminderDateTime);
      
      // Validar que la fecha sea válida y futura
      if (isNaN(reminderDate.getTime())) {
        console.warn('🤖 AI REMINDER ANALYSIS - Invalid date from AI, skipping reminder');
        return {
          hasReminder: false,
          cleanText: text,
        };
      }

      if (reminderDate <= new Date()) {
        console.warn('🤖 AI REMINDER ANALYSIS - Past date detected, skipping reminder');
        return {
          hasReminder: false,
          cleanText: text,
        };
      }

      return {
        hasReminder: true,
        reminderTime: reminderDate,
        cleanText: analysis.cleanText || text,
        originalReminderPhrase: analysis.reminderPhrase
      };
    }

    // Si la IA no detectó recordatorio pero hay palabras clave, intentar fallback
    if (!analysis.hasReminder && detectReminderCommand(text)) {
      console.log('🤖 AI REMINDER ANALYSIS - AI missed but keywords detected, trying fallback');
      
      // Intentar extraer hora manualmente de forma simple
      const timeMatch = text.match(/(\d{1,2}):(\d{2})|(\d{1,2})\s*(am|pm|AM|PM)/g);
      const todayMatch = text.toLowerCase().includes('hoy');
      const tomorrowMatch = text.toLowerCase().includes('mañana');
      
      if (timeMatch && (todayMatch || tomorrowMatch)) {
        console.log('🤖 AI REMINDER ANALYSIS - Fallback found time and date indicators');
        // Este es un caso donde deberíamos activar recordatorio pero la IA falló
        // Por ahora lo reportamos para debugging
      }
    }

    return {
      hasReminder: false,
      cleanText: analysis.cleanText || text,
    };

  } catch (error) {
    console.error('🤖 AI REMINDER ANALYSIS - Error:', error);
    
    // Fallback: detectar manualmente si hay palabras clave
    const hasBasicReminder = detectReminderCommand(text);
    
    if (hasBasicReminder) {
      console.log('🤖 AI REMINDER ANALYSIS - Error fallback: detected basic reminder keywords but cannot process');
    }

    return {
      hasReminder: false,
      cleanText: text,
    };
  }
};