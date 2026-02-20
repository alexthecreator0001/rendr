export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  maskedKey: string;
  fullKey?: string; // only returned once at creation
  createdAt: string;
  lastUsedAt: string | null;
  environment: "live" | "test";
}

export const mockApiKeys: ApiKey[] = [
  {
    id: "key_a1b2c3",
    name: "Production",
    prefix: "rk_live",
    maskedKey: "rk_live_••••••••••••a8f2",
    createdAt: "2026-01-03T10:00:00Z",
    lastUsedAt: "2026-02-20T08:44:02Z",
    environment: "live",
  },
  {
    id: "key_d4e5f6",
    name: "CI Bot",
    prefix: "rk_live",
    maskedKey: "rk_live_••••••••••••c73e",
    createdAt: "2026-01-15T15:30:00Z",
    lastUsedAt: "2026-02-19T22:10:44Z",
    environment: "live",
  },
  {
    id: "key_g7h8i9",
    name: "Staging",
    prefix: "rk_test",
    maskedKey: "rk_test_••••••••••••0b91",
    createdAt: "2026-02-01T09:00:00Z",
    lastUsedAt: "2026-02-18T16:55:12Z",
    environment: "test",
  },
];
