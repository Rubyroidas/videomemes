import {useEffect, useState} from 'react';

import {useApi} from '../services/apiContext';
import {FeedItem} from '../types';
import {FeedItemEl} from './FeedItem';
import {consoleLog} from '../utils';
import {FeedListWrapper} from './Feed/Feed.styles';

export const Feed = () => {
    const api = useApi();
    const [feed, setFeed] = useState<FeedItem[] | null>(null);

    const load = async () => {
        const res = await api.getFeed();
        consoleLog('FEED', res);
        setFeed(res);
    }

    useEffect(() => {
        load();
    }, []);

    if (!feed) {
        return null;
    }

    return (
        <FeedListWrapper>
            {feed.map(feedItem => (
                <FeedItemEl
                    key={feedItem.id}
                    item={feedItem}
                />
            ))}
        </FeedListWrapper>
    );
};
