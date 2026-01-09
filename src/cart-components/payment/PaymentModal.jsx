import React, { useMemo, useState } from "react";
import * as orderApi from "../../data/orderApi";
import * as paymentApi from "../../data/paymentApi";
import "./PaymentModal.css";

export default function PaymentModal({
  isOpen,
  onClose,
  cartItems = [],
  cartSummary = {},
  onSuccess,
}) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });

  const [discountCode, setDiscountCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const itemCount = useMemo(
    () => cartItems.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0),
    [cartItems]
  );

  if (!isOpen) return null;

  const setField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setError("");
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.phone.trim()) return "Phone is required";
    if (!form.city.trim()) return "City is required";
    if (!form.address.trim()) return "Address is required";
    return "";
  };

  const handlePay = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      setError("");

      // Create order items array from cart
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      console.log("Initiating payment with items:", orderItems);
      
      // Initiate payment directly - backend will create order
      const paymentResponse = await paymentApi.initiatePayment(orderItems, discountCode || "");
      console.log("Payment response:", paymentResponse);
      
      // Redirect to Kapital Bank payment page
      if (paymentResponse.paymentUrl) {
        window.location.href = paymentResponse.paymentUrl;
      } else {
        throw new Error("Payment URL not received from server");
      }
    } catch (err) {
      console.error("Payment error:", err);
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.message || err.message || "Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div className="pay-overlay" onClick={onClose}>
      <div className="pay-modal" onClick={stop}>
        <div className="pay-header">
          <h2>Checkout</h2>
          <button className="pay-close" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="pay-body">
          <div className="pay-left">
            <h3>Your details</h3>

            <div className="pay-grid">
              <div className="pay-field">
                <label>Full name</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="pay-field">
                <label>Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+994 xx xxx xx xx"
                />
              </div>

              <div className="pay-field">
                <label>City</label>
                <input
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  placeholder="Baku"
                />
              </div>

              <div className="pay-field pay-wide">
                <label>Address</label>
                <input
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="Street, building, apartment"
                />
              </div>

              <div className="pay-field pay-wide">
                <label>Discount Code (optional)</label>
                <input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter discount code"
                />
              </div>
            </div>

            {error && <div className="pay-alert error">{error}</div>}
            {success && <div className="pay-alert ok">{success}</div>}
          </div>

          <div className="pay-right">
            <h3>Order summary</h3>

            <div className="pay-summary">
              <div className="pay-line">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>
              <div className="pay-line">
                <span>Subtotal</span>
                <span>{(cartSummary.subtotal || 0).toLocaleString("ru-RU")} ₼</span>
              </div>
              <div className="pay-line">
                <span>Discount</span>
                <span>
                  {cartSummary.discount > 0 
                    ? `- ${cartSummary.discount.toLocaleString("ru-RU")} ₼` 
                    : "0 ₼"}
                </span>
              </div>
              <div className="pay-line">
                <span>Delivery</span>
                <span>{(cartSummary.shippingPrice || 0).toLocaleString("ru-RU")} ₼</span>
              </div>
              <div className="pay-total">
                <span>Total</span>
                <span>{(cartSummary.total || 0).toLocaleString("ru-RU")} ₼</span>
              </div>
            </div>

            <button className="pay-btn" onClick={handlePay} disabled={loading}>
              {loading ? "REDIRECTING TO PAYMENT..." : "PROCEED TO PAYMENT"}
            </button>

            <p className="pay-note">
              * You will be redirected to Kapital Bank for secure payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
