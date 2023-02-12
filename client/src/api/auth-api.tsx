import { useMutation, UseMutationResult } from '@tanstack/react-query';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

import { StreamChat } from 'stream-chat';
import { useSessionStorage } from '../hooks/useSessionStorage';

type User = {
  id: string;
  name: string;
  image?: string;
};

export type Context = {
  signup: UseMutationResult<AxiosResponse, unknown, User>;
  login: UseMutationResult<{ token: string; user: User }, unknown, string>;
  user?: User;
  streamChat?: StreamChat | null;
  logout: UseMutationResult<AxiosResponse, unknown, void>;
  error: string | null;
  check: boolean;
};

type Props = {
  children: ReactNode;
};

const Context = createContext<Context | null>(null);

const baseURL = import.meta.env.VITE_BASE_URL;

export function useAuth() {
  return useContext(Context);
}

export function AuthProvider({ children }: Props) {
  const navigate = useNavigate();
  const [user, setUser] = useSessionStorage<User>('user');
  const [token, setToken] = useSessionStorage<string>('token');
  const [streamChat, setStreamChat] = useState<StreamChat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [check, setCheck] = useState(false);

  const signup = useMutation({
    mutationFn: (user: User) => {
      return axios.post(`${baseURL}/signup`, user);
    },
    onSuccess: () => {
      navigate('/login');
    },
    onError(error: AxiosError) {
      if (error.response && typeof error.response.data === 'string')
        setError(error.response.data);
        setCheck(!check);
    },
  });

  const login = useMutation({
    mutationFn: (id: string) => {
      return axios
        .post(`${baseURL}/login`, { id })
        .then((res) => res.data as { token: string; user: User });
    },
    onSuccess(data) {
      const { token, user } = data;

      setToken(token);
      setUser(user);
    },
    onError(error: AxiosError) {
      if (error.response && typeof error.response.data === 'string')
        setError(error.response.data);
        setCheck(!check);
    },
  });

  const logout = useMutation({
    mutationFn: () => {
      return axios.post(`${baseURL}/logout`, { token });
    },
    onSuccess() {
      setUser(undefined);
      setToken(null);
      setStreamChat(null);
      setError(null);
    },
  });

  useEffect(() => {
    if (!user || !token) return;

    const chat = new StreamChat(import.meta.env.VITE_STREAM_CHAT_API_KEY!);

    if (chat.tokenManager.token === token && chat.userID === user.id) return;

    let isInterrupted = false;
    const connect = chat.connectUser(user, token).then(() => {
      if (isInterrupted) return;
      setStreamChat(chat);
    });

    return () => {
      isInterrupted = true;
      setStreamChat(null);

      connect.then(() => {
        chat.disconnectUser();
      });
    };
  }, [user, token]);

  return (
    <Context.Provider
      value={{ signup, login, user, streamChat, logout, error, check }}
    >
      {children}
    </Context.Provider>
  );
}
