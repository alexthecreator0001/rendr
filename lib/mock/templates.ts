export interface Template {
  id: string;
  name: string;
  description: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export const mockTemplates: Template[] = [
  {
    id: "tmpl_invoice",
    name: "Acme Internal Invoice",
    description: "Standard invoice with line items, totals, and payment terms.",
    variables: ["client_name", "invoice_number", "due_date", "line_items"],
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-02-05T14:22:00Z",
  },
  {
    id: "tmpl_nda",
    name: "NDA Template",
    description: "Non-disclosure agreement for vendors and contractors.",
    variables: ["party_name", "effective_date", "jurisdiction"],
    createdAt: "2026-01-18T11:00:00Z",
    updatedAt: "2026-01-18T11:00:00Z",
  },
  {
    id: "tmpl_sow",
    name: "Statement of Work",
    description: "Project SOW with scope, timeline, and deliverables.",
    variables: ["project_name", "client", "start_date", "end_date", "deliverables"],
    createdAt: "2026-01-25T09:30:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "tmpl_report",
    name: "Quarterly Report",
    description: "Internal reporting template with charts and executive summary.",
    variables: ["quarter", "year", "revenue", "highlights"],
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-02-15T16:45:00Z",
  },
];
