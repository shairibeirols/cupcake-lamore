import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Package, MapPin, CreditCard, QrCode, Loader2, AlertCircle } from "lucide-react";

export default function OrderConfirmation() {
  const [, params] = useRoute("/pedido/:id");
  const [, setLocation] = useLocation();
  const orderId = params?.id ? Number(params.id) : null;

  const { data: order, isLoading, error } = trpc.orders.getById.useQuery(
    { id: orderId! },
    { enabled: !!orderId }
  );

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Aguardando Pagamento",
      confirmed: "Confirmado",
      preparing: "Em Preparação",
      shipped: "Enviado",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
      confirmed: "text-blue-600 bg-blue-50 border-blue-200",
      preparing: "text-purple-600 bg-purple-50 border-purple-200",
      shipped: "text-indigo-600 bg-indigo-50 border-indigo-200",
      delivered: "text-green-600 bg-green-50 border-green-200",
      cancelled: "text-red-600 bg-red-50 border-red-200",
    };
    return colorMap[status] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Pedido não encontrado</h2>
              <p className="text-muted-foreground mb-6">
                O número do pedido é inválido ou não foi informado.
              </p>
              <Button onClick={() => setLocation("/")}>Voltar para Home</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="max-w-2xl mx-auto flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg">Carregando pedido...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Erro ao carregar pedido</h2>
              <p className="text-muted-foreground mb-6">
                {error?.message || "Não foi possível carregar os detalhes do pedido."}
              </p>
              <Button onClick={() => setLocation("/")}>Voltar para Home</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header de Sucesso */}
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-green-900 mb-2">
                Pedido Realizado com Sucesso!
              </h1>
              <p className="text-green-700 mb-4">
                Seu pedido foi recebido e está sendo processado.
              </p>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200">
                <span className="text-sm text-muted-foreground">Número do Pedido:</span>
                <span className="text-lg font-bold text-green-700">#{order.id}</span>
              </div>
            </CardContent>
          </Card>

          {/* Status do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Status do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status Atual</p>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full border font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Data do Pedido</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {order.paymentMethod === "pix" ? (
                  <QrCode className="h-5 w-5" />
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
                Informações de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Forma de Pagamento</p>
                <p className="font-medium">
                  {order.paymentMethod === "pix" ? "PIX" : "Cartão de Crédito"}
                </p>
              </div>

              {order.paymentMethod === "pix" && order.status === "pending" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Instruções para Pagamento via PIX
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Abra o aplicativo do seu banco</li>
                    <li>Escolha a opção PIX</li>
                    <li>Escaneie o QR Code ou copie o código PIX</li>
                    <li>Confirme o pagamento de {formatPrice(order.total)}</li>
                  </ol>
                  <p className="text-xs text-blue-700 mt-3">
                    O pagamento será confirmado automaticamente em alguns minutos.
                  </p>
                </div>
              )}

              {order.paymentMethod === "credit_card" && order.status === "pending" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Seu pagamento está sendo processado. Você receberá uma confirmação em breve.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-medium">{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço de Entrega */}
          {order.address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{order.address.recipientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.address.street}, {order.address.number}
                    {order.address.complement && ` - ${order.address.complement}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.address.neighborhood} - {order.address.city}/{order.address.state}
                  </p>
                  <p className="text-sm text-muted-foreground">CEP: {order.address.zipCode}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Itens do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantidade: {item.quantity} x {formatPrice(item.productPrice)}
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(item.subtotal)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setLocation("/")}>
              Voltar para Home
            </Button>
            <Button onClick={() => window.print()}>Imprimir Pedido</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
