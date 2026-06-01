import React, { useState, lazy, Suspense } from 'react';

const ProductList = lazy(() => import('./ProductList'));

function App() {
  const [showProducts, setShowProducts] = useState<boolean>(false);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Performance Optimization Demo</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => setShowProducts(true)}
          style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '16px' }}
        >
          Show Products
        </button>
      </div>

      {showProducts && (
        <Suspense fallback<div style={{ textAlign: 'center', fontSize: '18px' }}>Loading Products...</div>}>
          <ProductList />
        </Suspense>
      )}
    </div>
  );
}

export default App;