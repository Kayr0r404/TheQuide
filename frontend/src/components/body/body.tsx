import React from 'react';
import FeedListing from './feed.tsx';
import Aside from './aside.tsx';

const TimeLine = () => {
    return (
        <section>
            <article>
                <FeedListing />
            </article>
            <aside style={{fontSize: "22px"}}>
                <Aside />
            </aside>
        </section>
    );
};

export default TimeLine;
