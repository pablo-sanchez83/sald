<script lang="ts">
  import { Chart } from "flowbite-svelte";

  export let labels: string[] = [];
  export let incomeData: number[] = [];
  export let expenseData: number[] = [];

  let options = {
    chart: {
      type: "line" as "line"
    },
    series: [
      {
        name: "Ingresos",
        data: incomeData,
        color: "#22c55e"
      },
      {
        name: "Gastos",
        data: expenseData,
        color: "#ef4444"
      }
    ],
    xaxis: {
      categories: labels
    },
    stroke: {
      width: 3,
      curve: "smooth" as "smooth"
    },
    legend: {
      show: true,
      position: "top" as "top"
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "Inter, sans-serif"
        }
      }
    }
  };
</script>

<div class="w-full overflow-x-auto flex justify-center">
  <Chart {options} class="w-full max-w-2xl h-[300px]" />
</div>