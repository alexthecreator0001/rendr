export interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
  createdAt: string;
  lastDeliveredAt: string | null;
  failureCount: number;
}

export const mockWebhooks: Webhook[] = [
  {
    id: "wh_prod01",
    url: "https://hooks.acme.io/pdf",
    events: ["job.completed", "job.failed"],
    active: true,
    secret: "whsec_••••••••••••4d2f",
    createdAt: "2026-01-05T10:00:00Z",
    lastDeliveredAt: "2026-02-20T08:44:04Z",
    failureCount: 0,
  },
  {
    id: "wh_stg01",
    url: "https://api.staging.io/webhooks/rendr",
    events: ["job.completed"],
    active: false,
    secret: "whsec_••••••••••••9c11",
    createdAt: "2026-02-01T09:00:00Z",
    lastDeliveredAt: "2026-02-10T14:22:00Z",
    failureCount: 2,
  },
];
