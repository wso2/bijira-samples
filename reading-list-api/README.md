# Reading List API Proxy from GitHub Repository

## Use case

This sample demonstrates how to create a proxy for a Reading List API using a GitHub repository. 
The API Proxy component will forward requests to the actual Reading List API, allowing you to manage and monitor the API traffic.

The Reading List API provides endpoints to manage a reading list of books. 
By creating a proxy for this API, you can add additional layers of security, rate limiting, and analytics.

The following steps will guide you through the process of creating and deploying the Reading List API Proxy component in Bijira:

1. **Create the API Proxy**: Create the API Proxy using the provided sample values.
2. **Configure and Deploy the API Proxy**: Configure the necessary settings and deploy the API proxy to make it available for use.
3. **Test the API Proxy**: Use the OpenAPI Console in Bijira to test the API Proxy and ensure it is functioning correctly.

## Run the sample in Bijira

### Prerequisites

- A valid Bijira account with available resource quota.

### Create the API Proxy

1. Go to [https://console.bijira.dev/](https://console.bijira.dev/) and sign in. This opens the project home page.
2. Choose **My APIs (Ingress)** option and select **Import API Contract**.
3. Select **URL** option and provide the following URL to import the API contract from the GitHub repository:
   ```
   https://raw.githubusercontent.com/wso2/bijira-samples/refs/heads/main/reading-list-api/open-api.yaml
   ```
4. Click **Next** and edit pre-defined values as needed. You can keep the default values for this sample.
5. Click **Create** to create the API Proxy. Wait for the setup to complete.

### Configure and Deploy the API Proxy

1. Navigate to the **Deploy** page of the API Proxy.
2. Click **Configure and Deploy** button.
3. Select **External** as API Access Mode.
4. Click **Deploy**.

## Test the API Proxy

1. Navigate to the **Test --> OpenAPI Console** page of the API Proxy.
2. Use the OpenAPI Console to test the API Proxy.

### API Proxy Behavior

The Reading List API Proxy provides the following functionality:

- **GET /books**: Returns a list of pre-defined books with a warning that changes are not persisted.
- **POST /books**: Adds a new book to the reading list (without including `id` in the request body). Returns the created book along with a warning that changes are not persisted.
- **PUT /books/{id}**: Updates the status of an existing book. The request body only includes the `status` to update, and the `id` is passed in the URL. Returns the updated book with a warning.
- **GET /books/{id}**: Retrieves a book by its `id`. If the `id` does not exist, a 404 error is returned.
- **DELETE /books/{id}**: Deletes a book by its `id`.