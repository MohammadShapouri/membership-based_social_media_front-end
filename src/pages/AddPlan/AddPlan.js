import React, { useState, useContext } from "react";
import { UserContext } from '../../context/UserContext';
import TextTitle from "../../components/Text/title";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import Loading from '../../components/loading';
import "./AddPlan.css";
import { client } from '../../utils';
import { toast } from "react-toastify";

function AddPlan() {
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [loading, setLoading] = useState(false);

  // calculate discount and effective price dynamically
  const discountAmount = price && discountPercent 
    ? (parseFloat(price) * parseFloat(discountPercent) / 100) 
    : 0;

  const effectivePrice = price 
    ? (parseFloat(price) - discountAmount) 
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      name: name,
      price: parseFloat(price),
      discount_percent: discountPercent ? parseFloat(discountPercent) : 0,
    };

    try {
      await client("/api/v1/plans/", { body });
      toast.success("Plan created successfully!");
      // optionally, redirect back to ManagePlans
    } catch (err) {
      console.error(err);
      toast.error("Failed to create plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header border>
        <TextTitle xbold>Add Plan</TextTitle>
      </Header>

      <div className="add-plan-container">
        <form className="add-plan-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Plan Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input 
              type="number" 
              step="0.01" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Discount (%)</label>
            <input 
              type="number" 
              step="1" 
              value={discountPercent} 
              onChange={e => setDiscountPercent(e.target.value)} 
            />
          </div>

          <div className="plan-summary">
            <p><strong>Discount Amount:</strong> ${discountAmount.toFixed(2)}</p>
            <p><strong>Effective Price:</strong> ${effectivePrice.toFixed(2)}</p>
          </div>

          <Button type="submit" className="create-plan-btn" disabled={loading}>
            {loading ? <Loading /> : "Create Plan"}
          </Button>
        </form>
      </div>
    </>
  );
}

export default AddPlan;
