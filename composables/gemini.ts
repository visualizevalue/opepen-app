const useGemini = () => {
  const config = useRuntimeConfig();

  const generateImage = async (prompt: string, imageUrl: string) => {
    try {
      // If the imageUrl is already a base64 string, use it directly
      let base64Image = imageUrl;
      if (!imageUrl.startsWith('data:')) {
        // Otherwise fetch the image and convert to base64
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.status}`);
        }
        const blob = await imageResponse.blob();
        base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }

      // Extract the base64 data part if it's a data URL
      const base64Data = base64Image.startsWith('data:') 
        ? base64Image.split(',')[1] 
        : base64Image;

      const requestBody = {
        contents: [{
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/png',
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          responseModalities: ['Text', 'Image']
        }
      };

      console.log('Sending request to Gemini API:', {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${config.public.geminiApiKey}`,
        prompt,
        imageUrlLength: imageUrl.length,
        base64DataLength: base64Data.length
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${config.public.geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const result = await response.json();
      
      // Extract the generated image from the response
      if (!result.candidates?.[0]?.content?.parts) {
        throw new Error('Invalid response structure');
      }
      const parts = result.candidates[0].content.parts;
      const generatedImage = parts.find((part: any) => part.inlineData?.mimeType === 'image/png')?.inlineData;
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