import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  useState,
  useEffect,
  useContext,
  createContext
} from 'react';
import { api } from '../services/api';
import { AuthContextData, AuthProviderProps, SignInFormData, SignUpFormData, UserData } from '../types';
import { ErrorHandling } from '../utils/ErrorHandling';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../routes/auth.routes';

export const AuthContext = createContext({} as AuthContextData);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const { navigate } = useNavigation<NativeStackNavigationProp<StackProps>>();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const signed = !!user;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const storage = await AsyncStorage.getItem('@auth.token');

        if (storage) {
          const data = JSON.parse(storage);

          const response = await api.get('/users/me', {
            headers: {
              Authorization: `Bearer ${data.token}`,
            }
          });

          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

          setUser(response.data);          
          setLoading(false);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        new ErrorHandling(error);
      }
    }

    loadData();
  }, []);
  
  const handleSignIn = async (credentials: SignInFormData) => {
    try {
      setLoading(true);

      const response = await api.post('/sign_in', credentials);

      await AsyncStorage.setItem('@auth.token', JSON.stringify({ token: response.data.token }));

      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      setUser({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  const handleSignUp = async (credentials: SignUpFormData) => {
    try {
      setLoading(true);

      await api.post('/users', credentials);

      navigate('SignIn');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('@auth.token');
      setUser(null);
    } catch (error) {
      new ErrorHandling(error);
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signed,
      handleSignIn,
      handleSignUp,
      handleSignOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}
