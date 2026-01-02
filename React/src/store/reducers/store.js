import { configureStore } from '@reduxjs/toolkit'
import { productReducer } from './productReducer'
import { errorReducer } from './errorReducer'
import { cartReducer } from './cartReducer'
import { authReducer } from './authenticationReducer';
import { paymentMethodReducer } from './paymentMethodReducer';
import { adminReducer } from './adminReducer';
import { orderReducer } from './orderReducer';


const cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

const user = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null;

const selectedUserCheckoutAddress = localStorage.getItem("CHECKOUT_ADDRESS") ? JSON.parse(localStorage.getItem('CHECKOUT_ADDRESS')) : null;

const initialState = {
    auth: { user: user, selectedUserCheckoutAddress },
    carts: { cart: cartItems, }
}

export const store = configureStore({
    reducer: {
        products: productReducer,
        errors: errorReducer,
        carts: cartReducer,
        auth: authReducer,
        payment: paymentMethodReducer,
        admin: adminReducer,
        order: orderReducer,
    },
    preloadedState: initialState,
})

export default store