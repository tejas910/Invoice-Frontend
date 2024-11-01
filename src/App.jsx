import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import InvoicePage from './pages/invoices/InvoicePage';
import Setting from './pages/profile/Setting';
import Product from './pages/product/Product';
import Customer from './pages/client/Customer';
import Home from './pages/Home';
import AddInvoicePage from './pages/invoices/AddInvoicePage';
import AddProductPage from './pages/product/AddProductPage';
import AddClientPage from './pages/client/AddClientPage';
import PurchaseInvoice from './pages/purchase-invoice/PurchaseInvoice';
import AddPurchaseInvoice from './pages/purchase-invoice/AddPurchaseInvoice';
import AddTaxes from './pages/tax/AddTaxes';
import Taxes from './pages/tax/Taxes';
import Registration from './pages/auth-pages/Registration';
import Login from './pages/auth-pages/Login';
import UserPrivateRoute from './auth/UserPrivateRoute';
import UserPublicRoute from './auth/UserPublicRoute';
import UpdateTaxPage from './pages/tax/UpdateTaxPage';
import UpdateProductPage from './pages/product/UpdateProductPage';
import UpdateClientPage from './pages/client/UpdateClientPage';
import DisplayClientPage from './pages/client/DisplayClientPage';
import DisplayProductPage from './pages/product/DisplayProductPage';
import DisplayTaxPage from './pages/tax/DisplayTaxPage';
import Profile from './pages/profile/Profile';
import ExportPage from './pages/invoices/ExportPage';
import Invoice from './components/Invoice';
import Quotes from './pages/quotes/Quotes';
import AddQuotesPage from './pages/quotes/AddQuotesPage';
import { Quote } from 'lucide-react';
import QuotePdf from './components/QuotePdf';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const location = useLocation();
  const isAuthRoute = location.pathname === '/register' || location.pathname === '/login';

  return (
    <div className="flex">
      {!isAuthRoute && <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}
      <div className="flex-grow">
        {!isAuthRoute && <Navbar toggleSidebar={toggleSidebar} />}
        <Routes>
          <Route element={<UserPrivateRoute />}>
            <Route path='/' element={<Home />} />
            <Route path='/invoice' element={<InvoicePage />} />
            <Route path='/quotes' element={<Quotes/>}/>
            <Route path='/setting' element={<Setting />} />
            <Route path='/product' element={<Product />} />
            <Route path='/addinvoice' element={<AddInvoicePage />} />
            <Route path='/quotes/addquotes' element={<AddQuotesPage/>}/>
            <Route path='/client' element={<Customer />} />
            <Route path='/client/displayclient/:id' element={<DisplayClientPage/>}/>
            <Route path='/addproduct' element={<AddProductPage />} />
            <Route path='/product/updateproduct/:id' element={<UpdateProductPage/>}/>
            <Route path='/product/displayproduct/:id' element={<DisplayProductPage/>}/>
            <Route path='/addclient' element={<AddClientPage />} />
            <Route path='/client/updateclient/:id' element={<UpdateClientPage />} />
            <Route path='/purchasein' element={<PurchaseInvoice />} />
            <Route path='/addpurchaseinvoice' element={<AddPurchaseInvoice />} />
            <Route path='/taxes' element={<Taxes />} />
            <Route path='/taxes/Addtax' element={<AddTaxes />} />
            <Route path='/taxes/updatetax/:id' element={<UpdateTaxPage/>}/>
            <Route path='/taxes/displaytax/:id' element={<DisplayTaxPage/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/invoice/:invoiceId' element={<Invoice/>}/>
            <Route path='/exportsheet' element={<ExportPage/>}/>
            <Route path='/quotes/:quotesId' element={<QuotePdf/>}/>
          </Route>

          <Route element={<UserPublicRoute />}>
            <Route path='/register' element={<Registration />} />
            <Route path='/login' element={<Login />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
