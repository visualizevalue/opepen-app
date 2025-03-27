import { GoogleGenerativeAI } from '@google/generative-ai';

const useGemini = () => {
  const config = useRuntimeConfig();
  const genAI = new GoogleGenerativeAI(config.public.geminiApiKey as string);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp-image-generation" });

  const generateImage = async (prompt: string, imageUrl: string) => {
    try {
      // Fetch the image and convert to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

      const contents = [{
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/png',
              data: (base64Image as string).split(',')[1]
            }
          }
        ]
      }];

      const result = await model.generateContent({
        contents,
        config: {
          responseModalities: ['Text', 'Image']
        }
      } as any);

      // Extract the generated image from the response
      if (!result.response?.candidates?.[0]?.content?.parts) {
        throw new Error('Invalid response structure');
      }
      const generatedImage = result.response.candidates[0].content.parts.find((part: any) => part.inlineData)?.inlineData;
      if (!generatedImage) throw new Error('No image generated');

      return generatedImage.data;
    } catch (error) {
      console.error('Error generating with Gemini:', error);
      throw error;
    }
  };

  return {
    generateImage
  };
};

export default useGemini; 