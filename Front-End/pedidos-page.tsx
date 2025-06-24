"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Clock, CheckCircle, Truck, MapPin } from "lucide-react"

interface ItemPedido {
  id: number
  nome: string
  preco: string
  quantidade: number
  imagem: string
}

interface Pedido {
  id: string
  data: string
  status: "preparando" | "saiu_entrega" | "entregue"
  total: number
  itens: ItemPedido[]
  endereco: string
  previsaoEntrega: string
}

interface PedidosPageProps {
  pedidoAtual?: Pedido
  onVoltarLoja: () => void
}

export default function PedidosPage({ pedidoAtual, onVoltarLoja }: PedidosPageProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([])

  // Simular pedidos anteriores
  useEffect(() => {
    const pedidosAnteriores: Pedido[] = [
      {
        id: "PED-001",
        data: "2024-01-10",
        status: "entregue",
        total: 45.67,
        itens: [
          { id: 1, nome: "Maçã Gala", preco: "R$ 10,89", quantidade: 2, imagem: "https://via.placeholder.com/60" },
          {
            id: 2,
            nome: "Banana Prata",
            preco: "R$ 7,65",
            quantidade: 1,
            imagem: "https://via.placeholder.com/60",
          },
        ],
        endereco: "Rua das Flores, 123 - Centro",
        previsaoEntrega: "Entregue em 10/01/2024",
      },
      {
        id: "PED-002",
        data: "2024-01-08",
        status: "entregue",
        total: 32.18,
        itens: [
          { id: 3, nome: "Tomate", preco: "R$ 8,39", quantidade: 2, imagem: "https://via.placeholder.com/60" },
          {
            id: 4,
            nome: "Alface Lisa",
            preco: "R$ 9,99",
            quantidade: 1,
            imagem: "https://via.placeholder.com/60",
          },
        ],
        endereco: "Rua das Flores, 123 - Centro",
        previsaoEntrega: "Entregue em 08/01/2024",
      },
    ]
    setPedidos(pedidosAnteriores)
  }, [])

  const getStatusInfo = (status: string) => {
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
              {new Date(pedido.data).toLocaleDateString("pt-BR", {
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
          {pedido.itens.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <img
                src={item.imagem || "https://via.placeholder.com/60"}
                alt={item.nome}
                className="w-12 h-12 object-contain bg-gray-50 rounded p-1"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.nome}</p>
                <p className="text-xs text-gray-500">Quantidade: {item.quantidade}</p>
              </div>
              <p className="text-sm font-semibold text-[#fa6924]">{item.preco}</p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center mb-2">
            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
            <p className="text-sm text-gray-600">{pedido.endereco}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{pedido.previsaoEntrega}</p>
            <p className="text-lg font-bold text-[#fa6924]">Total: R$ {pedido.total.toFixed(2).replace(".", ",")}</p>
          </div>
        </div>

        {isAtual && pedido.status !== "entregue" && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Acompanhe seu pedido:</h4>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center ${pedido.status === "preparando" ? "text-[#fa6924]" : "text-green-500"}`}
              >
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${pedido.status === "preparando" ? "bg-[#fa6924]" : "bg-green-500"}`}
                />
                <span className="text-sm">Preparando</span>
              </div>
              <div
                className={`w-8 h-0.5 ${pedido.status === "saiu_entrega" || pedido.status === "entregue" ? "bg-green-500" : "bg-gray-300"}`}
              />
              <div
                className={`flex items-center ${pedido.status === "saiu_entrega" ? "text-[#fa6924]" : pedido.status === "entregue" ? "text-green-500" : "text-gray-400"}`}
              >
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${pedido.status === "saiu_entrega" ? "bg-[#fa6924]" : pedido.status === "entregue" ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span className="text-sm">Saiu para entrega</span>
              </div>
              <div className={`w-8 h-0.5 ${pedido.status === "entregue" ? "bg-green-500" : "bg-gray-300"}`} />
              <div className={`flex items-center ${pedido.status === "entregue" ? "text-green-500" : "text-gray-400"}`}>
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${pedido.status === "entregue" ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span className="text-sm">Entregue</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
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
        {pedidoAtual && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pedido Atual</h2>
            <PedidoCard pedido={pedidoAtual} isAtual={true} />
          </section>
        )}

        {/* Pedidos Anteriores */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pedidos Anteriores</h2>
          {pedidos.length > 0 ? (
            <div className="space-y-4">
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
