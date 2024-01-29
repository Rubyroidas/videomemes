import {useEffect, useState} from 'react';

export const Feed = () => {
    const [feed, setFeed] = useState(null);

    const load = async () => {
        const res = await fetch('https://api.memely.net/feed');
        const json = await res.json();
        console.log(json);
        setFeed(json);
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
        </div>
    );
};
