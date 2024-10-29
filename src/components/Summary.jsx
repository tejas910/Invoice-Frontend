import { CreditCard, Calendar, FileText } from 'lucide-react';
const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

export const Summary = ({ invoice }) => (
    <div className="flex justify-end">
      <div className="w-64">
        <div className="flex justify-between mb-2 text-sm">
          <span className="font-medium">Subtotal:</span>
          <span>{formatCurrency(invoice.subTotal)}</span>
        </div>
        <div className="flex justify-between mb-2 text-sm">
          <span className="font-medium">Discount:</span>
          <span>{formatCurrency(invoice.discount)}</span>
        </div>
        {invoice.totalTax > 0 && (
          <>
            <div className="flex justify-between mb-2 text-sm">
              <span className="font-medium">GST:</span>
              <span>{formatCurrency(invoice.totalTax)}</span>
            </div>
            {invoice.invoiceItems[0].tax.cgst > 0 && (
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">CGST:</span>
                <span>{formatCurrency(invoice.totalTax / 2)}</span>
              </div>
            )}
            {invoice.invoiceItems[0].tax.sgst > 0 && (
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">SGST:</span>
                <span>{formatCurrency(invoice.totalTax / 2)}</span>
              </div>
            )}
            {invoice.invoiceItems[0].tax.igst > 0 && (
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">IGST:</span>
                <span>{formatCurrency(invoice.totalTax)}</span>
              </div>
            )}
          </>
        )}
        <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-300">
          <span>Total:</span>
          <span>{formatCurrency(invoice.total)}</span>
        </div>
      </div>
    </div>
  );