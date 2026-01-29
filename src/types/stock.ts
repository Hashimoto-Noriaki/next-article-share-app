export type Stock = {
  id: string;
  userId: string;
  articleId: string;
  createdAt: string;
};

export type StockWithArticle = {
  article: {
    id: string;
    title: string;
    tags: string[];
    likeCount: number;
    createdAt: string;
    author: {
      name: string | null;
    };
  };
};
