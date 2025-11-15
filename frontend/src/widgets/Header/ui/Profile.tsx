// types
import type { FC } from "react";

// components
import { Button } from "@/shared/ui/button";
import { User } from "lucide-react";

export const Profile: FC = () => {
  return (
    <div className="">
      <Button>
        <User />
      </Button>
    </div>
  );
};
