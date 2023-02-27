import React, { useContext, useState } from 'react';
import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const cartCtx = useContext(CartContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({...item, amount:1});
  };

  const orderHandler = () => {
    setIsCheckout(true);
  }

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
     await fetch('https://react-http-dd11f-default-rtdb.firebaseio.com/orders.json', {
      method: 'POST',
      body: JSON.stringify({
        user: userData, 
        orderedItems: cartCtx.items
      })
    });
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  }
 
  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalAction = (<div className={classes.actions}>
  <button className={classes['button--alt']} onClick={props.onHideClick}>
    Close
  </button>
  {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
</div>);

   const cartModalContent =  (
    <div>
    {cartItems}
   <div className={classes.total}>
     <span>Total Amount</span>
     <span>{totalAmount}</span>
   </div>
   {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onHideClick}/>}
   {!isCheckout && modalAction}
   </div>);

   const isSubmittingModalContent = <p>Sending order data...</p>;
   const didSubmitModalCount = <div>
    <p>Successfully Sent the order...</p>
      <div className={classes.actions}>
        <button className={classes.button}
          onClick={props.onHideClick}>
          Close
        </button>
      </div>
    </div>;

  return (
    <Modal onHideClick={props.onHideClick}>
     {!isSubmitting && !didSubmit && cartModalContent}
     {isSubmitting &&  isSubmittingModalContent}
     {didSubmit && didSubmitModalCount}

    </Modal>
  );
};

export default Cart;