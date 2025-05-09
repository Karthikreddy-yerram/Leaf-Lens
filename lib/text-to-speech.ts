export function generateFullTextForTTS(content: any): string {
  let text = `${content.description}\n`;

  if (content.medicinalUses && content.medicinalUses.length > 0) {
    text += "औषधीय उपयोग:\n";
    content.medicinalUses.forEach((use: string, index: number) => {
      text += `${index + 1}. ${use}\n`;
    });
  }

  if (content.regions && content.regions.length > 0) {
    text += `क्षेत्र: ${content.regions.join(", ")}\n`;
  }

  if (content.family) {
    text += `परिवार: ${content.family}\n`;
  }

  if (content.properties) {
    text += "गुण:\n";
    if (Array.isArray(content.properties)) {
      content.properties.forEach((p: string, i: number) => {
        text += `${i + 1}. ${p}\n`;
      });
    } else {
      for (const key in content.properties) {
        text += `${key}: ${content.properties[key]}\n`;
      }
    }
  }

  return text.trim();
}
