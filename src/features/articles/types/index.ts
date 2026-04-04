export type Article = {
  id: string;
  title: string;
  content: string;
  tags: string;
  isDraft: boolean;
  authorId: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ArticleWithAuthor = Article & {
  author: {
    id?: string;
    name: string | null;
  };
  isLiked?: boolean;
};
