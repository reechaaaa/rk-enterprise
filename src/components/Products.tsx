import React, { useCallback, useEffect, useMemo, useState } from "react";
import { X, List, LayoutGrid, AlertCircle, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce"; 
import pipesImage from "@/assets/pipes-fittings.jpg"; 
import ProductCard from "./ProductCard"; 
// Fixed import paths:
import { ValveProduct, mapZolotoRowsToProducts, parseGvizText, gvizResponseToRows } from "../lib/types"; 
import { ProductCardSkeleton } from "./ProductCardSkeleton"; // Assuming you put the Skeleton file here

const ITEMS_PER_PAGE = 12;

// ===============================================================
// 1. GOOGLE SHEET CONSTANTS (Set from the last step)
// ===============================================================
const GOOGLE_SHEET_ID = '1djgZYlSiPu2A1Qx8hDs8XUEWJG6Qr4AaMFo55vlvH-4'; 
const GID = '0'; 

// Using the raw CSV export format for better CORS compliance
const API_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&gid=${GID}`; 

// ===============================================================

// Helper function to render a single pagination button
const PaginationButton = ({ children, onClick, disabled, active }: { 
    children: React.ReactNode; 
    onClick: () => void; 
    disabled: boolean;
    active?: boolean;
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors 
            ${disabled ? 'text-slate-400 cursor-not-allowed' : 
            active ? 'bg-primary text-white shadow-md' : 
            'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'}`}
    >
        {children}
    </button>
);


