import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Header from '../../components/Header/Header'
import Loading from '../../components/loading'
import * as Icons from '../../components/icons'
import Tweet from '../../components/Tweet/Tweet'
import TweetEditor from '../../components/TweetEditor/TweetEditor'

import { FeedContext } from '../../context/FeedContext'
import { client } from '../../utils'

import './Home.css'
import Button from '../../components/Button/Button'
import TextTitle from '../../components/Text/title'

function Home() {

    const { feed, setFeed } = useContext(FeedContext)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        window.scrollTo(0, 0);

        setLoading(true);
        setFeed(null)

        client("/users/feed")
            .then((res) => {
                setFeed(res.data);
                setLoading(false);
            })
            .catch((res) => {
                toast.error(res)
                setLoading(false);
            });

    }, [])


    var feedTest = [
                    {
                        _id: "1",
                        isLiked: true,
                        isRetweeted: false,
                        comments: [
                        { _id: "c1", user: "Alice", text: "Nice post!", createdAt: "2025-08-15T09:00:00Z" },
                        { _id: "c2", user: "Bob", text: "I agree 👍", createdAt: "2025-08-15T09:05:00Z" }
                        ],
                        retweetCount: 3,
                        likesCount: 12,
                        user: {
                        _id: "u1",
                        name: "John Doe",
                        username: "johndoe",
                        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
                        },
                        createdAt: "2025-08-15T08:30:00Z",
                        caption: "Enjoying the sunny weather 🌞",
                        tags: ["#summer", "#sunnyday", "#chill"],
                        files: [
                        { url: "https://picsum.photos/500/300?random=1", type: "image" }
                        ]
                    },
                    {
                        _id: "2",
                        isLiked: false,
                        isRetweeted: true,
                        comments: [],
                        retweetCount: 10,
                        likesCount: 45,
                        user: {
                        _id: "u2",
                        name: "Sarah Lee",
                        username: "sarahlee",
                        avatar: "https://randomuser.me/api/portraits/women/45.jpg"
                        },
                        createdAt: "2025-08-14T16:00:00Z",
                        caption: "Just published a new blog post on JavaScript tips! 🚀",
                        tags: ["#javascript", "#coding", "#devlife"],
                        files: [
                        { url: "https://picsum.photos/500/300?random=2", type: "image" }
                        ]
                    },
                    {
                        _id: "3",
                        isLiked: false,
                        isRetweeted: false,
                        comments: [
                        { _id: "c3", user: "Mike", text: "That’s amazing!", createdAt: "2025-08-13T20:15:00Z" }
                        ],
                        retweetCount: 0,
                        likesCount: 5,
                        user: {
                        _id: "u3",
                        name: "Carlos Gomez",
                        username: "carlosg",
                        avatar: "https://randomuser.me/api/portraits/men/12.jpg"
                        },
                        createdAt: "2025-08-13T19:50:00Z",
                        caption: "My first time trying sushi 🍣",
                        tags: ["#foodie", "#sushi", "#firsttime"],
                        files: [
                        { url: "https://picsum.photos/500/300?random=3", type: "image" }
                        ]
                    }
                ]
    return (
        <div className="">
            <Header border>
                <TextTitle xbold>Home</TextTitle>
                <Button icon>
                    <Icons.TimelineProp />
                </Button>
            </Header>

            <TweetEditor />

            {/* {feed?.map((post) => (
                <Tweet key={post._id} post={post} />
            ))} */}
            {feedTest?.map((post) => (
                <Tweet key={post._id} post={post} />
            ))}


            {loading && <div className="loading">
                <Loading />
            </div>
            }


            { feed && feed.length == 0 && !loading && (
                <div className="loading">
                    <TextTitle>Follow to see people's posts.</TextTitle>
                </div>
            )}

        </div>
    )
}

export default Home
