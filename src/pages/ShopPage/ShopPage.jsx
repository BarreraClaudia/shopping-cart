import { useOutletContext } from 'react-router-dom';

import useFetchProducts from '../../hooks/useFetchProducts';
import ProductCard from '../../components/ProductCard/ProductCard';

import styles from './ShopPage.module.css';

function ShopPage() {
  const { products, error, loading } = useFetchProducts();

  const { addToCart } = useOutletContext();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error)
    return <p className={styles.error}>A network error was encountered</p>;

  return (
    <div className={styles.shopPageContainer}>
      <h2 className={styles.shopHeading}>
        The <span>Drop</span>
      </h2>
      <div className={styles.cardsContainer}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default ShopPage;
