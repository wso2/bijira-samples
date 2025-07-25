import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  ListToolsRequestSchema,
  LoggingLevel,
  Tool,
  ToolSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const instructions = readFileSync(join(__dirname, "instructions.md"), "utf-8");
const menu = readFileSync(join(__dirname, "card-promotions.json"), "utf-8");

const ToolInputSchema = ToolSchema.shape.inputSchema;
type ToolInput = z.infer<typeof ToolInputSchema>;

/* Promotion Tools Input Schemas */
const ViewPromotionsMenuSchema = z.object({});

const FilterPromotionsSchema = z.object({
  cardType: z.string().describe("Type of card to filter promotions by"),
});

export const SendPromotionsEmailSchema = z.object({
  to: z.string().email().describe("Email address to send the promotions to"),
  cardTypes: z.array(z.string()).optional().describe("Card types to filter promotions"),
  category: z.string().optional().describe("Promotion category"),
  promoCode: z.string().optional().describe("Promotion code"),
});

enum ToolName {
  VIEW_PROMOTIONS_MENU = "viewCardPromotions",
  FILTER_PROMOTIONS = "filterCardPromotions",
}

enum PromptName {
  SIMPLE = "simple_prompt",
  COMPLEX = "complex_prompt",
  RESOURCE = "resource_prompt",
}


export const createServer = () => {
  const server = new Server(
      {
        name: "bijira-mcp-card-promotions",
        version: "1.0.0",
      },
      {
        capabilities: {
          prompts: {},
          resources: { subscribe: true },
          tools: {},
          logging: {},
          completions: {},
          elicitation: {},
        },
        instructions,
      }
  );

  let subscriptions: Set<string> = new Set();
  let subsUpdateInterval: NodeJS.Timeout | undefined;

  subsUpdateInterval = setInterval(() => {
    for (const uri of subscriptions) {
      server.notification({
        method: "notifications/resources/updated",
        params: { uri },
      });
    }
  }, 10000);

  let logLevel: LoggingLevel = "debug";

  // Set up handler for listing tools - only promotions tools listed
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools: Tool[] = [
      {
        name: ToolName.VIEW_PROMOTIONS_MENU,
        description: "View the full list of available promotions.",
        inputSchema: zodToJsonSchema(ViewPromotionsMenuSchema) as ToolInput,
      },
      {
        name: ToolName.FILTER_PROMOTIONS,
        description: "Filter promotions by card type.",
        inputSchema: zodToJsonSchema(FilterPromotionsSchema) as ToolInput,
      }
    ];

    return { tools };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const {name, arguments: args} = request.params;

    if (name === ToolName.VIEW_PROMOTIONS_MENU) {
      const promotions = JSON.parse(menu);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(promotions, null, 2),
          },
        ],
      };
    }

    if (name === ToolName.FILTER_PROMOTIONS) {
      const validatedArgs = FilterPromotionsSchema.parse(args);
      const promotions = JSON.parse(menu);
      const filtered = promotions.filter((promo: any) =>
          promo.card_type?.toLowerCase() === validatedArgs.cardType.toLowerCase()
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(filtered, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  });

  const cleanup = async () => {
    if (subsUpdateInterval) clearInterval(subsUpdateInterval);
  };

  return { server, cleanup };
};
