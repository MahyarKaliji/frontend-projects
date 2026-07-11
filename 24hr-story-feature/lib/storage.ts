import { Story } from "@/types/story";

export const getStories = (): Story[] => {
  if (typeof window === "undefined") return [];

  const stories: Story[] = JSON.parse(localStorage.getItem("stories") || "[]");

  return stories;
};

export const saveStories = (stories: Story[]): void => {
  localStorage.setItem("stories", JSON.stringify(stories));
};
