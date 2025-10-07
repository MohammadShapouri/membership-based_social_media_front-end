import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import TextTitle from "../../components/Text/title";
import Header from "../../components/Header/Header";
import ThemeButton from "../../components/ThemeButton/ThemeButton";
import Loading from "../../components/loading";
import SearchBox from "../../components/SearchBox/SearchBox";
import Avatar from "../../components/Avatar/Avatar"; // adjust import if needed
import { client } from "../../utils";
import { toast } from "react-toastify";
import "./PlanSubscribers.css";

function PlanSubscribers() {
  const { planId } = useParams(); // plan id from route /plans/:id/subscribers
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchSubscribers = async (url, replace = false) => {
    try {
      setLoading(true);
      const res = await client(url);

      setSubscriptions((prev) =>
        replace ? res.results : [...prev, ...res.results]
      );

      let next = null;
      if (res.next) {
        next = res.next.replace(/^.*?(\/api\/.*)$/, "$1");
      }
      setNextPage(next);
    } catch (err) {
      toast.error("Failed to load subscribers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialUrl = `/api/v1/plan-subscribers/${planId}?is_subscription_active=true`;
    fetchSubscribers(initialUrl, true);
  }, [planId]);

  // 🔎 Handle search on Enter key
  const handleAddSearch = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const url = `/api/v1/plan-subscribers/${planId}?is_subscription_active=true&search=${encodeURIComponent(
        searchText
      )}`;
      await fetchSubscribers(url, true);
    }
  };

  const handleLoadMore = () => {
    if (nextPage) {
      fetchSubscribers(nextPage);
    }
  };

  return (
    <>
      <Header border>
        <TextTitle xbold>Plan Subscribers</TextTitle>
        <SearchBox
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          onKeyPress={handleAddSearch}
          className="layout-explore--search"
        />
      </Header>

      <div className="manage-subscriptions-container">
        {subscriptions.length === 0 && !loading ? (
          <div className="subscriptions-empty">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="rgba(29, 161, 242, 0.6)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7v6m0 0v6m0-6h6m-6 0H2"
              />
            </svg>
            <h2>No active subscribers</h2>
            <p>Looks like this plan has no active subscribers.</p>
          </div>
        ) : (
          <div className="follows-page">
            <div className="follows-page-header">
              <TextTitle xbold className="follows-page-title">
                Subscribers
              </TextTitle>
            </div>

            <div className="follows-list">
              {subscriptions.map((sub) => {
                const userObj = sub.user_account;
                return (
                  <div key={sub.id} className="follows-item">
                    <Link
                      to={`/${userObj.username}`}
                      className="follows-info-link"
                    >
                      <Avatar
                        size="medium"
                        src={
                          userObj.profile_picture
                            ? "http://127.0.0.1:8000" + userObj.profile_picture
                            : "/default-avatar.png"
                        }
                      />
                      <div className="follows-info">
                        <TextTitle>{userObj.full_name}</TextTitle>
                        <p className="username">@{userObj.username}</p>
                      </div>
                    </Link>
                  </div>
                );
              })}

              {/* Load More button */}
              {nextPage && (
                <div key="load-more" className="follows-load-more">
                  <ThemeButton size="medium" primary onClick={handleLoadMore}>
                    + More
                  </ThemeButton>
                </div>
              )}
            </div>
          </div>
        )}

        {loading && subscriptions.length === 0 && (
          <div className="loading">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
}

export default PlanSubscribers;
