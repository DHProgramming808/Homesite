declare global {
  interface Window {
    __CONFIG__?: {
      API_BASE_URL?: string;
      RECIPE_BASE_URL?: string;
      DOMAIN_URL?: string;
    };
  }
}

export type GraphQLError = {
  message: string;
  path?: (string | number)[];
  extensions?: any;
}

export class ApiError extends Error {
  constructor(
      message: string,
      status?: number,
      details?: any,
      graphqlErrors?: GraphQLError[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}
