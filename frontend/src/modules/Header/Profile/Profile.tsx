// types
import type { FC } from "react";

// components
import { Button } from "@/ui/button";
import { User } from "lucide-react";

export const UserProfile: FC = () => {
  return (
    <div className="">
      <Button>
        <User />
      </Button>
    </div>
  );
};
