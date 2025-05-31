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

<canvas bind:this={chartCanvas} class="w-full h-full max-h-[400px] max-w-full" style="display:block;"></canvas>