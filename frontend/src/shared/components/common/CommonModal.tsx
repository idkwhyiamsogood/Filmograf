import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

export const CommonModal: React.FC = () => {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline"></Button>
          </DialogClose>
          <Button type="submit"></Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
