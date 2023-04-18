export interface RegisterProps {
  name: string;
  email: string;
  password: string;
  file: string;
}

export interface LoginProps {
  email: string;
  password: string;
}

export interface AuthResProps {
  user: UserProps;
  token: string;
}

export interface UserProps {
  name: string;
  email: string;
  password: string;
  picture: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ChatProps {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: UserProps[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  latestMessage?: MessageProps;
  groupAdmin?: UserProps;
}

export interface MessageProps {
  _id: string;
  sender: UserProps;
  message: string;
  chat: ChatProps;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface AuthErrorProps {
  data: { message: string };
  status: string | number;
  error: string;
}
