import { User, Session } from 'next-auth'

export type FormState = {
    title: string;
    description: string;
    image: string;
    liveSiteUrl: string;
    githubUrl: string;
    category: string;
};


export interface ProjectInterface {
    title: string;
    description: string;
    image: string;
    liveSiteUrl: string;
    githubUrl: string;
    category: string;
    id: string;
    createdby: {
      name: string;
      email: string;
      avatarUrl: string;
      id: string;
    };
}


export interface UserProfile {
    id: string;
    name: string;
    email: string;
    description: string | null;
    avatarUrl: string;
    githubUrl: string | null;
    linkedinUrl: string | null;
}


export interface SessionInterface extends Session {
  user: User & {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
}


export interface ProjectForm {
  title: string;
  description: string;
  image: string;
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
}


export interface PageInfo{
  count: number;
  lastVisible: any;
  firstVisible: any;
  total: number;
}
