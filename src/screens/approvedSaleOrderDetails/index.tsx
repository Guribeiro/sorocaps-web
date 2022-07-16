import { useEffect, useMemo, useState } from 'react';
import {
  Layout,
  PageHeader,
  Row,
  Typography,
  Space,
  Col,
  Descriptions,
  message,
  Table,
  Empty,
} from 'antd';

import { useNavigate, useParams } from 'react-router-dom';
import { useOrders, OrderState } from '../../hooks/orders';
import currencyFormatter from '../../utils/currencyFormatter';
import api from '../../shared/services/api';
import { Product } from '../../hooks/products';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Item } = Descriptions;
const { Column } = Table;

type OrderProduct = {
  id: string;
  product: Product;
  quantity: number;
  total_price: number;
};

type OrderProductState = OrderProduct & {
  total_price_formatted: string;
};

function ApprovedSaleOrderDetails(): JSX.Element {
  const navigate = useNavigate();
  const [orderProducts, setOrderProducts] = useState<OrderProductState[]>([]);

  const { sale_order_id } = useParams();

  const { orders } = useOrders();

  const order = useMemo(() => {
    const saleOrder = orders.find(findOrder => findOrder.id === sale_order_id);

    if (!saleOrder) {
      return {} as OrderState;
    }

    return saleOrder;
  }, [orders, sale_order_id]);

  useEffect(() => {
    api
      .get<OrderProduct[]>(`/orders/${sale_order_id}`, {
        params: {
          customer_id: order.customer_id,
        },
      })
      .then(response =>
        setOrderProducts(
          response.data.map(orderProduct => ({
            ...orderProduct,
            total_price_formatted: currencyFormatter(orderProduct.total_price),
          })),
        ),
      )
      .catch(error => message.error(error));
  }, [order.customer_id, sale_order_id]);

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Row style={{ alignItems: 'center' }}>
        <Col span={23}>
          <PageHeader title="Voltar" onBack={() => navigate('/dashboard')} />
        </Col>
      </Row>

      {order.id ? (
        <Row justify="center">
          <Content style={{ flexDirection: 'column' }}>
            <Space size={30} direction="vertical" style={{ width: '100%' }}>
              <Row justify="space-between">
                <Col>
                  <Title level={3}>Pedido - {order.id}</Title>
                </Col>
              </Row>
              <Descriptions
                title="Informações do pedido"
                bordered
                layout="vertical"
                column={10}
              >
                <Item label="Cliente">{order.customer.corporate_name}</Item>
                <Item label="CNPJ">{order.customer.cnpj}</Item>
                <Item label="Telefone">{order.customer.phone}</Item>
                <Item label="Status">{order.status_formatted}</Item>
                <Item label="Data do pedido">{order.created_at_formatted}</Item>
                <Item label="Valor total do pedido">
                  {order.price_formatted}
                </Item>
              </Descriptions>
              <Table dataSource={orderProducts} rowKey="id">
                <Column
                  title="Nome do produto"
                  key="title"
                  render={(_: any, record: OrderProduct) => (
                    <Text>{record.product.title}</Text>
                  )}
                />
                <Column
                  title="Descrição"
                  key="title"
                  render={(_: any, record: OrderProduct) => (
                    <Text>{record.product.description}</Text>
                  )}
                />
                <Column
                  title="Unidade de medida"
                  key="title"
                  render={(_: any, record: OrderProduct) => (
                    <Text>{record.product.unit_of_measurement}</Text>
                  )}
                />
                <Column
                  title="Quantidade"
                  key="title"
                  render={(_: any, record: OrderProduct) => (
                    <Text>{record.quantity}</Text>
                  )}
                />
                <Column
                  title="Total"
                  dataIndex="total_price_formatted"
                  key="total_price_formatted"
                />
              </Table>
            </Space>
          </Content>
        </Row>
      ) : (
        <Empty />
      )}
    </Layout>
  );
}

export default ApprovedSaleOrderDetails;
