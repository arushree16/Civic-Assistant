import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertIssue, type Issue } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useIssues() {
  return useQuery({
    queryKey: [api.issues.list.path],
    queryFn: async () => {
      const res = await fetch(api.issues.list.path);
      if (!res.ok) throw new Error("Failed to fetch issues");
      return api.issues.list.responses[200].parse(await res.json());
    },
  });
}

export function useIssue(id: number) {
  return useQuery({
    queryKey: [api.issues.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.issues.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch issue");
      return api.issues.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertIssue) => {
      const validated = api.issues.create.input.parse(data);
      const res = await fetch(api.issues.create.path, {
        method: api.issues.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to report issue");
      return api.issues.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.issues.list.path] });
      toast({
        title: "Issue Reported",
        description: "Your issue has been successfully submitted to the department.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useSimulateUpdate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.issues.simulateUpdate.path, { id });
      const res = await fetch(url, {
        method: api.issues.simulateUpdate.method,
      });
      if (!res.ok) throw new Error("Failed to simulate update");
      return api.issues.simulateUpdate.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.issues.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.issues.get.path, data.id] });
      toast({
        title: "Status Updated",
        description: `Issue status changed to: ${data.status}`,
      });
    },
  });
}
