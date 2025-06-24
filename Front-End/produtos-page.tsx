"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ShoppingCart, Search, Plus, Check, X, Minus, Trash2 } from "lucide-react"
import PedidosPage from "../pedidos/page" // Caminho corrigido para o módulo de página
import { getAllProdutos } from "@/lib/api/produtos.service"
import { createPedido } from "@/lib/api/pedidos.service"
import { isAuthenticated, getProfile, logout } from "@/lib/api/auth.service"

interface Produto {
  id: string
  name: string
  price: number
  description: string
  category: string
  stock: number
  unit: string
  status: 'active' | 'deleted'
  imageUrl: string
}

interface ItemCarrinho {
  produto: Produto
  quantidade: number
}

// Interface Pedido ajustada para consistência com o backend e pedidos-page.tsx
interface Pedido {
  id: string
  orderDate: string // Alterado de 'data' para 'orderDate'
  status: "preparando" | "saiu_entrega" | "entregue"
  total: number
  items: Array<{ // Alterado de 'itens' para 'items'
    productId: string
    name: string
    price: number
    quantity: number
    imageUrl: string
  }>
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string // Alterado de 'endereco' para 'deliveryAddress'
  previsaoEntrega: string
}

export default function ProdutosPage() {
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [itensAdicionados, setItensAdicionados] = useState<string[]>([])
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [compraConcluida, setCompraConcluida] = useState(false)
  const [termoBusca, setTermoBusca] = useState("")
  const [mostrarPedidos, setMostrarPedidos] = useState(false)
  const [pedidoAtual, setPedidoAtual] = useState<Pedido | null>(null)
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string; phone: string; address: string; role: string } | null>(null)

  const categorias = ["Toda a Loja", "Frutas", "Legumes", "Vegetais", "Folhas", "Temperos", "Frutas da época"]

  const fetchProdutos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('jwtToken');
      if (token) {
         const produtos = await getAllProdutos(token);
         setProdutosDisponiveis(produtos.filter((p: Produto) => p.status === 'active'));
      } else {
         setProdutosDisponiveis([
           { id: "mock-1", name: "Maçã Gala (Mock)", price: 10.89, description: "Maçã fresquinha", category: "Frutas", stock: 100, unit: "kg", status: "active", imageUrl: "https://via.placeholder.com/80" },
           { id: "mock-2", name: "Banana Prata (Mock)", price: 7.65, description: "Banana saborosa", category: "Frutas", stock: 50, unit: "kg", status: "active", imageUrl: "https://via.placeholder.com/80" },
           { id: "mock-3", name: "Tomate (Mock)", price: 8.39, description: "Tomate cereja", category: "Legumes", stock: 200, unit: "kg", status: "active", imageUrl: "https://via.placeholder.com/80" },
           { id: "mock-4", name: "Alface Lisa (Mock)", price: 9.99, description: "Alface crocante", category: "Vegetais", stock: 70, unit: "un", status: "active", imageUrl: "https://via.placeholder.com/80" },
         ]);
         // Removido o argumento do setError para evitar o erro de tipagem "Expected 0 arguments, but got 1."
         // Se quiser mostrar um aviso, use um estado separado ou um toast
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar produtos do backend.");
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        const profile = await getProfile(token);
        setCurrentUser(profile);
      } else {
        setCurrentUser({ username: "Visitante", email: "visitante@example.com", phone: "", address: "", role: "" });
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    fetchProdutos();
    fetchUserProfile();
  }, [fetchProdutos, fetchUserProfile]);

  const produtosFiltrados = produtosDisponiveis.filter((produto) =>
    produto.name.toLowerCase().includes(termoBusca.toLowerCase()) ||
    (termoBusca === "" && produto.category === termoBusca) ||
    (termoBusca !== "" && produto.category.toLowerCase().includes(termoBusca.toLowerCase()))
  );

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho((carrinhoAtual) => {
      const itemExistente = carrinhoAtual.find((item) => item.produto.id === produto.id)
      if (itemExistente) {
        if (itemExistente.quantidade + 1 > produto.stock) {
          alert(`Limite de estoque para ${produto.name} atingido!`);
          return carrinhoAtual;
        }
        return carrinhoAtual.map((item) =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item,
        )
      } else {
        if (produto.stock <= 0) {
          alert(`Produto ${produto.name} fora de estoque!`);
          return carrinhoAtual;
        }
        return [...carrinhoAtual, { produto, quantidade: 1 }]
      }
    })
    setItensAdicionados((prev) => [...prev, produto.id])
    setTimeout(() => {
      setItensAdicionados((prev) => prev.filter((id) => id !== produto.id))
    }, 1000)
  }

  const aumentarQuantidade = (produtoId: string) => {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.map((item) => {
        if (item.produto.id === produtoId) {
          if (item.quantidade + 1 > item.produto.stock) {
            alert(`Limite de estoque para ${item.produto.name} atingido!`);
            return item;
          }
          return { ...item, quantidade: item.quantidade + 1 };
        }
        return item;
      }),
    );
  };

  const diminuirQuantidade = (produtoId: string) => {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual
        .map((item) => (item.produto.id === produtoId ? { ...item, quantidade: item.quantidade - 1 } : item))
        .filter((item) => item.quantidade > 0),
    )
  }

  const removerItem = (produtoId: string) => {
    setCarrinho((carrinhoAtual) => carrinhoAtual.filter((item) => item.produto.id !== produtoId))
  }

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.produto.price * item.quantidade, 0)
  }

  const calcularQuantidadeTotal = () => {
    return carrinho.reduce((total, item) => total + item.quantidade, 0)
  }

  const finalizarCompra = async () => {
    if (!currentUser || !isAuthenticated()) {
      alert("Você precisa estar logado para finalizar a compra.");
      return;
    }
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    setCompraConcluida(true);
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
      }
      const newPedido = await createPedido(token, {
        customerName: currentUser.username,
        customerEmail: currentUser.email,
        customerPhone: currentUser.phone,
        deliveryAddress: currentUser.address || "Endereço não informado",
        total: parseFloat(calcularTotal().toFixed(2)),
        items: carrinho.map(item => ({
          productId: item.produto.id,
          quantity: item.quantidade,
          priceAtOrder: item.produto.price,
        })),
        status: "preparando",
      });
      const mappedPedido: Pedido = {
        id: newPedido.id,
        orderDate: newPedido.orderDate.split('T')[0], // Mapeado de orderDate
        status: newPedido.status,
        total: newPedido.total,
        items: carrinho.map(item => ({ // Mapeado para 'items'
          productId: item.produto.id,
          name: item.produto.name,
          price: item.produto.price,
          quantity: item.quantidade,
          imageUrl: item.produto.imageUrl
        })),
        customerName: newPedido.customerName, // Adicionado customerName
        customerEmail: newPedido.customerEmail, // Adicionado customerEmail
        customerPhone: newPedido.customerPhone, // Adicionado customerPhone
        deliveryAddress: newPedido.deliveryAddress, // Mapeado de deliveryAddress
        previsaoEntrega: "Previsão: 30-45 minutos",
      };
      setPedidoAtual(mappedPedido);
      setCarrinho([]);
      setCarrinhoAberto(false);
      setMostrarPedidos(true);
    } catch (err: any) {
      setError(err.message || "Erro ao finalizar a compra.");
      console.error("Erro ao finalizar a compra:", err);
      alert(`Erro ao finalizar a compra: ${err.message || 'Verifique o console para mais detalhes.'}`);
    } finally {
      setCompraConcluida(false);
    }
  };

  const voltarParaLoja = () => {
    setMostrarPedidos(false)
    setPedidoAtual(null)
    fetchProdutos();
  }

  const limparBusca = () => {
    setTermoBusca("")
  }

  if (mostrarPedidos) {
    // PedidosPage espera 'initialPedido' e 'onVoltarLoja'
    return <PedidosPage initialPedido={pedidoAtual} onVoltarLoja={voltarParaLoja} />
  }

  const ProductCard = ({ produto }: { produto: Produto }) => {
    const foiAdicionado = itensAdicionados.includes(produto.id)
    const itemNoCarrinho = carrinho.find((item) => item.produto.id === produto.id)
    const isOutOfStock = produto.stock <= 0;
    return (
      <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow duration-200 border border-gray-100">
        <div className="bg-gray-50 rounded-lg p-4 mb-3 flex items-center justify-center h-20">
          <img
            src={produto.imageUrl || "https://via.placeholder.com/80"}
            alt={produto.name}
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800 text-sm mb-1">R$ {produto.price.toFixed(2).replace(".", ",")}</p>
          <p className="text-gray-600 text-xs">{produto.name}</p>
          <p className="text-[#fa6924] text-xs mt-1">{produto.category}</p>
        </div>
        <Button
          size="sm"
          onClick={() => adicionarAoCarrinho(produto)}
          className={`w-full mt-3 h-8 transition-all duration-200 ${
            foiAdicionado
              ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Esgotado" : (foiAdicionado ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />)}
        </Button>
        {itemNoCarrinho && (
          <p className="text-xs text-center text-[#fa6924] mt-1 font-medium">{itemNoCarrinho.quantidade} no carrinho</p>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <p className="text-gray-600">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
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
              <Button onClick={logout} className="text-gray-600 hover:text-gray-800 text-sm" variant="ghost">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {carrinhoAberto && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setCarrinhoAberto(false)} />
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Seu Carrinho</h2>
                <button
                  onClick={() => setCarrinhoAberto(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
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
                          src={item.produto.imageUrl || "https://via.placeholder.com/80"}
                          alt={item.produto.name}
                          className="w-12 h-12 object-contain bg-white rounded p-1"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm text-gray-800">{item.produto.name}</h3>
                          <p className="text-sm text-[#fa6924] font-semibold">R$ {item.produto.price.toFixed(2).replace(".", ",")}</p>
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
          <aside className="w-48 flex-shrink-0">
            <nav className="space-y-2">
              {categorias.map((categoria, index) => (
                <Link
                  key={index}
                  href="#"
                  onClick={() => setTermoBusca(categoria === "Toda a Loja" ? "" : categoria)}
                  className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                    termoBusca === categoria || (termoBusca === "" && categoria === "Toda a Loja")
                      ? "bg-gray-100 text-gray-800 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {categoria}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1">
            {termoBusca ? (
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
              <>
                {categorias.slice(1).map((category, index) => {
                  const categoryProducts = produtosDisponiveis.filter(
                    (p) => p.category === category && p.status === 'active'
                  );
                  if (categoryProducts.length === 0) return null;
                  return (
                    <section key={index} className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">{category}</h2>
                        <Link href="#" className="text-sm text-[#fa6924] hover:underline" onClick={() => setTermoBusca(category)}>
                          Ver mais
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categoryProducts.map((produto) => (
                          <ProductCard key={produto.id} produto={produto} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}