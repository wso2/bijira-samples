# Creating an OpenAI API Proxy

## Use Case

The OpenAI AI API Proxy in Bijira enables seamless integration with OpenAI’s AI models, allowing users to interact with AI-powered services securely and efficiently. This use case focuses on setting up an API proxy to facilitate AI-driven functionalities such as text generation, summarization, and analysis.

The following steps will guide you through the process of creating and deploying the Reading List API Proxy component in Bijira:

1. **Create the AI API Proxy**: Set up an API proxy in Bijira to connect with OpenAI’s services.
2. **Configure and Deploy the AI API**: Adjust settings and deploy the proxy for external access.
3. **Test the API Proxy**: Use the OpenAPI Console in Bijira to verify the API’s functionality.

## Run the Sample in Bijira

### Prerequisites

- A valid Bijira account with sufficient resource quota.
- An OpenAI API key, which you can obtain by signing up at [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys).

### Create the API Proxy

1. Visit [https://console.bijira.dev/](https://console.bijira.dev/) and sign in to your account.
2. Click the **Create** button in the **Component Listing** section.
3. Under **Create API Proxy for Third-Party APIs (Egress)**, select the **AI API** option.
4. Choose **OpenAI** from the list of AI providers.
5. Click **Next**, then review and modify the pre-defined settings as needed. Default values can be used for this sample and make sure that the Target URL points to `https://api.openai.com/v1`.
6. Click **Create** to initialize the AI API Proxy and wait for the setup to complete.

### Configure the Service Contract

1. Navigate to **Develop → Policy Section**, then click the settings icon next to the **Service Contract URL**.
2. In the **API Key Header** field, enter `Authorization`.
3. In the **API Key Value** field, enter `Bearer YOUR_OPENAI_API_KEY`.
4. Click **Save** to apply the changes.


### Deploy the API Proxy

1. Go to the **Deploy** page of the API Proxy.
2. Click the **Configure and Deploy** button.
3. Select **External** as the API Access Mode.
4. Click **Deploy** to complete the deployment.

## Test the API Proxy

1. Navigate to the **Test → OpenAPI Console** page of the API Proxy.
2. Use the OpenAPI Console to send test requests and validate the API Proxy’s functionality.

### API Proxy Behavior

Once deployed, the AI API Proxy allows you to interact with OpenAI’s API securely, providing access to AI-driven features such as text generation, sentiment analysis, and data summarization.  
