"use client";

import { useState } from "react";
import { Plus, Edit2, Layers } from "lucide-react";
import { mockTemplates, type Template } from "@/lib/mock/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <Card className="border-border flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-snug">
            {template.name}
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 -mt-0.5">
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          {template.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {template.variables.map((v) => (
            <Badge key={v} variant="secondary" className="rounded-md font-mono text-[10px]">
              {"{{"}{v}{"}}"}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-border pt-3 pb-3">
        <div className="flex w-full items-center justify-between">
          <code className="font-mono text-[10px] text-muted-foreground">{template.id}</code>
          <span className="text-xs text-muted-foreground">
            Updated {formatDate(template.updatedAt)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function TemplatesPage() {
  const templates = mockTemplates;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {templates.length} of 25 templates used.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              New template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create template</DialogTitle>
              <DialogDescription>
                Give your template an ID and name. You&apos;ll upload the HTML via API or paste it here.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="tmpl-id">Template ID</Label>
                <Input id="tmpl-id" placeholder="tmpl_invoice" className="font-mono" />
                <p className="text-xs text-muted-foreground">
                  Lowercase, underscores only. Used in API calls.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tmpl-name">Display name</Label>
                <Input id="tmpl-name" placeholder="Acme Internal Invoice" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No templates yet"
          description="Upload an HTML template to start rendering PDFs without repeating your markup."
          action={{ label: "Create first template" }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
