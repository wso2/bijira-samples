# Creating an OpenWeatherMap API Proxy

## Use Case

The OpenWeatherMap API Proxy in Bijira enables seamless integration with OpenWeatherMap’s weather data, allowing users to access real-time weather information securely and efficiently. This use case focuses on setting up an API proxy to facilitate weather-related functionalities such as current weather data, forecasts, and historical weather data.

The following steps will guide you through the process of creating and deploying the OpenWeatherMap API Proxy component in Bijira:

1. **Create the Weather API Proxy**: Set up an API proxy in Bijira to connect with OpenWeatherMap’s services.
2. **Configure and Deploy the Weather API**: Adjust settings and deploy the proxy for external access.
3. **Test the API Proxy**: Use the OpenAPI Console in Bijira to verify the API’s functionality.

## Run the Sample in Bijira

### Prerequisites

- A valid Bijira account with sufficient resource quota.
- An OpenWeatherMap API key, which you can obtain by signing up at [https://home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys).

### Create the API Proxy

1. Visit [https://preview-dv.bijira.dev/](https://preview-dv.bijira.dev/) and sign in to your account.
2. Click the **Create** button in the **Component Listing** section.
3. Under **Create API Proxy for Third-Party APIs (Egress)**, select the **Get from Marketplace** option.
4. Choose **OpenWeatherMap** from the list of available APIs.
5. Click **Next**, then review and modify the pre-defined settings as needed. Default values can be used for this sample and make sure that the Target URL points to `https://api.openweathermap.org/data/2.5`.
6. Click **Create** to initialize the Weather API Proxy and wait for the setup to complete.

### Configure the Service Contract

1. Navigate to **Develop → Policy Section**.
2. Click the document icon in the middle of two `/weather` paths to add a mediation policy.
3. For the request path, select `Add Query Parameter` policy and **set the parameter name to `appid` and the value to your OpenWeatherMap API key**. Make sure to check **Apply to all resources** checkbox.
4. Save the changes.

## Deploy the API Proxy

1. Navigate to the **Deploy** page of the API Proxy.
2. Click the **Configure and Deploy** button
3. Select **External** as the API Access Mode.
4. Click **Deploy** to complete the deployment.

## Test the API Proxy

1. Navigate to the **Test → OpenAPI Console** page of the API Proxy.
2. Use the OpenAPI Console to send test requests and validate the API Proxy’s functionality.

### API Proxy Behavior

Once deployed, the Weather API Proxy allows you to interact with OpenWeatherMap’s API securely, providing access to weather data such as current weather conditions, forecasts, and historical weather information.
