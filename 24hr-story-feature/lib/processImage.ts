export const processImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const MAX_WIDTH = 1080;
      const MAX_HEIGHT = 1920;

      const widthRatio = MAX_WIDTH / img.width;
      const heightRatio = MAX_HEIGHT / img.height;

      const ratio = Math.min(widthRatio, heightRatio, 1); // Ensure the ratio does not exceed 1

      const newWidth = Math.round(img.width * ratio);
      const newHeight = Math.round(img.height * ratio);

      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(imageUrl);
        reject(new Error("Canvas context not available"));
        return;
      }

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.7); // Adjust quality as needed

      URL.revokeObjectURL(imageUrl);
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
};
