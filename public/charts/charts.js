function preparePieChartData(transactions) 
{
    const categoryAmounts = new Map();
  
    transactions.forEach(transaction => 
        {
            const category = transaction.category;
            const currentCategoryAmount = categoryAmounts.get(category) || 0;
            categoryAmounts.set(category, currentCategoryAmount + transaction.amount);
        });
  
    const pieChartData = [['Category', 'Amount']];
    
    for (const [category, amount] of categoryAmounts) 
    {
      pieChartData.push([category, amount]);
    }
  
    return pieChartData;
}
  
function prepareMonthlyChartData(transactions) 
{
    const monthlyAmounts = new Map();

    transactions.forEach(transaction => 
        {
            const monthYear = new Date(transaction.transaction_date).toISOString().slice(0, 7);
            const currentMonthlyAmount = monthlyAmounts.get(monthYear) || 0;
            monthlyAmounts.set(monthYear, currentMonthlyAmount + transaction.amount);
        });

    const monthlyChartData = [['Month-Year', 'Amount']];
    const sortedMonths = Array.from(monthlyAmounts.keys()).sort();

    sortedMonths.forEach(monthYear => 
        {
            monthlyChartData.push([monthYear, monthlyAmounts.get(monthYear)]);
        });

    return monthlyChartData;
}

function prepareYearlyGrowthData(transactions) 
{
    const yearlyAmounts = new Map();

    transactions.forEach(transaction => 
        {
            const year = new Date(transaction.transaction_date).getFullYear();
            const currentYearlyAmount = yearlyAmounts.get(year) || 0;
            yearlyAmounts.set(year, currentYearlyAmount + transaction.amount);
        });

    const growthData = [['Year', 'Growth']];
    const sortedYears = Array.from(yearlyAmounts.keys()).sort();
    let previousYearAmount = 0;

    sortedYears.forEach(year => 
        {
            const currentYearAmount = yearlyAmounts.get(year);
            const growth = currentYearAmount - previousYearAmount;
            growthData.push([year.toString(), growth]);
            previousYearAmount = currentYearAmount;
        });

    return growthData;
}

function drawPieChart(transactions) 
{
    const pieChartData = preparePieChartData(transactions);
    const pieChart = new google.visualization.PieChart(document.getElementById('piechart'));
    pieChart.draw(google.visualization.arrayToDataTable(pieChartData), 
    {
        title: 'Expenses by Category'
    });
}

function drawLineChart(transactions) 
{
    const yearlyGrowthData = prepareYearlyGrowthData(transactions);
    const lineChart = new google.visualization.LineChart(document.getElementById('linechart'));
    lineChart.draw(google.visualization.arrayToDataTable(yearlyGrowthData), 
    {
        title: 'Year-on-Year Expenses Growth (Line Chart)'
    });
}

function drawBarChart(transactions) 
{
    const monthlyChartData = prepareMonthlyChartData(transactions);
    const barChart = new google.visualization.ColumnChart(document.getElementById('barchart'));
    barChart.draw(google.visualization.arrayToDataTable(monthlyChartData), 
    {
        title: 'Monthly Expenses Trend (Bar Chart)'
    });
}

function drawCharts() 
{
    const transactions = JSON.parse(document.getElementById('transactions-data').textContent);
    drawPieChart(transactions);
    drawLineChart(transactions);
    drawBarChart(transactions);
}
