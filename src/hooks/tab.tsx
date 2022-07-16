/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useContext, ReactNode, useState } from 'react';

type CurrentOptions = 'customers' | 'products' | 'orders';

type TabContextData = {
  current: CurrentOptions;
  setCurrent: React.Dispatch<React.SetStateAction<CurrentOptions>>;
};

const TabContext = createContext<TabContextData>({} as TabContextData);

type TabProviderProps = {
  children: ReactNode;
};

function TabProvider({ children }: TabProviderProps): JSX.Element {
  const [current, setCurrent] = useState<CurrentOptions>('customers');

  return (
    <TabContext.Provider value={{ current, setCurrent }}>
      {children}
    </TabContext.Provider>
  );
}

function useTab(): TabContextData {
  const context = useContext(TabContext);

  if (!context) {
    throw new Error('useTab should be used within a TabProvider');
  }

  return context;
}

export { useTab, TabProvider };
