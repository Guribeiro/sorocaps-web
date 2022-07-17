import { useCallback } from 'react';
import {
  Layout,
  PageHeader,
  Row,
  Button,
  Typography,
  message,
  Table,
  Space,
  Modal,
  Badge,
  Col,
} from 'antd';

import { useNavigate, useLocation } from 'react-router-dom';
import { InboxOutlined, SelectOutlined } from '@ant-design/icons';
import { ProductState, useProducts } from '../../hooks/products';
import { useOrders } from '../../hooks/orders';

const { Content } = Layout;
const { Column } = Table;
const { Title } = Typography;

type Error = {
  message: string;
};

type RegisterSaleOrderProductsScreenState = {
  customer_id: string;
};

function RegisterSaleOrderProducts(): JSX.Element {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { productsOrder } = useOrders();

  const { addProductToOrder } = useOrders();

  const { customer_id } = state as RegisterSaleOrderProductsScreenState;

  const handleAddProductToOrdert = useCallback(
    async (product_id: string) => {
      try {
        await addProductToOrder({ product_id });

        message.success('Produto adicionado com sucesso');
      } catch (error) {
        const err = error as Error;
        message.error(err.message);
      }
    },
    [addProductToOrder],
  );

  const handleOpenModal = useCallback(
    async (product: ProductState) => {
      Modal.confirm({
        title: 'Deseja mesmo adicionar esse produto ao seu pedido de venda?',
        onOk: () => handleAddProductToOrdert(product.id),
      });
    },
    [handleAddProductToOrdert],
  );

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Row style={{ alignItems: 'center' }}>
        <Col span={23}>
          <PageHeader title="Voltar" onBack={() => navigate('/sale-order')} />
        </Col>
        <Col span={1}>
          <Button
            ghost
            onClick={() =>
              navigate('/sale-order/products/finish', {
                state: {
                  customer_id,
                },
              })
            }
          >
            <Badge count={productsOrder.length} showZero>
              <InboxOutlined />
            </Badge>
          </Button>
        </Col>
      </Row>

      <Row justify="center">
        <Content style={{ flexDirection: 'column' }}>
          <Title level={3}>Selecionar produto</Title>

          <Table dataSource={products} rowKey="id">
            <Column title="Nome do produto" dataIndex="title" key="title" />
            <Column
              title="Descrição"
              dataIndex="description"
              key="description"
            />
            <Column
              title="Unidade de medida"
              dataIndex="unit_of_measurement"
              key="unit_of_measurement"
            />

            <Column
              title="Preço"
              dataIndex="sale_price_formatted"
              key="sale_price_formatted"
            />

            <Column
              title="Selecionar"
              key="action"
              dataIndex="id"
              render={(_: any, record: ProductState) => (
                <Space size="middle">
                  <Button onClick={() => handleOpenModal(record)}>
                    <SelectOutlined />
                  </Button>
                </Space>
              )}
            />
          </Table>
        </Content>
      </Row>
    </Layout>
  );
}

export default RegisterSaleOrderProducts;
