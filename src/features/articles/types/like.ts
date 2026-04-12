export type Like = {
  id: string;
  userId: string;
  articleId: string;
  createdAt: string;
};

export type LikeWithUser = Like & {
  user: {
    id: string;
    name: string | null;
  };
};
