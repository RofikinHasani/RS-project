import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function money(n) {
  return '$' + n.toFixed(2);
}

export default function CartDrawer() {
  const {
    cart, subtotal, tax, total,
    changeQty, removeFromCart,
    drawerOpen, closeDrawer,
    view, goToInvoice, backToCart, confirmOrder,
    placingOrder, orderError, placedOrder,
    toast,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const title = view === 'invoice' ? 'Your Invoice' : 'Your Order';

  function handleCheckoutClick() {
    if (!isAuthenticated) {
      closeDrawer();
      navigate('/login', { state: { from: { pathname: location.pathname } } });
      return;
    }
    goToInvoice();
  }

  return (
    <>
      <div className={`cart-overlay${drawerOpen ? ' open' : ''}`} onClick={closeDrawer}></div>
      <aside className={`cart-drawer${drawerOpen ? ' open' : ''}`} aria-label="Shopping cart">
        <div className="cart-drawer-header">
          <h5 id="cartDrawerTitle">{title}</h5>
          <button id="cartCloseBtn" aria-label="Close cart" onClick={closeDrawer}>&times;</button>
        </div>

        <div className="cart-drawer-body" id="cartItemsContainer">
          {view === 'cart' && (
            cart.length === 0 ? (
              <div className="cart-empty">Your order is empty.<br />Add a dish from the Menu to get started.</div>
            ) : (
              cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">{money(item.price)} each</div>
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => changeQty(item.id, -1)}>&minus;</button>
                    <span>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)}>&plus;</button>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              ))
            )
          )}

          {view === 'invoice' && (
            <>
              <div className="invoice-box">
                <div className="inv-row"><strong>Order Preview</strong><span>{cart.reduce((n, i) => n + i.qty, 0)} items</span></div>
                <hr />
                {cart.map((i) => (
                  <div className="inv-row" key={i.id}>
                    <span>{i.qty} x {i.name}</span><span>{money(i.price * i.qty)}</span>
                  </div>
                ))}
                <hr />
                <div className="inv-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                <div className="inv-row"><span>Tax (10%)</span><span>{money(tax)}</span></div>
                <div className="inv-row"><strong>Total</strong><strong>{money(total)}</strong></div>
              </div>

              {orderError && <div className="auth-error mt-3">{orderError}</div>}

              <button className="btn btn-ember w-100 mt-3" onClick={confirmOrder} disabled={placingOrder}>
                {placingOrder ? 'Placing Order…' : 'Confirm & Place Order'}
              </button>
              <button className="btn btn-outline-ink w-100 mt-2" onClick={backToCart} disabled={placingOrder}>Back to Order</button>
            </>
          )}

          {view === 'success' && (
            <div className="invoice-success">
              <div className="check-circle">&#10003;</div>
              <h5 className="mb-2">Order Placed!</h5>
              <p className="text-muted mb-1">Thank you. Your kitchen ticket has been sent &mdash; we&rsquo;ll have it ready shortly.</p>
              {placedOrder?.order_no && (
                <p className="text-muted mb-0"><strong>Order #{placedOrder.order_no}</strong></p>
              )}
            </div>
          )}
        </div>

        {view === 'cart' && cart.length > 0 && (
          <div className="cart-drawer-footer" id="cartFooter">
            <div className="d-flex justify-content-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="d-flex justify-content-between"><span>Tax (10%)</span><span>{money(tax)}</span></div>
            <div className="d-flex justify-content-between fw-bold"><span>Total</span><span>{money(total)}</span></div>
            <button className="btn btn-ember w-100 mt-3" onClick={handleCheckoutClick}>Checkout &amp; View Invoice</button>
          </div>
        )}
      </aside>
      <div className={`toast-add${toast ? ' show' : ''}`}>{toast}</div>
    </>
  );
}
