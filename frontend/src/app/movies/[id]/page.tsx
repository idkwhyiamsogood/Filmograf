import React from "react";

import { CommentWrapper } from "@/widgets/comments/CommentWrapper";
import { CommonWrapper } from "@/shared/components";

const Page: React.FC = () => {
  return (
    <CommonWrapper>
      <CommentWrapper />
    </CommonWrapper>
  );
};

export default Page;
