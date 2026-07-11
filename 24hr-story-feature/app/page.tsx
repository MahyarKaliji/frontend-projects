"use client";

import PreviewStories from "@/components/PreviewStories";
import { processImage } from "@/lib/processImage";
import { useStoryStore } from "@/store/storyStore";
import { Story } from "@/types/story";
import { ChangeEvent, useRef } from "react";

export default function Home() {
  // const [stories, setStories] = useState<Story[]>(() => {
  //   const stored = getStories();
  //   return removeExpiredStories(stored);
  // });

  // const stories = useStoryStore((state) => state.stories);
  // const setStories = useStoryStore((state) => state.setStories);
  const addStory = useStoryStore((state) => state.addStory);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   saveStories(stories);
  // }, [stories]);

  const handlePick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // Reset the input value to allow re-uploading the same file

    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const dataUrl = await processImage(file);

    const newStory: Story = {
      id: crypto.randomUUID(),
      image: dataUrl,
      createdAt: Date.now(),
    };

    addStory(newStory);
  };

  return (
    <div className="p-5">
      <header className="flex items-center gap-2 border-2 rounded-md p-4 w-10/12 mx-auto  flex-nowrap overflow-x-auto scrollbar-none">
        <input
          type="file"
          name=""
          id=""
          className="hidden"
          accept="image/*"
          ref={inputRef}
          onChange={handleImageChange}
        />
        <button
          className="size-16 border-2 rounded-full border-mauve-400 cursor-pointer shrink-0"
          onClick={handlePick}
        >
          <div className="flex items-center justify-center min-h-0 text-2xl">
            <svg
              className="size-4 fill-mauve-400"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.6875 5.75C11.6875 6.24219 11.2773 6.65234 10.8125 6.65234H6.875V10.5898C6.875 11.0547 6.46484 11.4375 6 11.4375C5.50781 11.4375 5.125 11.0547 5.125 10.5898V6.65234H1.1875C0.695312 6.65234 0.3125 6.24219 0.3125 5.75C0.3125 5.28516 0.695312 4.90234 1.1875 4.90234H5.125V0.964844C5.125 0.472656 5.50781 0.0625 6 0.0625C6.46484 0.0625 6.875 0.472656 6.875 0.964844V4.90234H10.8125C11.2773 4.875 11.6875 5.28516 11.6875 5.75Z"
                fillOpacity="0.5"
              />
            </svg>
          </div>
        </button>

        <PreviewStories />
      </header>

      <div
        className="w-fit border-2 border-amber-800 p-4"
        onPointerDown={() => console.log("Pointer Down")}
        onPointerUp={() => console.log("Pointer Up")}
      >
        Pointer Test
      </div>
    </div>
  );
}
