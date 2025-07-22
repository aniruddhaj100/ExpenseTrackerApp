import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./ExpenseTracker.css";
import "./ExpenseMonthList.css";
import PieChart from "./PieChart";
// import ExcelImport from './ExcelImport';
const API = process.env.REACT_APP_API_BASE_URL;

function ExpenseTracker() {
    const [expenses, setExpenses] = useState([]);
    const [expensesByMonth, setExpensesByMonth] = useState([]);
    const [expensesByCategory, setExpensesByCategory] = useState([]);
    const navigate = useNavigate();
    const todayStr = new Date().toISOString().slice(0, 10); // Format as YYYY-MM-DD
    const [form, setForm] = useState({
        title: "",
        amount: "",
        category: "",
        date: todayStr,
    });
    const [openMonth, setOpenMonth] = useState(null);
    const [openSections, setOpenSections] = useState({
        expenses: true,
        expensesByMonth: true,
        expensesByCategory: true,
    });
    const categories = [
        "Rent",
        "Food&Grocery",
        "Trips",
        "Home Halgara",
        "Investments",
        "HomeAP/Repair",
        "Travel",
        "allBills(wifi/electricity/gas/tax/petrol)",
        "self/Gifts",
        "emi",
    ];

    const fetchExpenses = async () => {
        const res = await axios.get(`${API}/expenses`);
        setExpenses(res.data);
    };


    const addExpense = async () => {
        if (!form.title || !form.amount)
            return alert("Title and amount are required");
        const res = await axios.post(`${API}/expenses`, form);

        if (res.status === 201) {
            alert("Expense added successfully");
        } else if (res.status !== 201) return alert("Failed to add expense");

        setForm({ title: "", amount: "", category: "", date: todayStr });

        fetchExpenses();
        getExpenseByMonth();
        getExpenseByCategory();
    };

    const deleteExpense = async (id) => {
        const res = await axios.delete(`${API}/expenses/${id}`);
        if (res.status === 204) {
            alert("Expense deleted successfully");
        } else if (res.status !== 204) {
            alert("Failed to delete expense");
        }
        fetchExpenses();
        getExpenseByMonth();
        getExpenseByCategory();
    };

    const getExpenseByMonth = async () => {
        const res = await axios.get(`${API}/expenses/month`);
        if (res.status === 200) {
            setExpensesByMonth(res.data);
        } else {
            alert("Failed to fetch expenses for the month");
        }
    };

    const getExpenseByCategory = async () => {
        const res = await axios.get(`${API}/expenses/category`);
        if (res.status === 200) {
            setExpensesByCategory(res.data);
        } else {
            alert("Failed to fetch expenses by category");
        }
    };

    const toggleSection = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    // Placeholder logout handler
    const handleLogout = () => {
        // Implement actual logout logic here
        //  alert("Logged out!");
        navigate("/login"); // Redirect to login page
    };

    useEffect(() => {
        fetchExpenses();
        getExpenseByMonth();
        getExpenseByCategory();
    }, []);

    return (
        <div className="expense-tracker-container" style={{ fontSize: '14px' }}>
            <div className="expense-header" style={{ display: 'flex', alignItems: 'center', marginBottom: 24, justifyContent: 'space-between' }}>
                <img src={require('./../../src/logo_expensetracker.png')} alt="Expense Tracker Logo" style={{ height: 60, width: 60, marginRight: 12 }} />
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        outline: 'none',
                        padding: 0,
                        marginLeft: 'auto'
                    }}
                    title="Logout"
                >
                    <img
                        src={require('./../../src/logout.png')}
                        alt="Logout"
                        style={{
                            height: 36,
                            width: 36,
                            objectFit: 'contain',
                            filter: 'grayscale(100%)',
                            transition: 'filter 0.2s',
                        }}
                        className="logout-logo-img"
                    />
                </button>
            </div>
            {/* <ExcelImport onImport={handleExcelImport} /> */}
            <div className="expense-form">
                <input
                    className="expense-input"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <input
                    className="expense-input"
                    placeholder="Amount"
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
                <select
                    className="expense-input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                    <option value="" disabled>
                        Select Category
                    </option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <input
                    className="expense-input"
                    type="datetime-local"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                />
                <button className="expense-add-btn" onClick={addExpense}>
                    Add
                </button>

            </div>

            <div className="expense-table-list" style={{ marginTop: 32 }}>
                <div className="expensesDiv" style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', background: '#fff' }}>
                    <div
                        style={{ cursor: 'pointer', padding: '14px 18px', fontWeight: 600, fontSize: 18, background: '#f1f5f9', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', userSelect: 'none' }}
                        onClick={() => toggleSection('expenses')}
                    >
                        <span style={{ marginRight: 10 }}>{openSections.expenses ? '▼' : '►'}</span> Expenses
                    </div>
                    {openSections.expenses && (
                        <div>
                            {expenses.length === 0 ? (
                                <div className="expense-empty">No expenses found.</div>
                            ) : (
                                <table
                                    className="expense-table"
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        background: "#fff",
                                        borderRadius: 8,
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                                    }}
                                >
                                    <thead>
                                        <tr style={{ background: "#f1f5f9" }}>
                                            <th
                                                style={{
                                                    padding: "10px 8px",
                                                    borderBottom: "1px solid #e2e8f0",
                                                }}
                                            >
                                                Title
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px 8px",
                                                    borderBottom: "1px solid #e2e8f0",
                                                }}
                                            >
                                                Amount
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px 8px",
                                                    borderBottom: "1px solid #e2e8f0",
                                                }}
                                            >
                                                Category
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px 8px",
                                                    borderBottom: "1px solid #e2e8f0",
                                                }}
                                            >
                                                Date
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px 8px",
                                                    borderBottom: "1px solid #e2e8f0",
                                                }}
                                            >
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.map((exp) => (
                                            <tr key={exp.id}>
                                                <td
                                                    style={{
                                                        padding: "8px",
                                                        borderBottom: "1px solid #e2e8f0",
                                                    }}
                                                >
                                                    {exp.title}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "8px",
                                                        borderBottom: "1px solid #e2e8f0",
                                                        textAlign: "right",
                                                    }}
                                                >
                                                    ₹{exp.amount}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "8px",
                                                        borderBottom: "1px solid #e2e8f0",
                                                    }}
                                                >
                                                    {exp.category}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "8px",
                                                        borderBottom: "1px solid #e2e8f0",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {exp.created_at
                                                        ? (() => {
                                                            const d = new Date(exp.created_at);
                                                            const day = d.getDate().toString().padStart(2, "0");
                                                            const month = d.toLocaleString("default", {
                                                                month: "short",
                                                            });
                                                            const year = d.getFullYear();
                                                            return `${day}-${month}-${year}`;
                                                        })()
                                                        : ""}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "8px",
                                                        borderBottom: "1px solid #e2e8f0",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <button
                                                        className="expense-delete-btn"
                                                        onClick={() => deleteExpense(exp.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>

                <div className="expensesByMonth" style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', background: '#fff' }}>
                    <div
                        style={{ cursor: 'pointer', padding: '14px 18px', fontWeight: 600, fontSize: 18, background: '#f1f5f9', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', userSelect: 'none' }}
                        onClick={() => toggleSection('expensesByMonth')}
                    >
                        <span style={{ marginRight: 10 }}>{openSections.expensesByMonth ? '▼' : '►'}</span> Expenses By Month
                    </div>
                    {openSections.expensesByMonth && (
                        <div className="expensesByMonth">
                            {expensesByMonth.length > 0 ? (
                                <div className="expense-month-list">

                                    {(() => {
                                        // Pie chart color palette for legend
                                        const echartsColors = [
                                            "#5470C6",
                                            "#91CC75",
                                            "#FAC858",
                                            "#EE6666",
                                            "#73C0DE",
                                            "#3BA272",
                                            "#FC8452",
                                            "#9A60B4",
                                            "#EA7CCC",
                                        ];
                                        // Group all items by month
                                        const monthMap = {};
                                        expensesByMonth.forEach((item) => {
                                            const month = item.month;
                                            if (!monthMap[month]) monthMap[month] = [];
                                            if (
                                                item.categoryBreakdown &&
                                                Array.isArray(item.categoryBreakdown)
                                            ) {
                                                item.categoryBreakdown.forEach((cat) => {
                                                    monthMap[month].push({
                                                        category: cat.category,
                                                        amount: cat.amount,
                                                    });
                                                });
                                            } else if (Array.isArray(item.expenses)) {
                                                item.expenses.forEach((e) => {
                                                    monthMap[month].push({
                                                        category: e.category,
                                                        amount: e.amount,
                                                    });
                                                });
                                            } else if (item.category && item.total_amount) {
                                                monthMap[month].push({
                                                    category: item.category,
                                                    amount: item.total_amount,
                                                });
                                            }
                                        });
                                        return Object.entries(monthMap).map(([month, cats], idx) => {
                                            let displayMonth = month;
                                            const match = month.match(/^(\d{4})[-/.](\d{1,2})$/);
                                            if (match) {
                                                const y = match[1];
                                                const m = match[2].padStart(2, "0");
                                                const date = new Date(`${y}-${m}-01`);
                                                displayMonth = date.toLocaleString("default", {
                                                    month: "short",
                                                    year: "numeric",
                                                });
                                            }

                                            const catAgg = {};
                                            cats.forEach((c) => {
                                                if (!catAgg[c.category]) catAgg[c.category] = 0;
                                                catAgg[c.category] += Number(c.amount);
                                            });
                                            const pieData = Object.entries(catAgg).map(([name, value]) => ({
                                                name,
                                                value,
                                            }));
                                            const total = pieData.reduce(
                                                (sum, d) => sum + Number(d.value),
                                                0
                                            );
                                            return (
                                                <div
                                                    key={month}
                                                    style={{
                                                        marginBottom: 32,
                                                        background: "#f8fafc",
                                                        borderRadius: 8,
                                                        padding: 16,
                                                        boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontWeight: 600,
                                                            marginBottom: 8,
                                                            color: "#2563eb",
                                                            background: "#e4e4e4",
                                                            borderRadius: 5,
                                                            padding: 10,
                                                        }}
                                                    >
                                                        {displayMonth}
                                                    </div>
                                                    <PieChart data={pieData} />
                                                    <div style={{ marginTop: 8, fontWeight: 500 }}>
                                                        Total: ₹{Number(total).toFixed(2)}
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                    <div
                                        style={{ marginTop: "16px", fontWeight: 600, color: "#2563eb" }}
                                    >
                                        Grand Total: ₹
                                        {expensesByMonth.reduce(
                                            (sum, item) => sum + Number(item.total_amount),
                                            0
                                        )}
                                    </div>
                                </div>
                            ) : <div className="expense-empty">No expenses found.</div>}
                        </div>
                    )}
                </div>

                <div className="expensesByCategory" style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', background: '#fff' }}>
                    <div
                        style={{ cursor: 'pointer', padding: '14px 18px', fontWeight: 600, fontSize: 18, background: '#f1f5f9', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', userSelect: 'none' }}
                        onClick={() => toggleSection('expensesByCategory')}
                    >
                        <span style={{ marginRight: 10 }}>{openSections.expensesByCategory ? '▼' : '►'}</span> Expenses By Category
                    </div>
                    {openSections.expensesByCategory && (
                        <div className="expensesByCategory">
                            {expensesByCategory.length > 0 ? (
                                <div
                                    style={{
                                        marginTop: 48,
                                        padding: 24,
                                        background: "#f1f5f9",
                                        borderRadius: 12,
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                                        overflowX: 'auto',
                                    }}
                                >

                                    <table
                                        className="expense-table"
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            background: "#fff",
                                            borderRadius: 8,
                                            minWidth: 400,
                                        }}
                                    >
                                        {(() => {
                                            const data = expensesByCategory;
                                            if (!data || data.length === 0) return null;
                                            const monthKeys = Object.keys(data[0] || {}).filter(k => k !== 'category');
                                            return <>
                                                <thead>
                                                    <tr style={{ background: "#f1f5f9" }}>
                                                        <th style={{ padding: "10px 8px", borderBottom: "1px solid #e2e8f0" }}>Category</th>
                                                        {monthKeys.map(month => (
                                                            <th key={month} style={{ padding: "10px 8px", borderBottom: "1px solid #e2e8f0" }}>{month}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.map((row, idx) => (
                                                        <tr key={row.category || idx}>
                                                            <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", fontWeight: 500 }}>{row.category}</td>
                                                            {monthKeys.map(month => (
                                                                <td key={month} style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, textAlign: "right" }}>₹{row[month] ?? 0}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </>;
                                        })()}
                                    </table>
                                </div>
                            ) : <div className="expense-empty">No expenses found.</div>}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default ExpenseTracker;
