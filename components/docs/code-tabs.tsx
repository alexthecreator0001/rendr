"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/docs/code-block";

interface TabItem {
  label: string;
  code: string;
  language?: string;
}

interface CodeTabsProps {
  curl?: string;
  node?: string;
  python?: string;
  php?: string;
  tabs?: TabItem[];
}

const defaultExamples = {
  curl: `curl -X POST https://api.rendrpdf.com/v1/render \\
  -H "Authorization: Bearer rk_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "template_id": "tmpl_invoice",
    "variables": {
      "client_name": "Acme Corp",
      "invoice_number": "INV-0042",
      "due_date": "2026-03-01",
      "total": 4200.00
    }
  }'`,
  node: `import Rendr from "rendr-node";

const client = new Rendr({ apiKey: process.env.RENDR_API_KEY });

const job = await client.render.create({
  templateId: "tmpl_invoice",
  variables: {
    clientName: "Acme Corp",
    invoiceNumber: "INV-0042",
    dueDate: "2026-03-01",
    total: 4200.00,
  },
});

console.log(job.id); // job_7f3k2m
// Listen for the webhook or poll job.status`,
  python: `import rendr

client = rendr.Client(api_key=os.environ["RENDR_API_KEY"])

job = client.render.create(
    template_id="tmpl_invoice",
    variables={
        "client_name": "Acme Corp",
        "invoice_number": "INV-0042",
        "due_date": "2026-03-01",
        "total": 4200.00,
    },
)

print(job.id)  # job_7f3k2m`,
  php: `use Rendr\\Client;

$client = new Client(['api_key' => getenv('RENDR_API_KEY')]);

$job = $client->render->create([
    'template_id' => 'tmpl_invoice',
    'variables' => [
        'client_name'    => 'Acme Corp',
        'invoice_number' => 'INV-0042',
        'due_date'       => '2026-03-01',
        'total'          => 4200.00,
    ],
]);

echo $job->id; // job_7f3k2m`,
};

export function CodeTabs({ curl, node, python, php, tabs }: CodeTabsProps) {
  // If `tabs` array is provided, use it directly
  if (tabs && tabs.length > 0) {
    const defaultTab = tabs[0].label.toLowerCase().replace(/[^a-z0-9]/g, "");
    return (
      <Tabs defaultValue={defaultTab} className="my-6">
        <TabsList className="bg-zinc-950 border border-white/10 rounded-t-xl rounded-b-none h-auto p-1 w-full justify-start gap-0.5">
          {tabs.map((tab) => {
            const key = tab.label.toLowerCase().replace(/[^a-z0-9]/g, "");
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="text-xs rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-zinc-100 text-zinc-400 hover:text-zinc-200 px-3 py-1.5"
              >
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {tabs.map((tab) => {
          const key = tab.label.toLowerCase().replace(/[^a-z0-9]/g, "");
          return (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="rounded-t-none rounded-b-xl border border-white/10 bg-zinc-950 overflow-hidden">
                <CodeBlock
                  code={tab.code}
                  language={tab.language ?? key}
                  className="border-0 rounded-none my-0"
                />
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    );
  }

  // Fallback: individual props
  const examples = {
    curl: curl ?? defaultExamples.curl,
    node: node ?? defaultExamples.node,
    python: python ?? defaultExamples.python,
    php: php ?? defaultExamples.php,
  };

  return (
    <Tabs defaultValue="curl" className="my-6">
      <TabsList className="bg-zinc-950 border border-white/10 rounded-t-xl rounded-b-none h-auto p-1 w-full justify-start gap-0.5">
        <TabsTrigger value="curl" className="text-xs rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-zinc-100 text-zinc-400 hover:text-zinc-200 px-3 py-1.5">
          cURL
        </TabsTrigger>
        <TabsTrigger value="node" className="text-xs rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-zinc-100 text-zinc-400 hover:text-zinc-200 px-3 py-1.5">
          Node.js
        </TabsTrigger>
        <TabsTrigger value="python" className="text-xs rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-zinc-100 text-zinc-400 hover:text-zinc-200 px-3 py-1.5">
          Python
        </TabsTrigger>
        <TabsTrigger value="php" className="text-xs rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-zinc-100 text-zinc-400 hover:text-zinc-200 px-3 py-1.5">
          PHP
        </TabsTrigger>
      </TabsList>
      {Object.entries(examples).map(([lang, code]) => (
        <TabsContent key={lang} value={lang} className="mt-0">
          <div className="rounded-t-none rounded-b-xl border border-white/10 bg-zinc-950 overflow-hidden">
            <CodeBlock
              code={code}
              language={lang}
              className="border-0 rounded-none my-0"
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
