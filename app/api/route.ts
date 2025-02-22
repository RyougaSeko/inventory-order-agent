import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    // Convert base64 image to bytes
    const base64Data = image.split(",")[1];
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              item_id: { type: SchemaType.INTEGER },
              name: { type: SchemaType.STRING },
              category: {
                type: SchemaType.STRING,
                enum: ["Produce", "Dairy", "Grains"],
              },
              quantity: { type: SchemaType.INTEGER },
              unit: {
                type: SchemaType.STRING,
                enum: ["pieces", "cartons", "bags"],
              },
              supplier: { type: SchemaType.STRING },
              cost_per_unit: { type: SchemaType.NUMBER },
              expiration_date: { type: SchemaType.STRING },
              storage_location: { type: SchemaType.STRING },
            },
            required: ["item_id", "name", "category", "quantity", "unit"],
          },
        },
      },
    });

    const prompt = `Analyze this image of a pantry and count the following items:
    - Tomatoes
    - Cartons of milk
    - Cartons of eggs
    - Bags of rice
    
    Compare against these minimum requirements:
    - 3 tomatoes
    - 2 cartons of milk
    - 4 cartons of egg
    - 3 bags of rice`;

    // Create image part from base64 data
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    console.log(text);
    // Try to parse the response text directly, if it fails, handle the error gracefully
    try {
      return NextResponse.json(JSON.parse(text));
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", text);
      return NextResponse.json(
        { error: "Invalid response format from AI model" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
