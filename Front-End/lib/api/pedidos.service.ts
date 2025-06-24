import api from './axios';

interface CreatePedidoDTO {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  total: number;
  items: Array<{
    productId: string;
    quantity: number;
    priceAtOrder: number;
  }>;
  status: "preparando" | "saiu_entrega" | "entregue";
}

interface PedidoResponse {
  id: string;
  orderDate: string;
  status: "preparando" | "saiu_entrega" | "entregue";
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: Array<{
    productId: string;
    quantity: number;
    priceAtOrder: number;
  }>;
}

export const getAllPedidos = async (token: string): Promise<PedidoResponse[]> => {
  const response = await api.get('/orders', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getPedidoById = async (id: string, token: string): Promise<PedidoResponse> => {
  const response = await api.get(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createPedido = async (token: string, pedidoData: CreatePedidoDTO): Promise<PedidoResponse> => {
  const response = await api.post('/orders', pedidoData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updatePedidoStatus = async (id: string, newStatus: "preparando" | "saiu_entrega" | "entregue", token: string): Promise<PedidoResponse> => {
  const response = await api.patch(`/orders/${id}/status`, { status: newStatus }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const removePedido = async (id: string, token: string): Promise<void> => {
  await api.delete(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
