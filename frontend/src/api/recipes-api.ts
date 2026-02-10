import { getAccessToken } from "../auth";
import type { GraphQLError } from "./api-helper";
import { ApiError } from "./api-helper";

export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  featured: boolean;
  createdByUserId: number;
  createdAt: string;   // Instant serialized as ISO string
  updatedAt?: string;  // if you query it
  imageUrl?: string; // TODO add image support to recipes
};


const RECIPES_GRAPHQL_URL = window.__CONFIG__?.API_BASE_URL ??
  window.__CONFIG__?.RECIPE_BASE_URL ??
  import.meta.env.VITE_RECIPES_API_GRAPHQL_URL ??
  "http://localhost:5000";


// GRAPHQL API

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
}


async function graphql<TData>(
  query: string,
  variables?: Record<string, unknown>,
  opts?: {auth?:boolean}
): Promise<TData> {
  const url = RECIPES_GRAPHQL_URL + "/recipes/graphql";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (opts?.auth) {
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables: variables ?? {} }),
  });

  const responseBody = await response.text();

  if (!responseBody || !responseBody.trim()) {
    const contentType = response.headers.get("content-type");
    throw new Error(
      `GraphQL returned empty body (status ${response.status}). content-type = ${contentType ?? "n/a"}`

    );
  }

  let json: GraphQLResponse<TData>;
  try {
    json = JSON.parse(responseBody);
  } catch (err) {
    console.error("Failed to parse GraphQL response as JSON:", err, "Response body:", responseBody);
    throw new Error("Invalid JSON response from server");
  }

  if (json.errors?.length) {
    const detail = json.errors.map(e => e.message).join(" | ");
    throw new ApiError(`GraphQL errors: ${detail}`, response.status, response.statusText, json.errors);
  }

  if (!json.data) {
    throw new ApiError("No data in GraphQL response", response.status, response.statusText); // TODO check if an empty response is correct sometimes and doesn't need an thrown error
  }

  return json.data;
}


// Queries
// TODO consider mobing query strings to their own file

export async function getFeaturedRecipes(limit = 6): Promise<Recipe[]> {
  const query = `
  query GetFeaturedRecipes($limit: Int!) {
    getFeaturedRecipes(limit: $limit) {
      id
      title
      description
      ingredients
      steps
      featured
      createdByUserId
      createdAt
      updatedAt
      imageUrl
    }
  }`;

  type Data = {getFeaturedRecipes: Recipe[]};

  const response = await graphql<Data>(query, { limit }, {auth: false});
  return response.getFeaturedRecipes;
}


export async function getRecipeById(id: string): Promise<Recipe | null> {
  const query = `
  query GetRecipeById($id: ID!) {
    getRecipeById(id: $id) {
      id
      title
      description
      ingredients
      steps
      featured
      createdByUserId
      createdAt
      updatedAt
      imageUrl
    }
  }`;

  type Data = {getRecipeById: Recipe | null};

  const response = await graphql<Data>(query, { id }, {auth: false});
  return response.getRecipeById;
}

export async function getRandomRecipe(): Promise<Recipe | null> {
  const query = `
  query GetRandomRecipe {
    getRandomRecipe {
      id
      title
      description
      ingredients
      steps
      featured
      createdByUserId
      createdAt
      updatedAt
      imageUrl
    }
  }`;

  type Data = {getRandomRecipe: Recipe | null};

  const response = await graphql<Data>(query, {}, {auth: false});
  return response.getRandomRecipe;
}


// Mutations

export type CreateRecipeInput = {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  featured?: boolean;
  imageUrl?: string;
};

export async function createRecipe(input: CreateRecipeInput): Promise<Recipe> {
  const mutation = `
  mutation CreateRecipe($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
      id
      title
      description
      ingredients
      steps
      featured
      createdByUserId
      createdAt
      updatedAt
      imageUrl
    }
  }`;

  type Data = {createRecipe: Recipe};

  const response = await graphql<Data>(mutation, { input }, {auth: true});
  return response.createRecipe;
}


export type UpdateRecipeInput = {
  id: string;
  title?: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
  featured?: boolean;
  imageUrl?: string;
};

export async function updateRecipe(id: string, input: Omit<UpdateRecipeInput, "id">): Promise<Recipe> {
  const mutation = `
    mutation UpdateRecipe($id: ID!, $input: UpdateRecipeInput!) {
    updateRecipe(id: $id, input: $input) {
      id
      title
      description
      ingredients
      steps
      featured
      createdByUserId
      createdAt
      updatedAt
      imageUrl
    }
  }`;

  type Data = {updateRecipe: Recipe};

  const response = await graphql<Data>(mutation, { id, input }, {auth: true});
  return response.updateRecipe;
}

export async function deleteRecipe(id: string): Promise<boolean> {
  const mutation = `
    mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id)
  }`;

  type Data = {deleteRecipe: boolean};

  const response = await graphql<Data>(mutation, { id }, {auth: true});
  return response.deleteRecipe;
}
