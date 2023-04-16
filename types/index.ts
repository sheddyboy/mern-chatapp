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

export interface MessageProps {
  _id: string;
  sender: UserProps;
  message: string;
  chat: ChatProps;
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
