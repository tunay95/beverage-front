import React, { useMemo, useState } from "react";
import "./PaymentModal.css";

export default function PaymentModal({
  isOpen,
  onClose,
  cartItems = [],
  subtotal = 0,
  delivery = 0,
  total = 0,
  onSuccess,
}) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    cardNumber: "",
    cardExp: "",
    cardCvv: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const itemCount = useMemo(
    () => cartItems.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0),
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

    const digits = form.cardNumber.replace(/\s/g, "");
    if (digits.length < 12) return "Card number looks too short";
    if (!/^\d+$/.test(digits)) return "Card number must be digits only";
    if (!/^\d{2}\/\d{2}$/.test(form.cardExp.trim())) return "Expiry must be MM/YY";
    if (!/^\d{3,4}$/.test(form.cardCvv.trim())) return "CVV must be 3 or 4 digits";

    return "";
  };

  const handlePay = () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setSuccess("Payment successful ✅ Order placed!");
    setTimeout(() => {
      onSuccess?.({
        customer: {
          fullName: form.fullName,
          phone: form.phone,
          city: form.city,
          address: form.address,
        },
        totals: { subtotal, delivery, total },
        items: cartItems,
        createdAt: new Date().toISOString(),
      });
      onClose();
    }, 900);
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
            </div>

            <h3 style={{ marginTop: 18 }}>Card details</h3>

            <div className="pay-grid">
              <div className="pay-field pay-wide">
                <label>Card number</label>
                <input
                  value={form.cardNumber}
                  onChange={(e) => setField("cardNumber", e.target.value)}
                  placeholder="0000 0000 0000 0000"
                />
              </div>

              <div className="pay-field">
                <label>Expiry (MM/YY)</label>
                <input
                  value={form.cardExp}
                  onChange={(e) => setField("cardExp", e.target.value)}
                  placeholder="12/28"
                />
              </div>

              <div className="pay-field">
                <label>CVV</label>
                <input
                  value={form.cardCvv}
                  onChange={(e) => setField("cardCvv", e.target.value)}
                  placeholder="123"
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
                <span>{subtotal.toLocaleString("ru-RU")} Р</span>
              </div>
              <div className="pay-line">
                <span>Delivery</span>
                <span>{delivery.toLocaleString("ru-RU")} Р</span>
              </div>
              <div className="pay-total">
                <span>Total</span>
                <span>{total.toLocaleString("ru-RU")} Р</span>
              </div>
            </div>

            <button className="pay-btn" onClick={handlePay}>
              PAY NOW
            </button>

            <p className="pay-note">
              * This is a demo checkout. Backend payment integration can be added later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
