import { Formatter } from "../../interfaces";

/**
 * Converts a string into uppercase.
 * @see https://help.shopify.com/themes/liquid/filters/string-filters#upcase
 */
export const upcaseFormatter: Formatter = {
  name: "upcase",
  read(str: string) {
    return str.toUpperCase();
  },
};
