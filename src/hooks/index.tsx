import { ReactNode } from 'react';
import { AuthProvider } from './auth';
import { CustomersProvider } from './customers';
import { OrdersProvider } from './orders';
import { ProductsProvider } from './products';
import { StocksProvider } from './stocks';
import { TabProvider } from './tab';

type AppProviderProps = {
  children: ReactNode;
};

function AppProvider({ children }: AppProviderProps): JSX.Element {
  return (
    <AuthProvider>
      <TabProvider>
        <StocksProvider>
          <ProductsProvider>
            <OrdersProvider>
              <CustomersProvider>{children}</CustomersProvider>
            </OrdersProvider>
          </ProductsProvider>
        </StocksProvider>
      </TabProvider>
    </AuthProvider>
  );
}

export default AppProvider;
