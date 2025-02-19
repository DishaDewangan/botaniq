import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 });
    }

    // Convert image to base64
    const bytes = await (image as File).arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


    // Send request with better prompt
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { 
              text: `Identify this plant and return a JSON response with the following structure:
              {
                "common_name": "Common Name",
                "scientific_name": "Scientific Name",
                "description": "Short description",
                "care_tips": ["Tip 1", "Tip 2", "Tip 3"]
              }`
            },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }
      ]
    });

    const response = await result.response;
    const text = await response.text();

    console.log("API Response:", text); // Debugging

    // Ensure response is valid JSON
    // Clean the response by removing Markdown formatting (backticks)
const cleanedText = text.replace(/```json|```/g, "").trim();

const plantData = JSON.parse(cleanedText);


    return NextResponse.json(plantData);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Failed to identify plant" }, { status: 500 });
  }
}
