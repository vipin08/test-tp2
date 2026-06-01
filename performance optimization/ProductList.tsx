import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState<number>(0);
  const limit = 5;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
          { signal }
        );
        const data = await response.json();
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Request Cancelled');
        } else {
          console.error('Fetch error:', error);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [skip]);

  const handleLoadMore = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {products.map((product) => (
          <div key={product.id}>
            {/* Display requirements for Part 2 */}
            <p style={{ textAlign: 'center', margin: '5px 0' }}>
              {product.title} - ${product.price}
            </p>
            <ProductCard 
              title={product.title}
              price={product.price}
              thumbnail={product.thumbnail}
            />
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={handleLoadMore}
          style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '16px' }}
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default ProductList;