# Countries GraphQL API

## Use case

This sample demonstrates how to create a GraphQL API Proxy for a Countries API using a GraphQL schema definition.

The API Proxy component will forward requests to the actual Countries GraphQL API, allowing you to manage and monitor the API traffic.

The Countries GraphQL API provides queries and mutations to manage country data. 
By creating a GraphQL API Proxy for this API, you can add additional layers of security, rate limiting, and analytics.

The following steps will guide you through the process of creating and deploying the GraphQL API Proxy component in Bijira:

1. **Create the API Proxy**: Create the API Proxy using the provided sample values.
2. **Configure and Deploy the API Proxy**: Configure the necessary settings and deploy the API proxy to make it available for use.
3. **Test the API Proxy**: Use the GraphQL Console in Bijira to test the API Proxy and ensure it is functioning correctly.

## Run the sample in Bijira

### Prerequisites

- A valid Bijira account with available resource quota.

### Create the API Proxy

1. Go to [https://console.bijira.dev/](https://console.bijira.dev/) and sign in. This opens the project home page.
2. Choose **My APIs (Ingress)** option and select **Import API Contract**.
3. Select **URL** option and provide the following URL to import the GraphQL schema from the GitHub repository:
   ```
   https://raw.githubusercontent.com/wso2/bijira-samples/refs/heads/main/countries-api/schema.graphql
   ```
4. Click **Next** and edit pre-defined values as needed. You can keep the default values for this sample.
5. Click **Create** to create the API Proxy. Wait for the setup to complete.

### Configure and Deploy the API Proxy

1. Navigate to the **Deploy** page of the API Proxy.
2. Click **Configure and Deploy** button.
3. Select **External** as API Access Mode.
4. Click **Deploy**.

## Test the API Proxy

1. Navigate to the **Test --> GraphQL Console** page of the API Proxy.
2. Use the GraphQL Console to test the API Proxy with queries and mutations.

### API Proxy Behavior

The Countries GraphQL API Proxy provides the following functionality:

- **Queries**: Query country data including country details, lists, and filtered results.
- **Mutations**: Create, update, or delete country data (if supported by the backend).

## Sample backend service (for testing)

This repository also includes a runnable Node.js GraphQL backend you can use as the upstream for the proxy:

- **Service path**: `services/countries-service-nodejs`
- **Default URL**: `http://localhost:8080/graphql`

To run it locally:

```bash
cd services/countries-service-nodejs
npm install
npm start
```

Example query:

```bash
curl -sS http://localhost:8080/graphql \
  -H 'content-type: application/json' \
  --data-binary '{"query":"{ countries { code name continent { code name } } }"}'
```

## GraphQL Schema

The GraphQL schema is defined in `schema.graphql`. This file contains the type definitions, queries, and mutations available in the Countries API.

