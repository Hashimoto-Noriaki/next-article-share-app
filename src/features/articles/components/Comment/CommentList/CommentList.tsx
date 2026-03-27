import { CommentItem } from '../CommentItem';

type Comment = {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
  };
};

type Props = {
  comments: Comment[];
  currentUserId: string;
};

export function CommentList({ comments, currentUserId }: Props) {
  if (comments.length === 0) {
    return <p className="text-gray-500">コメントはまだありません</p>;
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          id={comment.id}
          content={comment.content}
          userId={comment.userId}
          userName={comment.user.name || '名無し'}
          createdAt={comment.createdAt}
          isOwner={comment.userId === currentUserId}
        />
      ))}
    </div>
  );
}
