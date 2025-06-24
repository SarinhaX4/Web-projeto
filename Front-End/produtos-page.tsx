"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ShoppingCart, Search, Plus, Check, X, Minus, Trash2 } from "lucide-react"
import PedidosPage from "./pedidos-page"

interface Produto {
  id: number
  nome: string
  preco: string
  precoNumerico: number
  imagem: string
  categoria: string
}

interface ItemCarrinho {
  produto: Produto
  quantidade: number
}

interface Pedido {
  id: string
  data: string
  status: "preparando" | "saiu_entrega" | "entregue"
  total: number
  itens: Array<{
    id: number
    nome: string
    preco: string
    quantidade: number
    imagem: string
  }>
  endereco: string
  previsaoEntrega: string
}

export default function ProdutosPage() {
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [itensAdicionados, setItensAdicionados] = useState<number[]>([])
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [compraConcluida, setCompraConcluida] = useState(false)
  const [termoBusca, setTermoBusca] = useState("")
  const [mostrarPedidos, setMostrarPedidos] = useState(false)
  const [pedidoAtual, setPedidoAtual] = useState<Pedido | null>(null)

  const categorias = ["Toda a Loja", "Frutas", "Legumes", "Vegetais", "Folhas", "Temperos", "Frutas da época"]

  const frutas: Produto[] = [
    {
      id: 1,
      nome: "Maçã Gala",
      preco: "R$ 10,89",
      precoNumerico: 10.89,
      imagem: "https://via.placeholder.com/80",
      categoria: "Frutas",
    },
    {
      id: 2,
      nome: "Banana Prata",
      preco: "R$ 7,65",
      precoNumerico: 7.65,
      imagem: "https://via.placeholder.com/80",
      categoria: "Frutas",
    },
    {
      id: 3,
      nome: "Uva Roxa",
      preco: "R$ 12,69",
      precoNumerico: 12.69,
      imagem: "https://via.placeholder.com/80",
      categoria: "Frutas",
    },
    {
      id: 4,
      nome: "Laranja Pera",
      preco: "R$ 5,29",
      precoNumerico: 5.29,
      imagem: "https://via.placeholder.com/80",
      categoria: "Frutas",
    },
    {
      id: 5,
      nome: "Pera",
      preco: "R$ 8,45",
      precoNumerico: 8.45,
      imagem: "https://via.placeholder.com/80",
      categoria: "Frutas",
    },
  ]

  const legumes: Produto[] = [
    {
      id: 6,
      nome: "Pepino Japonês",
      preco: "R$ 9,39",
      precoNumerico: 9.39,
      imagem: "https://via.placeholder.com/80",
      categoria: "Legumes",
    },
    {
      id: 7,
      nome: "Cenoura",
      preco: "R$ 11,39",
      precoNumerico: 11.39,
      imagem: "https://via.placeholder.com/80",
      categoria: "Legumes",
    },
    {
      id: 8,
      nome: "Tomate",
      preco: "R$ 8,39",
      precoNumerico: 8.39,
      imagem: "https://via.placeholder.com/80",
      categoria: "Legumes",
    },
    {
      id: 9,
      nome: "Abóbora",
      preco: "R$ 13,89",
      precoNumerico: 13.89,
      imagem: "https://via.placeholder.com/80",
      categoria: "Legumes",
    },
    {
      id: 10,
      nome: "Cebola Roxa",
      preco: "R$ 6,82",
      precoNumerico: 6.82,
      imagem: "https://via.placeholder.com/80",
      categoria: "Legumes",
    },
  ]

  const vegetais: Produto[] = [
    {
      id: 11,
      nome: "Brócolis",
      preco: "R$ 5,48",
      precoNumerico: 5.48,
      imagem: "https://via.placeholder.com/80",
      categoria: "Vegetais",
    },
    {
      id: 12,
      nome: "Repolho",
      preco: "R$ 8,43",
      precoNumerico: 8.43,
      imagem: "https://via.placeholder.com/80",
      categoria: "Vegetais",
    },
    {
      id: 13,
      nome: "Alface Lisa",
      preco: "R$ 9,99",
      precoNumerico: 9.99,
      imagem: "https://via.placeholder.com/80",
      categoria: "Vegetais",
    },
    {
      id: 14,
      nome: "Batata Inglesa",
      preco: "R$ 13,14",
      precoNumerico: 13.14,
      imagem: "https://via.placeholder.com/80",
      categoria: "Vegetais",
    },
    {
      id: 15,
      nome: "Salsão",
      preco: "R$ 3,83",
      precoNumerico: 3.83,
      imagem: "https://via.placeholder.com/80",
      categoria: "Vegetais",
    },
  ]

  // Combinar todos os produtos para busca
  const todosProdutos = [...frutas, ...legumes, ...vegetais]

  // Filtrar produtos baseado no termo de busca
  const produtosFiltrados = todosProdutos.filter((produto) =>
    produto.nome.toLowerCase().includes(termoBusca.toLowerCase()),
  )

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho((carrinhoAtual) => {
      const itemExistente = carrinhoAtual.find((item) => item.produto.id === produto.id)

      if (itemExistente) {
        return carrinhoAtual.map((item) =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item,
        )
      } else {
        return [...carrinhoAtual, { produto, quantidade: 1 }]
      }
    })

    setItensAdicionados((prev) => [...prev, produto.id])
    setTimeout(() => {
      setItensAdicionados((prev) => prev.filter((id) => id !== produto.id))
    }, 1000)
  }

  const aumentarQuantidade = (produtoId: number) => {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.map((item) =>
        item.produto.id === produtoId ? { ...item, quantidade: item.quantidade + 1 } : item,
      ),
    )
  }

  const diminuirQuantidade = (produtoId: number) => {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual
        .map((item) => (item.produto.id === produtoId ? { ...item, quantidade: item.quantidade - 1 } : item))
        .filter((item) => item.quantidade > 0),
    )
  }

  const removerItem = (produtoId: number) => {
    setCarrinho((carrinhoAtual) => carrinhoAtual.filter((item) => item.produto.id !== produtoId))
  }

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.produto.precoNumerico * item.quantidade, 0)
  }

  const calcularQuantidadeTotal = () => {
    return carrinho.reduce((total, item) => total + item.quantidade, 0)
  }

  const finalizarCompra = () => {
    setCompraConcluida(true)

    // Criar pedido
    const novoPedido: Pedido = {
      id: `PED-${Date.now().toString().slice(-3)}`,
      data: new Date().toISOString().split("T")[0],
      status: "preparando",
      total: calcularTotal(),
      itens: carrinho.map((item) => ({
        id: item.produto.id,
        nome: item.produto.nome,
        preco: item.produto.preco,
        quantidade: item.quantidade,
        imagem: item.produto.imagem,
      })),
      endereco: "Rua das Flores, 123 - Centro",
      previsaoEntrega: "Previsão: 30-45 minutos",
    }

    setTimeout(() => {
      setPedidoAtual(novoPedido)
      setCarrinho([])
      setCarrinhoAberto(false)
      setCompraConcluida(false)
      setMostrarPedidos(true)
    }, 2000)
  }

  const voltarParaLoja = () => {
    setMostrarPedidos(false)
    setPedidoAtual(null)
  }

  const limparBusca = () => {
    setTermoBusca("")
  }

  // Se estiver mostrando pedidos, renderizar a página de pedidos
  if (mostrarPedidos) {
    return <PedidosPage pedidoAtual={pedidoAtual} onVoltarLoja={voltarParaLoja} />
  }

  const ProductCard = ({ produto }: { produto: Produto }) => {
    const foiAdicionado = itensAdicionados.includes(produto.id)
    const itemNoCarrinho = carrinho.find((item) => item.produto.id === produto.id)

    return (
      <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow duration-200 border border-gray-100">
        <div className="bg-gray-50 rounded-lg p-4 mb-3 flex items-center justify-center h-20">
          <img
            src={produto.imagem || "https://via.placeholder.com/80"}
            alt={produto.nome}
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800 text-sm mb-1">{produto.preco}</p>
          <p className="text-gray-600 text-xs">{produto.nome}</p>
          <p className="text-[#fa6924] text-xs mt-1">{produto.categoria}</p>
        </div>
        <Button
          size="sm"
          onClick={() => adicionarAoCarrinho(produto)}
          className={`w-full mt-3 h-8 transition-all duration-200 ${
            foiAdicionado
              ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {foiAdicionado ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </Button>
        {itemNoCarrinho && (
          <p className="text-xs text-center text-[#fa6924] mt-1 font-medium">{itemNoCarrinho.quantidade} no carrinho</p>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-800">HORT +</h1>
              <nav className="hidden md:flex space-x-6">
                <Link href="#" className="text-gray-600 hover:text-gray-800 text-sm">
                  Início
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-800 text-sm">
                  Supermercado
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-800 text-sm">
                  Hortifruti
                </Link>
                <button onClick={() => setMostrarPedidos(true)} className="text-gray-600 hover:text-gray-800 text-sm">
                  Meus Pedidos
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCarrinhoAberto(true)}
                className="flex items-center bg-[#fa6924] text-white px-3 py-2 rounded-md relative hover:bg-[#e55a1f] transition-colors"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">R$ {calcularTotal().toFixed(2).replace(".", ",")}</span>
                {calcularQuantidadeTotal() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {calcularQuantidadeTotal()}
                  </span>
                )}
              </button>
              <Link href="/" className="text-gray-600 hover:text-gray-800 text-sm">
                Sair
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      {carrinhoAberto && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setCarrinhoAberto(false)} />
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header do Carrinho */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Seu Carrinho</h2>
                <button
                  onClick={() => setCarrinhoAberto(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Itens do Carrinho */}
              <div className="flex-1 overflow-y-auto p-4">
                {carrinho.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Seu carrinho está vazio</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {carrinho.map((item) => (
                      <div key={item.produto.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.produto.imagem || "https://via.placeholder.com/80"}
                          alt={item.produto.nome}
                          className="w-12 h-12 object-contain bg-white rounded p-1"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm text-gray-800">{item.produto.nome}</h3>
                          <p className="text-sm text-[#fa6924] font-semibold">{item.produto.preco}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => diminuirQuantidade(item.produto.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantidade}</span>
                          <button
                            onClick={() => aumentarQuantidade(item.produto.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removerItem(item.produto.id)}
                            className="p-1 hover:bg-red-100 rounded text-red-500 ml-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer do Carrinho */}
              {carrinho.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-xl font-bold text-[#fa6924]">
                      R$ {calcularTotal().toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <Button
                    onClick={finalizarCompra}
                    className="w-full bg-[#fa6924] hover:bg-[#e55a1f] text-white py-3 rounded-lg font-semibold"
                    disabled={compraConcluida}
                  >
                    {compraConcluida ? "✅ Compra Realizada!" : "Finalizar Compra"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Logo and Location */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-2xl font-bold text-[#fa6924]">oba</span>
              <span className="text-sm text-gray-600 font-medium">HORTIFRUTI</span>
            </div>
            <p className="text-xs text-gray-500">São José dos Campos - SP</p>
            <Link href="#" className="text-xs text-[#fa6924] hover:underline">
              Ver mais
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Busque entre mais de 500 itens"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="pl-10 pr-10 bg-gray-100 border-0 rounded-lg h-12 text-sm"
          />
          {termoBusca && (
            <button
              onClick={limparBusca}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-48 flex-shrink-0">
            <nav className="space-y-2">
              {categorias.map((categoria, index) => (
                <Link
                  key={index}
                  href="#"
                  className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                    categoria === "Frutas" ? "bg-gray-100 text-gray-800 font-medium" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {categoria}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {termoBusca ? (
              /* Resultados da Busca */
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Resultados para "{termoBusca}" ({produtosFiltrados.length}{" "}
                    {produtosFiltrados.length === 1 ? "item" : "itens"})
                  </h2>
                  <button onClick={limparBusca} className="text-sm text-[#fa6924] hover:underline">
                    Limpar busca
                  </button>
                </div>
                {produtosFiltrados.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {produtosFiltrados.map((produto) => (
                      <ProductCard key={produto.id} produto={produto} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum produto encontrado para "{termoBusca}"</p>
                    <p className="text-gray-400 text-sm mt-2">Tente buscar por outro termo</p>
                  </div>
                )}
              </section>
            ) : (
              /* Exibição Normal por Categorias */
              <>
                {/* Frutas Section */}
                <section className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Frutas</h2>
                    <Link href="#" className="text-sm text-[#fa6924] hover:underline">
                      Ver mais
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {frutas.map((produto) => (
                      <ProductCard key={produto.id} produto={produto} />
                    ))}
                  </div>
                </section>

                {/* Legumes Section */}
                <section className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Legumes</h2>
                    <Link href="#" className="text-sm text-[#fa6924] hover:underline">
                      Ver mais
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {legumes.map((produto) => (
                      <ProductCard key={produto.id} produto={produto} />
                    ))}
                  </div>
                </section>

                {/* Vegetais Section */}
                <section className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Vegetais</h2>
                    <Link href="#" className="text-sm text-[#fa6924] hover:underline">
                      Ver mais
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {vegetais.map((produto) => (
                      <ProductCard key={produto.id} produto={produto} />
                    ))}
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
