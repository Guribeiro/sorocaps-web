import { useCallback, useMemo, useState } from 'react';
import {
  Layout,
  PageHeader,
  Row,
  Button,
  Typography,
  Table,
  Space,
  Col,
  message,
  Descriptions,
  Modal,
} from 'antd';

import { useNavigate, useLocation } from 'react-router-dom';
import { DeleteOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useOrders, ProductOrder } from '../../hooks/orders';
import { Customer, useCustomers } from '../../hooks/customers';
import currencyFormatter from '../../utils/currencyFormatter';

const { Content } = Layout;
const { Column } = Table;
const { Title, Text } = Typography;
const { Item } = Descriptions;

type Error = {
  message: string;
};

type ResumeSaleOrderScreenState = {
  customer_id: string;
};

type HandleRemoveProductOrderProps = {
  product_id: string;
};

function ResumeSaleOrder(): JSX.Element {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { customers } = useCustomers();
  const {
    productsOrder,
    updateProductOrderAmount,
    removeProductOrder,
    createProductOrder,
  } = useOrders();

  const { customer_id } = state as ResumeSaleOrderScreenState;

  const [loading, setLoading] = useState(false);

  const customer = useMemo(() => {
    const findCustomer = customers.find(c => c.id === customer_id);

    if (!findCustomer) {
      return {} as Customer;
    }

    return findCustomer;
  }, [customers, customer_id]);

  const totalProductsOrder = productsOrder.reduce(
    (accumulator, current) => accumulator + current.sale_price * current.amount,
    0,
  );

  const handleRemoveProductOrder = useCallback(
    async ({ product_id }: HandleRemoveProductOrderProps) => {
      try {
        await removeProductOrder({ product_id });

        message.success('produto removido com sucesso');
      } catch (error) {
        const err = error as Error;
        message.error(err.message);
      }
    },
    [removeProductOrder],
  );

  const handleCreateSaleOrder = useCallback(async () => {
    try {
      setLoading(true);
      await createProductOrder({ customer_id });
      message.success('Pedido de venda realizado com sucesso');
      navigate('/dashboard');
    } catch (error) {
      const err = error as Error;
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [createProductOrder, customer_id, navigate]);

  const handleOpenModal = useCallback(async () => {
    Modal.confirm({
      title: 'Deseja mesmo finalizar pedido?',
      onOk: () => handleCreateSaleOrder(),
    });
  }, [handleCreateSaleOrder]);

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Row style={{ alignItems: 'center' }}>
        <Col span={23}>
          <PageHeader title="Voltar" onBack={() => navigate('/sale-order/')} />
        </Col>
      </Row>

      <Row justify="center">
        <Content style={{ flexDirection: 'column' }}>
          <Space size={30} direction="vertical" style={{ width: '100%' }}>
            <Title level={3}>Resumo do pedido</Title>
            <Descriptions
              title="Informações do cliente"
              bordered
              layout="vertical"
            >
              <Item label="Razão social">{customer.corporate_name}</Item>
              <Item label="CNPJ">{customer.cnpj}</Item>
              <Item label="Telefone">{customer.phone}</Item>
            </Descriptions>

            <Title level={5}>Produtos</Title>
            <Table dataSource={productsOrder} rowKey="id">
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
                title="Preço unidade"
                dataIndex="sale_price_formatted"
                key="sale_price_formatted"
              />

              <Column
                title="Quantidade"
                dataIndex="amount"
                key="amount"
                render={(_: any, record: ProductOrder) => (
                  <Space>
                    <Button
                      onClick={() =>
                        updateProductOrderAmount({
                          product_id: record.id,
                          amount: record.amount - 1,
                        })
                      }
                    >
                      <LeftOutlined />
                    </Button>
                    <Text>{record.amount}</Text>
                    <Button
                      onClick={() =>
                        updateProductOrderAmount({
                          product_id: record.id,
                          amount: record.amount + 1,
                        })
                      }
                    >
                      <RightOutlined />
                    </Button>
                  </Space>
                )}
              />

              <Column
                title="Total"
                key="total"
                render={(_: any, record: ProductOrder) => (
                  <Space size="middle">
                    <Text>
                      {currencyFormatter(record.sale_price * record.amount)}
                    </Text>
                  </Space>
                )}
              />

              <Column
                title="Remove"
                key="action"
                dataIndex="id"
                render={(_: any, record: ProductOrder) => (
                  <Space size="middle">
                    <Button
                      onClick={() =>
                        handleRemoveProductOrder({
                          product_id: record.id,
                        })
                      }
                    >
                      <DeleteOutlined />
                    </Button>
                  </Space>
                )}
              />
            </Table>
            <Row justify="end" gutter={30}>
              <Col>
                <Title level={4}>
                  Total:
                  <Text>{currencyFormatter(totalProductsOrder)}</Text>
                </Title>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={handleOpenModal}
                  loading={loading}
                >
                  Finalizar pedido
                </Button>
              </Col>
            </Row>
          </Space>
        </Content>
      </Row>
    </Layout>
  );
}

export default ResumeSaleOrder;
