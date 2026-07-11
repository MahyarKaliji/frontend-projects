import { useDragClick } from "@/hooks/useDragClick";
import { Story } from "@/types/story";
import { useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";
import { useStoryStore } from "@/store/storyStore";

export const PreviewItem = ({ story }: { story: Story }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);

  const stories = useStoryStore((state) => state.stories);
  const currentStory = useStoryStore((state) => state.currentStory);
  const currentIndex = useStoryStore((state) => state.currentIndex);
  const resetStory = useStoryStore((state) => state.resetStory);
  const setCurrentStoryByIndex = useStoryStore(
    (state) => state.setCurrentStoryByIndex,
  );
  const nextStory = useStoryStore((state) => state.nextStory);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      console.log(story.id);
      // console.log(nextStory());
      nextStory();
    }, 3000);
  };

  const handleClose = () => {
    console.log("currentStory - handleClose", currentStory);
    setModalOpen(false);
    resetStory();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (currentStory && currentStory.id === story.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsViewing(true);
    }
  }, [currentStory, story.id]);

  useEffect(() => {
    if (
      modalOpen &&
      stories.length > 0 &&
      currentIndex === stories.length - 1
    ) {
      console.log("Last Item");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleClose();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, modalOpen, stories]);

  const handleRealClick = () => {
    setModalOpen(true);
    const index = stories.findIndex((s) => s.id === story.id);
    console.log(index);
    setCurrentStoryByIndex(index);
    startTimer();
  };

  const dragProps = useDragClick(handleRealClick);

  return (
    <>
      <div
        className={`size-16 rounded-full overflow-hidden shrink-0 border-2 ${isViewing ? "border-gray-500" : "border-rose-600"}`}
        {...dragProps}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={story.image} alt={story.image} />
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={handleClose} title="Test">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={currentStory?.image} alt="" width="100%" />
      </Modal>
    </>
  );
};
