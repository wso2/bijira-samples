# Everything MCP Server

This MCP server attempts to exercise all the features of the MCP protocol. It is not intended to be a useful server, but rather a test server for builders of MCP clients. It implements prompts, tools, resources, sampling, and more to showcase MCP capabilities.

## Components

### Tools

1. `echo`
   - Simple tool to echo back input messages
   - Input:
     - `message` (string): Message to echo back
   - Returns: Text content with echoed message

2. `add`
   - Adds two numbers together
   - Inputs:
     - `a` (number): First number
     - `b` (number): Second number
   - Returns: Text result of the addition

3. `viewPizzaMenu`
   - Returns a menu of pizzas
   - No inputs required
   - Returns: A JSON of available pizzas with details

4. `orderPizza`
   - Place and order for pizza
   - Inputs:
     - `pizzaType`        (string): Type of pizza
     - `quantity`         (number): Amount of pizzas to order
     - `customerName`     (string) Name of the customer
     - `deliveryAddress`  (string) Delivery address
     - `creditCardNumber` (string) Credir card number used for payment
   - Returns: Order details with the orderId

### Resources

The server provides 100 test resources in two formats:
- Even numbered resources:
  - Plaintext format
  - URI pattern: `test://static/resource/{even_number}`
  - Content: Simple text description

- Odd numbered resources:
  - Binary blob format
  - URI pattern: `test://static/resource/{odd_number}`
  - Content: Base64 encoded binary data

Resource features:
- Supports pagination (10 items per page)
- Allows subscribing to resource updates
- Demonstrates resource templates
- Auto-updates subscribed resources every 5 seconds

### Prompts

1. `simple_prompt`
   - Basic prompt without arguments
   - Returns: Single message exchange

2. `complex_prompt`
   - Advanced prompt demonstrating argument handling
   - Required arguments:
     - `temperature` (number): Temperature setting
   - Optional arguments:
     - `style` (string): Output style preference
   - Returns: Multi-turn conversation with images

3. `resource_prompt`
   - Demonstrates embedding resource references in prompts
   - Required arguments:
     - `resourceId` (number): ID of the resource to embed (1-100)
   - Returns: Multi-turn conversation with an embedded resource reference
   - Shows how to include resources directly in prompt messages

### Logging

The server sends random-leveled log messages every 15 seconds, e.g.:

```json
{
  "method": "notifications/message",
  "params": {
	"level": "info",
	"data": "Info-level message"
  }
}
```

### Running Locally

To build the server after changes, use

```node
npm install
```

To run the server locally, use

```
npm start
```

