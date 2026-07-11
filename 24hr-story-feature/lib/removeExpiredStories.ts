import { Story } from "@/types/story";

export const removeExpiredStories = (stories: Story[]) => {
  if (stories.length === 0) {
    return [];
  }

  const now = Date.now();
  const expiredDuration = 1000 * 60 * 60 * 24;
  const existedStories = stories.filter(
    (story) => story.createdAt + expiredDuration > now,
  );

  return existedStories;
};
