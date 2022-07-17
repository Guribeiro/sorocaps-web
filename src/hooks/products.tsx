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
import { useStocks, Stock, StockState } from './stocks';

type ProductsContextData = {
  loadProducts(): Promise<Product[]>;
  create(data: CreateProps): Promise<void>;
  remove(data: RemoveProps): Promise<void>;
  update(data: UpdateProps): Promise<void>;
  products: ProductState[];
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

type UpdateProps = {
  product_id: string;
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

function ProductsProvider({ children }: ProductsProviderProps): JSX.Element {
  const { auth } = useAuth();
  const [products, setProducts] = useState<ProductState[]>([]);
  const { setStocks, stocks } = useStocks();
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

      const { data: created_stock } = await api.post<Stock>('/stocks', {
        product_id: created_product.id,
        amount,
        limit,
      });

      const newStocks = [...stocks];

      const stockFormatted: StockState = {
        ...created_stock,
        price_unit_formatted: currencyFormatter(created_stock.price_unit),
        product: created_product,
        product_id: created_product.id,
      };

      newStocks.push(stockFormatted);

      setStocks(newStocks);

      const product: ProductState = {
        ...created_product,
        buy_price_formatted: currencyFormatter(created_product.buy_price),
        sale_price_formatted: currencyFormatter(created_product.sale_price),
      };

      setProducts(prev => [...prev, product]);
    },
    [stocks, setStocks],
  );

  const remove = useCallback(async ({ product_id }: RemoveProps) => {
    await api.delete(`/products/${product_id}`);

    setProducts(prev => prev.filter(product => product.id !== product_id));
  }, []);

  const update = useCallback(
    async ({
      product_id,
      bar_code,
      title,
      description,
      quantity_in_units,
      unit_of_measurement,
      buy_price,
      sale_price,
    }: UpdateProps) => {
      const { data: updated_product } = await api.put<Product>(
        `/products/${product_id}`,
        {
          bar_code,
          title,
          description,
          quantity_in_units,
          unit_of_measurement,
          buy_price,
          sale_price,
        },
      );

      const newProducts = [...products];

      const findProductIndex = newProducts.findIndex(
        product => product.id === product_id,
      );

      const updated_product_formatted: ProductState = {
        ...updated_product,
        buy_price_formatted: currencyFormatter(updated_product.buy_price),
        sale_price_formatted: currencyFormatter(updated_product.sale_price),
      };

      newProducts[findProductIndex] = updated_product_formatted;

      setProducts(newProducts);
    },
    [products],
  );

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

    loadStock().then(response => {
      const stocks_formatted = response.map(stock => ({
        ...stock,
        price_unit_formatted: currencyFormatter(stock.price_unit),
      }));

      setStocks(stocks_formatted);
    });
  }, [loadProducts, auth.user, loadStock, setStocks]);

  return (
    <ProductsContext.Provider
      value={{
        loadProducts,
        create,
        remove,
        update,
        products,
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
