import { CreditCard, Calendar, FileText } from 'lucide-react';

const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);


export const InvoiceTable = ({ invoiceItems }) => (
    <div className="mb-8 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
          <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Sr.no</th>
            <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Item</th>
            <th className="p-2 text-center text-xs font-semibold text-gray-600 uppercase">Quantity</th>
            <th className="p-2 text-center text-xs font-semibold text-gray-600 uppercase">Unit Price</th>
            <th className="p-2 text-center text-xs font-semibold text-gray-600 uppercase">Sub Total</th>
            <th className="p-2 text-center text-xs font-semibold text-gray-600 uppercase">Tax</th>
            <th className="p-2 text-center text-xs font-semibold text-gray-600 uppercase">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className='p-2 text-sm '>{index+1}</td>
              <td className="p-2 text-sm ">{item.productName}</td>
              <td className="p-2 text-sm text-center">{item.quantity}</td>
              <td className="p-2 text-sm text-center">{formatCurrency(item.price)}</td>
              <td className="p-2 text-sm text-center">{formatCurrency(item.subTotal)}</td>
              <td className="p-2 text-sm text-center">{formatCurrency(item.taxableAmount)}</td>
              <td className="p-2 text-sm text-center">{formatCurrency(item.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );