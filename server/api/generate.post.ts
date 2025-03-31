export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { prompt, imageData } = body

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/png',
              data: imageData,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['Text', 'Image'],
    },
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${config.geminiApiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw createError({
      statusCode: response.status,
      message: `Gemini API error: ${errorText}`,
    })
  }

  const result = await response.json()

  if (!result.candidates?.[0]?.content?.parts) {
    throw createError({
      statusCode: 500,
      message: 'Invalid response structure from Gemini API',
    })
  }

  const parts = result.candidates[0].content.parts
  const generatedImage = parts.find(
    (part: any) => part.inlineData?.mimeType === 'image/png',
  )?.inlineData
  if (!generatedImage) {
    throw createError({
      statusCode: 500,
      message: 'No image generated',
    })
  }

  return generatedImage.data
})
