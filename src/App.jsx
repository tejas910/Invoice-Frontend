import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import InvoicePage from './pages/InvoicePage';
import Setting from './pages/Setting';
import Product from './pages/Product';
import Customer from './pages/Customer';
import Home from './pages/Home';
import AddInvoicePage from './pages/AddInvoicePage';
import AddProductPage from './pages/AddProductPage';
import AddClientPage from './pages/AddClientPage';
import PurchaseInvoice from './pages/PurchaseInvoice';
import AddPurchaseInvoice from './pages/AddPurchaseInvoice';
import AddTaxes from './pages/AddTaxes';
import Taxes from './pages/Taxes';
import Registration from './pages/auth-pages/Registration';
import Login from './pages/auth-pages/Login';
import UserPrivateRoute from './auth/UserPrivateRoute';
import UserPublicRoute from './auth/UserPublicRoute';
import UpdateTaxPage from './pages/UpdateTaxPage';
import UpdateProductPage from './pages/UpdateProductPage';
import UpdateClientPage from './pages/UpdateClientPage';
import DisplayClientPage from './pages/DisplayClientPage';
import DisplayProductPage from './pages/DisplayProductPage';
import DisplayTaxPage from './pages/DisplayTaxPage';
import Profile from './pages/Profile';
import ExportPage from './pages/ExportPage';
import Invoice from './components/Invoice';
import Quotes from './pages/Quotes';
import AddQuotesPage from './pages/AddQuotesPage';
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
