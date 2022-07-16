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

type CustomersContextData = {
  customers: Customer[];
  create(data: CreateProps): Promise<void>;
  remove(data: RemoveProps): Promise<void>;
  update(data: UpdateProps): Promise<void>;
  updateAddress(data: UpdateAddressProps): Promise<void>;
  removeAddress(data: RemoveProps): Promise<void>;
  createCustomerAddress(data: CreateCustomerAddressProps): Promise<void>;
};

export type CustomerAddress = {
  id: string;
  cep: string;
  number: string;
  street: string;
  district: string;
  state: string;
  country: string;
};

export type Customer = {
  id: string;
  cnpj: string;
  corporate_name: string;
  phone: string;
  customer_address_id?: string;
  customer_address?: CustomerAddress;
};

type CreateProps = {
  cnpj: string;
  corporate_name: string;
  phone: string;
};

type CreateCustomerAddressProps = {
  user_id: string;
  cep: string;
  number: string;
  district: string;
  country: string;
  state: string;
  street: string;
};

type UpdateProps = {
  customer_id: string;
  corporate_name: string;
  phone: string;
};

type UpdateAddressProps = {
  customer_id: string;
  cep: string;
  number: string;
  district: string;
  country: string;
  state: string;
  street: string;
};

type RemoveProps = {
  customer_id: string;
};

const CustomersContext = createContext<CustomersContextData>(
  {} as CustomersContextData,
);

type CustomerProviderProps = {
  children: ReactNode;
};

function CustomersProvider({ children }: CustomerProviderProps): JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const { auth } = useAuth();

  const loadCustomers = useCallback(async () => {
    const { data } = await api.get<Customer[]>('/customers');

    return data;
  }, []);

  const create = useCallback(
    async ({ cnpj, corporate_name, phone }: CreateProps) => {
      const { data } = await api.post<Customer>('/customers', {
        cnpj,
        corporate_name,
        phone,
      });

      setCustomers(prev => [...prev, data]);
    },
    [],
  );

  const update = useCallback(
    async ({ customer_id, corporate_name, phone }: UpdateProps) => {
      const { data } = await api.put<Customer>(`/customers/${customer_id}`, {
        corporate_name,
        phone,
      });

      const newCustomers = [...customers];

      const findCustomerIndex = newCustomers.findIndex(
        customer => customer.id === customer_id,
      );

      newCustomers[findCustomerIndex] = data;

      setCustomers(newCustomers);
    },
    [customers],
  );

  const remove = useCallback(async ({ customer_id }: RemoveProps) => {
    await api.delete(`/customers/${customer_id}`);

    setCustomers(prev => prev.filter(customer => customer.id !== customer_id));
  }, []);

  const createCustomerAddress = useCallback(
    async ({
      user_id,
      cep,
      country,
      district,
      number,
      state,
      street,
    }: CreateCustomerAddressProps) => {
      const { data } = await api.post<Customer>(
        `/customers/${user_id}/address`,
        {
          cep,
          country,
          district,
          number,
          state,
          street,
        },
      );

      const customerIndex = customers.findIndex(
        customer => customer.id === user_id,
      );

      const newCustomers = [...customers];

      newCustomers[customerIndex] = {
        ...data,
      };

      setCustomers(newCustomers);
    },
    [customers],
  );

  const updateAddress = useCallback(
    async ({
      customer_id,
      cep,
      country,
      district,
      number,
      state,
      street,
    }: UpdateAddressProps) => {
      const { data } = await api.put<CustomerAddress>(
        `/customers/${customer_id}/address`,
        {
          cep,
          country,
          district,
          number,
          state,
          street,
        },
      );

      const newCustomers = [...customers];

      const findCustomerIndex = customers.findIndex(
        customer => customer.id === customer_id,
      );

      newCustomers[findCustomerIndex].customer_address = data;
      newCustomers[findCustomerIndex].customer_address_id = data.id;

      setCustomers(newCustomers);
    },
    [customers],
  );

  const removeAddress = useCallback(
    async ({ customer_id }: RemoveProps) => {
      await api.delete(`/customers/${customer_id}/address`);

      const newCustomers = [...customers];

      const findCustomerIndex = customers.findIndex(
        customer => customer.id === customer_id,
      );

      newCustomers[findCustomerIndex].customer_address_id = undefined;
      newCustomers[findCustomerIndex].customer_address = undefined;

      setCustomers(newCustomers);
    },
    [customers],
  );

  useEffect(() => {
    loadCustomers().then(response => setCustomers(response));
  }, [loadCustomers, auth.user]);

  return (
    <CustomersContext.Provider
      value={{
        customers,
        create,
        remove,
        update,
        updateAddress,
        removeAddress,
        createCustomerAddress,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
}

function useCustomers(): CustomersContextData {
  const context = useContext(CustomersContext);

  if (!context) {
    throw new Error('useCustomers should be used within an CustomersProvider');
  }

  return context;
}

export { CustomersProvider, useCustomers };
