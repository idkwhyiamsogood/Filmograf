import { Collection } from "@/entities/collection";
import React, { useEffect, useState } from "react";

import { TagWrapper } from "@/entities/collection-tags";
import { USER_MOCK_LIGHT, userApi, UserLight, UserLogo } from "@/entities/user";
import { CardDescription } from "@/shared/ui/card";

import { useTags } from "@/entities/collection-tags";
import { LoadingSplashScreen } from "@/shared/components";

interface Props {
  collection: Collection;
}

export const CollectionDetailsDescription: React.FC<Props> = ({
  collection,
}) => {
  const [user, setUser] = useState(USER_MOCK_LIGHT);

  useEffect(() => {
    const getUser = async (userId: string) => {
      try {
        const response = await userApi.getUser(userId);

        setUser(response.data);
      } catch (e) {
        console.log(e);
      }
    };

    getUser(collection.userId);
  }, []);

  return (
    <CardDescription>
      <div className="flex gap-2.5 items-center justify-between">
        <UserLogo logo={user.avatarUrl} />
        <span className="text-base">{user.name}</span>
      </div>
    </CardDescription>
  );
};
