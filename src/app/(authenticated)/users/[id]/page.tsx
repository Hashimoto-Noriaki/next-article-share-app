import { UserProfilePageTemplate } from '@/features/users/components/server/UserProfilePageTemplate';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  return <UserProfilePageTemplate userId={id} />;
}
