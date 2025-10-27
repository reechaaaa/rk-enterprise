import React, { useMemo, useState } from "react";
// Removed Link import since we don't want navigation
// import { Link } from "react-router-dom"; 
// Removed Component, Tag, Factory, Wrench icons since they were used in the now-removed Link blocks
import { AlertTriangle, CheckCircle } from "lucide-react"; 
import { ValveProduct } from "../lib/types"; // CORRECTED IMPORT PATH

interface ProductCardProps {
  product: ValveProduct; // Use ValveProduct type
  view: "grid" | "list";
  searchHighlight?: string;
  // Removed onQuickView and onToggleFavorite props since they are no longer used
}

const baseBadgeClasses = "text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full inline-flex items-center";
const safe = (v: any) => (v === null || v === undefined ? "" : String(v));
const currency = (n = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);

// Simplified AvailabilityBadge
const AvailabilityBadge: React.FC<{ availability?: ValveProduct["availability"] | string | number; }> = ({ availability }) => {
    if (typeof availability === "number") {
        if (availability > 10) {
            return (<span className={`bg-green-100 text-green-800 ${baseBadgeClasses}`}><CheckCircle className="w-3 h-3 mr-1" />In Stock</span>);
        }
        if (availability > 0) {
            return (<span className={`bg-yellow-100 text-yellow-800 ${baseBadgeClasses}`}><AlertTriangle className="w-3 h-3 mr-1" />Low Stock</span>);
        }
        return (<span className={`bg-red-100 text-red-800 ${baseBadgeClasses}`}><AlertTriangle className="w-3 h-3 mr-1" />Out of Stock</span>);
    }
    const v = (availability || "").toString().toLowerCase();
    if (v.includes("in"))
        return (<span className={`bg-green-100 text-green-800 ${baseBadgeClasses}`}><CheckCircle className="w-3 h-3 mr-1" />In Stock</span>);
    if (v.includes("low") || v.includes("few"))
        return (<span className={`bg-yellow-100 text-yellow-800 ${baseBadgeClasses}`}><AlertTriangle className="w-3 h-3 mr-1" />Low Stock</span>);
    return (<span className={`bg-red-100 text-red-800 ${baseBadgeClasses}`}><AlertTriangle className="w-3 h-3 mr-1" />Out of Stock</span>);
};
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
  // Removed unused props: onQuickView, onToggleFavorite, isFavorite
}) => {
  // Removed image state and memo since we don't display images
  // const [imgError, setImgError] = useState(false);

  const price = product.price;
  
  // NOTE: detailUrl is no longer used, as we removed the Link component.
  // const detailUrl = `/products/${product.id}`; 
  
  // Removed handleQuickView and Link components
  
  const DisplayName = searchHighlight 
    ? highlight(product.name, searchHighlight) 
    : product.name;
    
  const DisplaySize = `${product.sizeInches}" (${product.sizeMM} mm)`;

  if (view === "list") {
    // List view adapted to remove image column and link wrapping
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
                  {/* Company Name */}
                  {product.companyName}
                  {product.material && ` • ${product.material}`}
                </p>
              </div>

              {/* Price and Availability */}
              <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                <div className="text-2xl font-bold text-text">
                    {currency(price)}
                </div>
                <AvailabilityBadge availability={product.availability ?? product.stock} />
              </div>
            </div>

            <div className="mt-3 flex gap-2 flex-wrap items-center">
              {product.sizeInches && (
                <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                  {DisplaySize}
                </span>
              )}
              {product.connection && (
                <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                  {product.connection}
                </span>
              )}
              {product.hsnCode && (
                <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                  HSN: {product.hsnCode}
                </span>
              )}
               {product.artNo && (
                <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                  Art. No: {product.artNo}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // grid view adapted to remove image and link wrapping
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
            title={DisplaySize}
          >
            {product.material} ({product.connection})
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xl font-bold text-text">
            {currency(price)}
          </div>
          
          <div className="flex flex-col items-end space-y-1">
             <AvailabilityBadge availability={product.availability ?? product.stock} />
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
