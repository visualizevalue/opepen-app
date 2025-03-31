const useGemini = () => {
  const generateImage = async (prompt: string, imageUrl: string) => {
    try {
      // If the imageUrl is already a base64 string, use it directly
      let base64Image = imageUrl
      if (!imageUrl.startsWith('data:')) {
        // Otherwise fetch the image and convert to base64
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.status}`)
        }
        const blob = await imageResponse.blob()
        base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(blob)
        })
      }

      // Extract the base64 data part if it's a data URL
      const base64Data = base64Image.startsWith('data:')
        ? base64Image.split(',')[1]
        : base64Image

      const response = await $fetch('/api/generate', {
        method: 'POST',
        body: {
          prompt,
          imageData: base64Data,
        },
      })

      return response
    } catch (error) {
      console.error('Error generating with Gemini:', error)
      throw error
    }
  }

  return {
    generateImage,
  }
}

export default useGemini
