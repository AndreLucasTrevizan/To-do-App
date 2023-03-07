import { ReactNode } from 'react';

export interface SignInFormData {
  email: string,
  password: string
};

export interface SignUpFormData {
  name: string,
  email: string,
  password: string
};

export interface UserData {
  id: string,
  name: string,
  email: string
};

export interface AuthContextData {
  user: UserData,
  signed: boolean,
  loading: boolean,
  handleSignIn: (credentials: SignInFormData) => Promise<void>;
  handleSignUp: (credentials: SignUpFormData) => Promise<void>;
  handleSignOut: () => void;
};

export interface AuthProviderProps {
  children: ReactNode;
};

export interface TodoFormData {
  description: string,
};

export interface TodoData {
  id: string,
  description: string,
  date: string,
  time: string,
  status: boolean,
  user: {
    id: string,
    email: string,
  }
};

export interface TodoProps {
  data: TodoData,
  handleFinish: (todo: TodoData) => Promise<void>,
  handleEdit: (todo: TodoData) => Promise<void>,
  handleDelete: (todo: TodoData) => Promise<void>,
}

export interface DashboardProps {
  todo_list: TodoData[] | [],
};

export interface EmailFormData {
  email: string,
}

export interface CodeFormData {
  code: string,
}

export interface UpdatePasswordFormData {
  password: string,
  confirm_password: string
}
