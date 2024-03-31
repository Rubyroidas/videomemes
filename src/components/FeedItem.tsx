import {FC} from 'react';
import {Link} from 'react-router-dom';

import {FeedItem} from '../types';
import {FeedListElWrapper} from './Feed/Feed.styles';

type Props = {
    item: FeedItem;
}
export const FeedItemEl: FC<Props> = ({item}) => (
    <FeedListElWrapper>
        <Link to={`/feed/${item.id}`}>
            <img src={item.snapshot} crossOrigin="anonymous"/>
        </Link>
    </FeedListElWrapper>
);
