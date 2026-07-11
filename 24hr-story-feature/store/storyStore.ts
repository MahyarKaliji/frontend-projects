import { removeExpiredStories } from "@/lib/removeExpiredStories";
import { getStories, saveStories } from "@/lib/storage";
import { Story } from "@/types/story";
import { create } from "zustand";

interface StoryStore {
  stories: Story[];
  currentStory: Story | null;
  currentIndex: number;

  setStories: (newStories: Story[]) => void;
  setCurrentStory: (newStory: Story) => void;
  resetStory: () => void;
  addStory: (newStory: Story) => void;
  setCurrentStoryByIndex: (index: number) => void;
  nextStory: () => void;
}

export const useStoryStore = create<StoryStore>((set) => ({
  stories: (() => {
    const stored = getStories();
    return removeExpiredStories(stored);
  })(),
  currentStory: null,
  currentIndex: 0,

  setStories: (newStories) => set({ stories: newStories }),

  addStory: (newStory) =>
    set((state) => ({ stories: [newStory, ...state.stories] })),

  setCurrentStory: (newStory: Story) => set({ currentStory: newStory }),

  resetStory: () => set(() => ({ currentStory: null })),

  nextStory: () =>
    set((state) => {
      const nextIndex = state.currentIndex + 1;
      console.log("Next Index: ", nextIndex);
      if (nextIndex >= state.stories.length) {
        return state;
      }
      return {
        currentIndex: nextIndex,
        currentStory: state.stories[nextIndex],
      };
    }),
  setCurrentStoryByIndex: (index) =>
    set((state) => {
      const story = state.stories[index] || null;
      return {
        currentIndex: index,
        currentStory: story,
      };
    }),
}));

useStoryStore.subscribe((state) => saveStories(state.stories));
