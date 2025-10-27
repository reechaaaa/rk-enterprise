// src/lib/types.ts

// The GvizResponse and gvizResponseToRows utility functions are necessary for client-side fetching.
// Since we don't have the external files (gvizService.ts, dataMapping.ts), we include the core logic here.

export type Availability = "In Stock" | "Low Stock" | "Out of Stock";

export interface ValveProduct {
  id: string; 
  artNo: string;
  name: string;
  companyName: string; // <-- RENAMED: Use for filtering by company/brand
  material: string;
  connection: string;
  hsnCode: string;
  sizeInches: string;
  sizeMM: number;
  price: number;
  certification: string[];
  keyFeatures: string[];
  stock: number;
  availability: Availability;
  imageUrl?: string; 
  raw?: Record<string, any>;
}

// ----------------------------------------------------------------------
// GVIZ UTILITIES (Client-Side Sheet Data Conversion)
// ----------------------------------------------------------------------
// ... (parseGvizText and gvizResponseToRows remain the same)
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
// ZOLOTO Mapping (Updated for Company Name)
// ----------------------------------------------------------------------

const parseNumber = (val: any, fallback = 0) => {
    if (typeof val === "number") return val;
    const s = String(val || "").replace(/[^\d.-]/g, "");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : fallback;
};

const getAvailability = (stock: number): Availability => {
    if (stock > 20) return "In Stock";
    if (stock > 0) return "Low Stock";
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


// Main mapping function to convert raw sheet rows into structured ValveProduct objects
export function mapZolotoRowsToProducts(rows: Record<string, any>[]): ValveProduct[] {
  const products: ValveProduct[] = [];
  const uniqueIdCheck = new Set<string>();

  for (const row of rows) {
    // IMPORTANT: Keys must match the exact column headers from your Google Sheet
    const artNo = getCellValue(row, ["Art. No.", "ArtNo", "Article"]) || "";
    const productName = getCellValue(row, ["Product", "Name", "Valve Name"]) || "";
    const sizeInches = getCellValue(row, ["Inches", "Size Inches"]) || "";
    const sizeMM = parseNumber(getCellValue(row, ["mm", "Size MM"]));
    const price = parseNumber(getCellValue(row, ["Price/Piece", "Price"]));
    const hsnCode = getCellValue(row, ["HSN Code", "HSN"]) || "";
    const imageUrl = getCellValue(row, ["Image URL", "Image", "img"]) || undefined; 
    
    // NEW: Extract Company/Brand Name. Assuming a header like 'Company' or 'Brand'
    // If not found, default to 'ZOLOTO' as per your initial data.
    const companyName = getCellValue(row, ["Company", "Brand", "Manufacturer Name"]) || "ZOLOTO";
    
    // Skip if core data is missing
    if (!productName || !sizeInches || !artNo) continue;
    
    // Create a stable unique ID
    const id = `${artNo}-${sizeInches.replace(/[/$]/g, '')}-${sizeMM}`;
    if (uniqueIdCheck.has(id)) continue; 
    uniqueIdCheck.add(id);

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
    if (nameLower.includes("bs 10 table 'd'")) keyFeatures.push("Flanged Ends to BS 10 Table 'D'");
    if (nameLower.includes("bs 10 table 'f'")) keyFeatures.push("Flanged Ends to BS 10 Table 'F'");
    if (nameLower.includes("is 778")) keyFeatures.push("Flanged Ends to IS 778");
    if (nameLower.includes("is 1538")) keyFeatures.push("Flanged Ends to IS 1538");
    if (nameLower.includes("ibr")) keyFeatures.push("I.B.R. Certified");
    if (nameLower.includes("pn ")) {
        const match = productName.match(/PN\s*(\d+(\.\d+)?)/i);
        if (match) keyFeatures.push(`Pressure Nominal: PN ${match[1]}`);
    }

    const certification = keyFeatures.filter(f => 
        f.includes('Certified') || 
        f.includes('IS') || 
        f.includes('BS')
    );

    // Mock Stock/Availability
    const stock = 100; 

    products.push({
      id,
      artNo,
      name: productName,
      companyName, // <-- Mapped company name
      material,
      connection,
      hsnCode,
      sizeInches,
      sizeMM,
      price,
      certification,
      keyFeatures,
      stock,
      availability: getAvailability(stock),
      imageUrl, 
      raw: row,
    });
  }

  return products;
}
