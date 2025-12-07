import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { AdminLayout } from "./components/AdminLayout";

// Pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  // Modo demo: permitir acesso sem autenticação para demonstração
  return <AdminLayout>{children}</AdminLayout>;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/carrinho" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/pedido/:id" component={OrderConfirmation} />

      {/* Admin Routes */}
      <Route path="/admin">
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      </Route>
      <Route path="/admin/produtos">
        <ProtectedAdminRoute>
          <AdminProducts />
        </ProtectedAdminRoute>
      </Route>
      <Route path="/admin/pedidos">
        <ProtectedAdminRoute>
          <AdminOrders />
        </ProtectedAdminRoute>
      </Route>

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
