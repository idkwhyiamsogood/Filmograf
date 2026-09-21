import React from 'react';

// ui
import { TabsContent } from '@/shared/ui/tabs';
import { CommentWrapper } from '@/widgets/comments/CommentWrapper';
import { Collection } from '@/entities/collection';


interface Props {
  collection: Collection;
}

export const CollectionComments: React.FC<Props> = ({ collection }) => {
  return (
    <TabsContent value='comments' className='w-full'>
      {collection.isCommentable ? <CommentWrapper /> : (
        <div className='w-full flex'>
          У данной подборки отключены комментарии.
        </div>
      )}
    </TabsContent>
  );
};
