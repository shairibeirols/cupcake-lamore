import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, CreditCard, QrCode } from "lucide-react";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "pix">("credit_card");
  const [notes, setNotes] = useState("");

  const [formData, setFormData] = useState({
    recipientName: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const createOrderMutation = trpc.orders.create.useMutation();
  const createAddressMutation = trpc.addresses.create.useMutation();

  const shippingFee = 1500;
  const total = subtotal + shippingFee;

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    // Validar formulário
    const requiredFields = ["recipientName", "street", "number", "neighborhood", "city", "state", "zipCode"];
    const emptyFields = requiredFields.filter((field) => !formData[field as keyof typeof formData]);

    if (emptyFields.length > 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      // Primeiro criar o endereço
      const addressResult = await createAddressMutation.mutateAsync({
        ...formData,
        isDefault: false,
      });

      // Extrair o ID do endereço criado
      const addressId = (addressResult as any).id;

      // Depois criar o pedido
      const orderResult = await createOrderMutation.mutateAsync({
        addressId,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        notes: notes || undefined,
      });

      clearCart();
      toast.success("Pedido realizado com sucesso!");
      setLocation(`/pedido/${orderResult.orderId}`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao finalizar pedido");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        {items.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-lg text-muted-foreground mb-4">Seu carrinho está vazio</p>
              <Button onClick={() => setLocation("/")}>Voltar para Home</Button>
            </CardContent>
          </Card>
        ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-2 space-y-6">
              {/* Endereço de Entrega */}
              <Card>
                <CardHeader>
                  <CardTitle>Endereço de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="recipientName">Nome do Destinatário *</Label>
                      <Input
                        id="recipientName"
                        value={formData.recipientName}
                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="zipCode">CEP *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        placeholder="00000-000"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="street">Rua *</Label>
                      <Input
                        id="street"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="number">Número *</Label>
                      <Input
                        id="number"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        value={formData.complement}
                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="neighborhood">Bairro *</Label>
                      <Input
                        id="neighborhood"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="city">Cidade *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">Estado *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                        placeholder="SP"
                        maxLength={2}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Forma de Pagamento */}
              <Card>
                <CardHeader>
                  <CardTitle>Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5" />
                        Cartão de Crédito
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                        <QrCode className="h-5 w-5" />
                        PIX
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Observações */}
              <Card>
                <CardHeader>
                  <CardTitle>Observações (Opcional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Alguma observação sobre o pedido?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Itens */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span className="font-medium">{formatPrice(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardContent>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Confirmar Pedido"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
        )}
      </main>
    </div>
  );
}
