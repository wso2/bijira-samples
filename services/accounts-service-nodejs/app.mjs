import express from 'express';

const app = express();
app.use(express.json());


// In-memory accounts array with some sample data
let accounts = [
  {
    id: 1,
    customerId: "CUST1001",
    accountType: "savings",
    balance: 5000,
    status: "active",
    createdAt: new Date("2024-01-10T09:00:00Z")
  },
  {
    id: 2,
    customerId: "CUST1002",
    accountType: "current",
    balance: 1500,
    status: "active",
    createdAt: new Date("2024-03-15T11:30:00Z")
  }
];

// In-memory sample transactions map: accountId => transactions[]
const transactions = {
  1: [
    {
      transactionId: "TXN1001",
      accountId: 1,
      type: "credit",
      amount: 1000,
      description: "Salary credit",
      timestamp: new Date("2024-06-01T09:00:00Z")
    },
    {
      transactionId: "TXN1002",
      accountId: 1,
      type: "debit",
      amount: 500,
      description: "Grocery shopping",
      timestamp: new Date("2024-06-05T13:15:00Z")
    }
  ],
  2: [
    {
      transactionId: "TXN2001",
      accountId: 2,
      type: "debit",
      amount: 300,
      description: "Utility bill",
      timestamp: new Date("2024-06-03T10:30:00Z")
    }
  ]
};

// Get transaction history for an account
app.get('/accounts/:id/transactions', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid account ID' });

  const account = accounts.find(acc => acc.id === id);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  res.json(transactions[id] || []);
});


let nextId = 3;

// Helper to validate new account data
function validateAccount(data) {
  const requiredFields = ['customerId', 'accountType', 'balance', 'status'];
  for (const field of requiredFields) {
    if (data[field] === undefined) {
      return `${field} is required`;
    }
  }
  // Optional: Validate accountType and status values
  const validAccountTypes = ['savings', 'current'];
  const validStatuses = ['active', 'closed', 'suspended'];

  if (!validAccountTypes.includes(data.accountType)) {
    return `accountType must be one of: ${validAccountTypes.join(', ')}`;
  }
  if (!validStatuses.includes(data.status)) {
    return `status must be one of: ${validStatuses.join(', ')}`;
  }

  return null;
}

// Create a new account
app.post('/accounts', (req, res) => {
  const error = validateAccount(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const newAccount = {
    id: nextId++,
    customerId: req.body.customerId,
    accountType: req.body.accountType,
    balance: req.body.balance,
    status: req.body.status,
    createdAt: new Date()
  };

  accounts.push(newAccount);
  res.status(201).json(newAccount);
});

// Get all accounts
app.get('/accounts', (req, res) => {
  res.json(accounts);
});

// Get an account by ID
app.get('/accounts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid account ID' });

  const account = accounts.find(acc => acc.id === id);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  res.json(account);
});

// Update account by ID (partial updates allowed)
app.put('/accounts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid account ID' });

  const account = accounts.find(acc => acc.id === id);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  const allowedFields = ['customerId', 'accountType', 'balance', 'status'];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      // Optional: Add field-specific validation here if needed
      account[field] = req.body[field];
    }
  }

  res.json(account);
});

// Delete account by ID
app.delete('/accounts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid account ID' });

  const index = accounts.findIndex(acc => acc.id === id);
  if (index === -1) return res.status(404).json({ error: 'Account not found' });

  accounts.splice(index, 1);
  res.json({ message: `Account ${id} deleted.` });
});

// Get account balance by ID
app.get('/accounts/:id/balance', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid account ID' });

  const account = accounts.find(acc => acc.id === id);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  res.json({
    accountId: account.id,
    balance: account.balance,
    currency: 'LKR' // Hardcoded for now
  });
});


// Get transaction history for an account
app.get('/accounts/:id/transactions', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid account ID' });

  const account = accounts.find(acc => acc.id === id);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  res.json(transactions[id] || []);
});

// Health check endpoint
app.get('/healthz', (_, res) => {
  res.sendStatus(200);
});

// Error handling middleware
app.use((err, _req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err);
  res.status(500).json({ error: err.message });
});

// 404 handler
app.use("*", (_, res) => {
  res.status(404).json({ error: "The requested resource does not exist on this server" });
});

export default app;