export async function translateText(content: Record<string, any>, targetLang: string): Promise<Record<string, any>> {
  try {
    if (!targetLang || targetLang === "en") {
      return content
    }

    const response = await fetch("http://127.0.0.1:5000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        language: targetLang,
      }),
    })

    if (!response.ok) {
      throw new Error("Translation failed")
    }

    const data = await response.json()

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error("Unexpected translation response")
    }

    return data
  } catch (error) {
    console.error("🌐 Translation error:", error)
    throw new Error("Failed to translate plant info")
  }
}
