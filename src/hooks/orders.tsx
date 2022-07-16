/* eslint-disable react/jsx-no-constructed-context-values */
import {
  useContext,
  ReactNode,
  createContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { Product, useProducts } from './products';
import { useStocks } from './stocks';
import currencyFormatter from '../utils/currencyFormatter';
import api from '../shared/services/api';
import { useAuth } from './auth';
import { Customer } from './customers';
import dateFormatter from '../utils/dateFormatter';

type OrdersContextData = {
  loading: boolean;
  orders: OrderState[];
  setStatusFilter: React.Dispatch<React.SetStateAction<Status>>;
  productsOrder: ProductOrder[];
  addProductToOrder(data: AddProductToOrderProps): Promise<void>;
  updateProductOrderAmount(data: UpdateProductOrderAmount): Promise<void>;
  clearProductsOrder(): void;
  removeProductOrder(data: RemoveProductOrderProps): Promise<void>;
  createProductOrder(data: CreateProductsOrder): Promise<void>;
  approveOrder(data: ApproveOrderProps): Promise<void>;
};

const OrdersContext = createContext<OrdersContextData>({} as OrdersContextData);

type OrdersProviderProps = {
  children: ReactNode;
};

export type Status = 'approved' | 'pending';

export type Order = {
  id: string;
  customer_id: string;
  status: Status;
  price: number;
  customer: Customer;
  created_at: string;
};

export type OrderState = Order & {
  status_formatted: string;
  price_formatted: string;
  created_at_formatted: string;
};

type StatusVariation = {
  [key: string]: string;
};

const statusVariations: StatusVariation = {
  approved: 'Aprovado',
  pending: 'Pendente',
};

export type ProductOrder = Product & {
  amount: number;
};

type AddProductToOrderProps = {
  product_id: string;
};

type UpdateProductOrderAmount = {
  product_id: string;
  amount: number;
};

type RemoveProductOrderProps = {
  product_id: string;
};

type CreateProductsOrder = {
  customer_id: string;
};

type ApproveOrderProps = {
  order_id: string;
};

function OrdersProvider({ children }: OrdersProviderProps): JSX.Element {
  const [orders, setOrders] = useState<OrderState[]>([]);
  const [productsOrder, setProductsOrder] = useState<ProductOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Status>('pending');
  const { auth } = useAuth();

  const { stocks } = useStocks();
  const { products } = useProducts();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await api.get<Order[]>('/orders', {
      params: {
        status: statusFilter,
      },
    });

    setLoading(false);
    return data;
  }, [statusFilter]);

  useEffect(() => {
    loadOrders().then(response => {
      setOrders(
        response.map(order => ({
          ...order,
          status_formatted: statusVariations[order.status],
          price_formatted: currencyFormatter(order.price),
          created_at_formatted: dateFormatter(order.created_at),
        })),
      );
    });
  }, [loadOrders, auth.user]);

  const addProductToOrder = useCallback(
    async ({ product_id }: AddProductToOrderProps) => {
      const updatedProductsOrder = [...productsOrder];

      const productOrderExists = updatedProductsOrder.find(
        productOrder => productOrder.id === product_id,
      );

      const productStock = stocks.find(
        stock => stock.product_id === product_id,
      );

      if (!productStock) {
        throw new Error('Produto não pôde ser encontrado');
      }

      const productStockAmount = productStock.amount;

      const currentProductOrderAmount = productOrderExists
        ? productOrderExists.amount
        : 0;

      const amount = currentProductOrderAmount + 1;

      if (amount > productStockAmount) {
        throw new Error('Quantidade fora de estoque');
      }

      if (productOrderExists) {
        productOrderExists.amount = amount;

        const findProductOrderIndex = productsOrder.findIndex(
          productOrder => productOrder.id === productOrderExists.id,
        );

        updatedProductsOrder[findProductOrderIndex] = productOrderExists;

        setProductsOrder(updatedProductsOrder);
      } else {
        const findProduct = products.find(product => product.id === product_id);

        if (!findProduct) {
          throw new Error('Produto não pôde ser encontrado');
        }

        const newProductOrder = {
          ...findProduct,
          amount: 1,
        };

        updatedProductsOrder.push(newProductOrder);

        setProductsOrder(updatedProductsOrder);
      }
    },
    [products, productsOrder, stocks],
  );

  const clearProductsOrder = useCallback(() => {
    setProductsOrder([]);
  }, []);

  const updateProductOrderAmount = useCallback(
    async ({ product_id, amount }: UpdateProductOrderAmount) => {
      if (amount <= 0) return;

      const updatedProductsOrder = [...productsOrder];

      const findProduct = updatedProductsOrder.find(
        product => product.id === product_id,
      );

      if (!findProduct) {
        throw new Error();
      }

      const productStock = stocks.find(
        stock => stock.product_id === product_id,
      );

      if (!productStock) {
        throw new Error();
      }

      const productStockAmount = productStock.amount;

      if (amount > productStockAmount) {
        throw new Error('quantidade fora de estoque');
      }

      findProduct.amount = amount;

      setProductsOrder(updatedProductsOrder);
    },
    [productsOrder, stocks],
  );

  const removeProductOrder = useCallback(
    async ({ product_id }: RemoveProductOrderProps) => {
      const updatedProductsOrder = [...productsOrder];

      const findProductOrderIndex = updatedProductsOrder.findIndex(
        productOrder => productOrder.id === product_id,
      );

      if (findProductOrderIndex >= 0) {
        updatedProductsOrder.splice(findProductOrderIndex, 1);

        setProductsOrder(updatedProductsOrder);
      } else {
        throw new Error('aaaa');
      }
    },
    [productsOrder],
  );

  const createProductOrder = useCallback(
    async ({ customer_id }: CreateProductsOrder) => {
      const productsOrderFormatted = productsOrder.map(({ id, amount }) => ({
        id,
        quantity: amount,
      }));

      await api.post('/orders', {
        customer_id,
        products: productsOrderFormatted,
      });
    },
    [productsOrder],
  );

  const approveOrder = useCallback(async ({ order_id }: ApproveOrderProps) => {
    await api.post(`orders/${order_id}`);
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        loading,
        orders,
        setStatusFilter,
        addProductToOrder,
        productsOrder,
        clearProductsOrder,
        updateProductOrderAmount,
        removeProductOrder,
        createProductOrder,
        approveOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

function useOrders(): OrdersContextData {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error('useOrders should be used within an OrdersProvider');
  }

  return context;
}

export { useOrders, OrdersProvider };
