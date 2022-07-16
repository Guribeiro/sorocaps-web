/* eslint-disable react/jsx-no-constructed-context-values */
import {
  useContext,
  ReactNode,
  createContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { Product } from './products';
import api from '../shared/services/api';
import currencyFormatter from '../utils/currencyFormatter';

type StocksContextData = {
  loading: boolean;
  stocks: StockState[];
};

const StocksContext = createContext<StocksContextData>({} as StocksContextData);

type OrdersProviderProps = {
  children: ReactNode;
};

type Stock = {
  id: string;
  product_id: string;
  product: Product;
  price_unit: number;
  amount: number;
};

type StockState = Stock & {
  price_unit_formatted: string;
};

function StocksProvider({ children }: OrdersProviderProps): JSX.Element {
  const [stocks, setStocks] = useState<StockState[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStocks = useCallback(async () => {
    setLoading(true);
    const { data } = await api.get<Stock[]>('/stocks');

    setLoading(false);
    return data;
  }, []);

  useEffect(() => {
    loadStocks().then(response => {
      setStocks(
        response.map(stock => ({
          ...stock,
          price_unit_formatted: currencyFormatter(stock.price_unit),
        })),
      );
    });
  }, [loadStocks]);

  return (
    <StocksContext.Provider value={{ loading, stocks }}>
      {children}
    </StocksContext.Provider>
  );
}

function useStocks(): StocksContextData {
  const context = useContext(StocksContext);

  if (!context) {
    throw new Error('useStocks should be used within an StocksProvider');
  }

  return context;
}

export { useStocks, StocksProvider };
