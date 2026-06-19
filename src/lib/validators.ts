import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z
  .object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;

export const biographyFormSchema = z.object({
  subject_name: z.string().optional().nullable(),
  personal_overview: z.string().optional().nullable(),
  origin_story: z.string().optional().nullable(),
  career_journey: z.string().optional().nullable(),
  current_focus: z.string().optional().nullable(),
  areas_of_expertise: z.string().optional().nullable(),
  notable_achievements: z.string().optional().nullable(),
  career_highlights: z.string().optional().nullable(),
  personal_interests: z.string().optional().nullable(),
});

export type BiographyFormValues = z.infer<typeof biographyFormSchema>;

export const generateUrlSchema = z.object({
  source_url: z.string().url("Enter a valid URL"),
});

export const generateTextSchema = z.object({
  source_text: z
    .string()
    .min(1, "Paste biography or resume text")
    .max(100000, "Maximum 100,000 characters"),
});

export type GenerateUrlValues = z.infer<typeof generateUrlSchema>;
export type GenerateTextValues = z.infer<typeof generateTextSchema>;
