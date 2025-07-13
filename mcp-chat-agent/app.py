from flask import Flask, request, render_template, jsonify
import asyncio
from mcp_client import async_main

app = Flask(__name__)

# Global variable to store configuration in server memory
server_config = {}

@app.route("/")
def index():
    return render_template("chat.html")

@app.route("/config", methods=["POST"])
def save_config():
    """Save configuration to server memory"""
    global server_config
    try:
        data = request.get_json()
        server_config = data
        return jsonify({"success": True, "message": "Configuration saved successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/config", methods=["GET"])
def get_config():
    """Retrieve configuration from server memory"""
    global server_config
    return jsonify(server_config)

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message", "").strip()
        
        global server_config
        config = server_config
        
        if not user_input:
            return jsonify({"error": "No input received"}), 400

        result = asyncio.run(async_main(user_input, config))

        return jsonify({"response": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5050)
