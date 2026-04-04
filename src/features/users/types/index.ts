export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserWithArticles = User & {
  articles: {
    id: string;
    title: string;
    tags: string[];
    likeCount: number;
    createdAt: string;
  }[];
};
