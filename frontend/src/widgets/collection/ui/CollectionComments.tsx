import React from 'react';

// ui
import { TabsContent } from '@/shared/ui/tabs';

interface Props {
  collectionId: string;
}

export const CollectionComments: React.FC<Props> = ({ collectionId }) => {
  return (
    <TabsContent value='comments'>

    </TabsContent>
  );
};
