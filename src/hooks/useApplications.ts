import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationService } from "@/services/applicationService";
import { type components } from "@/types/api";

type ApplicationFlags = components["schemas"]["ApplicationFlags"];
type WorkflowActionRequest = components["schemas"]["WorkflowActionRequest"];

export function useApplications(params: { flag: ApplicationFlags; citizen_user_id?: number; offset?: number; limit?: number }) {
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

export function useApplicationComments(applicationId: number) {
  return useQuery({
    queryKey: ["application-comments", applicationId],
    queryFn: () => ApplicationService.getComments(applicationId),
    enabled: !!applicationId,
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
