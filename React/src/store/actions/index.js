import  api  from '../../api/api'

export const fetchProducts = (queryString) => async(dispatch) => {
    try {
        dispatch({ type: 'IS_FETCHING' });
        const { data } = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: 'FETCH_PRODUCTS',
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: 'IS_SUCCESS' });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: 'IS_ERROR',
            payload: error?.response?.data?.message || 'Failed to fetch products',
        });
    }
}

export const fetchDashboardOrders = (queryString) => async(dispatch) => {
    try {
        dispatch({ type: 'IS_FETCHING' });
        const { data } = await api.get(`/admin/orders?${queryString}`);
        dispatch({
            type: 'FETCH_DASHBOARD_ORDERS',
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: 'IS_SUCCESS' });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: 'IS_ERROR',
            payload: error?.response?.data?.message || 'Failed to fetch dashboard orders',
        });
    }
}


export const fetchCategories = () => async(dispatch) => {
    try {
        dispatch({ type: 'CATEGORY_LOADER' });
        const { data } = await api.get(`/public/categories`);
        dispatch({
            type: 'FETCH_CATEGORIES',
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: 'CATEGORY_SUCCESS' });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: 'IS_ERROR',
            payload: error?.response?.data?.message || 'Failed to fetch categories',
        });
    }
}

export const addToCart = (data, qty = 1, toast) =>
    (dispatch, getState) => {
        const { products } = getState().products;
        const getProduct = products.find((item) => item.productId === data.productId);

        const quantityEnough = getProduct.quantity >= qty

        if (quantityEnough) {
            dispatch({ type: 'ADD_CART', payload: {...data, quantity: qty} })
            toast.success(`${data?.productName} added to cart successfully`)
            localStorage.setItem('cartItems', JSON.stringify(getState().carts.cart))
        } else {
            toast.error('Out of stock')
        }
}

export const increaseCartQuantity = 
    (data, toast, currentQuantity, setCurrentQuantity) => 
    (dispatch, getState) => {
        const { products } = getState().products;
        const getProduct = products.find((item) => item.productId === data.productId);

        const quantityEnough = getProduct.quantity >= currentQuantity + 1

        if (quantityEnough) {
            const newQuantity = currentQuantity + 1;
            setCurrentQuantity(newQuantity)
            dispatch({ type: 'ADD_CART', payload: {...data, quantity: newQuantity} })
            localStorage.setItem('cartItems', JSON.stringify(getState().carts.cart))
        } else {
            toast.error('No more stock available')
        }
}  

export const decreaseCartQuantity =  (data, newQuantity) =>  (dispatch, getState) => {
    dispatch({ type: 'ADD_CART', payload: {...data, quantity: newQuantity} })
    localStorage.setItem('cartItems', JSON.stringify(getState().carts.cart))
}

export const removeFromCart = (data, toast) => (dispatch, getState) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: data })
    toast.success(`${data?.productName} removed from cart`)
    localStorage.setItem('cartItems', JSON.stringify(getState().carts.cart))
}

export const authenticateUser = (loginData, toast, reset, navigate, setLoader) => async(dispatch) => {
    try {
        setLoader(true);
        const { data } = await api.post("/auth/signin", loginData);
        dispatch({ type: 'AUTHENTICATE_USER', payload: data });
        localStorage.setItem('auth', JSON.stringify(data));
        toast.success('Login successful');
        reset();
        navigate('/');
    } catch(error) {
        console.log(error);
        toast.error('Wrong credentials');
    } finally {
        setLoader(false);
    }
}

export const registerUser = (registerData, toast, reset, navigate, setLoader) => async(dispatch) => {
     try {
        setLoader(true);
        const { data } = await api.post("/auth/signup", registerData);
        toast.success(data?.message || 'User registered successfully');
        reset();
        navigate('/login');
    } catch(error) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Internal Server Error');
    } finally {
        setLoader(false);
    }
}

export const logoutUser = (navigate, toast) => (dispatch) => {
    dispatch({ type: 'LOGOUT_USER' });
    localStorage.removeItem('auth');
    toast.success('Logged out successfully');
    navigate('/login');
}

