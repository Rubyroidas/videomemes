import {FC} from 'react';

import {FeedItem} from '../types';

type Props = {
    item: FeedItem;
}
export const FeedItemEl: FC<Props> = ({item}) => (
    <div>
        <video src={item.url}/>
    </div>
);
