import { generateJson } from './gemini';
import { intentClassifierPrompt, riskScorerPrompt, triagePromptColoracion } from './prompts';
import type { IntentResult, RiskResult, RiskLevel } from './types';

const keywordIntent = (message: string): IntentResult => {
  const text = message.toLowerCase();
  if (/(precio|cuesta|valor|sale)/.test(text)) {
    return { intent: 'precio', servicio: null, confidence: 0.65 };
  }
  if (/(turno|agenda|reserv|horario|disponibilidad)/.test(text)) {
    return { intent: 'agenda', servicio: null, confidence: 0.65 };
  }
  if (/(curso|academia|inscripcion)/.test(text)) {
    return { intent: 'curso', servicio: 'otro', confidence: 0.65 };
  }
  if (/(producto|shampoo|serum|mascara)/.test(text)) {
    return { intent: 'producto', servicio: null, confidence: 0.6 };
  }
  if (/(direccion|ubicacion|mapa|contacto)/.test(text)) {
    return { intent: 'ubicacion', servicio: null, confidence: 0.6 };
  }
  if (/(decolor|tinte|balayage|mechas|color)/.test(text)) {
    return { intent: 'info_servicio', servicio: 'coloracion', confidence: 0.55 };
  }
  return { intent: 'info_servicio', servicio: 'otro', confidence: 0.5 };
};

export const classifyIntent = async (message: string) => {
  try {
    return await generateJson<IntentResult>(intentClassifierPrompt(message));
  } catch {
    return keywordIntent(message);
  }
};

const heuristicRisk = (message: string): RiskResult => {
  const text = message.toLowerCase();
  let score = 0;
  const factors: string[] = [];

  const add = (value: number, factor: string) => {
    score += value;
    factors.push(factor);
  };

  if (/(arde|ardor|ampolla|alerg|irrit|caida|picazon)/.test(text)) {
    add(40, 'salud');
  }
  if (/(decolor|mezclar|perox|volumen|oxidante)/.test(text)) {
    add(30, 'quimica');
  }
  if (/(negro a rubio|rapar|alisado permanente|cambio radical)/.test(text)) {
    add(25, 'transformacion');
  }
  if (/(garantia|asegura|promete|seguro)/.test(text)) {
    add(20, 'garantia');
  }
  if (/(hoy|urgente|rapido|en una sesion)/.test(text)) {
    add(10, 'urgencia');
  }

  const risk_level: RiskLevel =
    score >= 81 ? 'critico' : score >= 56 ? 'alto' : score >= 26 ? 'medio' : 'bajo';

  return {
    risk_score: Math.min(score, 100),
    risk_level,
    factors,
    reasoning: factors.length ? `Detected: ${factors.join(', ')}` : 'Low risk',
  };
};

export const scoreRisk = async (
  message: string,
  intent: string,
  service: string | null
) => {
  try {
    return await generateJson<RiskResult>(riskScorerPrompt(message, intent, service));
  } catch {
    return heuristicRisk(message);
  }
};

export const triageQuestions = async (message: string) => {
  try {
    const text = await generateJson<string | string[]>(triagePromptColoracion(message));
    if (Array.isArray(text)) {
      return text;
    }
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 3);
  } catch {
    return [
      'Tenes tintura o decoloracion previa? Cuando fue la ultima aplicacion?',
      'Que color tenes actualmente y que resultado queres lograr?',
      'Estas dispuesta a multiples sesiones si es necesario?',
    ];
  }
};