const Products: React.FC = () => {
    const [products, setProducts] = useState<ValveProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [connectionFilter, setConnectionFilter] = useState("all");
    const [materialFilter, setMaterialFilter] = useState("all");
    const [companyFilter, setCompanyFilter] = useState("all"); 
    const [sortOrder, setSortOrder] = useState("name-asc");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [currentPage, setCurrentPage] = useState(1);
    
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // --- Data Fetching Logic (CSV Parser) ---
    const fetchZolotoData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log("Attempting fetch from Google Sheet (Raw CSV Export):", API_URL);
            
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            
            const rawCsvText = await response.text();
            
            // Simple CSV Parser
            const [headerLine, ...dataLines] = rawCsvText.split('\n').filter(line => line.trim().length > 0);
            const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));
            
            const rawRows = dataLines.map(line => {
                const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                const rowObject: Record<string, any> = {};
                headers.forEach((header, index) => {
                    // Map CSV column values to header names
                    rowObject[header] = values[index];
                });
                return rowObject;
            });
            
            // Map the raw rows using the logic from lib/types.ts
            const data: ValveProduct[] = mapZolotoRowsToProducts(rawRows);
            
            setProducts(data);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
            
            if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
                 setError(`Failed to fetch data due to CORS block. Please verify 'File > Share > Publish to web' in your Google Sheet.`);
            } else {
                 setError(`Failed to process data: ${errorMessage}. Check that your Google Sheet column headers match: 'Art. No.', 'Product', 'Inches', 'mm', 'Price/Piece', 'HSN Code', and 'Company'.`);
            }
            
            console.error("Error fetching ZOLOTO data:", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []); 

    useEffect(() => {
        fetchZolotoData();
    }, [fetchZolotoData]);

    // This logic runs on the client after data is fetched.
    const { uniqueConnections, uniqueMaterials, uniqueCompanies } = useMemo(() => {
        const connections = new Set<string>();
        const materials = new Set<string>();
        const companies = new Set<string>();
        for (const p of products) {
            if (p.connection) connections.add(p.connection);
            if (p.material) materials.add(p.material);
            if (p.companyName) companies.add(p.companyName);
        }
        return {
            uniqueConnections: Array.from(connections).sort(),
            uniqueMaterials: Array.from(materials).sort(),
            uniqueCompanies: Array.from(companies).sort(),
        };
    }, [products]);

    // Client-side Filtering and Sorting
    const filteredAndSortedProducts = useMemo(() => {
        const searchLower = debouncedSearchTerm.trim().toLowerCase();
        
        const filtered = products.filter((p) => {
            const name = p.name.toLowerCase();
            const artNo = p.artNo.toLowerCase();
            const material = p.material.toLowerCase();
            const company = p.companyName.toLowerCase();

            const matchesSearch =
                !searchLower ||
                name.includes(searchLower) ||
                artNo.includes(searchLower) ||
                material.includes(searchLower) ||
                company.includes(searchLower);

            const matchesConnection =
                connectionFilter === "all" || p.connection === connectionFilter;
                
            const matchesMaterial =
                materialFilter === "all" || p.material === materialFilter;
                
            const matchesCompany =
                companyFilter === "all" || p.companyName === companyFilter;

            return matchesSearch && matchesConnection && matchesMaterial && matchesCompany;
        });

        const sorted = filtered.sort((a, b) => {
            switch (sortOrder) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "artno-asc":
                    return a.artNo.localeCompare(b.artNo);
                case "artno-desc":
                    return b.artNo.localeCompare(a.artNo);
                default: // name-asc
                    return a.name.localeCompare(b.name);
            }
        });
        return sorted;
    }, [products, debouncedSearchTerm, connectionFilter, materialFilter, companyFilter, sortOrder]);

    // Reset pagination on filter/sort change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, connectionFilter, materialFilter, companyFilter, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE));
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredAndSortedProducts, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };
    
    const resetFilters = () => {
        setSearchTerm("");
        setConnectionFilter("all");
        setMaterialFilter("all");
        setCompanyFilter("all");
        setSortOrder("name-asc");
        setCurrentPage(1);
    };

    // Helper to generate page numbers for pagination view
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Show a maximum of 5 page buttons

        // Simple logic for displaying pages around the current page
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };


    // --- JSX RENDER ---
    return (
        <section id="products" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-primary-dark">
                    ZOLOTO Valves Price List
                </h2>
                <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Explore our Maximum Retail Price list, effective Dt. 25.08.2025.
                    Prices are inclusive of 18% GST and F.O.R Jalandhar.
                </p>

                {/* Filter and Search Bar */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end"> 
                        {/* Search Bar */}
                        <div className="relative col-span-1 md:col-span-2 lg:col-span-2"> 
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search by Art. No., Valve Type, or Material</label>
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="e.g., Globe Valve, 1001, Bronze..."
                                className="pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary w-full"
                            />
                        </div>

                        {/* Company Filter */}
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                            <select
                                id="company"
                                value={companyFilter}
                                onChange={(e) => setCompanyFilter(e.target.value)}
                                className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm"
                            >
                                <option value="all">All Companies</option>
                                {uniqueCompanies.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Connection Filter */}
                        <div>
                            <label htmlFor="connection" className="block text-sm font-medium text-gray-700">End Connection</label>
                            <select
                                id="connection"
                                value={connectionFilter}
                                onChange={(e) => setConnectionFilter(e.target.value)}
                                className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm"
                            >
                                <option value="all">All Connections</option>
                                {uniqueConnections.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Material Filter */}
                        <div>
                            <label htmlFor="material" className="block text-sm font-medium text-gray-700">Material</label>
                            <select
                                id="material"
                                value={materialFilter}
                                onChange={(e) => setMaterialFilter(e.target.value)}
                                className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm"
                            >
                                <option value="all">All Materials</option>
                                {uniqueMaterials.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                         <div className="flex items-center space-x-3">
                            <button
                                onClick={resetFilters}
                                className="flex items-center text-sm text-primary hover:underline"
                                aria-label="Reset filters"
                            >
                                <X className="w-4 h-4 mr-1" /> Reset Filters
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                id="sort"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm"
                            >
                                <option value="name-asc">Valve Name (A–Z)</option>
                                <option value="price-asc">Price: Low → High</option>
                                <option value="price-desc">Price: High → Low</option>
                                <option value="artno-asc">Art. No. (Asc)</option>
                            </select>

                            {/* View Mode Toggle */}
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md ${viewMode === "grid" ? "bg-primary text-white" : "bg-white"}`} aria-label="Grid View"><LayoutGrid size={18} /></button>
                                <button onClick={() => setViewMode("list")} className={`p-2 rounded-md ${viewMode === "list" ? "bg-primary text-white" : "bg-white"}`} aria-label="List View"><List size={18} /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Summary and View Toggle (kept separate for layout) */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-slate-600">
                        Showing <strong>{paginatedProducts.length}</strong> of{" "}
                        <strong>{filteredAndSortedProducts.length}</strong> results
                    </p>
                </div>


                {/* Product Display */}
                {loading && (
                    <div className={`grid gap-8 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                            <ProductCardSkeleton key={i} view={viewMode} /> 
                        ))}
                    </div>
                )}

                {error && !loading && (
                    <div className="text-center py-10 px-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
                        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                        <h3 className="mt-2 text-lg font-medium">Error Loading Data</h3>
                        <p className="mt-1 text-sm">{String(error)}</p>
                    </div>
                )}

                {!loading && !error && filteredAndSortedProducts.length > 0 && (
                    <>
                        <div className={`grid gap-8 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                            {paginatedProducts.map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    view={viewMode} 
                                    searchHighlight={debouncedSearchTerm}
                                />
                            ))}
                        </div>

                        {/* --- PAGINATION CONTROLS (NEW UI) --- */}
                        <div className="mt-8 flex items-center justify-center space-x-2">
                            {/* Previous Button */}
                            <PaginationButton 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                            >
                                <ArrowLeft className="w-4 h-4 mr-1 inline" /> Previous
                            </PaginationButton>

                            {/* Page Numbers */}
                            <div className="flex space-x-1">
                                {getPageNumbers().map((page) => (
                                    <PaginationButton
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        disabled={false}
                                        active={page === currentPage}
                                    >
                                        {page}
                                    </PaginationButton>
                                ))}
                            </div>
                            
                            {/* Page Count Text (Visible if pages hidden) */}
                            {totalPages > 5 && currentPage !== totalPages && getPageNumbers().indexOf(totalPages) === -1 && (
                                <span className="text-sm text-slate-500">...</span>
                            )}

                            {/* Next Button */}
                            <PaginationButton 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                            >
                                Next <ArrowRight className="w-4 h-4 ml-1 inline" />
                            </PaginationButton>
                            
                            <p className="text-sm text-slate-500 ml-4 hidden sm:block">
                                Page {currentPage} of {totalPages}
                            </p>
                        </div>
                        {/* --- END PAGINATION CONTROLS --- */}
                    </>
                )}
                
                {!loading && !error && filteredAndSortedProducts.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-sm text-slate-600 mb-4">
                            No ZOLOTO products matched your current filters.
                        </p>
                        <button onClick={resetFilters} className="px-4 py-2 bg-primary text-white rounded-md">
                            Clear filters
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};

export default Products;
