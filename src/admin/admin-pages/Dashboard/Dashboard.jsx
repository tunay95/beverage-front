import React, { useState, useEffect } from "react";
import * as transactionApi from "../../../data/transactionApi";
import * as productApi from "../../../data/productApi";
import * as categoryApi from "../../../data/categoryApi";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load transaction stats
      const statsData = await transactionApi.getTransactionStats();
      setStats(statsData);

      // Load recent transactions
      const transactionsData = await transactionApi.getTransactionsWithFilter({
        page: 1,
        pageSize: 5,
        sortBy: "date-desc"
      });
      setRecentTransactions(transactionsData.transactions || []);

      // Load products
      const productsData = await productApi.getAllProducts();
      setProducts(productsData || []);

      // Load categories
      const categoriesData = await categoryApi.getAllCategories();
      setCategories(categoriesData || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  const activeProducts = products.filter(p => p.isActive && !p.isDeleted).length;
  const inactiveProducts = products.filter(p => !p.isActive && !p.isDeleted).length;
  const deletedProducts = products.filter(p => p.isDeleted).length;

  const activeCategories = categories.filter(c => c.isActive && !c.isDeleted).length;
  const inactiveCategories = categories.filter(c => !c.isActive && !c.isDeleted).length;

  // Calculate stock statistics
  const inStockProducts = products.filter(p => !p.isDeleted && p.stockQuantity > 0).length;
  const outOfStockProducts = products.filter(p => !p.isDeleted && p.stockQuantity === 0).length;
  const totalStockQuantity = products
    .filter(p => !p.isDeleted)
    .reduce((sum, p) => sum + (p.stockQuantity || 0), 0);

  const statusDistribution = stats ? [
    { name: 'Completed', value: stats.completedTransactions, color: '#27ae60' },
    { name: 'Pending', value: stats.pendingTransactions, color: '#e67e22' },
    { name: 'Failed', value: stats.failedTransactions, color: '#c0392b' },
    { name: 'Cancelled', value: stats.cancelledTransactions, color: '#95a5a6' }
  ] : [];

  const productDistribution = [
    { name: 'In Stock', value: inStockProducts, color: '#27ae60', quantity: totalStockQuantity },
    { name: 'Out of Stock', value: outOfStockProducts, color: '#c0392b', quantity: 0 }
  ];

  const total = statusDistribution.reduce((acc, item) => acc + item.value, 0);
  const productTotal = productDistribution.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="dashboard-page">
      <h1>Dashboard Overview</h1>

      {/* Main Statistics Grid */}
      <div className="main-stats-grid">
        {/* Products Stats */}
        <div className="stat-card products">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-value">{products.length}</p>
            <p className="stat-detail">Active: {activeProducts} | Inactive: {inactiveProducts}</p>
          </div>
        </div>

        {/* Categories Stats */}
        <div className="stat-card categories">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <h3>Categories</h3>
            <p className="stat-value">{categories.length}</p>
            <p className="stat-detail">Active: {activeCategories} | Inactive: {inactiveCategories}</p>
          </div>
        </div>

        {/* Transactions Stats */}
        {stats && (
          <div className="stat-card transactions">
            <div className="stat-icon">💳</div>
            <div className="stat-content">
              <h3>Total Transactions</h3>
              <p className="stat-value">{stats.totalTransactions || 0}</p>
              <p className="stat-detail">Completed: {stats.completedTransactions} | Pending: {stats.pendingTransactions}</p>
            </div>
          </div>
        )}

        {/* Revenue Stats */}
        {stats && (
          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-value">{(stats.totalRevenue || 0).toLocaleString("ru-RU")} ₼</p>
              <p className="stat-detail">Today: {(stats.todayRevenue || 0).toLocaleString("ru-RU")} ₼</p>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Transaction Status Pie Chart */}
        <div className="chart-card">
          <h3>Transaction Status Distribution</h3>
          <div className="pie-chart">
            {total === 0 ? (
              <div className="no-data-chart">
                <p>No transaction data available</p>
              </div>
            ) : (
              <>
                <svg viewBox="0 0 200 200" className="pie-svg">
                  {statusDistribution.map((item, index) => {
                    if (item.value === 0) return null;
                    const prevSum = statusDistribution.slice(0, index).reduce((acc, i) => acc + i.value, 0);
                    const startAngle = (prevSum / total) * 360;
                    const endAngle = ((prevSum + item.value) / total) * 360;
                    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
                    
                    const startRad = (startAngle - 90) * Math.PI / 180;
                    const endRad = (endAngle - 90) * Math.PI / 180;
                    
                    const x1 = 100 + 80 * Math.cos(startRad);
                    const y1 = 100 + 80 * Math.sin(startRad);
                    const x2 = 100 + 80 * Math.cos(endRad);
                    const y2 = 100 + 80 * Math.sin(endRad);

                    return (
                      <path
                        key={index}
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={item.color}
                        stroke="#1a1a1a"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
                <div className="pie-legend">
                  {statusDistribution.map((item, index) => (
                    <div key={index} className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                      <span className="legend-text">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Categories & Products Bar Charts */}
      <div className="charts-section">
        {/* Categories Bar Chart */}
        <div className="chart-card">
          <h3>Categories Overview</h3>
          <div className="bar-chart">
            {[
              { label: 'Total Categories', value: categories.length, color: '#3498db' },
              { label: 'Active', value: activeCategories, color: '#27ae60' },
              { label: 'Inactive', value: inactiveCategories, color: '#e67e22' }
            ].map((item, index) => {
              const maxValue = Math.max(categories.length, 1);
              const percentage = Math.max((item.value / maxValue) * 100, item.value > 0 ? 5 : 0);
              
              return (
                <div key={index} className="bar-item">
                  <div className="bar-label">{item.label}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: item.color,
                        minWidth: item.value > 0 ? '40px' : '0'
                      }}
                    >
                      <span className="bar-value">{item.value}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="chart-card">
          <h3>Revenue Comparison</h3>
          <div className="bar-chart">
            {stats && [
              { label: 'Today', value: stats.todayRevenue, color: '#3498db' },
              { label: 'This Month', value: stats.thisMonthRevenue, color: '#2980b9' },
              { label: 'Total', value: stats.totalRevenue, color: '#2c3e50' }
            ].map((item, index) => {
              const maxValue = stats.totalRevenue || 1;
              const percentage = Math.max((item.value / maxValue) * 100, item.value > 0 ? 5 : 0);
              
              return (
                <div key={index} className="bar-item">
                  <div className="bar-label">{item.label}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: item.color,
                        minWidth: item.value > 0 ? '60px' : '0'
                      }}
                    >
                      <span className="bar-value">{item.value.toLocaleString("ru-RU")} ₼</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        <div className="transactions-list">
          {recentTransactions.length === 0 ? (
            <p className="no-data">No recent transactions</p>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Provider</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>#{transaction.orderId}</td>
                    <td>{transaction.amount?.toLocaleString("ru-RU")} ₼</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor:
                            transaction.status === 2 ? '#27ae60' :
                            transaction.status === 0 ? '#e67e22' :
                            transaction.status === 3 ? '#c0392b' : '#95a5a6'
                        }}
                      >
                        {transactionApi.TransactionStatusNames[transaction.status]}
                      </span>
                    </td>
                    <td>{transaction.paymentProvider}</td>
                    <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
