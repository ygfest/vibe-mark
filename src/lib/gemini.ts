import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateLogo = async (base64Sketch: string) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ inlineData: { data: base64Sketch, mimeType: "image/png" } }],
      },
    ],
  });

  return result.response.text();
};
