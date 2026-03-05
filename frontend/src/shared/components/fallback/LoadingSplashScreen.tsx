import { Spinner } from "@/shared/ui/spinner";
import { FC } from "react";

interface Props {
  message?: string | undefined;
  showMessage?: boolean | undefined;
}

export const LoadingSplashScreen: FC<Props> = ({ showMessage = false }) => {
  return (
    <div className="flex w-full h-[calc(100vh - 15rem)] items-center justify-center space-x-4">
      <div className="flex justify-around items-center gap-3">
        <Spinner className="opacity-65 items-center" />
        {(showMessage === undefined || showMessage == true) && (
          <div className="text-sm opacity-65 text-center">Загрузка данных</div>
        )}
      </div>
    </div>
  );
};
