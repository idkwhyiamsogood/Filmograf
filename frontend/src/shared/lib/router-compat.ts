import {
  useNavigate,
  useParams as useTanStackParams,
  useRouter as useTanStackRouter,
  useRouterState,
} from "@tanstack/react-router";

export const useRouter = () => {
  const navigate = useNavigate();
  const router = useTanStackRouter();

  return {
    push: (href: string) => navigate({ to: href as any }),
    replace: (href: string) => navigate({ to: href as any, replace: true }),
    back: () => router.history.back(),
    forward: () => router.history.forward(),
  };
};

export const usePathname = () =>
  useRouterState({ select: (s) => s.location.pathname });

export const useSearchParams = () =>
  useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr),
  });

export const useParams = () => useTanStackParams({ strict: false });
