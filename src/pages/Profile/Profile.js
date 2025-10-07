import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Header from '../../components/Header/Header';
import Loading from '../../components/loading';
import * as Icons from '../../components/icons';
import TextTitle from '../../components/Text/title';
import TextBody from '../../components/Text/body';
import Follow from '../../components/Follow/Follow';
import Button from '../../components/Button/Button';
import Avatar from '../../components/Avatar/Avatar';
import { UserContext } from '../../context/UserContext';
import ThemeButton from '../../components/ThemeButton/ThemeButton';
import Post from '../../components/Post/Post';

import { client } from '../../utils';
import './Profile.css';

function Profile() {
  const { handle } = useParams();
  const { user } = useContext(UserContext);

  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [deadend, setDeadend] = useState(false);

  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [connectionId, setConnectionId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockId, setBlockId] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  // Plans state
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const loadingRef = useRef(false);
  // Posts state
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [nextPostsPage, setNextPostsPage] = useState(null);
  const postsLoadingRef = useRef(false);

  const incFollowers = () => setFollower(follower + 1);
  const decFollowers = () => setFollower(follower - 1);

  const fetchUser = async () => {
    setLoading(true);
    window.scrollTo(0, 0);
    try {
      setDeadend(false);
      if (handle === user.username) {
        const userData = await client("/api/v1/auth/me");
        setProfile(userData);
        await fetchFollowStatus(userData.id);
      } else {
        const userData = await client(`/api/v1/users?username=${handle}`);
        const target = userData.results[0];
        setProfile(target);
        await fetchFollowStatus(target.id);
        await fetchIsFollowing(target.id);
        await fetchIsBlocked(target.id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user data");
      setDeadend(true);
    }
    setLoading(false);
  };

  const fetchFollowStatus = async (id) => {
    try {
      const followStat = await client(`/api/v1/follow-stats/${id}`);
      setFollower(followStat.num_follower);
      setFollowing(followStat.num_following);
    } catch (err) {
      console.log(err)
      toast.error("Failed to load follow status");
    }
  };

  const fetchIsFollowing = async (id) => {
    try {
      const res = await client(`/api/v1/current-user-following-stats/${id}`);
      setIsFollowing(res.follows);
      setConnectionId(res.connection_id);
    } catch (err) {
      setIsFollowing(false);
    }
  };

  const fetchIsBlocked = async (id) => {
    try {
      const res = await client(`/api/v1/current-user-block-stats/${id}`);
      setIsBlocked(res.blocked);
      setBlockId(res.block_id);
    } catch (err) {
      setIsBlocked(false);
    }
  };

  const manageUserBlocking = async () => {
    try {
      if (isBlocked) {
        await client(`/api/v1/blocklists/${blockId}/`, { method: "DELETE" });
        setIsBlocked(false);
      } else {
        const res = await client(`/api/v1/blocklists/`, { method: "POST", body: { blocked: profile.id } });
        setIsBlocked(true);
        setIsFollowing(false);
        setBlockId(res.id);
        setFollower(follower-1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch plans using next page logic
  const fetchPlans = async (url) => {
    if (!url || loadingRef.current) return;
    loadingRef.current = true;
    setLoadingPlans(true);
    try {
      const res = await client(url);
      setPlans(prev => [...prev, ...res.results]);

      let next = null;
      if (res.next) {
        next = res.next.replace(/^.*?(\/api\/.*)$/, "$1");
      }
      setNextPage(next);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load plans");
    } finally {
      setLoadingPlans(false);
      loadingRef.current = false; // ✅ release lock
    }
  };

  // Fetch posts function
  const fetchPosts = async (url) => {
    if (!url || postsLoadingRef.current) return;
    postsLoadingRef.current = true;
    setPostsLoading(true);
    try {
      const res = await client(url);
      setPosts(prev => [...prev, ...res.results]);
      let next = null;
      if (res.next) {
        next = res.next.replace(/^.*?(\/api\/.*)$/, "$1");
      }
      setNextPostsPage(next);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts");
    } finally {
      setPostsLoading(false);
      postsLoadingRef.current = false;
    }
  };

  // Infinite scroll for posts
  const handleScrollPosts = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= fullHeight - 200 && nextPostsPage) {
      fetchPosts(nextPostsPage);
    }
  };

  // Infinite scroll for plans
  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= fullHeight - 200 && nextPage) {
      fetchPlans(nextPage);
    }
  };

  // Load initial user and tab
  useEffect(() => {
    // const savedTab = sessionStorage.getItem(`profile_active_tab_${handle}`);
    // if (savedTab) setActiveTab(savedTab);
    fetchUser();
  }, [handle]);

  // useEffect(() => {
  //   sessionStorage.setItem(`profile_active_tab_${handle}`, activeTab);
  // }, [activeTab, handle]);

  // Fetch plans when tab changes
  useEffect(() => {
    if (activeTab === "plans" && profile.id) {
      setPlans([]); // clear old plans
      if (handle === user.username) {

      } else {

      }
      const firstPage = `/api/v1/plans?user_account=${profile.id}`;
      setNextPage(firstPage);   // initialize nextPage
      fetchPlans(firstPage);    // immediately fetch first page
    }
  }, [activeTab, profile.id]);


  useEffect(() => {
    if (activeTab !== "plans") return;

    let timeout;
    const debouncedScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScroll, 100); // run every 100ms max
    };

    window.addEventListener("scroll", debouncedScroll, { passive: true });
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", debouncedScroll);
    };
  }, [activeTab, nextPage]);

  // Load posts on tab change
  useEffect(() => {
    if (activeTab === "posts" && profile.id) {
      setPosts([]); // clear old posts
      const firstPage = `/api/v1/posts?user_account=${profile.id}`;
      setNextPostsPage(firstPage);
      fetchPosts(firstPage);
    }
  }, [activeTab, profile.id]);

  useEffect(() => {
    if (activeTab !== "posts") return;

    let timeout;
    const debouncedScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScrollPosts, 100);
    };

    window.addEventListener("scroll", debouncedScroll, { passive: true });
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", debouncedScroll);
    };
  }, [activeTab, nextPostsPage]);


  if (!deadend && loading) return <div className="loading"><Loading /></div>;
  if (deadend) return <div>Sorry, this page isn't available</div>;

  return (
    <div className="profile-page">
      <Header border>
        <div className="profile-page__header--body">
          <Link to="/settings">
            <Button icon><Icons.Options /></Button>
          </Link>
          <div style={{ marginLeft: 15 }}>
            <TextTitle xbold>{profile.full_name ?? profile.username}</TextTitle>
          </div>
        </div>
      </Header>

      <div className="profile__background">
        <img src={`http://127.0.0.1:8000/${profile.background_picture}`} alt="Background Preview" />
      </div>

      <div className="profile-page__container">
        <div>
          <Avatar size="xlarge" border src={`http://127.0.0.1:8000/${profile.profile_picture}`} />
          <div>
            {profile?.email ? (
              <ThemeButton primary href='/accounts/edit'>Edit Profile</ThemeButton>
            ) : (
              <div className="action-buttons">
                <Follow
                  isFollowing={isFollowing}
                  connectionId={connectionId}
                  incFollowers={incFollowers}
                  decFollowers={decFollowers}
                  userId={profile?.id}
                />
                <ThemeButton className="block-btn" onClick={manageUserBlocking}>
                  {isBlocked ? "Unblock" : "Block"}
                </ThemeButton>
              </div>
            )}
          </div>
        </div>

        <div className="profile-page__detail">
          <TextTitle xbold>{profile.full_name ?? profile.username}</TextTitle>
          <TextBody>@{profile.username}</TextBody>
          <TextBody>Date Joined: {String(profile.creation_date).slice(0, 10)}</TextBody>
          <div className="profile-page__detail--b">
            <Link to={`/follows/${profile.id}?type=following`}>
              <TextBody><span className="bold">{following}</span> following</TextBody>
            </Link>
            <Link to={`/follows/${profile.id}?type=follower`}>
              <TextBody><span className="bold"> {follower}</span> followers</TextBody>
            </Link>
          </div>
        </div>

        <div className="profile-tabs">
          <button className={`tab-btn ${activeTab === "posts" ? "active" : ""}`} onClick={() => setActiveTab("posts")}>Posts</button>
          <button className={`tab-btn ${activeTab === "plans" ? "active" : ""}`} onClick={() => setActiveTab("plans")}>Plans</button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "posts" && (
            <Post 
              posts={posts} 
              loading={postsLoading} 
              currentUser={user} 
            />
          )}

        {activeTab === "plans" && (
          <div className="plans-tab-section">
            {plans.length === 0 && plansLoading && <Loading />}
            {plans.length === 0 && !plansLoading && (
              <div className="no-plans-center">
                <TextBody>No plans found</TextBody>
                {user.id === profile.id && (
                  <Link to="/add-plan">
                    <Button className="create-plan-btn">+ Create Plan</Button>
                  </Link>
                )}
              </div>
            )}
            {user.username === profile.username && plans.length > 0 && !plansLoading && (
              <div style={{ marginBottom: 15, textAlign: "right" }}>
                <Link to="/add-plan">
                  <Button className="create-plan-btn">+ Add Plan</Button>
                </Link>
              </div>
            )}
            <div className="plans-list">
              {plans.map(plan => (
                <Link to={`plan-subscribers/${plan.id}`}>
                  <div key={plan.id} className="plan-card">
                    <div className="plan-card-header">
                      <TextTitle className="plan-name">
                        {plan.name} 
                        {plan.discount_percent > 0 && (
                          <span className="discount-badge">
                            {plan.discount_percent}% OFF
                          </span>
                        )}
                      </TextTitle>

                      {user.username === profile.username ? (
                        <div className="plan-actions">
                          <Link to={{ pathname: "/edit-plan", state: { plan } }}>
                            <button className="plan-btn edit">Edit</button>
                          </Link>
                          <button
                            className="plan-btn delete"
                            onClick={async () => {
                              try {
                                if (!window.confirm("Are you sure you want to delete this plan?")) return;

                                await client(`/api/v1/plans/${plan.id}/`, { method: "DELETE" });
                                toast.success("Plan deleted");
                                setPlans(plans.filter(p => p.id !== plan.id));
                              } catch (err) {
                                toast.error("Failed to delete plan");
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div className="plan-actions">
                          <button className="plan-btn purchase">Purchase</button>
                        </div>
                      )}
                    </div>


                    {user.username === profile.username && (
                      <div className="plan-info">
                        <TextBody>Base Price: ${plan.price}</TextBody>
                        <TextBody>Discount: {plan.discount_percent ?? 0}%</TextBody>
                        <TextBody>Final Price: ${plan.effective_price.toFixed(2)}</TextBody>
                        <TextBody>Subscribers: {plan.subscribers_count}</TextBody>
                        <TextBody>Posts: {plan.posts_count}</TextBody>
                      </div>
                    )}

                    {user.username !== profile.username && (
                      <div className="plan-info">
                        <TextBody>Price: ${plan.effective_price.toFixed(2)}</TextBody>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            {plansLoading && <div style={{ textAlign: 'center', padding: 15 }}><Loading /></div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
