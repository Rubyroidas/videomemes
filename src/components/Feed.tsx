import {useEffect, useState} from 'react';

import {useApi} from '../services/apiContext';
import {FeedItem} from '../types';
import {FeedItemEl} from './FeedItem';
import {consoleLog} from '../utils';

export const Feed = () => {
    const api = useApi();
    const [feed, setFeed] = useState<FeedItem[] | null>(null);

    const load = async () => {
        const res = await api.getFeed();
        consoleLog(res);
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
            {feed.map(feedItem => (
                <FeedItemEl
                    key={feedItem.id}
                    item={feedItem}
                />
            ))}
        </div>
    );
};
