import React from 'react'
import { Home, CreditCard, Package, Users, ShoppingCart, Settings, Menu,IndianRupee} from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'
import {  FaFileInvoice } from "react-icons/fa";

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
    const navigate = useNavigate()
  const menuItems = [
    { icon: Home, label: 'Dashboard', path:'/'},
    { icon: CreditCard, label: 'Invoices', path:'/invoice'},
    {icon: FaFileInvoice, label:'Quotes', path:'/quotes'},
    { icon: Package, label: 'Products',path:'/product' },
    { icon: Users, label: 'Customers', path:'/client'},
    { icon: IndianRupee, label: 'Taxes', path:'/taxes'},
   
    { icon: ShoppingCart, label: 'Purchase Invoice', path:'/purchasein' },
   
    { icon: Settings, label: 'Settings', path:'/setting'},

  ]

  return (
    <aside className={`bg-white w-64 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static fixed z-30`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl pb-0.2 font-bold">InvoicePro</h2>
        <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md hover:bg-gray-100">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-grow">
        <ul className="p-2 space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button onClick={()=>navigate(item.path)} className="w-full flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar