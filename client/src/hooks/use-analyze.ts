import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type AnalyzeRequest } from "@shared/schema";

export function useAnalyzeText() {
  return useMutation({
    mutationFn: async (data: AnalyzeRequest) => {
      const validated = api.analyze.analyzeText.input.parse(data);
      const res = await fetch(api.analyze.analyzeText.path, {
        method: api.analyze.analyzeText.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to analyze text");
      return api.analyze.analyzeText.responses[200].parse(await res.json());
    },
  });
}
