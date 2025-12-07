import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Home } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = "/";
  };

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/produtos", label: "Produtos", icon: Package },
    { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin">
              <div className="flex items-center gap-2 cursor-pointer">
                <img src="/logo.png" alt="Cupcake Lamore" className="h-8 w-8" />
                <span className="font-semibold">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="border-t p-4 space-y-2">
            <div className="text-sm">
              <p className="font-medium">{user?.name || "Modo Demonstração"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "Visualização do painel admin"}</p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Voltar para Loja
              </Button>
            </Link>
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        <div className="container py-8">{children}</div>
      </div>
    </div>
  );
}
