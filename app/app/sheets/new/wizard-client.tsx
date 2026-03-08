"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, Loader2, Table2 } from "lucide-react"
import {
  fetchSpreadsheetInfoAction,
  fetchSheetPreviewAction,
  getTemplateVariablesAction,
  createSheetSyncAction,
} from "@/app/actions/sheets"

interface Props {
  connections: { id: string; email: string }[]
  templates: { id: string; name: string }[]
}

type Step = "sheet" | "tab" | "template" | "mapping" | "confirm"

export function NewSyncWizard({ connections, templates }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [step, setStep] = useState<Step>("sheet")

  // Step 1: Connection + spreadsheet URL
  const [connectionId, setConnectionId] = useState(connections[0]?.id ?? "")
  const [sheetUrl, setSheetUrl] = useState("")
  const [spreadsheetId, setSpreadsheetId] = useState("")
  const [spreadsheetName, setSpreadsheetName] = useState("")
  const [tabs, setTabs] = useState<{ title: string; sheetId: number }[]>([])

  // Step 2: Tab selection + preview
  const [selectedTab, setSelectedTab] = useState("")
  const [headers, setHeaders] = useState<string[]>([])
  const [previewRows, setPreviewRows] = useState<string[][]>([])

  // Step 3: Template
  const [templateId, setTemplateId] = useState("")
  const [templateVars, setTemplateVars] = useState<string[]>([])

  // Step 4: Column mapping
  const [mapping, setMapping] = useState<Record<string, string>>({})

  function handleFetchSheet() {
    setError(null)
    startTransition(async () => {
      const res = await fetchSpreadsheetInfoAction(connectionId, sheetUrl)
      if (res.error) {
        setError(res.error)
        return
      }
      setSpreadsheetId(res.spreadsheetId!)
      setSpreadsheetName(res.title!)
      setTabs(res.tabs!)
      if (res.tabs!.length > 0) setSelectedTab(res.tabs![0].title)
      setStep("tab")
    })
  }

  function handleSelectTab() {
    setError(null)
    startTransition(async () => {
      const res = await fetchSheetPreviewAction(connectionId, spreadsheetId, selectedTab)
      if (res.error) {
        setError(res.error)
        return
      }
      setHeaders(res.headers!)
      setPreviewRows(res.rows!)
      setStep("template")
    })
  }

  function handleSelectTemplate() {
    setError(null)
    startTransition(async () => {
      const vars = await getTemplateVariablesAction(templateId)
      setTemplateVars(vars)
      // Auto-map: if a header matches a variable name (case-insensitive), pre-fill it
      const autoMap: Record<string, string> = {}
      for (const v of vars) {
        const match = headers.find(
          (h) => h.toLowerCase().replace(/\s+/g, "_") === v.toLowerCase() || h.toLowerCase() === v.toLowerCase()
        )
        if (match) autoMap[v] = match
      }
      setMapping(autoMap)
      setStep("mapping")
    })
  }

  function handleCreate() {
    setError(null)
    startTransition(async () => {
      const res = await createSheetSyncAction({
        connectionId,
        templateId,
        spreadsheetId,
        spreadsheetName,
        sheetName: selectedTab,
        columnMapping: mapping,
      })
      if (res.error) {
        setError(res.error)
        return
      }
      router.push("/app/sheets")
    })
  }

  const stepIndex = ["sheet", "tab", "template", "mapping", "confirm"].indexOf(step)
  const steps = ["Spreadsheet", "Tab", "Template", "Mapping"]

  return (
    <>
      {/* Back link */}
      <Link
        href="/app/sheets"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sheets
      </Link>

      <h1 className="text-2xl font-bold mb-1">New Sheet Sync</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Connect a Google Sheet to a template. Each row becomes a PDF.
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                i < stepIndex
                  ? "bg-emerald-500/20 text-emerald-400"
                  : i === stepIndex
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < stepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={`text-xs ${i === stepIndex ? "font-medium text-foreground" : "text-muted-foreground"}`}>
              {s}
            </span>
            {i < steps.length - 1 && <div className="h-px w-6 bg-border" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Step 1: Spreadsheet URL */}
      {step === "sheet" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Google Account</label>
            <select
              value={connectionId}
              onChange={(e) => setConnectionId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {connections.map((c) => (
                <option key={c.id} value={c.id}>{c.email}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Spreadsheet URL</label>
            <input
              type="url"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Paste the full URL of your Google Sheet. The connected Google account must have access.
            </p>
          </div>
          <button
            onClick={handleFetchSheet}
            disabled={pending || !sheetUrl.includes("spreadsheets/d/")}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            Fetch spreadsheet
          </button>
        </div>
      )}

      {/* Step 2: Tab selection */}
      {step === "tab" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Spreadsheet: <span className="text-muted-foreground font-normal">{spreadsheetName}</span>
            </label>
            <label className="block text-sm font-medium mb-1.5 mt-3">Select tab</label>
            <select
              value={selectedTab}
              onChange={(e) => setSelectedTab(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {tabs.map((t) => (
                <option key={t.sheetId} value={t.title}>{t.title}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep("sheet")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={handleSelectTab}
              disabled={pending || !selectedTab}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Template selection + preview */}
      {step === "template" && (
        <div className="space-y-4">
          {/* Data preview */}
          {headers.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Data preview</label>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40">
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {previewRows.map((row, ri) => (
                      <tr key={ri}>
                        {headers.map((_, ci) => (
                          <td key={ci} className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                            {row[ci] ?? ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Showing first {previewRows.length} rows. All rows will be rendered.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Template</label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Select a template...</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {"Choose the template with {{variables}} to fill from your sheet columns."}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep("tab")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={handleSelectTemplate}
              disabled={pending || !templateId}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Column mapping */}
      {step === "mapping" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Map template variables to sheet columns</label>
            {templateVars.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {"No {{variables}} found in the template. Each row will render the same PDF."}
              </p>
            ) : (
              <div className="space-y-2">
                {templateVars.map((v) => (
                  <div key={v} className="flex items-center gap-3">
                    <code className="shrink-0 rounded bg-muted px-2 py-1 text-xs font-mono min-w-[140px]">
                      {`{{${v}}}`}
                    </code>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <select
                      value={mapping[v] ?? ""}
                      onChange={(e) => setMapping((m) => ({ ...m, [v]: e.target.value }))}
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
                    >
                      <option value="">— skip —</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep("template")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={handleCreate}
              disabled={pending}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Create sync
            </button>
          </div>
        </div>
      )}
    </>
  )
}
