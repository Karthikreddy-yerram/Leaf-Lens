export async function translateText(content: Record<string, any>, targetLang: string): Promise<Record<string, any>> {
  try {
    if (!targetLang || targetLang === "en") {
      return content
    }

    if (!content || typeof content !== "object" || Object.keys(content).length === 0) {
      console.error("Invalid content provided for translation")
      return content
    }

    console.log("Sending for translation:", { content, targetLang })

    const response = await fetch("http://localhost:5000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        language: targetLang,
      }),
      signal: AbortSignal.timeout(20000),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Translation API error:", errorText)
      throw new Error(`Translation failed: ${response.status} ${errorText}`)
    }

    const data = await response.json()

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      console.error("Unexpected translation response format:", data)
      throw new Error("Unexpected translation response format")
    }

    if (Object.keys(data).length === 0) {
      console.error("Empty translation response")
      return content
    }

    console.log("Translation successful:", data)
    return data
  } catch (error) {
    console.error("🌐 Translation error:", error)
    return content
  }
} 