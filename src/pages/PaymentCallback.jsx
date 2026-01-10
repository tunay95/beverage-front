import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as paymentApi from "../data/paymentApi";
import * as orderApi from "../data/orderApi";
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
      // Get saved payment data from localStorage
      const savedPaymentData = localStorage.getItem('pendingPayment');
      let pendingPayment = null;
      
      if (savedPaymentData) {
        try {
          pendingPayment = JSON.parse(savedPaymentData);
          console.log("Found pending payment:", pendingPayment);
        } catch (e) {
          console.error("Failed to parse pending payment:", e);
        }
      }

      // Get parameters from URL (Kapital Bank sends these)
      const providerTransactionId = searchParams.get("id") || searchParams.get("transactionId") || pendingPayment?.transactionId;
      const paymentStatus = searchParams.get("status") || "COMPLETED";

      console.log("Payment callback params:", { providerTransactionId, paymentStatus, pendingPayment });

      if (!providerTransactionId) {
        setStatus("failed");
        setMessage("Invalid payment callback - missing transaction ID");
        setLoading(false);
        return;
      }

      // Step 1: Send callback to backend for verification
      console.log("Sending callback to backend...");
      const callbackResponse = await paymentApi.handlePaymentCallback(providerTransactionId, paymentStatus);
      console.log("Callback response:", callbackResponse);
      
      // Step 2: Check payment status to confirm
      console.log("Checking payment status...");
      const statusResponse = await paymentApi.getPaymentStatus(providerTransactionId);
      console.log("Payment status response:", statusResponse);

      // Step 3: Handle based on status
      if (statusResponse.status === "FULLYPAID") {
        setStatus("success");
        setMessage("Payment completed successfully!");
        
        // Clear pending payment from localStorage
        localStorage.removeItem('pendingPayment');
        
        // Step 4: Clear cart on successful payment
        try {
          await orderApi.clearCart();
          console.log("Cart cleared successfully");
        } catch (err) {
          console.error("Failed to clear cart:", err);
        }
        
        // Trigger cart update event
        window.dispatchEvent(new Event("cartUpdated"));
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else if (statusResponse.status === "ONPAYMENT") {
        setStatus("processing");
        setMessage("Payment is still processing. Please check back later.");
        setTimeout(() => {
          navigate("/cart");
        }, 5000);
      } else {
        // Clear pending payment on failure
        localStorage.removeItem('pendingPayment');
        setStatus("failed");
        setMessage(`Payment failed with status: ${statusResponse.status}`);
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
