import { useRouter, useSearchParams } from "next/navigation";

import useUrl from "@/hooks/useUrl";

export default function useFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const repoName = searchParams.get("repo")?.split("&") ?? [];
  const state = searchParams.get("state") ?? "open";

  const { dynamicSet } = useUrl();

  const handleRepo = (key: string) => {
    if (repoName.includes(key)) {
      const newRepo = repoName.filter((repoKey) => key !== repoKey);
      if (newRepo.length === 0)
        router.replace(
          dynamicSet({ repo: newRepo.join("&") }, undefined, {
            delete: ["repo"],
          })
        );
      else router.replace(dynamicSet({ repo: newRepo.join("&") }));
    } else {
      const newRepo = [key];
      router.replace(dynamicSet({ repo: newRepo.join("&") }));
    }
  };

  const handleState = (state: string) => {
    router.replace(dynamicSet({ state }));
  };

  return {
    repoName,
    state,
    handleRepo,
    handleState,
  };
}
