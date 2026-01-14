import React from 'react';

const InvoiceTerms = ({ invoiceData }) => {
    const { terms, notes } = invoiceData.invoiceDetails;

    if (!terms && !notes) return null;

    return (
        <div className="mt-2 border-t border-black">
            {/* Terms and Conditions */}
            {terms && (
                <div className="p-2 border-b border-dashed border-gray-300">
                    <p className="font-bold text-[11px] uppercase underline mb-1">Terms and Conditions:</p>
                    <p className="text-[10px] whitespace-pre-wrap leading-tight">{terms}</p>
                </div>
            )}

            {/* Notes Section */}
            {notes && (
                <div className="p-2">
                    <p className="font-bold text-[11px] mb-1">Notes:</p>
                    <p className="text-[10px]">{notes}</p>
                </div>
            )}
        </div>
    );
};

export default InvoiceTerms;
