import React, { useContext, useEffect, useState } from "react";
import { client } from "../../utils";
import ThemeButton from '../ThemeButton/ThemeButton'
import { useLocation as locations } from "react-router-dom";
import { FeedContext } from "../../context/FeedContext";

const Follow = ({ nobtn, isFollowing, connectionId, incFollowers, decFollowers, userId, username }) => {
    let router = locations();
    const { feed, setFeed, setWhoFollow } = useContext(FeedContext);

    const [followingState, setFollowingState] = useState(isFollowing);
    const [stateConnectionId, setStateConnectionId] = useState(connectionId);
    const [stateUserId, setstateUserId] = useState(userId);

    useEffect(
        () => setFollowingState(isFollowing),
        [isFollowing]);

    const handleFollow = async () => {
        if (followingState == true) {
            try {
                await client(`/api/v1/follower-followings/${stateConnectionId}/`, { method: "DELETE" });
                setFollowingState(false);
                decFollowers();
            } catch (error) {
                console.log(error);
            // toast.error("Failed to unfollow.");
            }
        } else if (followingState === null) {
            try {
                await client(`/api/v1/follower-followings/${stateConnectionId}/`, { method: "DELETE" });
                setFollowingState(false);
            } catch (error) {
                console.log(error);
            // toast.error("Failed to unfollow.");
            }
        } else {
            const body = {
                following: stateUserId
            };
            try {
                const res = await client("/api/v1/follower-followings/", { method: "POST", body });
                setStateConnectionId(res.id);
                if (res.is_accepted) {
                    setFollowingState(true);
                    incFollowers();
                } else {
                    setFollowingState(null);
                }
            } catch (error) {
            // toast.error("Failed to follow.");
            }
        }
    };

    if (followingState === true) {
        return (
            <>
                {nobtn ? (
                    <span
                        style={{ color: "#262626" }}
                        className="pointer"
                        onClick={() => handleFollow()}
                    >
                        Following
                    </span>
                ) : (
                        <ThemeButton size='medium' primary onClick={() => handleFollow()}>Following</ThemeButton>
                    )}
            </>
        );
    } else if (followingState === false) {
        return (
            <>
                {nobtn ? (
                    <span className="pointer" onClick={() => handleFollow()}>
                        Follow
                    </span>
                ) : (
                        <ThemeButton size='medium' onClick={() => handleFollow()}>Follow</ThemeButton>
                    )}
            </>
        );
    } else if (followingState === null) {
        return (
            <>
                {nobtn ? (
                    <span className="pointer" onClick={() => handleFollow()}>
                        Pending
                    </span>
                ) : (
                        <ThemeButton size='medium' onClick={() => handleFollow()}>Pending</ThemeButton>
                    )}
            </>
        );
    }
};

export default Follow;