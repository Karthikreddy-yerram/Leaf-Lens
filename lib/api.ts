const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

export async function identifyPlant(imageFile: File) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${BASE_URL}/identify`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Plant identification failed");
  }

  return await response.json();
}

export async function translateText(text: string, targetLang: string) {
  const response = await fetch(`${BASE_URL}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, target_lang: targetLang }),
  });

  if (!response.ok) {
    throw new Error("Translation failed");
  }

  return await response.json();
}

export async function getTTS(text: string, lang: string) {
  const response = await fetch(`${BASE_URL}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, lang }),
  });

  if (!response.ok) {
    throw new Error("TTS failed");
  }

  const data = await response.json();
  return `${BASE_URL}/static/audio/${data.audio_file}`;
}
