/* eslint-disable react/jsx-no-constructed-context-values */
import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import api from '../shared/services/api';
import { useAuth } from './auth';

import currencyFormatter from '../utils/currencyFormatter';

type ProductsContextData = {
  loadProducts(): Promise<Product[]>;
  create(data: CreateProps): Promise<void>;
  remove(data: RemoveProps): Promise<void>;
  products: ProductState[];
  stocks: Stock[];
  selectedProduct: ProductState;
  setSelectedProduct: React.Dispatch<React.SetStateAction<ProductState>>;
};

const ProductsContext = createContext<ProductsContextData>(
  {} as ProductsContextData,
);

type ProductsProviderProps = {
  children: ReactNode;
};

export type Product = {
  id: string;
  bar_code: string;
  title: string;
  description: string;
  unit_of_measurement: string;
  quantity_in_units: number;
  buy_price: number;
  sale_price: number;
};

export type ProductState = Product & {
  buy_price_formatted: string;
  sale_price_formatted: string;
};

type RemoveProps = {
  product_id: string;
};

type CreateProps = {
  bar_code: string;
  title: string;
  description: string;
  quantity_in_units: number;
  unit_of_measurement: string;
  buy_price: number;
  sale_price: number;
  amount: number;
  limit: number;
};

type Stock = {
  id: string;
  amount: string;
  price_unit: number;
};

function ProductsProvider({ children }: ProductsProviderProps): JSX.Element {
  const { auth } = useAuth();
  const [products, setProducts] = useState<ProductState[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductState>(
    {} as ProductState,
  );

  const loadProducts = useCallback(async () => {
    const { data } = await api.get<Product[]>('/products');

    return data;
  }, []);

  const loadStock = useCallback(async () => {
    const { data } = await api.get<Stock[]>('/stocks');

    return data;
  }, []);

  const create = useCallback(
    async ({
      bar_code,
      title,
      description,
      quantity_in_units,
      unit_of_measurement,
      buy_price,
      sale_price,
      amount,
      limit,
    }: CreateProps) => {
      const { data: created_product } = await api.post<Product>('/products', {
        bar_code,
        title,
        description,
        quantity_in_units,
        unit_of_measurement,
        buy_price,
        sale_price,
      });

      await api.post('/stocks', {
        product_id: created_product.id,
        amount,
        limit,
      });

      const product: ProductState = {
        ...created_product,
        buy_price_formatted: currencyFormatter(created_product.buy_price),
        sale_price_formatted: currencyFormatter(created_product.sale_price),
      };

      setProducts(prev => [...prev, product]);
    },
    [],
  );

  const remove = useCallback(async ({ product_id }: RemoveProps) => {
    await api.delete(`/products/${product_id}`);

    setProducts(prev => prev.filter(product => product.id !== product_id));
  }, []);

  useEffect(() => {
    loadProducts().then(response => {
      setProducts(
        response.map(product => ({
          ...product,
          buy_price_formatted: currencyFormatter(product.buy_price),
          sale_price_formatted: currencyFormatter(product.sale_price),
        })),
      );
    });

    loadStock().then(response => setStocks(response));
  }, [loadProducts, auth.user, loadStock]);

  return (
    <ProductsContext.Provider
      value={{
        loadProducts,
        create,
        remove,
        products,
        stocks,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

function useProducts(): ProductsContextData {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('useProducts should be used within an ProductsProvider');
  }

  return context;
}

export { useProducts, ProductsProvider };
