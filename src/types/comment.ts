export type Comment = {
  id: string;
  content: string;
  articleId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CommentWithUser = {
  user: {
    id: string;
    name: string | null;
    image?: string | null;
  };
};
