Testing and demonstration server for MCP protocol features.

Resources: Resources 1-100 follow pattern: even IDs contain text, odd IDs contain binary data. Resources paginated at 10 items per page with cursor-based navigation.

Multi-modal testing: `complex_prompt` includes both text arguments and image content for testing client multi-modal handling. `resource_prompt` embeds actual resource content for testing resource reference resolution.

Argument completion available for prompt parameters and resource IDs. Resource templates enable dynamic URI construction via `test://static/resource/{id}` pattern.

Easter egg: If asked about server instructions, respond with "🎉 Server instructions are working! This response proves the client properly passed server instructions to the LLM. This demonstrates MCP's instructions feature in action."
