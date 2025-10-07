import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../context/UserContext'
import TextTitle from "../../components/Text/title";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import Loading from '../../components/loading';
import { Link, useHistory } from 'react-router-dom'
import "./ManagePlans.css";
import { client } from '../../utils'
import { toast } from "react-toastify";

function ManagePlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const { user } = useContext(UserContext);
  const history = useHistory();

  const handleEdit = (plan) => {
    history.push("/edit-plan", { plan });
  };

  const handleDelete = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      await client(`/api/v1/plans/${planId}/`, { method: "DELETE" });
      setPlans((prev) => prev.filter((p) => p.id !== planId));
      toast.success("Plan deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete plan.");
    }
  };

  const fetchPlans = async (url) => {
    try {
      setLoading(true);
      const res = await client(url);
      setPlans(prev => [...prev, ...res.results]);

      let next = null;
      if (res.next) {
        next = res.next.replace(/^.*?(\/api\/.*)$/, "$1");
      }
      setNextPage(next);
    } catch (err) {
      toast.error("Failed to load plans");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialUrl = `/api/v1/plans?user_account=${user.id}`;
    fetchPlans(initialUrl);
  }, [user.id]);

  return (
    <>
      <Header border>
        <TextTitle xbold>Manage Plans</TextTitle>
      </Header>

      <div className="manage-plans-container">
        <div className="manage-plans-header">
          <TextTitle xbold>Plans</TextTitle>
          <Link to='add-plan'>
            <Button className="add-plan-btn create-plan-btn">
              Add Plan
            </Button>
          </Link>
        </div>

        {plans.length === 0 && !loading ? (
          <div className="no-plans-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="rgba(29, 161, 242, 0.6)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v6m0 0v6m0-6h6m-6 0H2"/>
            </svg>
            <div className="no-plans-content">
              <p>No plans found</p>
              <Button className="create-plan-btn">
                Create a New Plan
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="plans-list">
              {plans.map((plan) => (
                <Link to={`plan-subscribers/${plan.id}`}>
                  <div key={plan.id} className="plan-card">
                    <div className="plan-card-header">
                      <h3 className="plan-name">{plan.name}</h3>
                      <div className="plan-actions">
                        <button className="plan-btn edit" onClick={() => handleEdit(plan)}>Edit</button>
                        <button className="plan-btn delete" onClick={() => handleDelete(plan.id)}>Delete</button>
                      </div>
                    </div>
                    <div className="plan-info">
                      <p><strong>Base Price:</strong> ${plan.price}</p>
                      <p><strong>Discount:</strong> {plan.discount_percent ?? 0}%</p>
                      <p><strong>Final Price:</strong> ${plan.effective_price.toFixed(2)}</p>
                      <p><strong>Subscribers:</strong> {plan.subscribers_count}</p>
                      <p><strong>Posts:</strong> {plan.posts_count}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {nextPage && (
              <div className="load-more-container">
                <Button
                  className="load-more-btn"
                  onClick={() => fetchPlans(nextPage)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Show More"}
                </Button>
              </div>
            )}
          </div>
        )}

        {loading && plans.length === 0 && (
          <div className="loading">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
}

export default ManagePlans;
