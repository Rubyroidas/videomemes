import {FC} from 'react';
import {Link} from 'react-router-dom';

import {FeedItem} from '../types';
import {FeedListDuration, FeedListElWrapper} from './Feed/Feed.styles';

type Props = {
    item: FeedItem;
}
export const FeedItemEl: FC<Props> = ({item}) => (
    <FeedListElWrapper>
        <Link to={`/feed/${item.id}`}>
            <img
                loading="lazy"
                src={item.snapshot}
                crossOrigin="anonymous"
            />
        </Link>
        <FeedListDuration>{item.duration}</FeedListDuration>
    </FeedListElWrapper>
);
