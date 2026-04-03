import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient,SiteAnalysis } from "../lib/api";

export function useRenewableSites(){
    return useQuery({
        queryKey: ['renewable-sites'],
        queryFn: () => apiClient.getRenewableSites(),
    });
}

export function useRenewableSite(id: string) {
    return useQuery({
        queryKey: ['renewable-site',id],
        queryFn: () => apiClient.getRenewableSite(id),
    });
}

export function useCreateSite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: apiClient.createRenewableSite.bind(apiClient),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['renewable-sites']});
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats']});
        },
    });
}

export function useDeleteSite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.deleteSite(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['renewable-sites']});
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats']});
        },
    });
}

export function useAiSuggestions() {
    return useQuery({
        queryKey: ['ai-suggestions'],
        queryFn: () => apiClient.getAiSuggestions(),
    });
}

export function useWindResources() {
    return useQuery({
        queryKey: ['wind-resources'],
        queryFn: () => apiClient.getWindResources(),
    });
}

export function useSolarResources() {
    return useQuery({
        queryKey: ['solar-resources'],
        queryFn: () => apiClient.getSolarResources(),
    });
}

export function useGridInfrastructure() {
    return useQuery({
        queryKey: ['grid-infrastructure'],
        queryFn : () => apiClient.getGridInfrastructure(),
    });
}

export function useDemandCenters() {
  return useQuery({
    queryKey: ['demand-centers'],
    queryFn: () => apiClient.getDemandCenters(),
  });
}
 
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.getDashboardStats(),
  });
}
 
export function useAnalyzeSite() {
  return useMutation({
    mutationFn: apiClient.analyzeSite.bind(apiClient),
  });
}

export function useSaveSite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      name: string;
      type: 'wind' | 'solar' | 'hybrid';
      latitude: number;
      longitude: number;
      capacity: number;
      analysis: SiteAnalysis;
    }) => apiClient.saveSite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renewable-sites'] });
    },
  });
}