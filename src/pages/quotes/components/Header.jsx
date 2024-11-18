import { format } from "date-fns";
import { CreditCard, Calendar, FileText } from "lucide-react";

// Helper functions
const formatDate = (dateString) => format(new Date(dateString), "dd MMM yyyy");

export const Header = ({ quote }) => (
  <div className="flex justify-between items-start mb-8">
    <div className="flex-grow">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Quote</h1>
      <p className="text-sm text-gray-600 mb-1">
        Generated on: <b>{formatDate(new Date().toISOString())}</b>
      </p>
      <div className="flex items-center text-md text-gray-600 mb-1">
        <FileText className="w-4 h-4 mr-2" />
        <span>
          Quote Number: <b>{quote.quoteNumber}</b>
        </span>
      </div>
      <div className="flex items-center text-md text-gray-600 mb-1">
        <Calendar className="w-4 h-4 mr-2" />
        <span>
          Quote Date: <b>{formatDate(quote.quoteDate)}</b>
        </span>
      </div>
      <div className="flex items-center text-md text-gray-600">
        <Calendar className="w-4 h-4 mr-2" />
        <span>
          Due Date: <b>{formatDate(quote.quoteDueDate)}</b>
        </span>
      </div>
      <div className="flex items-center text-md text-gray-600">
        <CreditCard className="w-4 h-4 mr-2" />
        <span>
          Status:{" "}
          <b>
            {quote.status === "Partially_Paid"
              ? "Partially Paid"
              : quote.status}
          </b>
        </span>
      </div>
    </div>
    {quote.user.companyLogo && (
      <div className="w-52 h-auto m-1 flex justify-center items-center">
        <img
          src={quote.user.companyLogo}
          alt="Company Logo"
          className="object-contain"
        />
      </div>
    )}
  </div>
);
