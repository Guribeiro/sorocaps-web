/* eslint-disable react/forbid-prop-types */
import { useCallback, useMemo, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

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
import { DeleteOutlined } from '@ant-design/icons';

import { MaskedInput } from 'antd-mask-input';
import { useCustomers, CustomerAddress } from '../../hooks/customers';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

type FormData = {
  cep: string;
  number: string;
  district: string;
  country: string;
  state: string;
  street: string;
};

const schema = yup.object().shape({
  cep: yup.string().required('Informe o campo CEP'),
  number: yup.string().required('Informe o campo número'),
  district: yup.string().required('Informe o campo número'),
  country: yup.string().required('Informe o campo número'),
  state: yup.string().required('Informe o campo número'),
  street: yup.string().required('Informe o campo número'),
});

function UpdateCustomerAddress(): JSX.Element {
  const navigate = useNavigate();
  const { updateAddress, customers, removeAddress } = useCustomers();
  const { customer_id } = useParams();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const customer_address = useMemo(() => {
    const customer = customers.find(c => c.id === customer_id);

    if (!customer) {
      return {} as CustomerAddress;
    }

    if (!customer.customer_address) {
      return {} as CustomerAddress;
    }

    return customer.customer_address;
  }, [customers, customer_id]);

  const { handleSubmit, control, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      cep: customer_address.cep,
      number: customer_address.number,
      district: customer_address.district,
      country: customer_address.country,
      state: customer_address.state,
      street: customer_address.street,
    },
  });

  const onSubmit = useCallback(
    async ({ cep, number, district, country, state, street }: FormData) => {
      try {
        if (!customer_id) throw Error();
        await updateAddress({
          customer_id,
          cep,
          number,
          district,
          country,
          state,
          street,
        });

        message.success('endereço atualizado com sucesso');

        reset();
        setIsResultVisible(true);
      } catch (error) {
        message.error('Falha na atualização do endereço');
      }
    },
    [updateAddress, reset, setIsResultVisible, customer_id],
  );

  const handleRemoveAddress = useCallback(async () => {
    try {
      if (!customer_id) return;

      await removeAddress({ customer_id });
      message.success('Endereço excluído com sucesso');
      navigate('/dashboard');

      setIsModalVisible(false);
    } catch (error) {
      message.error('Erro ao excluir Endereço');
      setIsModalVisible(false);
    } finally {
      setRemoveLoading(false);
    }
  }, [customer_id, navigate, removeAddress]);

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      {isResultVisible ? (
        <Result
          status="success"
          title="Endereço do cliente foi cadastrado com sucesso"
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
            onOk={handleRemoveAddress}
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
                  <Title level={3}>Atualizar endereço do cliente</Title>
                </Col>
                <Col span={4}>
                  <Button
                    type="primary"
                    danger
                    onClick={() => setIsModalVisible(true)}
                  >
                    Excluir endereço
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
                    name="cep"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['cep']}
                        label="CEP"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <MaskedInput
                          mask="00000-000"
                          size="large"
                          placeholder="Ex. 00000-00"
                          onChange={onChange}
                          value={value}
                          defaultValue={value}
                        />
                      </Form.Item>
                    )}
                  />
                  <Row justify="center" gutter={30}>
                    <Col span={18}>
                      <Controller
                        name="street"
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Form.Item
                            name={['street']}
                            label="Rua"
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
                    </Col>

                    <Col span={6}>
                      <Controller
                        name="number"
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Form.Item
                            name={['number']}
                            label="Número"
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
                    </Col>
                  </Row>

                  <Controller
                    name="district"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['district']}
                        label="Bairro"
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
                    name="state"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['state']}
                        label="Estado"
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
                    name="country"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['country']}
                        label="País"
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
                </Col>
                <Row style={{ marginTop: 30 }}>
                  <Col span={24}>
                    <Button type="primary" block size="large" htmlType="submit">
                      Atualizar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Content>
          </Row>
        </>
      )}
    </Layout>
  );
}

export default UpdateCustomerAddress;
