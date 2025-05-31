<script lang="ts">
  import { db, user } from "$lib/firebase";
  import type { FormattedTransaction, UserData } from "$lib/types";
  import { doc, getDoc } from "firebase/firestore";
  import Chart from "chart.js/auto";

  let userData: UserData | null;
  let formattedTransactions: FormattedTransaction[] = [];
  let diferencia = 0;
  let chart: Chart | null = null;
  let chartCanvas: HTMLCanvasElement;

  let transactionModal: HTMLDialogElement;
  let newType = "";
  let newDescription = "";
  let newAmount: number | "" = "";

  $: if ($user) {
    fetchUserData();
  }

  async function fetchUserData() {
    try {
      const docRef = doc(db, "users", $user ? $user.uid : "");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        userData = docSnap.data() as UserData;
        if (!userData.transactions) {
          userData.transactions = [];
        }
        formattedTransactions = userData.transactions.map((tx) => {
          return {
            ...tx,
            formattedDate: tx.date.toDate().toLocaleString(),
          };
        });
        diferencia =
          userData.salary -
          userData.transactions.reduce(
            (acc, tx) => acc + (tx.type === "expense" ? tx.amount : 0),
            0,
          );
        // Renderiza la gráfica después de obtener los datos
        setTimeout(renderChart, 0);
      } else {
        userData = null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  function renderChart() {
    if (!chartCanvas) return;
    if (chart) {
      chart.destroy();
    }

    // Usar las mismas fechas para ambos datasets
    const labels = formattedTransactions.map((tx) => tx.formattedDate);

    // Mapear los montos, dejando 0 donde no corresponde el tipo
    const incomeData = formattedTransactions.map((tx) =>
      tx.type === "income" ? tx.amount : 0,
    );
    const expenseData = formattedTransactions.map((tx) =>
      tx.type === "expense" ? tx.amount : 0,
    );

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
</script>

{#if userData}
  <div class="p-2 sm:p-4 h-screen bg-gradient-to-br from-gray-50 to-gray-200">
    <div
      class="w-full min-h-full mx-auto grid grid-cols-1 md:grid-cols-5 grid-rows-8 gap-4 sm:gap-6"
    >
      <!-- Salario -->
      <div
        class="col-span-1 md:col-span-3 row-span-2 flex items-center justify-between bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 min-w-0"
      >
        <div class="min-w-0">
          <h2 class="text-base sm:text-lg font-semibold text-gray-600 truncate">
            Salario mensual
          </h2>
          <p
            class="text-2xl sm:text-3xl font-bold text-green-600 mt-2 truncate"
          >
            ${userData.salary.toLocaleString()}
          </p>
        </div>
        <svg
          class="w-10 h-10 sm:w-12 sm:h-12 text-green-200 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          ><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="10"
          ></circle></svg
        >
      </div>

      <!-- Diferencia mensual -->
      <div
        class="col-span-1 md:col-span-2 row-span-2 flex items-center justify-between bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 min-w-0"
      >
        <div class="min-w-0">
          <h2 class="text-base sm:text-lg font-semibold text-gray-600 truncate">
            Diferencia mensual
          </h2>
          <p
            class="text-2xl sm:text-3xl font-bold {diferencia >= 0
              ? 'text-green-600'
              : 'text-red-600'} mt-2 truncate"
          >
            {diferencia >= 0 ? "+" : ""}{diferencia.toLocaleString()}
          </p>
        </div>
        <svg
          class="w-10 h-10 sm:w-12 sm:h-12 text-blue-200 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          ><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="10"
          ></circle></svg
        >
      </div>

      <button
        class="col-span-1 md:col-span-5 row-span-1 bg-blue-600 text-white rounded-xl shadow-lg p-4 sm:p-6 flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        on:click={() => transactionModal.showModal()}
      >
        <span class="text-base sm:text-lg font-semibold"
          >Agregar transacción</span
        >
      </button>
      <dialog
        bind:this={transactionModal}
        id="transaction_modal"
        class="modal p-0 bg-transparent"
      >
        <div class="modal-box">
          <form
            method="dialog"
          >
            <button
              type="button"
              class="absolute top-3 right-3 text-gray-400 hover:text-blue-600 transition-colors text-xl"
              on:click={() => transactionModal.close()}
              aria-label="Cerrar"
              tabindex="0"
            >
              &times;
            </button>
            <h2 class="text-xl font-bold text-blue-700 mb-1 text-center">
              Nueva transacción
            </h2>
            <div class="flex flex-col gap-2">
              <label class="flex flex-col gap-1">
                <span class="text-sm font-medium text-gray-600">Tipo</span>
                <select
                  bind:value={newType}
                  required
                  class="border border-blue-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <option value="" disabled selected>Selecciona tipo</option>
                  <option value="income">Ingreso</option>
                  <option value="expense">Gasto</option>
                </select>
              </label>
              <label class="flex flex-col gap-1">
                <span class="text-sm font-medium text-gray-600"
                  >Descripción</span
                >
                <input
                  type="text"
                  bind:value={newDescription}
                  required
                  class="border border-blue-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="Descripción"
                />
              </label>
              <label class="flex flex-col gap-1">
                <span class="text-sm font-medium text-gray-600">Monto</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  bind:value={newAmount}
                  required
                  class="border border-blue-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="Monto"
                />
              </label>
            </div>
            <div class="flex gap-3 justify-end mt-2">
              <button
                type="button"
                class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-semibold"
                on:click={() => transactionModal.close()}
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <!-- Tabla de transacciones -->
      <div
        class="col-span-1 md:col-span-2 row-span-5 bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 flex flex-col min-w-0"
      >
        <h2
          class="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4"
        >
          Transacciones
        </h2>
        <div class="overflow-y-auto max-h-[40vh] sm:max-h-[400px]">
          <table class="min-w-full text-xs sm:text-sm">
            <thead>
              <tr class="text-gray-500 border-b">
                <th class="py-2 px-2 text-left">#</th>
                <th class="py-2 px-2 text-left">Fecha</th>
                <th class="py-2 px-2 text-left">Descripción</th>
                <th class="py-2 px-2 text-left">Monto</th>
              </tr>
            </thead>
            <tbody>
              {#if userData.transactions.length > 0}
                {#each formattedTransactions as transaction, index}
                  <tr
                    class="border-b last:border-b-0 {transaction.type ==
                    'income'
                      ? 'bg-green-50'
                      : 'bg-red-50'}"
                  >
                    <td class="py-2 px-2">{index + 1}</td>
                    <td class="py-2 px-2">{transaction.formattedDate}</td>
                    <td class="py-2 px-2">{transaction.description}</td>
                    <td
                      class="py-2 px-2 font-semibold {transaction.type ==
                      'income'
                        ? 'text-green-600'
                        : 'text-red-600'}">{transaction.amount}</td
                    >
                  </tr>
                {/each}
              {:else}
                <tr>
                  <td colspan="4" class="text-center py-4 text-gray-400"
                    >No hay transacciones registradas.</td
                  >
                </tr>
              {/if}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Gráfica -->
      <div
        class="col-span-1 md:col-span-3 row-span-5 bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 flex flex-col items-center min-w-0"
      >
        <h2
          class="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4"
        >
          Gráfica de transacciones
        </h2>
        {#if formattedTransactions.length > 0}
          <div class="flex-1 w-full flex items-center justify-center">
            <canvas
              bind:this={chartCanvas}
              class="w-full h-full max-h-[400px] max-w-full"
              style="display:block;"
            ></canvas>
          </div>
        {:else}
          <p class="text-gray-400">No hay datos para mostrar.</p>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div
    class="p-4 sm:p-8 flex justify-center items-center min-h-screen bg-gray-50"
  >
    <h1 class="text-xl sm:text-2xl font-bold text-gray-500 animate-pulse">
      Cargando datos del usuario...
    </h1>
  </div>
{/if}
