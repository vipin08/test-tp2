import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { fetchProductsPage, fetchProductsByCategory, setPage, resetCategory } from '../features/productSlice';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pages, currentPage, totalPages, filteredProducts, currentCategory, loading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (!pages[1] && currentCategory === 'all') {
      dispatch(fetchProductsPage(1));
    }
  }, [dispatch, pages, currentCategory]);

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      if (pages[nextPage]) {
        dispatch(setPage(nextPage));
      } else {
        dispatch(fetchProductsPage(nextPage));
      }
    }
  };

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 1) {
      dispatch(setPage(prevPage));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === 'all') {
      dispatch(resetCategory());
      if (!pages[1]) {
        dispatch(fetchProductsPage(1));
      } else {
        dispatch(setPage(1));
      }
    } else {
      dispatch(fetchProductsByCategory(selectedCategory));
    }
  };

  const displayProducts = currentCategory === 'all' ? (pages[currentPage] || []) : filteredProducts;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h2>Product Catalog</h2>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="category-select" style={{ marginRight: '10px' }}>Select Category: </label>
        <select id="category-select" value={currentCategory} onChange={handleCategoryChange} style={{ padding: '5px' }}>
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="grocery">Grocery</option>
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
          {displayProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            displayProducts.map((product) => (
              <div key={product._id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{product.title}</h4>
                <p style={{ margin: '0', color: '#555' }}>Category: {product.category} | Price: ${product.price}</p>
              </div>
            ))
          )}
        </div>
      )}

      {currentCategory === 'all' && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1 || loading}
            style={{ padding: '8px 16px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          
          <span>Page {currentPage} of {totalPages}</span>
          
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages || loading}
            style={{ padding: '8px 16px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;