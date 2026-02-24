// Single source of truth for plan limits — used in actions, worker, layout, UI

export const PLAN_RENDER_LIMITS: Record<string, number> = {
  starter:  100,
  growth:   5_000,
  business: 50_000,
};

// Maximum PDF file size per plan in bytes. Infinity = no limit.
export const PLAN_SIZE_LIMITS: Record<string, number> = {
  starter:  2 * 1024 * 1024, // 2 MB
  growth:   Infinity,
  business: Infinity,
};

export function getPlanRenderLimit(plan: string): number {
  return PLAN_RENDER_LIMITS[plan] ?? 100;
}

export function getPlanSizeLimit(plan: string): number {
  return PLAN_SIZE_LIMITS[plan] ?? 2 * 1024 * 1024;
}

export const PLAN_AI_LIMITS: Record<string, number> = {
  starter:  1,
  growth:   20,
  business: 50,
};

export function getPlanAiLimit(plan: string): number {
  return PLAN_AI_LIMITS[plan] ?? 1;
}
