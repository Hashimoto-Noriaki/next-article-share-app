export type PageProps = {
  params: Promise<Record<string, string>>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

export type LayoutProps = {
  children: React.ReactNode;
  params?: Promise<Record<string, string>>;
};
