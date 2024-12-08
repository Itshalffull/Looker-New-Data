const chartJs = document.createElement('script');
chartJs.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(chartJs);

chartJs.onload = () => {
  // Create canvas element
  const canvasElement = document.createElement('canvas');
  document.body.appendChild(canvasElement);
  const ctx = canvasElement.getContext('2d');
  let chart;

  const drawViz = (data) => {
    // Clear any existing chart
    if (chart) {
      chart.destroy();
    }

    // Set canvas dimensions
    canvasElement.width = dscc.getWidth();
    canvasElement.height = dscc.getHeight();

    // Extract data
    const dimension = data.tables.DEFAULT[0].dimID;
    const metrics = data.tables.DEFAULT.map(row => ({
      x: row[dimension[0]],
      y: row.metricID[0]
    }));

    // Get style values
    const lineColor = data.style.lineColor.value || '#1A73E8';
    const lineWidth = parseInt(data.style.lineWidth.value) || 2;
    const pointRadius = parseInt(data.style.pointRadius.value) || 4;

    // Create the chart
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          data: metrics,
          borderColor: lineColor,
          borderWidth: lineWidth,
          pointRadius: pointRadius,
          fill: false,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: dimension[0]
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  };

  // Subscribe to data and style changes
  dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}; 