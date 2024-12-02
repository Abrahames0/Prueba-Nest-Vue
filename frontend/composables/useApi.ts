import { useRuntimeConfig } from 'nuxt/app';
import { jwtDecode } from 'jwt-decode';

export default function useApi() {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  if (typeof apiBaseUrl !== 'string') {
    throw new Error('API base URL no configurada correctamente en runtimeConfig.');
  }

  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token) as { exp: number };
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken && decodedToken.exp > currentTime) {
            return token;
          } else {
            localStorage.removeItem('token');
            return null;
          }
        } catch (error) {
          localStorage.removeItem('token');
          return null;
        }
      }
    }
    return null;
  };
  
    const api = $fetch.create({
      baseURL: apiBaseUrl,
    });
  
    const login = async (email: string, password: string): Promise<any> => {
      const response: any = await api('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
  
      if (response.accessToken) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.accessToken);
        }
      }
  
      return response;
    };

  const verifyCode = async (email: string, code: string): Promise<any> => {
    const response: any = await api('/auth/verify-code', {
      method: 'POST',
      body: { email, code },
    });

    if (response.accessToken) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.accessToken);
      }
    }

    return response;
  };

  const register = async (userData: { name: string; email: string; contact: string; password: string; confirmPassword: string }): Promise<any> => {
    const response: any = await api('/users', {
      method: 'POST',
      body: userData,
    });

    return response;
  };

  const getUsers = async (): Promise<any> => {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token válido. Por favor, inicie sesión.');
    }

    try {
      const response: any = await api('/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw new Error('No se pudieron cargar los usuarios. Por favor, inténtelo de nuevo.');
    }
  };

  const updateUser = async (id: string, userData: { [key: string]: any }): Promise<any> => {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token válido. Por favor, inicie sesión.');
    }

    try {
      const response: any = await api(`/users/${id}`, {
        method: 'PUT',
        body: userData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw new Error('No se pudo actualizar el usuario.');
    }
  };

  const deleteUser = async (id: string): Promise<any> => {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token válido. Por favor, inicie sesión.');
    }

    return await api(`/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return { login, verifyCode, register, getUsers, updateUser, deleteUser };
}
