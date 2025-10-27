import { Download } from "lucide-react";

// src/lib/types.ts

export type Availability = "In Stock" | "Out of Stock";

export interface ValveProduct {
  id: string; 
  artNo: string;
  name: string;
  companyName: string; 
  material: string;
  connection: string;
  hsnCode: string;
  // Removed sizeInches, sizeMM, and price
  pdfLink: string; 
  certification: string[];
  keyFeatures: string[];
  stock: number;
  availability: Availability;
  // Removed imageUrl
  raw?: Record<string, any>;
}

// ----------------------------------------------------------------------
// GVIZ UTILITIES (Client-Side Sheet Data Conversion)
// ----------------------------------------------------------------------

interface GvizResponse {
  version: string;
  reqId: string;
  status: 'ok' | 'error';
  table: {
    cols: { id: string; label: string; type: string; pattern?: string }[];
    rows: { c: { v: any; f?: string }[] }[];
  };
  errors?: any[];
}

export function parseGvizText(text: string): GvizResponse {
  const jsonText = text
    .replace("/*O_o*/", "")
    .replace("google.visualization.Query.setResponse(", "")
    .slice(0, -2);
  try {
    return JSON.parse(jsonText);
  } catch (e) {
    console.error("Failed to parse GViz response:", e);
    throw new Error("Invalid GViz response format.");
  }
}

export const gvizResponseToRows = (
  gvizResponse: GvizResponse,
): Record<string, any>[] => {
  if (gvizResponse.status !== "ok" || !gvizResponse.table) {
    throw new Error("GViz response indicates an error or contains no table.");
  }

  const { cols, rows } = gvizResponse.table;
  const headers = cols.map((col) => col.label || col.id).filter(Boolean);

  return rows.map((row) => {
    const rowObject: Record<string, any> = {};
    row.c.forEach((cell, index) => {
      const header = headers[index];
      if (header) {
        rowObject[header] = cell?.f ?? cell?.v;
      }
    });
    return rowObject;
  });
};


// ----------------------------------------------------------------------
// ZOLOTO Mapping (Final Version)
// ----------------------------------------------------------------------

const parseNumber = (val: any, fallback = 0) => {
    if (typeof val === "number") return val;
    const s = String(val || "").replace(/[^\d.-]/g, "");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : fallback;
};

// SIMPLIFIED CHANGE: Only checks for 'In Stock' or defaults to 'Out of Stock'
const mapAvailability = (value: string | undefined): Availability => {
    const status = (value || "").toLowerCase().trim();
    if (status.includes("in")) return "In Stock";
    
    // Default to Out of Stock if no recognized 'in' text is provided
    return "Out of Stock"; 
};

// Simple utility to find a header, allowing for various spellings
const getCellValue = (row: Record<string, any>, candidates: string[]): string | undefined => {
    const rowKeys = Object.keys(row);
    for (const key of rowKeys) {
        if (candidates.some(c => key.toLowerCase().includes(c.toLowerCase()))) {
            return String(row[key]);
        }
    }
    return undefined;
};

// Base URL for the TDR PDF download endpoint
const TDR_BASE_URL = 'https://www.zolotovalves.com/wp-content/themes/zolotovalves/generatepdf.php';


// Main mapping function to convert raw sheet rows into structured ValveProduct objects
export function mapZolotoRowsToProducts(rows: Record<string, any>[]): ValveProduct[] {
  const products: ValveProduct[] = [];
  const uniqueArtNos = new Set<string>();

  for (const row of rows) {
    // IMPORTANT: Keys must match the exact column headers from your Google Sheet
    const artNo = getCellValue(row, ["Art. No.", "ArtNo", "Article"]) || "";
    const productName = getCellValue(row, ["Product", "Name", "Valve Name"]) || "";
    // Removed sizeInches, sizeMM, and the Price/Piece column retrieval
    const hsnCode = getCellValue(row, ["HSN Code", "HSN"]) || "";
    
    // Extract Company Name
    const companyName = getCellValue(row, ["Company", "Brand", "Manufacturer Name"]) || "ZOLOTO";
    
    // Extract Stock & Status
    const stock = parseNumber(getCellValue(row, ["Stock", "Quantity"])) || 0;
    const statusText = getCellValue(row, ["Availability", "Stock Status", "Status"]); 
    const availability = mapAvailability(statusText);
    
    // Extract Certification/Flange data
    const certFlangeRaw = getCellValue(row, ["Certification/Flange", "Flange"]) || "";


    // Skip if core data or ArtNo is missing
    if (!productName || !artNo) continue;
    
    // CONSOLIDATION CHECK: Only process unique Art. Nos. (ignoring size variants)
    if (uniqueArtNos.has(artNo)) continue;
    uniqueArtNos.add(artNo);


    // CONSTRUCT PDF LINK
    // We use the ArtNo to create the TDR link
    const pdfLink = `${TDR_BASE_URL}?pid=${artNo}`;

    // --- Deriving Material, Connection, and Features from Product Name/Notes ---
    const nameLower = productName.toLowerCase();
    
    let material = "Unknown";
    if (nameLower.includes("bronze")) material = "Bronze";
    else if (nameLower.includes("cast iron") || nameLower.includes("ci")) material = "Cast Iron";
    else if (nameLower.includes("cast steel") || nameLower.includes("cs")) material = "Cast Steel";
    else if (nameLower.includes("forged steel")) material = "Forged Steel";
    else if (nameLower.includes("forged brass") || nameLower.includes("brass")) material = "Forged Brass";
    else if (nameLower.includes("stainless steel") || nameLower.includes("ss")) material = "Stainless Steel";

    let connection = "Screwed";
    if (nameLower.includes("flanged")) connection = "Flanged";
    else if (nameLower.includes("wafer type")) connection = "Wafer Type";
    
    let keyFeatures: string[] = [];
    if (certFlangeRaw && certFlangeRaw !== '-') keyFeatures.push(certFlangeRaw); // Use new column data

    const certification = keyFeatures.filter(f => 
        f.includes('Certified') || 
        f.includes('IS') || 
        f.includes('BS')
    );
    
    // Set a unique product ID based on the Art. No. for React keys
    const id = artNo;


    products.push({
      id,
      artNo,
      name: productName,
      companyName,
      material,
      connection,
      hsnCode,
      // Removed sizeInches, sizeMM, price from final object
      pdfLink, 
      certification,
      keyFeatures,
      stock,
      availability, 
      // Removed imageUrl from final object
      raw: row,
    });
  }

  return products;
}
