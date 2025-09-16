import { createLoader, parseAsString } from "nuqs";

export const searchUserParams = {
  searchTerm: parseAsString,
};

export const loadSearchUserParams = createLoader(searchUserParams);
