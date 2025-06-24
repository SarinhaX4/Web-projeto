"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Clock, CheckCircle, Truck, MapPin } from "lucide-react"
import { getAllPedidos } from "@/lib/api/pedidos.service"
import { isAuthenticated } from "@/lib/api/auth.service"

interface ItemPedido {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

interface Pedido {
  id: string
  orderDate: string
  status: "preparando" | "saiu_entrega" | "entregue" | "processando"
  total: number
  items: ItemPedido[]
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  previsaoEntrega: string
}

interface PedidosPageProps {
  initialPedido?: Pedido
  onVoltarLoja: () => void
}

export default function PedidosPage({ initialPedido, onVoltarLoja }: PedidosPageProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPedidos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login para ver seus pedidos.");
      }
      const fetchedPedidos = await getAllPedidos(token);

      const mappedPedidos: Pedido[] = fetchedPedidos.map((p: any) => ({
        id: p.id,
        orderDate: p.orderDate.split('T')[0],
        status: p.status,
        total: p.total,
        items: p.items.map((item: any) => ({
          productId: item.productId,
          name: item.productName,
          price: item.priceAtOrder,
          quantity: item.quantity,
          imageUrl: item.productImageUrl || "https://via.placeholder.com/60"
        })),
        customerName: p.customerName,
        customerEmail: p.customerEmail,
        customerPhone: p.customerPhone,
        deliveryAddress: p.deliveryAddress,
        previsaoEntrega: p.status === 'entregue'
          ? `Entregue em ${new Date(p.orderDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}`
          : "Previsão: 30-45 minutos"
      }));
      setPedidos(mappedPedidos);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar pedidos.");
      console.error("Erro ao carregar pedidos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/';
      return;
    }
    fetchPedidos();
  }, [fetchPedidos]);

  useEffect(() => {
    if (initialPedido && !pedidos.some(p => p.id === initialPedido.id)) {
      setPedidos(prevPedidos => [initialPedido, ...prevPedidos]);
    }
  }, [initialPedido, pedidos]);

  const getStatusInfo = (status: Pedido["status"]) => {
    switch (status) {
      case "preparando":
        return {
          icon: <Package className="h-5 w-5 text-orange-500" />,
          text: "Preparando pedido",
          color: "text-orange-500",
          bgColor: "bg-orange-50",
        }
      case "saiu_entrega":
        return {
          icon: <Truck className="h-5 w-5 text-blue-500" />,
          text: "Saiu para entrega",
          color: "text-blue-500",
          bgColor: "bg-blue-50",
        }
      case "entregue":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          text: "Entregue",
          color: "text-green-500",
          bgColor: "bg-green-50",
        }
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          text: "Processando",
          color: "text-gray-500",
          bgColor: "bg-gray-50",
        }
    }
  }

  const PedidoCard = ({ pedido, isAtual = false }: { pedido: Pedido; isAtual?: boolean }) => {
    const statusInfo = getStatusInfo(pedido.status)
    const status = pedido.status

    return (
      <div className={`bg-white rounded-lg border p-6 ${isAtual ? "border-[#fa6924] shadow-lg" : "border-gray-200"}`}>
        {isAtual && (
          <div className="flex items-center mb-4 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700 font-medium">Pedido realizado com sucesso!</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800">Pedido #{pedido.id}</h3>
            <p className="text-sm text-gray-500">
              {new Date(pedido.orderDate).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
          <div className={`flex items-center px-3 py-1 rounded-full ${statusInfo.bgColor}`}>
            {statusInfo.icon}
            <span className={`ml-2 text-sm font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {pedido.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-1 bg-gray-50 rounded-lg">
              <img
                src={item.imageUrl || "https://via.placeholder.com/60"}
                alt={item.name}
                className="w-12 h-12 object-contain bg-white rounded p-1"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">Quantidade: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-[#fa6924]">R$ {item.price.toFixed(2).replace(".", ",")}</p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center mb-2">
            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
            <p className="text-sm text-gray-600">{pedido.deliveryAddress}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{pedido.previsaoEntrega}</p>
            <p className="text-lg font-bold text-[#fa6924]">Total: R$ {pedido.total.toFixed(2).replace(".", ",")}</p>
          </div>
        </div>

        {isAtual && (status as Pedido["status"]) !== "entregue" && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Acompanhe seu pedido:</h4>
            <div className="flex items-center space-x-4">
              {/* Preparando */}
              <div
                className={`flex items-center ${(status as Pedido["status"]) === "preparando" ? "text-[#fa6924]" : "text-green-500"}`}
              >
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${(status as Pedido["status"]) === "preparando" ? "bg-[#fa6924]" : "bg-green-500"}`}
                />
                <span className="text-sm">Preparando</span>
              </div>
              {/* Linha para Saiu para entrega */}
              <div
                className={`w-8 h-0.5 ${((status as Pedido["status"]) === "saiu_entrega" || (status as Pedido["status"]) === "entregue") ? "bg-green-500" : "bg-gray-300"}`}
              />
              {/* Saiu para entrega */}
              <div
                className={`flex items-center ${(status as Pedido["status"]) === "saiu_entrega" ? "text-[#fa6924]" : (status as Pedido["status"]) === "entregue" ? "text-green-500" : "text-gray-400"}`}
              >
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${(status as Pedido["status"]) === "saiu_entrega" ? "bg-[#fa6924]" : (status as Pedido["status"]) === "entregue" ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span className="text-sm">Saiu para entrega</span>
              </div>
              {/* Linha para Entregue */}
              <div
                className={`w-8 h-0.5 ${(status as Pedido["status"]) === "entregue" ? "bg-green-500" : "bg-gray-300"}`}
              />
              {/* Entregue */}
              <div className={`flex items-center ${(status as Pedido["status"]) === "entregue" ? "text-green-500" : "text-gray-400"}`}>
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${(status as Pedido["status"]) === "entregue" ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span className="text-sm">Entregue</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <p className="text-gray-600">Carregando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center justify-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Button onClick={fetchPedidos}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onVoltarLoja}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-sm">Voltar à loja</span>
              </button>
              <h1 className="text-xl font-bold text-gray-800">Meus Pedidos</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-medium">HORT+</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Pedido Atual */}
        {initialPedido && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Último Pedido</h2>
            <PedidoCard pedido={initialPedido} isAtual={true} />
          </section>
        )}

        {/* Pedidos Anteriores */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Todos os Pedidos</h2>
          {pedidos.length > 0 ? (
            <div className="space-y-6">
              {pedidos.map((pedido) => (
                <PedidoCard key={pedido.id} pedido={pedido} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Você ainda não fez nenhum pedido</p>
                        <Button onClick={onVoltarLoja} className="mt-4 bg-[#fa6924] hover:bg-[#e55a1f]">
                          Fazer primeiro pedido
                        </Button>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            )
          }