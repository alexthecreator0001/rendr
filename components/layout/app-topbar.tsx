"use client";

import { Bell, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function AppTopbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      {/* Workspace selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 font-medium">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
              A
            </div>
            Acme Internal
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
              A
            </div>
            Acme Internal
          </DropdownMenuItem>
          <DropdownMenuItem className="text-muted-foreground">
            + New workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>

        <ThemeToggle />

        <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-lg" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[11px]">AK</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div>
                <p className="text-sm font-medium">Alex K.</p>
                <p className="text-xs font-normal text-muted-foreground">alex@acme.io</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Account settings</DropdownMenuItem>
            <DropdownMenuItem>
              Billing
              <Badge variant="outline" className="ml-auto text-[10px]">Growth</Badge>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