export const addUpdateUserAddress = 
    (addressData, toast, setOpenAddressModal, addressId) => async(dispatch, getState) => {

    const { user } = getState().auth;
    dispatch({ type: 'BUTTON_LOADER' });

    try {

        if (addressId) {
            await api.put(`/addresses/${addressId}`, addressData);
        } else {
            const { data } = await api.post("/addresses", addressData);
        }
        dispatch(fetchUserAddresses())
        toast.success('Address saved successfully');
        dispatch({ type: 'IS_SUCCESS' })
    } catch(error) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Internal Server Error');
        dispatch({ type: 'IS_ERROR', payload: null })
    } finally {
        setOpenAddressModal(false)
    }
}

export const fetchUserAddresses = () => async(dispatch, getState) => {
    try {
        dispatch({ type: 'IS_FETCHING' });
        const { data } = await api.get(`/addresses`);
        dispatch({ type: 'FETCH_USER_ADDRESSES', payload: data});
        dispatch({ type: 'IS_SUCCESS' });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: 'IS_ERROR',
            payload: error?.response?.data?.message || 'Failed to fetch user addresses',
        });
    }
}

export const selectUserCheckoutAddress = (address) => {
    localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address))
    return {
        type: "SELECT_CHECKOUT_ADDRESS",
        payload: address,
    }
}

export const deleteUserAddress = 
    (toast, addressId, setOpenDeleteModal) => async (dispatch, getState) => {
    try {
        dispatch({ type: "BUTTON_LOADER" });
        await api.delete(`/addresses/${addressId}`);
        dispatch({ type: "IS_SUCCESS" });
        dispatch(fetchUserAddresses());
        dispatch(clearCheckoutAddress());
        toast.success("Address deleted successfully");
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Some Error Occured",
         });
    } finally {
        setOpenDeleteModal(false);
    }
};

export const clearCheckoutAddress = () => {
    return {
        type: "REMOVE_CHECKOUT_ADDRESS",
    }
};

export const addPaymentMethod = (method) => {
    return {
        type: "ADD_PAYMENT_METHOD",
        payload: method,
    }
}

export const createUserCart = (sendCartItems) => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        await api.post('/cart/create', sendCartItems);
        await dispatch(getUserCart());
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to create cart items",
         });
    }
};

export const getUserCart = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get('/carts/users/cart');

        const normalizedProducts = (data.products || []).map((p) => {
            const image = p?.image;
            return {
                ...p,
                image: `${import.meta.env.VITE_BACK_END_URL}/images/${image}`
            };
        });

        dispatch({
            type: "GET_USER_CART_PRODUCTS",
            payload: normalizedProducts,
            totalPrice: data.totalPrice,
            cartId: data.cartId
        })
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch cart items",
         });
    }
}

export const createStripePaymentSecret = (sendData) => async (dispatch, getState) => {
        try {
            dispatch({ type: "IS_FETCHING" });
            const { data } = await api.post("/order/stripe-client-secret", sendData);
            dispatch({ type: "CLIENT_SECRET", payload: data });
              localStorage.setItem("client-secret", JSON.stringify(data));
              dispatch({ type: "IS_SUCCESS" });
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to create client secret");
        }
};

export const stripePaymentConfirmation = (sendData ,setErrorMessage, setLoading, toast) => async (dispatch, getState) => {
        try {
            const response  = await api.post('/order/users/payments/online',sendData);

            if (response.data) {
                localStorage.removeItem("CHECKOUT_ADDRESS")
                localStorage.removeItem("cartItems")
                localStorage.removeItem("client-secret")
                dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS"});
                dispatch({ type: "CLEAR_CART" })
                toast.success("Order Accepted")
            } else {
                setErrorMessage("Payment Failed, please try again")
            }

        } catch (error) {
            console.log(error);
            setErrorMessage("Payment Failed, please try again");
        }
};

