import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function analyzePlantImage(base64Image: string): Promise<string> {
    const model = 'gemini-2.5-flash-image';

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
        },
    };

    const textPart = {
        text: `Analiza esta imagen de una planta de cannabis y proporciona un informe detallado en formato Markdown. 
        Incluye lo siguiente:
        1.  **Salud General:** Evalúa la salud de la planta (e.g., saludable, estresada, deficiente). Describe cualquier signo visible como decoloración, manchas, hojas caídas, etc.
        2.  **Etapa Sugerida:** Basado en la apariencia, sugiere la etapa de crecimiento más probable (Plántula, Vegetativo, Floración Temprana, Floración Tardía, Lista para Cosecha). Usa este formato exacto en una línea separada: "Etapa Sugerida: [Nombre de la Etapa]".
        3.  **Posibles Problemas:** Identifica posibles plagas, enfermedades o deficiencias nutricionales. Sé específico si es posible.
        4.  **Recomendaciones:** Ofrece 2-3 recomendaciones breves y accionables basadas en tu análisis.
        
        Responde en español.`
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing plant image with Gemini:", error);
        throw new Error("No se pudo conectar con el servicio de IA. Por favor, inténtalo de nuevo más tarde.");
    }
}


export async function getSunlightAnalysis(
    latitude: number,
    season: string,
    selectedDate: Date,
    daylight: number,
    sunrise: string,
    sunset: string
): Promise<string> {
    const model = 'gemini-2.5-flash';

    const prompt = `
        Eres un experto en el cultivo de cannabis. Proporciona un análisis y recomendaciones basadas en los siguientes datos solares para una ubicación específica. Responde en español y usa formato Markdown.
        
        **Datos de la Ubicación y Fecha:**
        -   **Latitud:** ${latitude.toFixed(4)}
        -   **Temporada/Tipo de Cultivo:** ${season}
        -   **Fecha Seleccionada:** ${selectedDate.toLocaleDateString('es-ES')}
        -   **Amanecer (hora local):** ${sunrise}
        -   **Atardecer (hora local):** ${sunset}
        -   **Total de Horas de Luz Solar Directa:** ${daylight.toFixed(2)} horas
        
        **Análisis Requerido:**
        1.  **Evaluación General:** ¿Son estas condiciones de luz adecuadas para el cannabis en esta fecha? Considera la etapa de crecimiento típica.
        2.  **Impacto en el Crecimiento:** Explica brevemente cómo esta cantidad de luz solar podría afectar a una planta de cannabis. ¿Favorece la etapa vegetativa o la floración?
        3.  **Recomendaciones Específicas para Hoy:**
            -   Ofrece 2-3 consejos prácticos para el cultivador basados en la duración del día y las horas de amanecer/atardecer.
            -   Por ejemplo: ¿deberían considerar luz suplementaria? ¿es un buen día para podar? ¿hay algún riesgo asociado con el amanecer/atardecer temprano/tardío?
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error getting sunlight analysis from Gemini:", error);
        throw new Error("No se pudo conectar con el servicio de IA. Por favor, inténtalo de nuevo más tarde.");
    }
}
