import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CityProfileService } from "@/services/cityProfileService";
import { type components } from "@/types/api";

type CityProfileUpdate = components["schemas"]["CityProfileUpdate"];

export const useCityProfile = () => {
  return useQuery({
    queryKey: ["city-profile"],
    queryFn: () => CityProfileService.getLatest(),
  });
};

export const useUpdateCityProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CityProfileUpdate) => CityProfileService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["city-profile"] });
    },
  });
};

export const useCityProfileHistory = () => {
  return useQuery({
    queryKey: ["city-profile-history"],
    queryFn: () => CityProfileService.getHistory(),
  });
};
