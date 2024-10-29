import React from 'react'
import { CreditCard, Users, Package, DollarSign } from 'lucide-react'

const DashboardCards = () => {
  const cardData = [
    { title: 'Total Invoices', icon: CreditCard, value: '254', change: '+12%', color:"bg-indigo-500 text-white" },
    { title: 'Total Customers', icon: Users, value: '1,234', change: '+5.2%', color:"bg-green-500 text-white"},
    { title: 'Total Products', icon: Package, value: '789', change: '+2.5%', color:"bg-red-500 text-white"},
    { title: 'Total Revenue', icon: DollarSign, value: '$54,231', change: '+18.7%', color:"bg-black text-white"},
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card, index) => (
        <div key={index} className={`${card.color} rounded-lg shadow-md p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-white-500 ">{card.title}</h3>
            <card.icon className="h-6 w-6 text-white-400" />
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">{card.value}</p>
            <p className="ml-2 text-sm text-white ">{card.change}</p>
          </div>
          <p className="text-xs text-white-500 mt-1">from last month</p>
        </div>
      ))}
    </div>
  )
}

export default DashboardCards