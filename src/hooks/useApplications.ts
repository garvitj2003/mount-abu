import { useQuery } from "@tanstack/react-query";
import { ApplicationService } from "@/services/applicationService";
import { type components } from "@/types/api";

type ApplicationFlags = components["schemas"]["ApplicationFlags"];

export function useApplications(params: { flag: ApplicationFlags; citizen_user_id?: number; offset?: number; limit?: number }) {
  return useQuery({
    queryKey: ["applications", params],
    queryFn: () => ApplicationService.getApplications(params),
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
  });
}
