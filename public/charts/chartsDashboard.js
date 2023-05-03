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
    const monthlyChartData = prepareMonthlyChartData(transactions);
    const lineChart = new google.visualization.LineChart(document.getElementById('linechart'));
    lineChart.draw(google.visualization.arrayToDataTable(monthlyChartData), 
    {
        title: 'Monthly Expenses Trend (Line Chart)'
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
    let transactions = JSON.parse(document.getElementById('transactions-data').textContent);
    const regex = /[0-9]+/g;
    const transformedResult = transactions.map((transaction) => {
        let amount = transaction.amount;
        amount = amount.match(regex);
        amount = parseInt(amount);
        // const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // const formattedDate = transaction.transaction_date.toLocaleDateString("en-US", options);
        return {
            ...transaction,
            amount: amount,
            // transaction_date: formattedDate
    }});
    // let x = transactions[0].amount.match(regex);
    // console.log(x);
    console.log(transformedResult);
    drawPieChart(transformedResult);
    // drawLineChart(transactions);
    drawBarChart(transformedResult);
}