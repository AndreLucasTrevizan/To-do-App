import React, {
  useState,
  useEffect,
  createContext,
  useContext
} from 'react';
import {
  AuthContextData,
  AuthProviderProps,
  SignInFormData,
  SignUpFormData,
  UserData
} from '../types';
import { toast } from 'react-toastify';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { ErrorHandling } from '../services/errors/ErrorHandling';
import { api } from '../services/apiClient';
import Router from 'next/router';

export const AuthContext = createContext({} as AuthContextData);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const handleSignOut = async () => {
  try {
    destroyCookie(undefined, '@nextauth.token');

    Router.push('/');
  } catch (error) {
    new ErrorHandling(error);
  }
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const signed = !!user;

  useEffect(() => {
    async function loadingData() {
      try {
        const { '@nextauth.token': token } = parseCookies();

        if (token) {
          const response = await api.get('/users/me');

          setUser(response.data);
        }
      } catch (error) {
        new ErrorHandling(error);
      }
    }

    loadingData();
  }, []);

  const handleSignIn = async (data: SignInFormData) => {
    try {
      setLoading(true);

      const response = await api.post('/sign_in', data);

      setCookie(undefined, '@nextauth.token', response.data.token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      });

      setUser({
        id: response.data.id,
        name: response.data.name,
        email: data.email
      });

      api.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;

      toast.success(`Bem-vindo ${response.data.name}`);

      Router.push('/dashboard');

      setLoading(false);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setLoading(true);

      await api.post('/users', data);

      toast.success('User created');
      Router.push('/');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      signed,
      loading,
      handleSignIn,
      handleSignUp,
      handleSignOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}
