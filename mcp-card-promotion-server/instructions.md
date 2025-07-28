### MCP Tool Instructions for Credit Card Promotions
This server provides a set of tools designed to interact with credit card promotions in a structured and filtered manner. These tools support prompt-based workflows for browsing, filtering, and emailing curated promotions.

1. view_promotions_menu
   Description: View the full list of available credit card promotions.

Inputs:

None

Returns:
JSON array of all available promotions, including:

company_name (string) — Issuing bank or company name

card_type (string[]) — Accepted card types (e.g., Visa, Mastercard)

description (string) — Short summary

validity.start_date / validity.end_date (string) — Offer period

promotion_details (string) — Detailed explanation

terms_and_conditions (string) — Fine print

2. filter_promotions
   Description: Filter credit card promotions by one or more card types.

Inputs:

cardTypes (string[]) — Accepted values: "Visa", "Mastercard", "Amex", "UnionPay" etc.

Returns:
A filtered list of promotions that support at least one of the specified card types.

🔁 Example Flow
Use viewPromotionsMenu to view all available promotions.

Use filterPromotions if the user wants only specific card types.


