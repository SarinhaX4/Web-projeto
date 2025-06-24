import api from './axios';

interface LoginResponse {
  accessToken: string;
  user: {
    username: string;
    email: string;
    phone: string;
    address: string;
    role: string;
  };
}

interface RegisterResponse {
  message: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', { username, password });
  if (response.data.accessToken) {
    localStorage.setItem('jwtToken', response.data.accessToken);
    localStorage.setItem('userProfile', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const register = async (userData: any): Promise<RegisterResponse> => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getProfile = async (): Promise<any> => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userProfile');
  window.location.href = '/';
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('jwtToken');
};
