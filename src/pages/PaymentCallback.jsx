import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as paymentApi from "../data/paymentApi";
import "./PaymentCallback.css";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); // processing, success, failed
  const [message, setMessage] = useState("Processing payment...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get parameters from URL
      const providerTransactionId = searchParams.get("transactionId");
      const paymentStatus = searchParams.get("status");

      if (!providerTransactionId || !paymentStatus) {
        setStatus("failed");
        setMessage("Invalid payment callback parameters");
        setLoading(false);
        return;
      }

      // Call backend to verify and process payment
      const response = await paymentApi.handlePaymentCallback(
        providerTransactionId,
        paymentStatus
      );

      if (response.success) {
        setStatus("success");
        setMessage("Payment completed successfully!");
        
        // Trigger cart update event
        window.dispatchEvent(new Event("cartUpdated"));
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setStatus("failed");
        setMessage(response.message || "Payment failed");
      }
    } catch (err) {
      console.error("Payment callback error:", err);
      setStatus("failed");
      setMessage(err.response?.data?.message || "Payment verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-callback-page">
      <div className="payment-callback-container">
        {loading ? (
          <>
            <div className="payment-spinner"></div>
            <h2>Processing Payment...</h2>
            <p>Please wait while we verify your payment</p>
          </>
        ) : status === "success" ? (
          <>
            <div className="payment-icon success">✓</div>
            <h2>Payment Successful!</h2>
            <p>{message}</p>
            <p className="redirect-text">Redirecting to home page...</p>
          </>
        ) : (
          <>
            <div className="payment-icon failed">✕</div>
            <h2>Payment Failed</h2>
            <p>{message}</p>
            <button 
              className="payment-btn"
              onClick={() => navigate("/cart")}
            >
              Return to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}
