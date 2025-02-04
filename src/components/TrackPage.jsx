import { useState, useEffect } from 'react';
import './TrackPage.css';

function TrackPage() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const userId = 1; // Hardcoded user ID (no need to set it dynamically)

  // Fetch expenses from the backend
  const fetchExpenses = async () => {
    try {
      const response = await fetch(`https://backend-1-3-g5a8.onrender.com/${userId}`);
      const data = await response.json();
      setExpenses(data.expenses);
      const totalAmount = data.expenses.reduce((acc, expense) => acc + expense.amount, 0);
      setTotal(totalAmount);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Fetch expenses when the component mounts
  useEffect(() => {
    fetchExpenses();
  }, [userId]); // Add userId as a dependency in case it changes (not needed here with hardcoded value)

  // Add a new expense
  const addExpense = async () => {
    try {
      const response = await fetch('https://backend-1-3-g5a8.onrender.com/add_expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, amount: parseFloat(amount), user_id: userId })
      });

      const data = await response.json();
      if (data.expense) {
        setExpenses([...expenses, data.expense]);
        setTotal(prevTotal => prevTotal + data.expense.amount);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // Delete an expense
  const deleteExpense = async (expenseId, expenseAmount) => {
    try {
      const response = await fetch(`https://backend-1-3-g5a8.onrender.com/delete_expense/${expenseId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setExpenses(expenses.filter(exp => exp.id !== expenseId));
        setTotal(prevTotal => prevTotal - expenseAmount);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim() && amount > 0) {
      addExpense();
      setDescription('');
      setAmount('');
    } else {
      alert("Please enter valid details");
    }
  };

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      
      {/* Expense Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add Expense</button>
      </form>

      {/* Total Expenses */}
      <h2>Total Expenses: ${total.toFixed(2)}</h2>

      {/* Expense List */}
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description}: ${expense.amount.toFixed(2)} 
            <button onClick={() => deleteExpense(expense.id, expense.amount)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrackPage;
