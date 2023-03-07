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
  user: UserData | null,
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
  handleGetTodo: (todo: TodoData) => void;
  handleDeleteTodo: (todo: TodoData) => void;
  handleFinishTodo: (todo: TodoData) => void;
}

export interface DashboardProps {
  todo_list: TodoData[] | [],
};

export interface DatePickerProps {
  handleChangeDate: (date: number) => void;
}

export interface StatusPickerProps {
  handleChangeStatus: (status: string) => void;
}
