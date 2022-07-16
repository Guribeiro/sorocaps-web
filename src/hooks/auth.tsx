/* eslint-disable react/jsx-no-constructed-context-values */
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';

import api from '../shared/services/api';

type AuthContextData = {
  auth: AuthState;
  signup(data: SignupProps): Promise<void>;
  signin(data: SigninProps): Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

type User = {
  full_name: string;
  email: string;
  username: string;
};

type SignupProps = {
  full_name: string;
  username: string;
  email: string;
  password: string;
};

interface AuthState {
  user: User;
  token: string;
}

type SigninProps = {
  email: string;
  password: string;
};

type SigninResponse = {
  user: User;
  token: string;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const AUTH_TOKEN_STORAGE_KEY = '@sorocaps:token';
  const AUTH_USER_STORAGE_KEY = '@sorocaps:user';

  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    const user = localStorage.getItem(AUTH_USER_STORAGE_KEY);

    if (token && user) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      return {
        token,
        user: JSON.parse(user),
      };
    }

    return {} as AuthState;
  });

  const signup = useCallback(
    async ({ full_name, username, email, password }: SignupProps) => {
      const response = await api.post<User>('/users', {
        full_name,
        username,
        email,
        password,
      });
    },
    [],
  );

  const signin = useCallback(async ({ email, password }: SigninProps) => {
    const response = await api.post<SigninResponse>('/sessions', {
      email,
      password,
    });

    const { user, token } = response.data;

    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    setAuth({
      user,
      token,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, signup, signin }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth sould be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
