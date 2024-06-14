import  {  useEffect, useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import AddModal from "./Modals/AddModal";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

type Product = {
  _id: string;
  product: string;
  description: string;
  image: string;
  price: string;
};

interface User {
  isAdmin: boolean;
}

const AdminDash = () => {
  const [modal, setModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const currentUser = useSelector((state: RootState) => state.user.currentUser) as User | null;

  
  useEffect(() => {
    fetch('https://go-shop-fbgh.onrender.com/api/get-prod') // Adjust the API endpoint if necessary
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <MaxWidthWrapper className="flex mx-auto p-4">
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => setModal(true)}
          >
            Add Products
          </button>
        </div>
        <AddModal show={modal} onClose={() => setModal(false)} onConfirm={() => setModal(false)} />
      </MaxWidthWrapper>

      <MaxWidthWrapper>
      <h2 className="text-2xl font-semibold mb-10 text-center">Existing Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 h-full flex flex-col">
              <Link key={product._id} to={`/products/${product._id}`} className="block">
                <img src={product.image} alt={product.product} className="w-full h-32 object-cover" />
              </Link>
              <div className="p-3 flex-grow flex flex-col">
                
             
                <h3 className="text-lg font-semibold mb-1 line-clamp-1">{product.product}</h3>
                <p className="text-gray-600 text-sm mb-2 flex-grow line-clamp-2">{product.description}</p>
                <p className="text-gray-600 text-sm mb-2 flex-grow">{product.price}</p>
                {currentUser && currentUser.isAdmin && (
                    <>
                    <h3 className="text-sm mb-2 text-green-600">{product._id}</h3>
                    </>
                  )}
             
              </div>
            </div>
          </div>
        ))}
      </div>
      </MaxWidthWrapper>

    </>
  );
};

export default AdminDash;
