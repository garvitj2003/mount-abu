export const validateImageAspectRatio = (file: File, targetRatio: number = 4/3, tolerance: number = 0.1): Promise<boolean> => {
  return new Promise((resolve) => {
    // Using URL.createObjectURL is generally more efficient than FileReader for this purpose
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      // Use naturalWidth/Height to get the actual dimensions of the image
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const ratio = width / height;
      
      const isValid = Math.abs(ratio - targetRatio) <= tolerance;
      
      console.log(`Image validation: ${width}x${height}, ratio: ${ratio.toFixed(4)}, target: ${targetRatio.toFixed(4)}, valid: ${isValid}`);
      
      // Clean up the object URL
      URL.revokeObjectURL(url);
      resolve(isValid);
    };
    
    img.onerror = () => {
      console.error("Failed to load image for aspect ratio validation");
      URL.revokeObjectURL(url);
      resolve(false);
    };
    
    img.src = url;
  });
};
