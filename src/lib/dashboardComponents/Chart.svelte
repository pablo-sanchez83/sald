<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Chart from "chart.js/auto";

  export let labels: string[] = [];
  export let incomeData: number[] = [];
  export let expenseData: number[] = [];

  let chart: Chart | null = null;
  let chartCanvas: HTMLCanvasElement;

  function renderChart() {
    if (!chartCanvas) return;
    if (chart) chart.destroy();

    chart = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Ingresos",
            data: incomeData,
            borderColor: "rgb(34,197,94)",
            backgroundColor: "rgba(34,197,94,0.2)",
            tension: 0.2,
            fill: false,
          },
          {
            label: "Gastos",
            data: expenseData,
            borderColor: "rgb(239,68,68)",
            backgroundColor: "rgba(239,68,68,0.2)",
            tension: 0.2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      },
    });
  }

  onMount(renderChart);
  $: renderChart();

  onDestroy(() => {
    if (chart) chart.destroy();
  });
</script>
<div class="w-full overflow-x-auto flex justify-center">
  <canvas
    bind:this={chartCanvas}
    class="min-w-[350px] w-full max-w-2xl h-[300px] sm:h-[400px]"
    style="display:block;"
  ></canvas>
</div>