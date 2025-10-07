import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import TextTitle from "../../components/Text/title";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import Loading from "../../components/loading";
import SearchBox from '../../components/SearchBox/SearchBox';
import { client } from "../../utils";
import { toast } from "react-toastify";
import "./UserSubscriptions.css";

function UserSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [searchText, setSearchText] = useState("");
  const { user } = useContext(UserContext);

  const fetchSubscriptions = async (url, replace = false) => {
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
      toast.error("Failed to load subscriptions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialUrl = `/api/v1/subscriptions`;
    fetchSubscriptions(initialUrl, true);
  }, [user.id]);

  // 🔎 Handle search on Enter key
  const handleAddSearch = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const url = `/api/v1/subscriptions?search=${encodeURIComponent(
        searchText
      )}`;
      await fetchSubscriptions(url, true); // replace list with search results
    }
  };


  return (
    <>
      <Header border>
        <TextTitle xbold>My Subscriptions</TextTitle>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="rgba(29, 161, 242, 0.6)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v6m0 0v6m0-6h6m-6 0H2"/>
            </svg>
            <h2>No plan found</h2>
            <p>Looks like this list is empty for now.</p>
          </div>
        ) : (
          <div>
            <div className="subscriptions-list">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="subscription-card">
                  <div className="subscription-header">
                    <h3>
                      {sub.plan?.name || "Unknown Plan"} 
                      <span className={sub.is_subscription_active ? "active-badge" : "inactive-badge"}>
                        {sub.is_subscription_active ? "Active" : "Inactive"}
                      </span>
                      <span
                        className={
                          sub.payment_status === "completed"
                            ? "completed-badge"
                            : sub.payment_status === "pending"
                            ? "pending-badge"
                            : "failed-badge"
                        }
                      >
                        {"Payment " + sub.payment_status.charAt(0).toUpperCase() + sub.payment_status.slice(1)}
                      </span>
                    </h3>
                  </div>
                  <div className="subscription-info">
                    <p><strong>Start Date:</strong> {new Date(sub.start_date).toLocaleDateString()}</p>
                    <p><strong>End Date:</strong> {new Date(sub.end_date).toLocaleDateString()}</p>
                    <p><strong>Payment Method:</strong> {sub.payment_method}</p>
                    <p><strong>Amount Paid:</strong> {sub.amount_paid} {sub.currency}</p>
                    <p><strong>Payment Status:</strong> {sub.payment_status}</p>
                    <p><strong>Created:</strong> {new Date(sub.creation_date).toLocaleString()}</p>
                    <p><strong>Payment ID:</strong> {sub.payment_id}</p>
                    <p><strong>Plan Owner:</strong> <Link to={`/${sub?.plan_owner.username}`}>{sub?.plan_owner.username}</Link></p>
                  </div>
                </div>
              ))}
            </div>

            {nextPage && (
              <div className="load-more-container">
                <Button
                  className="load-more-btn"
                  onClick={() => fetchSubscriptions(nextPage)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Show More"}
                </Button>
              </div>
            )}
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

export default UserSubscriptions;
