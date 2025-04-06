import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ColorThief from "colorthief";
import { PrismaClient } from "@prisma/client";
import { db } from "./db";
import countries from "@/data/countries.json";
import { CartProductType, Country } from "./types";
import { differenceInDays, differenceInHours } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getGridClassName = (length: number) => {
  switch (length) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 grid-rows-2";
    case 4:
      return "grid-cols-2 grid-rows-2";
    case 5:
      return "grid-cols-2 grid-rows-6";
    case 6:
      return "grid-cols-2 grid-rows-3";
    default:
      return "grid-cols-1";
  }
};

// Function to get prominent colors from an image
export const getDominantColors = (imgUrl: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(img, 4).map((color) => {
          // Convert RGB array to hex string
          return `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2])
            .toString(16)
            .slice(1)
            .toUpperCase()}`;
        });
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};

//Generate a uniqure slug
export const generateUniqueSlug = async (
  baseSlug: string,
  model: keyof PrismaClient,
  field: string = "slug",
  separator: string = "-"
) => {
  const count = await (db[model] as any).count({
    where: {
      [field]: {
        startsWith: `${baseSlug}${separator}`,
      },
    },
  });

  if (count === 0) {
    const exists = await (db[model] as any).findFirst({
      where: { [field]: baseSlug },
    });
    return exists ? `${baseSlug}${separator}1` : baseSlug;
  }

  return `${baseSlug}${separator}${count + 1}`;
};

//Function to get the user country
const DEFAULT_COUNTRY: Country = {
  name: "United Kingdom",
  code: "GB",
  city: "London",
  region: "England",
};

export async function getUserCountry(): Promise<Country> {
  let userCountry: Country = DEFAULT_COUNTRY;
  try {
    const response = await fetch(
      `https://ipinfo.io/?token=${process.env.IPINFO_API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();
      userCountry = {
        name:
          countries.find((country) => country.code === data.country)?.name ||
          data.country,
        code: data.country,
        city: data.city,
        region: data.region,
      };
    }
  } catch (error) {
    console.error("Error getting user country", error);
  }
  return userCountry;
}

//Function to get the shipping rate range by adding the specified min and max
export const getShippingDatesRange = (
  minDays: number,
  maxDays: number,
  date?: Date
) => {
  const currentDate = date ? new Date(date) : new Date();

  //Calculate minDate by adding minDays to currentDate
  const minDate = new Date(currentDate);
  minDate.setDate(currentDate.getDate() + minDays);

  //Calculate maxDate by adding maxDays to currentDate
  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + maxDays);

  return { minDate: minDate.toDateString(), maxDate: maxDate.toDateString() };
};

//Function to validate the product data before adding to cart
export const isProductValidToAdd = (product: CartProductType): boolean => {
  // Check that all required fields are filled
  const {
    productId,
    variantId,
    productSlug,
    variantSlug,
    name,
    variantName,
    image,
    quantity,
    price,
    sizeId,
    size,
    stock,
    shippingFee,
    extraShippingFee,
    shippingMethod,
    shippingService,
    variantImage,
    weight,
    deliveryTimeMin,
    deliveryTimeMax,
  } = product;

  // Ensure that all necessary fields have values
  if (
    !productId ||
    !variantId ||
    !productSlug ||
    !variantSlug ||
    !name ||
    !variantName ||
    !image ||
    quantity <= 0 ||
    price <= 0 ||
    !sizeId ||
    !size ||
    stock <= 0 ||
    weight <= 0 ||
    !shippingMethod ||
    !variantImage ||
    deliveryTimeMin < 0 ||
    deliveryTimeMax < deliveryTimeMin
  ) {
    return false; // Validation failed
  }

  return true; // Product is valid
};

type CensorReturn = {
  firstName: string;
  lastName: string;
  fullName: string;
};

export function censorName(
  firstNameInput: string,
  lastNameInput: string
): CensorReturn {
  const censor = (name: string): string => {
    if (name.length <= 2) return name;

    const firstChar = name[0];
    const lastChar = name[name.length - 1];

    const middleLength = name.length - 2;

    return `${firstChar}${"*".repeat(middleLength)}${lastChar}`;
  };

  const censoredFullName = `${firstNameInput[0]}***${
    lastNameInput[lastNameInput.length - 1]
  }`;

  return {
    firstName: censor(firstNameInput),
    lastName: censor(lastNameInput),
    fullName: censoredFullName,
  };
}

export const getTimeUntil = (
  targetDate: string
): { days: number; hours: number } => {
  const now = new Date();
  const target = new Date(targetDate);

  //Ensure target date is in the future
  if (target <= now) return { days: 0, hours: 0 };

  const totalDays = differenceInDays(target, now);
  const totalHours = differenceInHours(target, now) % 24;

  return { days: totalDays, hours: totalHours };
};

export const downloadBlobAsFile = (blob: Blob, filename: string) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const printPDF = (blob: Blob) => {
  const pdfUrl = URL.createObjectURL(blob);
  const printWindow = window.open(pdfUrl, "_blank");
  if (printWindow) {
    printWindow.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  }
};

export const updateProductHistory = (variantSlug: string) => {
  let productHistory: string[] = [];
  const historyString = localStorage.getItem("productHistory");

  if (historyString) {
    try {
      productHistory = JSON.parse(historyString);
    } catch (error) {
      console.error("Error parsing product history", error);
      productHistory = [];
    }
  }

  //Update the history
  productHistory = productHistory.filter((slug) => slug != variantSlug);
  productHistory.unshift(variantSlug);

  //Check storage limit
  const MAX_PRODUCTS = 100;
  if (productHistory.length > MAX_PRODUCTS) {
    productHistory.pop();
  }

  //Save the updated history
  localStorage.setItem("productHistory", JSON.stringify(productHistory));
};
