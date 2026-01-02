const initialState = {
    user: null,
    address: [],
    clientSecret: null,
    selectedUserCheckoutAddress: null,
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'AUTHENTICATE_USER':
            return { ...state, user: action.payload };

        case 'FETCH_USER_ADDRESSES':
            return { ...state, address: action.payload };
            
        case 'SELECT_CHECKOUT_ADDRESS':
            return { ...state, selectedUserCheckoutAddress: action.payload };    

        case "REMOVE_CHECKOUT_ADDRESS":
            return { ...state, selectedUserCheckoutAddress: null };   
            
        case "CLIENT_SECRET":
            return { ...state, clientSecret: action.payload };

        case "REMOVE_CLIENT_SECRET_ADDRESS":
            return { ...state, clientSecret: null, selectedUserCheckoutAddress: null  };    

        case 'LOGOUT_USER':
            return { user: null, address: null };

        default:
            return state;    
            
    }
}

