import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CheckedItems, Task } from "../backend.d";

export function useIsDataPersisted() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isDataPersisted"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isUserDataPersisted();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLoadUserData() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.loadUserData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      checkedItems: CheckedItems;
      monthlyIncome: number;
      dailyTasks: Task[];
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.saveUserData(
        args.checkedItems,
        BigInt(Math.round(args.monthlyIncome)),
        args.dailyTasks,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
}
