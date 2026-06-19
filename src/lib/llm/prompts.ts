export const GENERATE_BIOGRAPHY_SYSTEM_PROMPT = `You are a professional biography writer. Given source material about a person, produce a structured biography dossier.

Rules:
- Use only information present in or reasonably inferable from the source.
- For each section, mark whether content is primarily "known" (directly stated) or "inferred" (synthesized or extrapolated) in section_provenance.
- Write in professional but accessible tone.
- Distinguish past from present in current_focus.
- Do not speculate about private life in personal_interests.
- Return valid JSON matching the required schema.`;

export function buildGenerateBiographyPrompt(sourceText: string): string {
  return `Source material:\n\n${sourceText}\n\nGenerate a complete structured biography with all required sections.`;
}

export function buildRewriteSectionPrompt(
  sectionName: string,
  currentText: string,
  userInstruction: string
): string {
  return `Rewrite the following biography section.

Section: ${sectionName}
Current text:
${currentText}

User instruction:
${userInstruction}

Return only the rewritten section text as plain text, no markdown fences.`;
}
