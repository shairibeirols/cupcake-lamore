import { Link } from "wouter";
import { ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  cartItemCount?: number;
}

export function Navbar({ cartItemCount = 0 }: NavbarProps) {
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <img src="/logo.png" alt="Cupcake Lamore" className="h-10 w-10" />
            <span className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Cupcake Lamore
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Painel Admin
            </Button>
          </Link>
          
          <Link href="/carrinho">
            <div>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user?.name || user?.email}
                </div>
                <DropdownMenuSeparator />
                
                {user?.role === "admin" && (
                  <>
                    <Link href="/admin">
                      <DropdownMenuItem className="cursor-pointer">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Painel Admin
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <Link href="/meus-pedidos">
                  <DropdownMenuItem className="cursor-pointer">
                    Meus Pedidos
                  </DropdownMenuItem>
                </Link>
                
                <Link href="/meus-enderecos">
                  <DropdownMenuItem className="cursor-pointer">
                    Meus Endereços
                  </DropdownMenuItem>
                </Link>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <a href={getLoginUrl()}>Entrar</a>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
