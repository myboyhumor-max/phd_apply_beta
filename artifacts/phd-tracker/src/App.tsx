import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LayoutDashboard, FileText, Users, Bell, BarChart2, GraduationCap } from "lucide-react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Applications from "@/pages/applications";
import ApplicationDetail from "@/pages/application-detail";
import Outreach from "@/pages/outreach";
import Reminders from "@/pages/reminders";
import Analytics from "@/pages/analytics";
import KanbanBoard from "@/pages/kanban";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/outreach", label: "Outreach", icon: Users },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
];

function FloatingNav() {
  const [location] = useLocation();

  return (
    <header className="fixed top-3 left-3 right-3 z-50">
      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-2xl shadow-xl shadow-black/5 px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-sm tracking-tight leading-none">PhD Tracker</span>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Europe Hub</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 flex-1 justify-center">
          {navItems.map((item) => {
            const isActive =
              location === item.href ||
              (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`}
              >
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right spacer (mirrors brand width for centering) */}
        <div className="hidden sm:block w-[110px] shrink-0" />
      </div>
    </header>
  );
}

function Router() {
  return (
    <>
      <FloatingNav />
      <main className="pt-20 min-h-screen bg-background">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/applications" component={Applications} />
          <Route path="/applications/:id" component={ApplicationDetail} />
          <Route path="/kanban" component={KanbanBoard} />
          <Route path="/outreach" component={Outreach} />
          <Route path="/reminders" component={Reminders} />
          <Route path="/analytics" component={Analytics} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
