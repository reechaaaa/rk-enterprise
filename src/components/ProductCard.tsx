// src/components/ProductCard.tsx (Renamed from MedicineCard)
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
// Use appropriate icons for hardware
import { Component, AlertTriangle, CheckCircle, Tag, Factory, Wrench } from "lucide-react"; 
import { ValveProduct } from "../lib/types"; // CORRECTED IMPORT PATH

interface ProductCardProps {
  product: ValveProduct; // Use ValveProduct type
  view: "grid" | "list";
  searchHighlight?: string;
  onQuickView?: (product: ValveProduct) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
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
  onQuickView,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const fallbackImageUrl = useMemo(() => {
    const letter = safe(product.name).charAt(0) || "V";
    return `https://placehold.co/600x600/0D9488/FFFFFF?text=${encodeURIComponent(letter)}`;
  }, [product.name]);

  const price = product.price;
  const imageSrc =
    !imgError && product.imageUrl ? product.imageUrl : fallbackImageUrl;

  const detailUrl = `/products/${product.id}`; 
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };
  
  const DisplayName = searchHighlight 
    ? highlight(product.name, searchHighlight) 
    : product.name;
    
  const DisplaySize = `${product.sizeInches}" (${product.sizeMM} mm)`;

  if (view === "list") {
    return (
      <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row w-full focus-within:ring-2 focus-within:ring-primary">
        <Link
          to={detailUrl}
          className="md:w-1/3 flex-shrink-0 group"
          aria-label={`Open ${product.name} details`}
        >
          {/* Image/Placeholder section */}
          <div className="w-full h-44 md:h-full bg-slate-100 overflow-hidden relative">
            <img
              src={imageSrc}
              alt={safe(product.name)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
            <div className="absolute top-2 left-2">
              <AvailabilityBadge availability={product.availability ?? product.stock} />
            </div>
            {product.certification.length > 0 && (
                <div className="absolute top-2 right-2 inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                    <Component className="w-3 h-3" /> {product.certification[0]} 
                </div>
            )}
          </div>
        </Link>

        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start gap-4">
              <Link
                to={detailUrl}
                className="block min-w-0"
                aria-label={`Open ${product.name} details`}
              >
                <h3 className="text-xl font-bold text-primary-dark hover:underline truncate">
                  {DisplayName}
                </h3>
                <p className="text-sm text-subtle truncate">
                  <Tag className="w-3 h-3 mr-1 inline" /> Art. No: {product.artNo} 
                  {product.material && ` • ${product.material}`}
                </p>
              </Link>

              {/* Price and Quick View */}
              <div className="flex flex-col items-end space-y-2">
                <div className="text-2xl font-bold text-text">
                    {currency(price)}
                </div>
              </div>
            </div>

            {/* REMOVED: Manufacturer display section (using product.manufacturer) */}
            
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
            </div>
          </div>
        </div>
      </article>
    );
  }

  // grid view
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <Link
        to={detailUrl}
        aria-label={`Open ${product.name} details`}
        className="group"
      >
        <div className="relative">
          {/* Image/Placeholder section */}
          <div className="w-full h-44 bg-slate-100 overflow-hidden">
            <img
              src={imageSrc}
              alt={safe(product.name)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          </div>

          <div className="absolute top-2 left-2">
            <AvailabilityBadge availability={product.availability ?? product.stock} />
          </div>

          {product.certification.length > 0 && (
            <div className="absolute top-2 right-2 inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs border border-blue-100">
              <Component className="w-3 h-3" /> {product.certification[0].replace(/ Certified/i, '').trim()}
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            {/* UPDATED: Displaying Company Name (product.companyName) instead of the old manufacturer field */}
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
              <Wrench className="w-3 h-3 mr-1 inline" /> {DisplaySize} • Art. No: {product.artNo}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-xl font-bold text-text">
              {currency(price)}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleQuickView}
                title="Quick view"
                className="p-2 rounded-md hover:bg-slate-100 focus:outline-none"
              >
                 <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-slate-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
