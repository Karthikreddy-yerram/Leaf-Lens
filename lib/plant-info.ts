export async function fetchPlantInfo(plantName: string) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/plant-info?name=${encodeURIComponent(plantName)}`);

    if (!response.ok) {
      throw new Error("Failed to fetch plant information");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching plant info:", error);
    throw new Error("Failed to fetch plant information");
  }
}
