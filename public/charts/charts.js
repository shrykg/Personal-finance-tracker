function drawCharts() {
    const transactions = JSON.parse(document.getElementById('transactions-data').textContent);
    console.log(transactions);
  
    // Process the transactions data and prepare the data for charts
    const categoryAmounts = new Map();
    const monthlyAmounts = new Map();
  
    transactions.forEach(transaction => {
      // Update categoryAmounts
      const category = transaction.category;
      const currentCategoryAmount = categoryAmounts.get(category) || 0;
      categoryAmounts.set(category, currentCategoryAmount + transaction.amount);
  
      // Update monthlyAmounts
      const monthYear = new Date(transaction.transaction_date).toISOString().slice(0, 7);
      const currentMonthlyAmount = monthlyAmounts.get(monthYear) || 0;
      monthlyAmounts.set(monthYear, currentMonthlyAmount + transaction.amount);
    });
  
    // Draw the pie chart
    const pieChartData = [['Category', 'Amount']];
    for (const [category, amount] of categoryAmounts) {
      pieChartData.push([category, amount]);
    }
  
    const pieChart = new google.visualization.PieChart(document.getElementById('piechart'));
    pieChart.draw(google.visualization.arrayToDataTable(pieChartData), {
      title: 'Expenses by Category'
    });
  
    // Draw the line chart and bar chart
    const monthlyChartData = [['Month-Year', 'Amount']];
    const sortedMonths = Array.from(monthlyAmounts.keys()).sort();
    sortedMonths.forEach(monthYear => {
      monthlyChartData.push([monthYear, monthlyAmounts.get(monthYear)]);
    });
  
    const lineChart = new google.visualization.LineChart(document.getElementById('linechart'));
    lineChart.draw(google.visualization.arrayToDataTable(monthlyChartData), {
      title: 'Monthly Expenses Trend (Line Chart)'
    });
  
    const barChart = new google.visualization.ColumnChart(document.getElementById('barchart'));
    barChart.draw(google.visualization.arrayToDataTable(monthlyChartData), {
      title: 'Monthly Expenses Trend (Bar Chart)'
    });
  }
  