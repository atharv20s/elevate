// OpenRouter LLM Configuration
// Using environment variables for security, with fallback to hardcoded key

const getApiKey = (): string => {
  if (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_OPENROUTER_API_KEY) {
    return import.meta.env.VITE_OPENROUTER_API_KEY;
  }
  console.warn("VITE_OPENROUTER_API_KEY is not set. Chat functionality will not work.");
  return "";
};

const getModel = (): string => {
  if (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_OPENROUTER_MODEL) {
    return import.meta.env.VITE_OPENROUTER_MODEL;
  }
  return "openai/gpt-4o-mini";
};

const getBaseUrl = (): string => {
  if (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_OPENROUTER_BASE_URL) {
    return import.meta.env.VITE_OPENROUTER_BASE_URL;
  }
  return "https://openrouter.ai/api/v1";
};

export const LLM_CONFIG = {
  apiKey: getApiKey(),
  baseUrl: getBaseUrl(),
  model: getModel(),
  maxTokens: 700,
  temperature: 0.8,
};

export const getOpenRouterHeaders = () => ({
  "Authorization": `Bearer ${LLM_CONFIG.apiKey}`,
  "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://bns-legal.com",
  "X-Title": "BNS Legal Assistant",
  "Content-Type": "application/json",
});
