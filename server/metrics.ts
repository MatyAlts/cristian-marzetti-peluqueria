import { db } from './db';

export const recordMetrics = async (
  riskLevel: string,
  decision: 'respond' | 'handoff' | 'triage'
) => {
  const date = new Date().toISOString().slice(0, 10);

  await db`
    INSERT INTO metrics_daily (
      day,
      total_conversations,
      total_messages,
      total_handoffs,
      total_triage,
      risk_bajo,
      risk_medio,
      risk_alto,
      risk_critico
    )
    VALUES (
      ${date},
      1,
      1,
      ${decision === 'handoff' ? 1 : 0},
      ${decision === 'triage' ? 1 : 0},
      ${riskLevel === 'bajo' ? 1 : 0},
      ${riskLevel === 'medio' ? 1 : 0},
      ${riskLevel === 'alto' ? 1 : 0},
      ${riskLevel === 'critico' ? 1 : 0}
    )
    ON CONFLICT (day)
    DO UPDATE SET
      total_conversations = metrics_daily.total_conversations + 1,
      total_messages = metrics_daily.total_messages + 1,
      total_handoffs = metrics_daily.total_handoffs + ${decision === 'handoff' ? 1 : 0},
      total_triage = metrics_daily.total_triage + ${decision === 'triage' ? 1 : 0},
      risk_bajo = metrics_daily.risk_bajo + ${riskLevel === 'bajo' ? 1 : 0},
      risk_medio = metrics_daily.risk_medio + ${riskLevel === 'medio' ? 1 : 0},
      risk_alto = metrics_daily.risk_alto + ${riskLevel === 'alto' ? 1 : 0},
      risk_critico = metrics_daily.risk_critico + ${riskLevel === 'critico' ? 1 : 0}
  `;
};
