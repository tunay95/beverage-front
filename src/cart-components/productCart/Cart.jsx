import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import * as orderApi from "../../data/orderApi";
import PaymentModal from "../payment/PaymentModal";
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    discount: 0,
    shippingPrice: 100,
    total: 0
  });

  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) return;
    
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }
    loadCart();
  }, [isAuthenticated, authLoading]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getCart();
      console.log("Cart data:", data);
      setCartItems(data.items || []);
      setCartSummary({
        subtotal: data.subtotal || 0,
        discount: data.discount || 0,
        shippingPrice: data.shippingPrice || 100,
        total: data.total || 0
      });
    } catch (err) {
      console.error("Failed to load cart:", err);
      if (err.response?.status === 401) {
        navigate("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, qty) => {
    if (qty < 1) return;
    
    try {
      await orderApi.updateCartItem(productId, qty);
      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await orderApi.removeFromCart(productId);
      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  const openCheckout = () => {
    if (cartItems.length === 0) return;
    setIsPayOpen(true);
  };

  if (loading) {
    return (
      <div className="cart-page">
        <h1 className="cart-title">MY CART</h1>
        <p className="empty">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">MY CART</h1>

      <div className="cart-container">
        <div className="cart-table">
          <div className="cart-header">
            <div className="col-product header-label">PRODUCT</div>
            <div className="col-price header-label">PRICE</div>
            <div className="col-qty header-label">QUANTITY</div>
            <div className="col-total header-label">TOTAL</div>
          </div>

          {cartItems.length === 0 ? (
            <p className="empty">The cart is empty...</p>
          ) : (
            cartItems.map((item) => {
              return (
                <div key={item.productId} className="cart-row">
                  <div className="col-product">
                    <div
                      className="cart-product-info"
                      onClick={() => navigate(`/wine/${item.productId}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="cart-product-img">
                        <img src={item.imageUrl} alt={item.title} />
                      </div>

                      <div className="cart-product-text">
                        <h3>{item.title}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-price">
                    <span>{(item.total / item.quantity).toLocaleString("ru-RU")} ₼</span>
                  </div>

                  <div className="col-qty">
                    <div className="quantity">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-total">
                    {item.total.toLocaleString("ru-RU")} ₼
                    <button
                      className="remove"
                      onClick={() => removeItem(item.productId)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="cart-summary">
          <h3>CONTINUE SHOPPING</h3>

          <div className="summary-line">
            <span>Sum</span>
            <span>{cartSummary.subtotal.toLocaleString("ru-RU")} ₼</span>
          </div>

          <div className="summary-line">
            <span>Delivery</span>
            <span>{cartSummary.shippingPrice.toLocaleString("ru-RU")} ₼</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>For payment</span>
            <span>{(cartSummary.subtotal + cartSummary.shippingPrice).toLocaleString("ru-RU")} ₼</span>
          </div>

          <button className="checkout-btn" onClick={openCheckout}>
            PLACE AN ORDER
          </button>
        </div>
      </div>

      <PaymentModal
        isOpen={isPayOpen}
        onClose={() => setIsPayOpen(false)}
        cartItems={cartItems}
        cartSummary={cartSummary}
        onSuccess={async () => {
          await loadCart();
          window.dispatchEvent(new Event("cartUpdated"));
        }}
      />
    </div>
  );
}