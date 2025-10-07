import React, { useState, useEffect } from "react";
import TextTitle from "../../components/Text/title";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import Loading from "../../components/loading";
import { client } from "../../utils";
import { toast } from "react-toastify";
import './EditPlan.css';

function EditPlan({ location, history }) {
  const plan = location.state?.plan;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [loading, setLoading] = useState(false);

  // Load sessionStorage values or fallback to plan data
  useEffect(() => {
    const savedName = sessionStorage.getItem("editPlan_name");
    const savedPrice = sessionStorage.getItem("editPlan_price");
    const savedDiscount = sessionStorage.getItem("editPlan_discount");

    if (savedName || savedPrice || savedDiscount) {
      setName(savedName || "");
      setPrice(savedPrice || "");
      setDiscountPercent(savedDiscount || "");
    } else if (plan) {
      setName(plan.name || "");
      setPrice(plan.price || "");
      setDiscountPercent(plan.discount_percent || "");
    }
  }, [plan]);

  // Persist changes to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("editPlan_name", name);
    sessionStorage.setItem("editPlan_price", price);
    sessionStorage.setItem("editPlan_discount", discountPercent);
  }, [name, price, discountPercent]);

  // Calculate prices
  const discountAmount =
    price && discountPercent
      ? (parseFloat(price) * parseFloat(discountPercent)) / 100
      : 0;

  const effectivePrice = price ? parseFloat(price) - discountAmount : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      name,
      price: parseFloat(price),
      discount_percent: discountPercent ? parseFloat(discountPercent) : 0,
    };

    try {
      await client(`/api/v1/plans/${plan.id}/`, { method: "PUT", body });
      toast.success("Plan updated successfully!");
      sessionStorage.removeItem("editPlan_name");
      sessionStorage.removeItem("editPlan_price");
      sessionStorage.removeItem("editPlan_discount");
      history.push("/manage-plan"); // go back to ManagePlans
    } catch (err) {
      console.error(err);
      toast.error("Failed to update plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header border>
        <TextTitle xbold>Edit Plan</TextTitle>
      </Header>

      <div className="add-plan-container">
        <form className="add-plan-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Plan Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Discount (%)</label>
            <input
              type="number"
              step="1"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
            />
          </div>

          <div className="plan-summary">
            <p>
              <strong>Discount Amount:</strong> ${discountAmount.toFixed(2)}
            </p>
            <p>
              <strong>Effective Price:</strong> ${effectivePrice.toFixed(2)}
            </p>
          </div>

          <Button type="submit" className="create-plan-btn" disabled={loading}>
            {loading ? <Loading /> : "Update Plan"}
          </Button>
        </form>
      </div>
    </>
  );
}

export default EditPlan;
