import {FC} from 'react';
import {Link} from 'react-router-dom';

import {FeedItem} from '../types';

type Props = {
    item: FeedItem;
}
export const FeedItemEl: FC<Props> = ({item}) => (
    <div>
        <Link to={`/feed/${item.id}`}>
            <img src={item.snapshot} crossOrigin="anonymous" width={200}/>
        </Link>
    </div>
);
