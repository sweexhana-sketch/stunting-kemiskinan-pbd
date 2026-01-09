import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { BarChart3, Map, Target, ClipboardCheck, Database, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const navItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      to: "/map",
      label: "Peta Interaktif",
      icon: Map,
    },
    {
      to: "/intervention",
      label: "Intervensi",
      icon: Target,
    },
    {
      to: "/monitoring",
      label: "Monitoring",
      icon: ClipboardCheck,
    },
  ];

  // Add Data Input menu item only for authenticated users
  if (isAuthenticated) {
    navItems.push({
      to: "/data-input",
      label: "Input Data",
      icon: Database,
    });
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    });
    navigate("/login");
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6 py-3">
          <div className="flex items-center gap-6 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  activeClassName="bg-primary text-primary-foreground hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
