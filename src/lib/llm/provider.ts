import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";
import { generateObject, generateText } from "ai";
import {
  biographySectionsSchema,
  type BiographySections,
} from "./schemas";
import {
  buildGenerateBiographyPrompt,
  buildRewriteSectionPrompt,
  GENERATE_BIOGRAPHY_SYSTEM_PROMPT,
} from "./prompts";

export const GEMINI_MODEL_FLASH = "gemini-2.5-flash";

export const GEMINI_MODEL_FLASH_LITE = "gemini-2.5-flash-lite";

function getGoogleProvider() {
  return createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });
}

function getGenerationModel(): LanguageModel {
  const modelId = process.env.GEMINI_MODEL ?? GEMINI_MODEL_FLASH;
  return getGoogleProvider()(modelId);
}

function getRewriteModel(): LanguageModel {
  const modelId =
    process.env.GEMINI_MODEL_LITE ?? GEMINI_MODEL_FLASH_LITE;
  return getGoogleProvider()(modelId);
}

export async function generateBiographyFromText(
  sourceText: string
): Promise<BiographySections> {
  const { object } = await generateObject({
    model: getGenerationModel(),
    schema: biographySectionsSchema,
    system: GENERATE_BIOGRAPHY_SYSTEM_PROMPT,
    prompt: buildGenerateBiographyPrompt(sourceText),
  });

  return object;
}

export async function rewriteBiographySection(
  sectionName: string,
  currentText: string,
  userInstruction: string
): Promise<string> {
  const { text } = await generateText({
    model: getRewriteModel(),
    system:
      "You rewrite biography sections based on user direction. Return only the rewritten section text.",
    prompt: buildRewriteSectionPrompt(
      sectionName,
      currentText,
      userInstruction
    ),
  });

  return text.trim();
}
