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
  VIEW_PROMOTIONS_MENU = "viewPromotionsMenu",
  FILTER_PROMOTIONS = "filterPromotions",
  SEND_PROMOTIONS_EMAIL = "sendPromotionsEmail",
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
      },
      {
        name: ToolName.SEND_PROMOTIONS_EMAIL,
        description: "Send promotions via email after applying optional filters.",
        inputSchema: zodToJsonSchema(SendPromotionsEmailSchema) as ToolInput,
      },
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

    if (name === ToolName.SEND_PROMOTIONS_EMAIL) {
      const validatedArgs = SendPromotionsEmailSchema.parse(args);
      const allPromotions = JSON.parse(menu); // assuming `menu` contains the full JSON array

      const filtered = allPromotions.filter((promo: any) => {

        const matchesCard = !validatedArgs.cardTypes?.length || validatedArgs.cardTypes.some(
            (type) => promo.card_type?.toLowerCase() === type.toLowerCase()
        );

        const matchesCategory = validatedArgs.category
            ? promo.category?.toLowerCase() === validatedArgs.category.toLowerCase()
            : true;

        const matchesPromo = validatedArgs.promoCode
            ? promo.promo_code?.toLowerCase() === validatedArgs.promoCode.toLowerCase()
            : true;

        return matchesCard && matchesCategory && matchesPromo;
      });

      const mailBodyHtml = filtered.length
          ? filtered
              .map(
                  (promo: any, index: number) => `
          <div style="margin-bottom: 20px; padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${index + 1}. ${promo.company_name} - ${promo.category}</strong><br/>
            <span><strong>Card Type:</strong> ${promo.card_type}</span><br/>
            <span><strong>Category:</strong> ${promo.category}</span><br/>
            <span><strong>Promo Code:</strong> ${promo.promo_code ?? "N/A"}</span><br/>
            <span><strong>Description:</strong> ${promo.description}</span><br/>
            <span><strong>Validity:</strong> ${promo.validity?.start_date ?? "N/A"} to ${promo.validity?.end_date ?? "N/A"}</span>
          </div>`
              )
              .join("")
          : "<p>No matching promotions found.</p>";

      const mailBodyText = filtered.length
          ? filtered
              .map(
                  (promo: any, index: number) =>
                      `${index + 1}\n` +
                      `Title: ${promo.company_name} - ${promo.category}\n` +
                      `Card Type: ${promo.card_type}\n` +
                      `Category: ${promo.category}\n` +
                      `Promo Code: ${promo.promo_code ?? "N/A"}\n` +
                      `Description: ${promo.description}\n` +
                      `Validity: ${promo.validity?.start_date ?? "N/A"} to ${promo.validity?.end_date ?? "N/A"}\n`
              )
              .join("\n\n")
          : "No matching promotions found.";

      const htmlTemplate = `<html>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
           background="https://plus.unsplash.com/premium_photo-1728613749980-cd3e758183df?q=80&w=2590&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
           style="background-size: cover; background-repeat: no-repeat; background-position: center top; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="90%" max-width="600" cellpadding="20" cellspacing="0" border="0"
                 style="background-color: rgba(255, 255, 255, 0.6); border-radius: 8px; font-family: Arial, sans-serif; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <tr>
              <td style="text-align: center; color: #333;">
                <h2 style="margin: 0 0 15px;">Card Promotion Alerts</h2>
                <div style="text-align: left; font-size: 14px; color: #111;">
                  ${mailBodyHtml}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

// Replace with your actual API key
      const apiKey = "re_SF9zrda1_QEniFgR3Mjp1ckJFBcMwrjkG";
      const from = "Card Promotions <onboarding@resend.dev>";

      if (!apiKey) {
        console.error("RESEND_API_KEY not provided.");
        throw new Error("Missing API key for Resend");
      }

      const resend = new Resend(apiKey);
      const emailRequest = {
        to: validatedArgs.to,
        subject: `Don't miss today's ${validatedArgs.category || "top"} promotions for ${validatedArgs.cardTypes?.join(", ") || "your cards"}!`,
        text: mailBodyText,
        html: htmlTemplate,
        from,
        replyTo: from
      };

      const response = await resend.emails.send(emailRequest);
      if (response.error) {
        throw new Error(`Email failed to send: ${JSON.stringify(response.error)}`);
      }

      return {
        content: [
          {
            type: "text",
            text: `✅ Email sent successfully! ${JSON.stringify(response.data)}`,
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
