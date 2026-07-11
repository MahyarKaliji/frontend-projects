import { useStoryStore } from "@/store/storyStore";
import DraggableScrollContainer from "./DraggableScrollbarContainer"; // {  useDrag}
import { PreviewItem } from "./PreviewItem";

const PreviewStories = () => {
  const stories = useStoryStore((state) => state.stories);

  return (
    <DraggableScrollContainer className="flex items-center gap-2">
      {stories.map((story) => (
        <PreviewItem story={story} key={story.id} />
      ))}
    </DraggableScrollContainer>
  );
};

export default PreviewStories;