export const getAnalytics = () => async (dispatch, getState) => {
        try {
            dispatch({ type: "IS_FETCHING" })
            const { data } = await api.get('/admin/app/analytics');
            dispatch({ type: 'FETCH_ANALYTICS', payload: data, })
            dispatch({ type: "IS_SUCCESS" });
        } catch (error) {
            dispatch({ type: "IS_ERROR", payload: error?.response?.data?.message || 
                                        'Failed to fetch analytics data' })
        }
};

export const updateOrderStatusFromDashboard =
     (orderId, orderStatus, toast, setLoader, isAdmin) => async (dispatch, getState) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/orders/" : "/seller/orders/";
        const { data } = await api.put(`${endpoint}${orderId}/status`, { status: orderStatus});
        toast.success(data.message || "Order updated successfully");
        await dispatch(fetchDashboardOrders());
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
        setLoader(false)
    }
};

export const dashboardFetchProducts = (queryString) => async(dispatch) => {
    try {
        dispatch({ type: 'IS_FETCHING' });
        const { data } = await api.get(`/admin/products?${queryString}`);
        dispatch({
            type: 'FETCH_PRODUCTS',
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: 'IS_SUCCESS' });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: 'IS_ERROR',
            payload: error?.response?.data?.message || 'Failed to fetch products',
        });
    }
}

export const updateProductAdmin = (sendData, toast, reset, setLoader, setOpen) => async(dispatch) => {
    try {
        setLoader(true)
        await api.put(`/admin/products/${sendData.id}`, sendData)
        toast.success('Product updated successfully')
        reset()
        setLoader(false)
        setOpen(false)
        await dispatch(dashboardFetchProducts())
    } catch(error) {
        toast.error(error?.response?.data?.description || 'Product update failed')
    }
}

export const addNewProductFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen, isAdmin) => async(dispatch, getState) => {
        try {
            setLoader(true);
            const endpoint = isAdmin ? "/admin/categories/" : "/seller/categories/";
            await api.post(`${endpoint}${sendData.categoryId}/product`,
                sendData
            );
            toast.success("Product created successfully");
            reset();
            setOpen(false);
            await dispatch(dashboardProductsAction());
        } catch (error) {
            console.error(err);
            toast.error(err?.response?.data?.description || "Product creation failed");
        } finally {
            setLoader(false);
        }
    }

export const deleteProduct = (setLoader, productId, toast, setOpenDeleteModal, isAdmin) => async (dispatch, getState) => {
    try {
        setLoader(true)
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        await api.delete(`${endpoint}${productId}`);
        toast.success("Product deleted successfully");
        setLoader(false);
        setOpenDeleteModal(false);
        await dispatch(dashboardFetchProducts());
    } catch (error) {
        console.log(error);
        toast.error(
            error?.response?.data?.message || "Some Error Occured"
        )
    }
};

export const updateProductImageFromDashboard = (formData, productId, toast, setLoader, setOpen, isAdmin) => async (dispatch) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        await api.put(`${endpoint}${productId}/image`, formData);
        toast.success("Image upload successful");
        setLoader(false);
        setOpen(false);
        await dispatch(dashboardFetchProducts());
    } catch (error) {
        toast.error(error?.response?.data?.description || "Product Image upload failed");
    }
};

export const createCategoryDashboardAction = (sendData, setOpen, reset, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });
      await api.post("/admin/categories", sendData);
      dispatch({ type: "CATEGORY_SUCCESS" });
      reset();
      toast.success("Category Created Successful");
      setOpen(false);
      await dispatch(fetchCategories());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to create new category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
};

export const updateCategoryDashboardAction = (sendData, setOpen, categoryID, reset, toast) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.put(`/admin/categories/${categoryID}`, sendData);

      dispatch({ type: "CATEGORY_SUCCESS" });

      reset();
      toast.success("Category Update Successful");
      setOpen(false);
      await dispatch(fetchCategories());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to update category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
};

export const deleteCategoryDashboardAction = (setOpen, categoryID, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.delete(`/admin/categories/${categoryID}`);

      dispatch({ type: "CATEGORY_SUCCESS" });

      toast.success("Category Delete Successful");
      setOpen(false);
      await dispatch(fetchCategories());
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to delete category");
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };