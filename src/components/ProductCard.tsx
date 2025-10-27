import React, { useMemo } from "react";
import { AlertTriangle, CheckCircle, Download } from "lucide-react"; 
import { ValveProduct } from "../lib/types"; // Import from local lib

interface ProductCardProps {
  product: ValveProduct; // Use ValveProduct type
  view: "grid" | "list";
  searchHighlight?: string;
  // Removed onQuickView, onToggleFavorite, isFavorite, as they are no longer used
}

const baseBadgeClasses = "text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full inline-flex items-center";
const safe = (v: any) => (v === null || v === undefined ? "" : String(v));

// --- MODIFIED AVAILABILITY BADGE ---
// Now only displays a badge if the product is explicitly "In Stock".
const AvailabilityBadge: React.FC<{ availability?: string }> = ({ availability }) => {
    const v = (availability || "").toString().toLowerCase();

    // Check for In Stock (based on "in" being present)
    if (v.includes("in"))
        return (<span className={`bg-green-100 text-green-800 ${baseBadgeClasses}`}><CheckCircle className="w-3 h-3 mr-1" />In Stock</span>);
    
    // Returns null (no badge) if not explicitly 'In Stock'
    return null;
};
// -------------------------------------

// Highlight function (kept simplified)
function highlight(text: string, query?: string) { 
    if (!query) return text;
    const q = query.trim();
    if (!q) return text;
    const parts = text.split(new RegExp(`(${q})`, "ig"));
    return parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 rounded-sm px-0.5">{part}</mark>
        ) : (
            part
        ),
    );
} 
function escapeRegExp(string: string) { return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }


const ProductCard: React.FC<ProductCardProps> = ({
  product,
  view,
  searchHighlight,
}) => {
  // Removed image, price, size logic
  const DisplayName = searchHighlight 
    ? highlight(product.name, searchHighlight) 
    : product.name;
    
  if (view === "list") {
    return (
      <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex w-full p-4">
        
        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row justify-between flex-grow">
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start gap-4">
              
              <div className="block min-w-0">
                <h3 className="text-xl font-bold text-primary-dark truncate">
                  {DisplayName}
                </h3>
                <p className="text-sm text-subtle truncate">
                  {/* Company Name / Material */}
                  {product.companyName}
                  {product.material && ` • ${product.material}`}
                </p>
              </div>

              {/* HSN CODE (Primary Detail) */}
              <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                {product.hsnCode && (
                    <span className="text-sm text-slate-600 font-semibold px-3 py-2">
                        HSN: {product.hsnCode}
                    </span>
                )}
                {/* Badge now only appears if In Stock */}
                <AvailabilityBadge availability={product.availability} /> 
              </div>
            </div>

            <div className="mt-3 flex gap-2 flex-wrap items-center">
              
              {product.connection && (
                <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                  {product.connection}
                </span>
              )}
              {/* Removed HSN Code chip here */}
               {product.artNo && (
                <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                  Art. No: {product.artNo}
                </span>
              )}
               {product.certification.length > 0 && product.certification[0] !== '-' && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {product.certification[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // grid view 
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      
      {/* NO IMAGE SECTION HERE */}
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          {/* Company Name */}
          <p className="text-sm text-gray-500">
            {product.companyName}
          </p> 
          <h3
            className="text-lg font-bold text-primary-dark truncate"
            title={product.name}
          >
            {DisplayName}
          </h3>
          <p
            className="text-sm text-subtle truncate"
            title={product.material}
          >
            {product.material} ({product.connection})
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* HSN CODE (Primary Detail) */}
          <span className="text-sm text-slate-600 font-semibold">
             HSN: {product.hsnCode}
          </span>
          
          <div className="flex flex-col items-end space-y-1">
             {/* Badge now only appears if In Stock */}
             <AvailabilityBadge availability={product.availability} />
             {product.artNo && (
                <span className="text-xs text-slate-500">Art. No: {product.artNo}</span>
             )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
