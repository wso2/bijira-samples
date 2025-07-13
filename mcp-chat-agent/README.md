# MCP Chat Agent

A simple web-based chat application that connects AI models with Model Context Protocol (MCP) servers for extended functionality.

## What It Does

- Web chat interface with AI models (OpenAI, Azure OpenAI, Mistral)
- Connects to MCP servers for additional tools and capabilities
- OAuth2 authentication for secure API access
- Memory-enabled conversations

## What It Doesn't Do

- No user authentication or multi-user support
- No persistent storage (memory only)
- No file uploads or advanced chat features

## Prerequisites

- Python 3.11+
- API key for your chosen LLM provider (OpenAI, Azure OpenAI, Mistral AI)

## Quick Start

### Local Setup
```bash
# Clone and setup
git clone https://github.com/wso2/bijira-samples
cd mcp-chat-agent

# Install dependencies
pip install -r requirements.txt
pip install git+https://github.com/wso2/bijira-samples.git#subdirectory=external-lib/mcp-use

# Run
python app.py
```

### Docker
```bash
docker build -t mcp-chat-agent .
docker run -p 5050:5050 mcp-chat-agent
```

Access at `http://localhost:5050`


## Usage

1. **Start the application** using the above method
2. **Open the web interface** in your browser
3. **Configure your LLM provider** in the configuration panel
4. **Add MCP servers** if you want extended functionality
5. **Start chatting** with the AI agent

The agent will use its general knowledge and any configured MCP server tools to assist with your queries.
