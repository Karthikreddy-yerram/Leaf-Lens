
export interface PlantIdentificationResult {
  plantName: string;
  confidence: number;
}

export async function identifyPlant(imageFile: File): Promise<PlantIdentificationResult> {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch("http://127.0.0.1:5000/identify", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to identify plant: ${errorText}`);
    }

    const data = await response.json();

    if (!data.class_name || data.confidence === undefined) {
      throw new Error("Invalid response from server");
    }

    return {
      plantName: data.class_name,
      confidence: data.confidence,
    };
  } catch (error: any) {
    console.error("Plant identification error:", error.message || error);
    throw new Error("Plant identification failed. Please try again.");
  }
}
