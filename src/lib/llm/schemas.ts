import { z } from "zod";

export const biographySectionsSchema = z.object({
  subject_name: z.string().nullable(),
  personal_overview: z.string().nullable(),
  origin_story: z.string().nullable(),
  career_journey: z.string().nullable(),
  current_focus: z.string().nullable(),
  areas_of_expertise: z.string().nullable(),
  notable_achievements: z.string().nullable(),
  career_highlights: z.string().nullable(),
  personal_interests: z.string().nullable(),
  section_provenance: z
    .object({
      subject_name: z.enum(["known", "inferred"]).optional(),
      personal_overview: z.enum(["known", "inferred"]).optional(),
      origin_story: z.enum(["known", "inferred"]).optional(),
      career_journey: z.enum(["known", "inferred"]).optional(),
      current_focus: z.enum(["known", "inferred"]).optional(),
      areas_of_expertise: z.enum(["known", "inferred"]).optional(),
      notable_achievements: z.enum(["known", "inferred"]).optional(),
      career_highlights: z.enum(["known", "inferred"]).optional(),
      personal_interests: z.enum(["known", "inferred"]).optional(),
    })
    .optional(),
});

export type BiographySections = z.infer<typeof biographySectionsSchema>;

export const BIOGRAPHY_SECTION_FIELDS = [
  { key: "subject_name", label: "Subject Name", type: "input" as const },
  { key: "personal_overview", label: "Personal Overview", type: "textarea" as const },
  { key: "origin_story", label: "Origin Story", type: "textarea" as const },
  { key: "career_journey", label: "Career Journey", type: "textarea" as const },
  { key: "current_focus", label: "Current Focus", type: "textarea" as const },
  { key: "areas_of_expertise", label: "Areas of Expertise", type: "textarea" as const },
  { key: "notable_achievements", label: "Notable Achievements", type: "textarea" as const },
  { key: "career_highlights", label: "Career Highlights", type: "textarea" as const },
  { key: "personal_interests", label: "Personal Interests", type: "textarea" as const },
] as const;

export type BiographySectionKey = (typeof BIOGRAPHY_SECTION_FIELDS)[number]["key"];
