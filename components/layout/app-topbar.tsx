"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOutAction } from "@/app/actions/auth";

interface AppTopbarProps {
  user: { email: string };
}

export function AppTopbar({ user }: AppTopbarProps) {
  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      {/* Left — intentionally empty; page title lives in page headings */}
      <div />

      {/* Right */}
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-lg" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-white text-[11px] font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs font-normal text-muted-foreground">Starter plan</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/app/billing">Billing</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-destructive focus:text-destructive p-0">
              <form action={signOutAction} className="w-full">
                <button
                  type="submit"
                  className="w-full text-left px-2 py-1.5 text-sm cursor-pointer"
                >
                  Sign out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
