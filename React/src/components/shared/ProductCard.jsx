import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";
import { truncateText } from "../../utils/truncateText";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/actions";
import toast from "react-hot-toast";

const ProductCard = ({
  productId,
  productName,
  image,
  description,
  quantity,
  price,
  discount,
  specialPrice,
  about = false
}) => {
  const [openProductViewModal, setOpenProductViewModal] = useState(false);
  const [selectedViewProduct, setSelectedViewProduct] = useState(null);
  const dispatch = useDispatch();
  const buttonLoader = false;
  const isAvailable = quantity && Number(quantity) > 0;

  const handleProductView = (product) => {
    if (!about) {
      setSelectedViewProduct(product);
      setOpenProductViewModal(true);
    }
  };

  const addToCartHandler = (cartItems) => {
    dispatch(addToCart(cartItems, 1, toast));
  };

  const productData = {
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
  };


  return (
    <div className="border rounded-lg shadow-xl overflow-hidden transition-shadow duration-300">
      <div
        onClick={() => handleProductView(productData)}
        className="w-full overflow-hidden aspect-3/2"
      >
        <img
          src={image}
          alt={productName}
          className="w-full h-full cursor-pointer transition-transform duration-300 transform hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h2
          onClick={() => handleProductView(productData)}
          className="text-lg font-semibold mb-2 cursor-pointer"
        >
          {truncateText(productName, 50)}
        </h2>

        <div className="min-h-20 max-h-20">
          <p className="text-gray-600 text-sm">{truncateText(description, 80)}</p>
        </div>

        { !about && 
          <div className="flex items-center justify-between">
          {specialPrice ? (
            <div className="flex flex-col">
              <span className="text-gray-400 line-through">
                ${Number(price).toFixed(2)}
              </span>
              <span className="text-xl font-bold text-slate-700">
                ${Number(specialPrice).toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-700">
                ${Number(price).toFixed(2)}
              </span>
            </div>
          )}

          <button
            disabled={!isAvailable || buttonLoader}
            onClick={() => addToCartHandler({
                        image,
                        productName,
                        description,
                        specialPrice,
                        price,
                        productId,
                        quantity,
                    })}
            className={`bg-blue-500 ${
              isAvailable ? "opacity-100 hover:bg-blue-600" : "opacity-70"
            } text-white py-2 px-3 rounded-lg items-center transition-colors duration-300 w-36 flex justify-center cursor-pointer`}
          >
            <FaShoppingCart className="mr-2" />
            {isAvailable ? "Add to Cart" : "Stock out"}
          </button>
        </div>
        }
        
      </div>

      <ProductViewModal
        open={openProductViewModal}
        setOpen={setOpenProductViewModal}
        product={selectedViewProduct}
        isAvailable={isAvailable}
      />
    </div>
  );
};

export default ProductCard;
