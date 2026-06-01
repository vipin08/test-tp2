import React from 'react';

interface ProductCardProps {
  title: string;
  price: number;
  thumbnail: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, price, thumbnail }) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      margin: '10px 0',
      maxWidth: '300px',
      textAlign: 'center'
    }}>
      <img 
        src={thumbnail} 
        alt={title} 
        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} 
      />
      <h3>{title}</h3>
      <p style={{ fontWeight: 'bold' }}>${price}</p>
    </div>
  );
};

export default ProductCard;