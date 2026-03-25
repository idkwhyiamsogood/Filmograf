import type { Comment } from "@/entities/comment";

export type ReactionType = 'like' | 'dislike' | null;

export const toggleReaction = (
  comment: Comment, 
  userId: string, 
  reaction: ReactionType
): Comment => {
  const hasLike = comment.likes?.includes(userId) || false;
  const hasDislike = comment.dislikes?.includes(userId) || false;

  let updatedLikes = [...(comment.likes || [])];
  let updatedDislikes = [...(comment.dislikes || [])];

  if (hasLike) {
    updatedLikes = updatedLikes.filter((id) => id !== userId);
  }
  if (hasDislike) {
    updatedDislikes = updatedDislikes.filter((id) => id !== userId);
  }

  if (reaction === 'like') {
    updatedLikes.push(userId);
  } else if (reaction === 'dislike') {
    updatedDislikes.push(userId);
  }

  return {
    ...comment,
    likes: updatedLikes,
    dislikes: updatedDislikes,
  };
};