import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationService } from "@/services/applicationService";
import { type components } from "@/types/api";

type ApplicationFlags = components["schemas"]["ApplicationFlags"];
type WorkflowActionRequest = components["schemas"]["WorkflowActionRequest"];

export function useApplications(params: { 
  flag: ApplicationFlags; 
  citizen_user_id?: number; 
  offset?: number; 
  limit?: number;
  search?: string;
  ward_id?: number;
  property_usage?: string;
  jurisdiction_zone?: string;
}) {
  return useQuery({
    queryKey: ["applications", params],
    queryFn: () => ApplicationService.getApplications(params),
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
  });
}

export function useApplication(id: number) {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => ApplicationService.getApplication(id),
    staleTime: 30 * 1000,
    enabled: !!id,
  });
}

export function useWorkflowAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkflowActionRequest }) => 
      ApplicationService.workflowAction(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useAddPhaseMaterials() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: components["schemas"]["PhaseMaterialEntry"][] }) => 
      ApplicationService.addPhaseMaterials(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
    },
  });
}

export function useUpdatePhaseStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ 
      applicationId, 
      phase, 
      status 
    }: { 
      applicationId: number; 
      phase: number; 
      status: components["schemas"]["ApplicationPhaseStatus"] 
    }) => ApplicationService.updatePhaseStatus(applicationId, phase, status),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ["token"] });
      queryClient.invalidateQueries({ queryKey: ["application", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
    },
  });
}

export function useApplicationComments(applicationId: number, options?: { enabled?: boolean }) {
  return useQuery<components["schemas"]["CommentResponse"][]>({
    queryKey: ["application-comments", applicationId],
    queryFn: () => ApplicationService.getComments(applicationId),
    enabled: !!applicationId,
    ...options,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: components["schemas"]["CommentRequest"] }) => 
      ApplicationService.addComment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["application-comments", id] });
    },
  });
}

export function useOrganizationSuggestions(propertyUsage: string, options?: { enabled?: boolean }) {
  return useQuery<string[]>({
    queryKey: ["organization-suggestions", propertyUsage],
    queryFn: () => ApplicationService.getOrganizationSuggestions(propertyUsage),
    enabled: !!propertyUsage && propertyUsage !== "DOMESTIC",
    ...options,
  });
}
