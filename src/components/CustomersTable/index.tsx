import { Space, Table, PageHeader, Button } from 'antd';
import { UserAddOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { Customer } from '../../hooks/customers';

import './styles.css';

const { Column } = Table;

type CustomTableProps = {
  label: string;
  customers: Customer[];
};

function CustomersTable({ label, customers }: CustomTableProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <section>
      <div className="row">
        <PageHeader title={label} />
        <Button onClick={() => navigate('/register-customer')}>
          <UserAddOutlined />
          Cadastrar cliente
        </Button>
      </div>
      <Table dataSource={customers} rowKey="id">
        <Column
          title="Razão social"
          dataIndex="corporate_name"
          key="corporate_name"
        />
        <Column title="CNPJ" dataIndex="cnpj" key="cnpj" />
        <Column title="Telefone" dataIndex="phone" key="phone" />
        <Column
          title="Endereço"
          dataIndex="customer_address_id"
          key="customer_address_id"
          render={(_: any, record: Customer) => (
            <Space size="middle">
              {record.customer_address_id ? (
                <Space size="middle">
                  <Link to={`/customers/${record.id}/update-address`}>
                    <EditOutlined />
                  </Link>
                </Space>
              ) : (
                <Link to={`/customers/${record.id}/register-address`}>
                  Cadastrar endereço
                </Link>
              )}
            </Space>
          )}
        />

        <Column
          title="Editar"
          key="action"
          render={(_: any, record: Customer) => (
            <Space size="middle">
              <Link to={`/customers/${record.id}`}>
                <EditOutlined />
              </Link>
            </Space>
          )}
        />
      </Table>
    </section>
  );
}

export default CustomersTable;
