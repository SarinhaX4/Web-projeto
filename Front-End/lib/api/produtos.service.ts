import api from './axios';

interface Produto {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  unit: string;
  status: 'active' | 'deleted';
  imageUrl: string;
}

export const getAllProdutos = async (token: string): Promise<Produto[]> => {
  const response = await api.get('/products', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getProdutoById = async (id: string, token: string): Promise<Produto> => {
  const response = await api.get(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createProduto = async (produtoData: Omit<Produto, 'id' | 'status'>, token: string): Promise<Produto> => {
  const response = await api.post('/products', produtoData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateProduto = async (id: string, produtoData: Partial<Produto>, token: string): Promise<Produto> => {
  const response = await api.patch(`/products/${id}`, produtoData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const removeProduto = async (id: string, token: string): Promise<void> => {
  await api.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};