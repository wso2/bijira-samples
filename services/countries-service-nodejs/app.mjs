// Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com/) All Rights Reserved.
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied. See the License for the
// specific language governing permissions and limitations
// under the License.

import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSchema, graphql } from "graphql";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readSchemaSDL() {
  // Use the schema file in the service directory (copied from countries-api/)
  const schemaPath = path.resolve(__dirname, "schema.graphql");
  return fs.readFileSync(schemaPath, "utf8");
}

const schema = buildSchema(readSchemaSDL());

// ---- In-memory sample data -------------------------------------------------

const CONTINENTS = [
  { code: "AF", name: "Africa" },
  { code: "AN", name: "Antarctica" },
  { code: "AS", name: "Asia" },
  { code: "EU", name: "Europe" },
  { code: "NA", name: "North America" },
  { code: "OC", name: "Oceania" },
  { code: "SA", name: "South America" }
];

const LANGUAGES = [
  { code: "en", name: "English", native: "English", rtl: false },
  { code: "fr", name: "French", native: "Français", rtl: false },
  { code: "si", name: "Sinhala", native: "සිංහල", rtl: false }
];

const COUNTRIES = [
  {
    code: "US",
    name: "United States",
    native: "United States",
    capital: "Washington, D.C.",
    continent: "NA",
    currency: "USD",
    currencies: ["USD"],
    emoji: "🇺🇸",
    emojiU: "U+1F1FA U+1F1F8",
    phone: "1",
    phones: ["1"],
    languages: ["en"],
    awsRegion: "us-east-1",
    states: [
      { code: "CA", name: "California" },
      { code: "NY", name: "New York" }
    ],
    subdivisions: []
  },
  {
    code: "FR",
    name: "France",
    native: "France",
    capital: "Paris",
    continent: "EU",
    currency: "EUR",
    currencies: ["EUR"],
    emoji: "🇫🇷",
    emojiU: "U+1F1EB U+1F1F7",
    phone: "33",
    phones: ["33"],
    languages: ["fr"],
    awsRegion: "eu-west-3",
    states: [],
    subdivisions: [
      { code: "FR-IDF", name: "Île-de-France", emoji: "🗼" }
    ]
  },
  {
    code: "LK",
    name: "Sri Lanka",
    native: "ශ්‍රී ලංකාව",
    capital: "Sri Jayawardenepura Kotte",
    continent: "AS",
    currency: "LKR",
    currencies: ["LKR"],
    emoji: "🇱🇰",
    emojiU: "U+1F1F1 U+1F1F0",
    phone: "94",
    phones: ["94"],
    languages: ["si", "en"],
    awsRegion: "ap-south-1",
    states: [],
    subdivisions: []
  }
];

function getContinentByCode(code) {
  const c = CONTINENTS.find((x) => x.code === code);
  if (!c) return null;
  return {
    code: c.code,
    name: c.name,
    countries: () => COUNTRIES.filter((cty) => cty.continent === c.code).map(toCountryGQL)
  };
}

function getLanguageByCode(code) {
  const l = LANGUAGES.find((x) => x.code === code);
  if (!l) return null;
  return {
    code: l.code,
    name: l.name,
    native: l.native,
    rtl: l.rtl,
    countries: () => COUNTRIES.filter((cty) => cty.languages.includes(l.code)).map(toCountryGQL)
  };
}

function toStateGQL(countryCode, state) {
  return {
    code: state.code ?? null,
    name: state.name,
    country: () => toCountryGQL(COUNTRIES.find((c) => c.code === countryCode))
  };
}

function toCountryGQL(country) {
  if (!country) return null;
  return {
    awsRegion: country.awsRegion,
    capital: country.capital ?? null,
    code: country.code,
    continent: () => getContinentByCode(country.continent),
    currencies: country.currencies,
    currency: country.currency ?? null,
    emoji: country.emoji,
    emojiU: country.emojiU,
    languages: () => country.languages.map(getLanguageByCode).filter(Boolean),
    name: ({ lang } = {}) => {
      // Minimal: ignore `lang` and always return English name.
      // Keeping the arg makes this compatible with the schema.
      return country.name;
    },
    native: country.native,
    phone: country.phone,
    phones: country.phones,
    states: () => (country.states || []).map((s) => toStateGQL(country.code, s)),
    subdivisions: () => (country.subdivisions || []).map((sd) => ({ ...sd }))
  };
}

function applyStringQueryOperator(value, operator) {
  if (!operator || value == null) return true;

  if (operator.eq != null && value !== operator.eq) return false;
  if (operator.ne != null && value === operator.ne) return false;
  if (Array.isArray(operator.in) && operator.in.length > 0 && !operator.in.includes(value)) return false;
  if (Array.isArray(operator.nin) && operator.nin.length > 0 && operator.nin.includes(value)) return false;
  if (operator.regex != null) {
    try {
      const re = new RegExp(operator.regex, "i");
      if (!re.test(value)) return false;
    } catch {
      // If regex is invalid, treat it as "no match".
      return false;
    }
  }
  return true;
}

function filterCountries(countries, filter = {}) {
  return countries.filter((c) => {
    if (filter.code && !applyStringQueryOperator(c.code, filter.code)) return false;
    if (filter.name && !applyStringQueryOperator(c.name, filter.name)) return false;
    if (filter.continent && !applyStringQueryOperator(c.continent, filter.continent)) return false;
    if (filter.currency && !applyStringQueryOperator(c.currency ?? "", filter.currency)) return false;
    return true;
  });
}

function filterContinents(continents, filter = {}) {
  return continents.filter((c) => {
    if (filter.code && !applyStringQueryOperator(c.code, filter.code)) return false;
    return true;
  });
}

function filterLanguages(languages, filter = {}) {
  return languages.filter((l) => {
    if (filter.code && !applyStringQueryOperator(l.code, filter.code)) return false;
    return true;
  });
}

const rootValue = {
  country: ({ code }) => toCountryGQL(COUNTRIES.find((c) => c.code === code)),
  countries: ({ filter } = {}) => filterCountries(COUNTRIES, filter).map(toCountryGQL),

  continent: ({ code }) => getContinentByCode(code),
  continents: ({ filter } = {}) => filterContinents(CONTINENTS, filter).map((c) => getContinentByCode(c.code)),

  language: ({ code }) => getLanguageByCode(code),
  languages: ({ filter } = {}) => filterLanguages(LANGUAGES, filter).map((l) => getLanguageByCode(l.code))
};

// ---- Express app -----------------------------------------------------------

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/healthz", (_req, res) => res.sendStatus(200));

// Minimal GraphQL over HTTP (POST only).
app.post("/graphql", async (req, res) => {
  const { query, variables, operationName } = req.body || {};

  if (!query || typeof query !== "string") {
    return res.status(400).json({ errors: [{ message: "Request body must include a string 'query' field." }] });
  }

  const result = await graphql({
    schema,
    source: query,
    rootValue,
    variableValues: variables ?? undefined,
    operationName: operationName ?? undefined
  });

  const status = result.errors?.length ? 400 : 200;
  return res.status(status).json(result);
});

app.get("/", (_req, res) => {
  res.type("text/plain").send(
    [
      "Countries GraphQL Service",
      "",
      "POST /graphql with JSON body: { \"query\": \"{ countries { code name } }\" }",
      "GET  /healthz"
    ].join("\n")
  );
});

// 404 handler
app.use("*", (_req, res) => {
  res.status(404).json({ error: "The requested resource does not exist on this server" });
});

export default app;


