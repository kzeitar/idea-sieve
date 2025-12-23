import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/lib/api-client";

export function useStatsApi() {
	return useQuery({
		queryKey: ["stats"],
		queryFn: () => statsApi.get(),
	});
}
