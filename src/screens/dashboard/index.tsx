import React, { useCallback, useState } from 'react';
import { Button, Layout, Menu, Row, Modal, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  WarningOutlined,
  BookOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';

import { useTab } from '../../hooks/tab';
import { useAuth } from '../../hooks/auth';
import { useProducts } from '../../hooks/products';
import { useCustomers } from '../../hooks/customers';

import CustomersTable from '../../components/CustomersTable';
import ProductsTable from '../../components/ProductsTable';
import SaleOrders from '../../components/SaleOrders';

import logo from '../../assets/sorocaps.png';

import './styles.css';

type TablesVariations = {
  customers: JSX.Element;
  products: JSX.Element;
  orders: JSX.Element;
};

type Error = {
  message: string;
};

const { Header, Sider, Content } = Layout;

function Dashboard(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut } = useAuth();
  const { customers } = useCustomers();
  const { products } = useProducts();
  const { current, setCurrent } = useTab();

  const tables: TablesVariations = {
    customers: <CustomersTable label="Clientes" customers={customers} />,
    products: <ProductsTable label="Produtos" products={products} />,
    orders: <SaleOrders label="Ordens de venda" />,
  };

  const handleSignout = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      const err = error as Error;
      message.error(err.message);
    }
  }, []);

  const openModal = useCallback(() => {
    Modal.confirm({
      title: 'Deseja mesmo sair da aplicação ?',
      onOk: () => handleSignout(),
    });
  }, [handleSignout]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <img src={logo} alt="sorocaps" />
        </div>
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
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          <Row
            style={{
              justifyContent: 'space-between',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              paddingRight: 16,
            }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
              },
            )}
            <Button type="primary" danger onClick={openModal}>
              <PoweroffOutlined />
            </Button>
          </Row>
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
