import {useEffect, useState} from 'react';

import {useApi} from '../services/apiContext';
import {FeedItem} from '../types';
import {FeedItemEl} from './FeedItem';

export const Feed = () => {
    const api = useApi();
    const [feed, setFeed] = useState<FeedItem[] | null>(null);

    const load = async () => {
        const res = await api.getRequest<FeedItem[]>('/feed');
        console.log(res);
        setFeed(res);
    }

    useEffect(() => {
        load();
    }, []);

    if (!feed) {
        return null;
    }

    return (
        <div>
            feed here
            {feed.slice(1, 2).map(feedItem => (
                <FeedItemEl
                    key={feedItem.url}
                    item={feedItem}
                />
            ))}
        </div>
    );
};
