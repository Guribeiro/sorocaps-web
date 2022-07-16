import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  WarningOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { useCustomers } from '../../hooks/customers';
import { useProducts } from '../../hooks/products';

import CustomersTable from '../../components/CustomersTable';
import ProductsTable from '../../components/ProductsTable';
import SaleOrders from '../../components/SaleOrders';
import { useTab } from '../../hooks/tab';
import './styles.css';

type TablesVariations = {
  customers: JSX.Element;
  products: JSX.Element;
  orders: JSX.Element;
};

const { Header, Sider, Content } = Layout;

function Dashboard(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const { customers } = useCustomers();
  const { products } = useProducts();
  const { current, setCurrent } = useTab();

  const tables: TablesVariations = {
    customers: <CustomersTable label="Clientes" customers={customers} />,
    products: <ProductsTable label="Produtos" products={products} />,
    orders: <SaleOrders label="Ordens de venda" />,
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current]}
          items={[
            {
              key: 'customers',
              icon: <UserOutlined />,
              label: 'Clientes',
              onClick: () => {
                setCurrent('customers');
              },
            },
            {
              key: 'products',
              icon: <BookOutlined />,
              label: 'Produtos',
              onClick: () => {
                setCurrent('products');
              },
            },
            {
              key: 'orders',
              icon: <WarningOutlined />,
              label: 'Orders de venda',
              onClick: () => {
                setCurrent('orders');
              },
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            },
          )}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          {tables[current]}
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
