import React, { useState, useEffect } from "react";
import * as transactionApi from "../../../data/transactionApi";
import "./Transactions.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    status: null,
    fromDate: "",
    toDate: "",
    paymentProvider: "",
    minAmount: "",
    maxAmount: "",
    page: 1,
    pageSize: 20,
    sortBy: "date-desc"
  });
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 20
  });

  useEffect(() => {
    loadStats();
    loadTransactions();
  }, []);

  const loadStats = async () => {
    try {
      const data = await transactionApi.getTransactionStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Prepare filter data
      const filterData = {
        status: filter.status !== null ? parseInt(filter.status) : null,
        fromDate: filter.fromDate || null,
        toDate: filter.toDate || null,
        paymentProvider: filter.paymentProvider || null,
        minAmount: filter.minAmount ? parseFloat(filter.minAmount) : null,
        maxAmount: filter.maxAmount ? parseFloat(filter.maxAmount) : null,
        page: filter.page,
        pageSize: filter.pageSize,
        sortBy: filter.sortBy
      };

      const data = await transactionApi.getTransactionsWithFilter(filterData);
      setTransactions(data.transactions || []);
      setPagination({
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        pageSize: data.pageSize
      });
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setError(err.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const applyFilter = () => {
    setFilter(prev => ({ ...prev, page: 1 }));
    loadTransactions();
  };

  const resetFilter = () => {
    setFilter({
      status: null,
      fromDate: "",
      toDate: "",
      paymentProvider: "",
      minAmount: "",
      maxAmount: "",
      page: 1,
      pageSize: 20,
      sortBy: "date-desc"
    });
    setTimeout(() => loadTransactions(), 100);
  };

  const handlePageChange = (newPage) => {
    setFilter(prev => ({ ...prev, page: newPage }));
    setTimeout(() => loadTransactions(), 100);
  };

  const updateStatus = async (id, newStatus) => {
    if (!window.confirm("Are you sure you want to update this transaction status?")) {
      return;
    }

    try {
      await transactionApi.updateTransactionStatus(id, newStatus);
      loadTransactions();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return "#FFA500"; // Pending - Orange
      case 1: return "#2196F3"; // Processing - Blue
      case 2: return "#4CAF50"; // Completed - Green
      case 3: return "#f44336"; // Failed - Red
      case 4: return "#9E9E9E"; // Cancelled - Gray
      default: return "#000";
    }
  };

  return (
    <div className="transactions-page">
      <h1>Transactions</h1>

      {/* Filter Section */}
      <div className="transaction-filter">
        <h3>Filter Transactions</h3>
        <div className="filter-grid">
          <div className="filter-field">
            <label>Status</label>
            <select
              value={filter.status ?? ""}
              onChange={(e) => handleFilterChange("status", e.target.value === "" ? null : e.target.value)}
            >
              <option value="">All</option>
              <option value="0">Pending</option>
              <option value="1">Processing</option>
              <option value="2">Completed</option>
              <option value="3">Failed</option>
              <option value="4">Cancelled</option>
            </select>
          </div>

          <div className="filter-field">
            <label>From Date</label>
            <input
              type="date"
              value={filter.fromDate}
              onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label>To Date</label>
            <input
              type="date"
              value={filter.toDate}
              onChange={(e) => handleFilterChange("toDate", e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label>Payment Provider</label>
            <input
              type="text"
              value={filter.paymentProvider}
              onChange={(e) => handleFilterChange("paymentProvider", e.target.value)}
              placeholder="KapitalBank"
            />
          </div>

          <div className="filter-field">
            <label>Min Amount</label>
            <input
              type="number"
              value={filter.minAmount}
              onChange={(e) => handleFilterChange("minAmount", e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="filter-field">
            <label>Max Amount</label>
            <input
              type="number"
              value={filter.maxAmount}
              onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
              placeholder="10000"
            />
          </div>

          <div className="filter-field">
            <label>Sort By</label>
            <select
              value={filter.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button className="btn-primary" onClick={applyFilter}>
            Apply Filter
          </button>
          <button className="btn-secondary" onClick={resetFilter}>
            Reset
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Transactions Table */}
      <div className="transactions-table-container">
        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          <>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Provider</th>
                  <th>Transaction ID</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>#{transaction.orderId}</td>
                    <td>{transaction.amount?.toLocaleString("ru-RU")} ₼</td>
                    <td>{transaction.currency}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(transaction.status) }}
                      >
                        {transactionApi.TransactionStatusNames[transaction.status]}
                      </span>
                    </td>
                    <td>{transaction.paymentProvider}</td>
                    <td className="transaction-id">{transaction.providerTransactionId}</td>
                    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                    <td>
                      <select
                        className="status-select"
                        value={transaction.status}
                        onChange={(e) => updateStatus(transaction.id, parseInt(e.target.value))}
                      >
                        <option value="0">Pending</option>
                        <option value="1">Processing</option>
                        <option value="2">Completed</option>
                        <option value="3">Failed</option>
                        <option value="4">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages} 
                ({pagination.totalCount} total)
              </span>
              <button
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
