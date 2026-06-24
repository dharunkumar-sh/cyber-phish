import { z } from "zod";

const envSchema = z.object({
  // Neon database (required)
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .startsWith("postgresql", "DATABASE_URL must be a PostgreSQL connection string"),

  // OpenRouter AI (optional — falls back to template explanations)
  OPENROUTER_API_KEY: z.string().optional().default(""),

  // Threat intelligence providers (optional — features degrade gracefully)
  VIRUSTOTAL_API_KEY: z.string().optional().default(""),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((e) => `  • ${e.path.map(String).join(".")}: ${e.message}`)
      .join("\n");

    console.error(`\n🚨 [CyberPhish] Missing environment variables:\n${missing}\n`);

    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment configuration. See logs above.");
    }

    return process.env as unknown as z.infer<typeof envSchema>;
  }

  return parsed.data;
}

export const env = validateEnv();

export const config = {
  db: {
    url: env.DATABASE_URL,
  },
  ai: {
    openRouterApiKey: env.OPENROUTER_API_KEY,
    model: "anthropic/claude-3-haiku",
    baseURL: "https://openrouter.ai/api/v1",
    hasKey: !!env.OPENROUTER_API_KEY,
  },
  threatIntel: {
    virusTotalApiKey: env.VIRUSTOTAL_API_KEY,
    hasVirusTotal: !!env.VIRUSTOTAL_API_KEY,
  },
  app: {
    url: env.NEXT_PUBLIC_APP_URL,
    nodeEnv: env.NODE_ENV,
    isDev: env.NODE_ENV === "development",
    isProd: env.NODE_ENV === "production",
  },
} as const;
