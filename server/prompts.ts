export const intentClassifierPrompt = (message: string) => `You are a classifier for a hair salon assistant. The user message is in Spanish.
Return ONLY a JSON with this shape:
{
  "intent": "info_servicio" | "precio" | "agenda" | "transformacion" | "quimica" | "salud" | "curso" | "producto" | "ubicacion" | "otro",
  "servicio": "corte" | "coloracion" | "tratamiento" | "novias" | "domicilio" | "otro" | null,
  "confidence": 0.0-1.0
}
Definitions:
info_servicio: what a service includes, duration, aftercare
precio: pricing questions
agenda: booking, schedule, availability
transformacion: radical changes (shave, black to platinum, permanent straightening)
quimica: chemical instructions, mixes, volumes, timing
salud: symptoms (burning, irritation, allergies, shedding)
curso: academy or course info
producto: product info or pricing
ubicacion: address, maps, contact

User message: ${message}
Output:`;

export const riskScorerPrompt = (message: string, intent: string, service: string | null) => `You are a risk evaluator for a hair salon assistant. The user message is in Spanish.
Assign a risk score 0-100.
Risk factors:
+40 health symptoms (burning, blisters, allergy, severe shedding)
+30 chemical instructions or mixing
+25 radical transformation
+20 request for guarantees
+15 recent chemical history (<2 weeks)
+10 missing critical info
+10 urgency (same day, fast)
Levels:
0-25 low, 26-55 medium, 56-80 high, 81-100 critical
Return ONLY JSON:
{
  "risk_score": 0-100,
  "risk_level": "bajo" | "medio" | "alto" | "critico",
  "factors": ["factor1"],
  "reasoning": "short explanation"
}

Context:
Intent: ${intent}
Servicio: ${service || 'null'}
Message: ${message}
Output:`;

export const triagePromptColoracion = (message: string, knownData = '') => `You are triaging a hair color request in Spanish (use ASCII, no accents). Ask up to 3 short questions.
Do not give recommendations yet.
Use only relevant questions:
- Tenes tintura o decoloracion previa? Cuando fue la ultima aplicacion?
- Que color tenes actualmente y que resultado queres lograr?
- Tu cuero cabelludo esta sensible hoy (ardor o picazon)?
- Tenes una referencia visual (foto)?
- Estas dispuesta a multiples sesiones si es necesario?

Known data: ${knownData}
User message: ${message}
Return only the questions, one per line.`;

export const answererPrompt = (context: string, message: string, riskLevel: string, intent: string) => `You are the official assistant for Marzetti hair salon in Mendoza. Reply in Spanish using ASCII (no accents).
Hard rules:
- Use ONLY the information in [CONTEXT]
- If info is missing, say you do not have updated info and offer WhatsApp.
- Never invent prices, guarantees, or technical instructions.
- If risk is high or critical, recommend in-person evaluation and WhatsApp.

[CONTEXT]
${context}

[USER]
${message}

Risk level: ${riskLevel}
Intent: ${intent}

Response:`;
