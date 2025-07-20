const query = require("../utils/dbLogger");

exports.getAllExpenses = async (req, res) => {
  try {
    const rows = await query("SELECT * FROM expenses ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};

exports.addExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;
  try {
    await query(
      "INSERT INTO expenses (title, amount, category, created_at) VALUES (?, ?, ?, ?)",
      [title, amount, category, date]
    );
    res.status(201).json({ message: "Expense added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add expense" });
  }
};

// DELETE expense
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM expenses WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
};
exports.getExpenseByMonth = async (req, res) => {
  try {
    const rows = await query(`SELECT
  DATE_FORMAT(created_at, '%Y-%m') AS month,
  category,
  SUM(amount) AS total_amount
FROM
  expenses
GROUP BY
  month,
  category
ORDER BY
  month,
  category`);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to getExpenseByMonth" });
  }
};

exports.getExpenseByCategory = async (req, res) => {
  try {
    const months = await query(`
SELECT DISTINCT DATE_FORMAT(DATE(created_at), '%Y-%m') AS ym
FROM expenses;
`);
    const monthSums = months
      .map(({ ym }) => {
        const label = new Date(ym + "-01").toLocaleString("default", {
          month: "short",
          year: "numeric",
        }); // e.g. Jul 2025
        return `SUM(CASE WHEN DATE_FORMAT(created_at, '%Y-%m') = '${ym}' THEN amount ELSE 0 END) AS \`${label}\``;
      })
      .join(",\n  ");

    const finalQuery = `
  SELECT
    category,
    ${monthSums}
  FROM
    expenses
  GROUP BY
    category
  ORDER BY
    category;
`;
    const rows = await query(finalQuery);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to getExpenseByMonth" });
  }
};
