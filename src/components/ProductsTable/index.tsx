import { Space, Table, PageHeader, Button } from 'antd';
import { BookOutlined, EditOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { ProductState, useProducts } from '../../hooks/products';

const { Column } = Table;

type CustomTableProps = {
  label: string;
  products: ProductState[];
};

function ProductsTable({ label, products }: CustomTableProps): JSX.Element {
  const { setSelectedProduct } = useProducts();
  const navigate = useNavigate();
  return (
    <section>
      <div className="row">
        <PageHeader title={label} />
        <Button onClick={() => navigate('/register-product')}>
          <BookOutlined />
          Cadastrar produto
        </Button>
      </div>
      <Table dataSource={products} rowKey="id">
        <Column title="Nome do produto" dataIndex="title" key="title" />
        <Column title="Descrição" dataIndex="description" key="description" />
        <Column
          title="Unidade de medida"
          dataIndex="unit_of_measurement"
          key="unit_of_measurement"
        />
        <Column
          title="Quantidade em unidades"
          dataIndex="quantity_in_units"
          key="quantity_in_units"
        />
        <Column
          title="Valor da compra"
          dataIndex="buy_price_formatted"
          key="buy_price"
        />
        <Column
          title="Valor da venda"
          dataIndex="sale_price_formatted"
          key="sale_price"
        />

        <Column
          title="Editar"
          key="action"
          render={(_: any, record: ProductState) => (
            <Space size="middle">
              <Space size="middle">
                <Link
                  to={`/products/${record.id}/update-product`}
                  onClick={() => setSelectedProduct(record)}
                >
                  <EditOutlined />
                </Link>
              </Space>
            </Space>
          )}
        />
      </Table>
    </section>
  );
}

export default ProductsTable;
