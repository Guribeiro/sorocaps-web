import { useState } from 'react';
import { SelectOutlined } from '@ant-design/icons';
import {
  Layout,
  PageHeader,
  Row,
  Button,
  Typography,
  Result,
  Table,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { Customer, useCustomers } from '../../hooks/customers';

const { Content } = Layout;
const { Column } = Table;
const { Title } = Typography;

function RegisterSaleOrder(): JSX.Element {
  const navigate = useNavigate();
  const { customers } = useCustomers();

  const [isResultVisible, setIsResultVisible] = useState(false);

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      {isResultVisible ? (
        <Result
          status="success"
          title="Produto cadastrado com sucesso"
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => navigate('/dashboard')}
            >
              Voltar ao ínicio
            </Button>,
            <Button key="buy" onClick={() => setIsResultVisible(false)}>
              Cadastrar novo pedido de venda
            </Button>,
          ]}
        />
      ) : (
        <>
          <PageHeader title="Voltar" onBack={() => navigate('/dashboard')} />

          <Row justify="center">
            <Content style={{ flexDirection: 'column' }}>
              <Title level={3}>Selecionar cliente</Title>

              <Table dataSource={customers} rowKey="id">
                <Column
                  title="Razão social"
                  dataIndex="corporate_name"
                  key="corporate_name"
                />
                <Column title="CNPJ" dataIndex="cnpj" key="cnpj" />
                <Column title="Telefone" dataIndex="phone" key="phone" />

                <Column
                  title="Selecionar"
                  key="action"
                  render={(_: any, record: Customer) => (
                    <Button
                      size="middle"
                      onClick={() =>
                        navigate('/sale-order/products', {
                          state: {
                            customer_id: record.id,
                          },
                        })
                      }
                    >
                      <SelectOutlined />
                    </Button>
                  )}
                />
              </Table>
            </Content>
          </Row>
        </>
      )}
    </Layout>
  );
}

export default RegisterSaleOrder;
