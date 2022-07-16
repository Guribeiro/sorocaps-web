import { Routes as Router, Route, Navigate } from 'react-router-dom';
import SignIn from '../screens/signin';
import SignUp from '../screens/signup';
import DefinePassword from '../screens/definePassword';
import Dashboard from '../screens/dashboard';
import RegisterProduct from '../screens/registerProduct';
import RegisterCustomer from '../screens/registerCustomer';
import RegisterCustomerAddress from '../screens/registerCustomerAddress';
import UpdateCustomerAddress from '../screens/updateCustomerAddress';
import UpdateProduct from '../screens/updateProduct';
import UpdateCustomer from '../screens/updateCustomer';
import RegisterSaleOrder from '../screens/registerSaleOrder';
import RegisterSaleOrderProducts from '../screens/registerSaleOrderProducts';
import SaleOrderDetails from '../screens/saleOrderDetails';
import ResumeSaleOrder from '../screens/resumeSaleOrder';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../hooks/auth';

function Routes(): JSX.Element {
  const { auth } = useAuth();
  return (
    <Router>
      {!auth.user ? (
        <>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="define-password" element={<DefinePassword />} />
        </>
      ) : (
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register-product" element={<RegisterProduct />} />
          <Route
            path="/products/:product_id/update-product"
            element={<UpdateProduct />}
          />
          <Route path="/register-customer" element={<RegisterCustomer />} />
          <Route path="/customers/:customer_id" element={<UpdateCustomer />} />
          <Route
            path="/customers/:customer_id/register-address"
            element={<RegisterCustomerAddress />}
          />
          <Route
            path="/customers/:customer_id/update-address"
            element={<UpdateCustomerAddress />}
          />
          <Route path="/sale-order" element={<RegisterSaleOrder />} />
          <Route
            path="/sale-order/:sale_order_id"
            element={<SaleOrderDetails />}
          />
          <Route
            path="/sale-order/products"
            element={<RegisterSaleOrderProducts />}
          />
          <Route
            path="/sale-order/products/finish"
            element={<ResumeSaleOrder />}
          />
        </Route>
      )}

      <Route
        path="*"
        element={<Navigate to={auth.user ? '/dashboard' : '/'} />}
      />
    </Router>
  );
}

export default Routes;
