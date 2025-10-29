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
  tdrLink: string; // Updated from pdfLink
  certification: string[];
  keyFeatures: string[];
  stock: number;
  availability: Availability;
  raw?: Record<string, any>;
}

// ----------------------------------------------------------------------
// GVIZ UTILITIES (Must be exported to be used in Products.tsx if GVIZ logic is used)
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
// ZOLOTO Mapping Utilities (Internal Helpers - NOT exported)
// ----------------------------------------------------------------------

const parseNumber = (val: any, fallback = 0) => {
    if (typeof val === "number") return val;
    const s = String(val || "").replace(/[^\d.-]/g, "");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : fallback;
};

const mapAvailability = (value: string | undefined): Availability => {
    const status = (value || "").toLowerCase().trim();
    if (status.includes("in")) return "In Stock";
    
    return "Out of Stock"; 
};

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
// This function IS exported as it is used by Products.tsx
export function mapZolotoRowsToProducts(rows: Record<string, any>[]): ValveProduct[] {
  const products: ValveProduct[] = [];
  const uniqueArtNos = new Set<string>();

  for (const row of rows) {
    const artNo = getCellValue(row, ["Art. No.", "ArtNo", "Article"]) || "";
    const productName = getCellValue(row, ["Product", "Name", "Valve Name"]) || "";
    const hsnCode = getCellValue(row, ["HSN Code", "HSN"]) || "";
    
    const companyName = getCellValue(row, ["Company", "Brand", "Manufacturer Name"]) || "ZOLOTO";
    
    const stock = parseNumber(getCellValue(row, ["Stock", "Quantity"])) || 0;
    const statusText = getCellValue(row, ["Availability", "Stock Status", "Status"]); 
    const availability = mapAvailability(statusText);
    
    const certFlangeRaw = getCellValue(row, ["Certification/Flange", "Flange"]) || "";
    const sheetTdrLink = getCellValue(row, ["TDR Link", "TDRLink", "TDR"]) || "";


    if (!productName || !artNo) continue;
    
    if (uniqueArtNos.has(artNo)) continue;
    uniqueArtNos.add(artNo);


    const tdrLink = sheetTdrLink.trim()
      ? sheetTdrLink.trim()
      : `${TDR_BASE_URL}?pid=${artNo}`;

    const nameLower = productName.toLowerCase();
    
    let material = "Unknown";
    if (nameLower.includes("bronze")) material = "Bronze";
    else if (nameLower.includes("cast iron") || nameLower.includes("ci")) material = "Cast Iron";
    else if (nameLower.includes("cast steel") || nameLower.includes("cs")) material = "Cast Steel";
    else if (nameLower.includes("forged steel")) material = "Forged Steel";
    else if (nameLower.includes("forged brass") || nameLower.includes("brass")) material = "Forged Brass";
    else if (nameLower.includes("stainless steel") || nameLower.includes("ss")) material = "Stainless Steel";

    let connection = getCellValue(row, ["Connection Type", "Connection"]) || "Screwed";
    if (nameLower.includes("flanged")) connection = "Flanged";
    else if (nameLower.includes("wafer type")) connection = "Wafer Type";
    
    let keyFeatures: string[] = [];
    if (certFlangeRaw && certFlangeRaw !== '-') keyFeatures.push(certFlangeRaw); 

    const connectionTypeFromSheet = getCellValue(row, ["Connection Type", "Type"])
    if (connectionTypeFromSheet && !["Screwed", "Flanged", "Wafer Type"].some(c => connectionTypeFromSheet.toLowerCase().includes(c.toLowerCase()))) {
        keyFeatures.push(connectionTypeFromSheet);
    }
    
    const certification = keyFeatures.filter(f => 
        f.includes('Certified') || 
        f.includes('IS') || 
        f.includes('BS')
    );
    
    const id = artNo;

    products.push({
      id,
      artNo,
      name: productName,
      companyName,
      material,
      connection,
      hsnCode,
      tdrLink, 
      certification,
      keyFeatures,
      stock,
      availability, 
      raw: row,
    });
  }

  return products;
}