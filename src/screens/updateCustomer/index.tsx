/* eslint-disable react/forbid-prop-types */
import { useCallback, useMemo, useState } from 'react';
import * as yup from 'yup';
import { DeleteOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import MaskedInput from 'antd-mask-input';

import {
  Layout,
  PageHeader,
  Form,
  Input,
  Row,
  Col,
  Button,
  Typography,
  message,
  Result,
  Modal,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Customer, useCustomers } from '../../hooks/customers';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

type FormData = {
  cnpj: string;
  corporate_name: string;
  phone: string;
};

const schema = yup.object().shape({
  cnpj: yup.string().required('Informe o CNPJ do cliente'),
  corporate_name: yup.string().required('Informe a razão social'),
  phone: yup.string().required('Informe a razão social'),
});

function UpdateCustomer(): JSX.Element {
  const { customer_id } = useParams();
  const navigate = useNavigate();
  const { update, customers, remove } = useCustomers();
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const customer = useMemo(() => {
    const findCustomer = customers.find(c => c.id === customer_id);

    if (!findCustomer) {
      return {} as Customer;
    }

    return findCustomer;
  }, [customers, customer_id]);

  const { handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: {
      cnpj: customer.cnpj,
      corporate_name: customer.corporate_name,
      phone: customer.phone,
    },
    resolver: yupResolver(schema),
  });

  const handleRemove = useCallback(async () => {
    try {
      if (!customer_id) return;

      await remove({ customer_id });
      message.success('Usuário excluído com sucesso');
      navigate('/dashboard');

      setIsModalVisible(false);
    } catch (error) {
      message.error('Erro ao excluir esse cliente');
      setIsModalVisible(false);
    } finally {
      setRemoveLoading(false);
    }
  }, [customer_id, remove, navigate]);

  const onSubmit = useCallback(
    async ({ corporate_name, phone }: FormData) => {
      try {
        await update({
          customer_id: customer.id,
          corporate_name,
          phone,
        });

        message.success('cliente cadastrado com sucesso');

        reset();
        setIsResultVisible(true);
      } catch (error) {
        message.error('Falha no cadastro do cliente');
      }
    },
    [reset, update, customer.id],
  );

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      {isResultVisible ? (
        <Result
          status="success"
          title="Cliente atualizado com sucesso"
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => navigate('/dashboard')}
            >
              Voltar ao ínicio
            </Button>,
          ]}
        />
      ) : (
        <>
          <PageHeader title="Voltar" onBack={() => navigate('/dashboard')} />

          <Modal
            title="Deseja mesmo excluir esse usuário?"
            onCancel={() => setIsModalVisible(false)}
            visible={isModalVisible}
            onOk={handleRemove}
            confirmLoading={removeLoading}
          >
            <Paragraph>
              Os dados desse usuário não poderão ser recuperados
            </Paragraph>
          </Modal>

          <Row justify="center">
            <Content style={{ maxWidth: 680 }}>
              <Row>
                <Col span={20}>
                  <Title level={3}>Atualizar cliente</Title>
                </Col>
                <Col span={4}>
                  <Button
                    type="primary"
                    danger
                    onClick={() => setIsModalVisible(true)}
                  >
                    Excluir cliente
                    <DeleteOutlined />
                  </Button>
                </Col>
              </Row>
              <Form
                layout="vertical"
                onSubmitCapture={handleSubmit(onSubmit)}
                style={{ paddingBottom: 30 }}
              >
                <Col span={24}>
                  <Controller
                    name="cnpj"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['cnpj']}
                        label="CNPJ"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <MaskedInput
                          disabled
                          mask="00.000.000/0000-00"
                          size="large"
                          placeholder="Ex. XX.XXX.XXX/0001-XX"
                          onChange={onChange}
                          value={value}
                          defaultValue={value}
                        />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="corporate_name"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['corporate_name']}
                        label="Razão social"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <Input
                          size="large"
                          onChange={onChange}
                          value={value}
                          defaultValue={value}
                        />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['phone']}
                        label="Telefone de contato"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <MaskedInput
                          mask="+55 (00) 0000-0000"
                          size="large"
                          placeholder="Ex. 11999999999"
                          onChange={onChange}
                          value={value}
                          defaultValue={value}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
                <Row style={{ marginTop: 30 }}>
                  <Button type="primary" block size="large" htmlType="submit">
                    Submit
                  </Button>
                </Row>
              </Form>
            </Content>
          </Row>
        </>
      )}
    </Layout>
  );
}

export default UpdateCustomer;
