import {
  Space,
  Table,
  PageHeader,
  Button,
  Tabs,
  Layout,
  Typography,
} from 'antd';
import { EditOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

import { ProductState } from '../../hooks/products';

import { useOrders, Status, Order } from '../../hooks/orders';

const { Column } = Table;
const { TabPane } = Tabs;
const { Content } = Layout;
const { Text } = Typography;

type CustomTableProps = {
  label: string;
};

function SaleOrders({ label }: CustomTableProps): JSX.Element {
  const { setStatusFilter, loading, orders } = useOrders();
  const navigate = useNavigate();

  return (
    <Content>
      <div className="row">
        <PageHeader title={label} />
        <Button onClick={() => navigate('/sale-order')}>
          <ShoppingCartOutlined />
          Novo pedido de venda
        </Button>
      </div>
      <Tabs onChange={key => setStatusFilter(key as Status)}>
        <TabPane tab="Em processo" key="pending">
          <Table dataSource={orders} loading={loading} rowKey="id">
            <Column
              title="Cliente"
              key="customer_id"
              render={(_: any, record: Order) => (
                <Text>{record.customer.corporate_name}</Text>
              )}
            />
            <Column
              title="Status do pedido"
              dataIndex="status_formatted"
              key="status_formatted"
            />

            <Column
              title="Valor do pedido"
              dataIndex="price_formatted"
              key="price_formatted"
            />

            <Column
              title="Editar"
              key="action"
              render={(_: any, record: ProductState) => (
                <Space size="middle">
                  <Space size="middle">
                    <Link to={`/sale-order/${record.id}`}>
                      <EditOutlined />
                    </Link>
                  </Space>
                </Space>
              )}
            />
          </Table>
        </TabPane>
        <TabPane tab="Aprovados" key="approved">
          <Table dataSource={orders} loading={loading} rowKey="id">
            <Column
              title="Cliente"
              key="customer_id"
              render={(_: any, record: Order) => (
                <Text>{record.customer.corporate_name}</Text>
              )}
            />
            <Column
              title="Status do pedido"
              dataIndex="status_formatted"
              key="status_formatted"
            />

            <Column
              title="Valor do pedido"
              dataIndex="price_formatted"
              key="price_formatted"
            />

            <Column
              title="Editar"
              key="action"
              render={(_: any, record: ProductState) => (
                <Space size="middle">
                  <Space size="middle">
                    <Link to={`/sale-order/${record.id}`}>
                      <EditOutlined />
                    </Link>
                  </Space>
                </Space>
              )}
            />
          </Table>
        </TabPane>
      </Tabs>
    </Content>
  );
}

export default SaleOrders;
