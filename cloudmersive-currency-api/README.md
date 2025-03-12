# Creating a Cloudmersive Currency API Proxy

## Use Case

The Cloudmersive Currency API Proxy in Bijira enables seamless integration with Cloudmersive’s currency conversion services, allowing users to access real-time exchange rates and currency conversion functionalities securely and efficiently. This use case focuses on setting up an API proxy to facilitate currency-related functionalities such as currency conversion, exchange rate retrieval, and historical currency data.

The following steps will guide you through the process of creating and deploying the Cloudmersive Currency API Proxy component in Bijira:

1. **Create the Currency API Proxy**: Set up an API proxy in Bijira to connect with Cloudmersive’s services.
2. **Configure and Deploy the Currency API**: Adjust settings and deploy the proxy for external access.
3. **Test the API Proxy**: Use the OpenAPI Console in Bijira to verify the API’s functionality.

## Run the Sample in Bijira

### Prerequisites

- A valid Bijira account with sufficient resource quota.
- A Cloudmersive API key, which you can obtain by signing up at [https://account.cloudmersive.com/](https://account.cloudmersive.com/).

### Create the API Proxy

1. Visit [https://console.bijira.dev/](https://console.bijira.dev/) and sign in to your account.
2. Under **Third-Party APIs (Egress)**, select the **Import API Contract** option.
3. Choose **URL** and provide the following URL to import the API contract from the GitHub repository:
   ```
   https://raw.githubusercontent.com/wso2/bijira-samples/refs/heads/main/cloudmersive-currency-api/openapi.yaml
   ```
4. Click **Next**, then review and modify the pre-defined settings as needed. Default values can be used for this sample.
5. Click **Create** to initialize the Currency API Proxy and wait for the setup to complete.

### Configure the Service Contract

1. Navigate to **Develop → Policy Section**.
2. Click the settings icon next to the **Service Contract URL
3. In the **API Key Header** field, enter `Apikey`.
4. In the **API Key Value** field, enter your Cloudmersive API key.
5. Click **Save** to apply the changes.

### Deploy the API Proxy

1. Go to the **Deploy** page of the API Proxy.
2. Click the **Deploy** button to re-deploy the API Proxy.
3. Wait for the deployment to complete.

## Test the API Proxy

1. Navigate to the **Test → OpenAPI Console** page of the API Proxy.
2. Use the OpenAPI Console to send test requests and validate the API Proxy’s functionality.