import { createFileRoute } from "@tanstack/react-router";
import type { FC, ReactNode } from "react";
import {
  Bookmark,
  ChevronRight,
  History,
  Lock,
  Palette,
  LogIn,
  LogOut,
  Pin,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { CommonWrapper, PageHeader } from "@/shared/components";
import { useModals } from "@/shared/contexts/modal-context";
import { getDaysFromReg, pluralWord, USE_MOCKS } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import Link from "@/shared/ui/link";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

import { UserLogo, useRequireMember, useUser } from "@/entities/user";
import { useInfiniteMovies, useMyRates } from "@/entities/movie";
import { useInfiniteCollections } from "@/entities/collection";
import { useCollectionPins } from "@/entities/collection-pins";
import { useAppearance } from "@/shared/context";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const Stat: FC<{ value: ReactNode; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-card px-2 py-3 shadow-xs ring-1 ring-border">
    <span className="text-xl font-extrabold tabular-nums">{value}</span>
    <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
  </div>
);

interface RowProps {
  icon: LucideIcon;
  label: string;
  hint?: string;
  href?: string;
  locked?: boolean;
  onLockedClick?: () => void;
}

const Row: FC<RowProps> = ({ icon: Icon, label, hint, href, locked, onLockedClick }) => {
  const body = (
    <>
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-primary">
        <Icon className="size-[18px]" />
      </span>
      <span className="flex-1 text-[15px] font-semibold">{label}</span>
      {hint && <span className="text-sm text-muted-foreground">{hint}</span>}
      {locked ? (
        <Lock className="size-4 text-muted-foreground" />
      ) : (
        <ChevronRight className="size-4 text-muted-foreground" />
      )}
    </>
  );
  const cls = "press flex w-full items-center gap-3 px-3.5 py-2.5 text-left";

  if (locked || !href) {
    return (
      <button type="button" className={cls} onClick={onLockedClick}>
        {body}
      </button>
    );
  }
  return (
    <Link href={href} className={cls}>
      {body}
    </Link>
  );
};

const Group: FC<{ title?: string; children: ReactNode }> = ({ title, children }) => (
  <section className="space-y-2">
    {title && (
      <h2 className="px-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
        {title}
      </h2>
    )}
    <div className="divide-y overflow-hidden rounded-2xl bg-card shadow-xs ring-1 ring-border">
      {children}
    </div>
  </section>
);

function ProfilePage() {
  const { user, isGuest, isLoading, logout } = useUser();
  const { openModal } = useModals();
  const requireMember = useRequireMember();
  const appearance = useAppearance();

  const { data: rates } = useMyRates();
  const { collections } = useInfiniteCollections({ type: "my", pageSize: 100 });
  const { data: pins } = useCollectionPins();
  const { movies: history } = useInfiniteMovies({ type: "history", pageSize: 100, staleTime: 0 });

  return (
    <CommonWrapper>
      <PageHeader title="Профиль" />

      {/* Карточка пользователя */}
      <section
        className={cn(
          "relative overflow-hidden rounded-3xl p-5",
          "bg-gradient-to-br from-primary/25 via-card to-card ring-1 ring-border",
        )}
      >
        <div className="flex items-center gap-4">
          {isLoading && !user ? (
            <Skeleton className="size-16 rounded-full" />
          ) : (
            <UserLogo
              logo={isGuest ? undefined : user?.avatarUrl}
              name={isGuest ? "Гость" : user?.name}
              className="size-16 text-xl ring-4 ring-background"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-extrabold">
              {isGuest ? "Гость" : user?.name ?? " "}
            </p>
            <p className="text-sm text-muted-foreground">
              {isGuest
                ? "Войдите, чтобы сохранять оценки и подборки"
                : user && `С нами ${getDaysFromReg(user.createDate)}`}
            </p>
          </div>
        </div>

        {isGuest ? (
          <Button
            className="mt-4 h-11 w-full rounded-xl font-bold"
            onClick={() => openModal("authorization-menu")}
          >
            <LogIn className="size-4" />
            Войти через Google
          </Button>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat
              value={rates?.length ?? 0}
              label={pluralWord(rates?.length ?? 0, ["оценка", "оценки", "оценок"])}
            />
            <Stat
              value={collections.length}
              label={pluralWord(collections.length, ["подборка", "подборки", "подборок"])}
            />
            <Stat value={history.length} label="в истории" />
          </div>
        )}
      </section>

      <Group title="Моё">
        <Row
          icon={History}
          label="История просмотра"
          href="/history"
          hint={history.length ? String(history.length) : undefined}
        />
        <Row
          icon={Star}
          label="Мои оценки"
          href="/rates"
          hint={rates?.length ? String(rates.length) : undefined}
          locked={isGuest}
          onLockedClick={() => requireMember("видеть свои оценки")}
        />
        <Row icon={Bookmark} label="Мои подборки" href="/collections" />
        <Row
          icon={Pin}
          label="Избранные подборки"
          href="/favorites"
          hint={pins.length ? String(pins.length) : undefined}
          locked={isGuest}
          onLockedClick={() => requireMember("закреплять подборки")}
        />
      </Group>

      <Group title="Открывайте">
        <Row icon={Trophy} label="Топ фильмов" href="/top" />
      </Group>

      <Group title="Оформление">
        <button
          type="button"
          onClick={() => openModal("appearance")}
          className="press flex w-full items-center gap-3 px-3.5 py-2.5 text-left"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Palette className="size-[18px]" />
          </span>
          <span className="flex-1 text-[15px] font-semibold">Тема и цвет</span>
          <span className="text-sm text-muted-foreground">
            {appearance.settings.accent === "daily" ? `Цвет дня · ${appearance.palette.name}` : appearance.palette.name}
          </span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
      </Group>

      {!isGuest && (
        <Button
          variant="ghost"
          className="h-11 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => logout()}
        >
          <LogOut className="size-4" />
          Выйти из аккаунта
        </Button>
      )}

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Filmograf{USE_MOCKS && " · демо-данные"}
      </p>
    </CommonWrapper>
  );
}
