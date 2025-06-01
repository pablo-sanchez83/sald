<script lang="ts">
  import Chart from "$lib/dashboardComponents/Chart.svelte";
  import TransactionTable from "$lib/dashboardComponents/TransactionTable.svelte";
  import NewTransactionForm from "$lib/dashboardComponents/NewTransactionForm.svelte";
  import { TrendingDown, TrendingUp, Wallet } from "lucide-svelte";

  // Datos demo
  let userData = {
    username: "DemoUser",
    accounts: [
      {
        id: "demo-account",
        name: "Cuenta Demo",
        salary: 2000,
        balance: 1800,
        currency: "EUR",
        transactions: [
          {
            type: "income",
            description: "Sueldo",
            amount: 2000,
            date: new Date(2025, 5, 1),
          },
          {
            type: "expense",
            description: "Alquiler",
            amount: 800,
            date: new Date(2025, 5, 2),
          },
          {
            type: "expense",
            description: "Supermercado",
            amount: 120,
            date: new Date(2025, 5, 5),
          },
          {
            type: "income",
            description: "Venta segunda mano",
            amount: 100,
            date: new Date(2025, 5, 10),
          },
        ],
      },
    ],
  };

  let selectedAccount = userData.accounts[0];

  let formattedTransactions = selectedAccount.transactions.map((tx) => ({
    ...tx,
    formattedDate: tx.date.toLocaleString(),
  }));

  let diferencia =
    selectedAccount.salary +
    selectedAccount.transactions
      .filter((tx) => tx.type === "income")
      .reduce((acc, tx) => acc + tx.amount, 0) -
    selectedAccount.transactions
      .filter((tx) => tx.type === "expense")
      .reduce((acc, tx) => acc + tx.amount, 0);

  let transactionModal: HTMLDialogElement;

  let newType = "";
  let newDescription = "";
  let newAmount: number = 0;

  $: labels = formattedTransactions.map((tx) =>
    tx.date.toLocaleDateString("es-ES", {
      month: "short",
      year: "2-digit",
    })
  );

  function handleTransactionSubmit(event: CustomEvent) {
    event.preventDefault?.();
    if (!newType || !newDescription || newAmount <= 0) return;

    const newTransaction = {
      type: newType as "income" | "expense",
      description: newDescription,
      amount: parseFloat(newAmount.toFixed(2)),
      date: new Date(),
    };

    selectedAccount.transactions = [
      ...selectedAccount.transactions,
      newTransaction,
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    formattedTransactions = selectedAccount.transactions.map((tx) => ({
      ...tx,
      formattedDate: tx.date.toLocaleString(),
    }));

    diferencia =
      selectedAccount.salary +
      selectedAccount.transactions
        .filter((tx) => tx.type === "income")
        .reduce((acc, tx) => acc + tx.amount, 0) -
      selectedAccount.transactions
        .filter((tx) => tx.type === "expense")
        .reduce((acc, tx) => acc + tx.amount, 0);

    // Limpiar formulario
    newType = "";
    newDescription = "";
    newAmount = 0;
    transactionModal.close();
  }
</script>

<div class="p-1 sm:p-4 min-h-screen">
  <div
    class="w-full min-h-full mx-auto grid grid-cols-1 grid-rows-auto gap-2 sm:gap-6 md:grid-cols-5 md:grid-rows-5"
  >
    <!-- Salario -->
    <div
      class="col-span-1 md:col-span-3 row-span-1 flex items-center justify-between rounded-xl shadow-lg p-2 sm:p-6 border min-w-0"
    >
      <div class="min-w-0">
        <h2 class="text-sm sm:text-lg font-semibold truncate">
          Salario mensual
        </h2>
        <p class="text-xl sm:text-3xl font-bold mt-2 truncate">
          {selectedAccount.salary.toLocaleString()}
        </p>
      </div>
      <Wallet class="w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0" />
    </div>

    <!-- Diferencia mensual -->
    <div
      class="col-span-1 md:col-span-2 row-span-1 flex items-center justify-between rounded-xl shadow-lg p-2 sm:p-6 border min-w-0"
    >
      <div class="min-w-0">
        <h2 class="text-sm sm:text-lg font-semibold truncate">
          Diferencia mensual
        </h2>
        <p
          class="text-xl sm:text-3xl font-bold {diferencia >= 0
            ? 'text-green-600 [data-theme=dark]:text-green-400'
            : 'text-red-600 [data-theme=dark]:text-red-400'} mt-2 truncate"
        >
          {diferencia >= 0 ? "+" : ""}{diferencia.toLocaleString()}
        </p>
      </div>
      {#if diferencia >= 0}
        <TrendingUp class="w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0" />
      {:else}
        <TrendingDown class="w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0" />
      {/if}
    </div>
    <!-- Botón para agregar transacción -->
    <button
      class="btn h-full cursor-pointer col-span-1 md:col-span-5 row-span-1 rounded-xl shadow-lg p-2 sm:p-6 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm sm:text-lg"
      on:click={() => transactionModal.showModal()}
    >
      <span class="font-semibold">Agregar transacción</span>
    </button>
    <!-- Modal para agregar transacción -->
    <dialog
      bind:this={transactionModal}
      id="transaction_modal"
      class="modal p-0 bg-transparent"
    >
      <div class="modal-box">
        <NewTransactionForm
          bind:newType
          bind:newDescription
          bind:newAmount
          on:submit={handleTransactionSubmit}
          on:close={() => transactionModal.close()}
        />
      </div>
    </dialog>
    <!-- Tabla de transacciones -->
    <div
      class="col-span-1 md:col-span-2 row-span-3 rounded-xl shadow-lg p-2 sm:p-6 border flex flex-col min-w-0"
    >
      <h2 class="text-sm sm:text-lg font-semibold mb-2 sm:mb-4">
        Transacciones
      </h2>
      <div class="flex-1 min-h-0 overflow-x-auto">
        <TransactionTable transactions={formattedTransactions} />
      </div>
    </div>

    <!-- Gráfica -->
    <div
      class="col-span-1 md:col-span-3 row-span-3 rounded-xl shadow-lg p-1 sm:p-4 border flex flex-col items-center min-w-0"
    >
      <h2 class="text-sm sm:text-lg font-semibold mb-2 sm:mb-4">
        Gráfica de transacciones
      </h2>
      {#if formattedTransactions.length > 0}
        <div
          class="flex-1 w-full flex items-center justify-center overflow-x-auto"
        >
          <Chart
            labels={labels.slice().reverse()}
            incomeData={formattedTransactions
              .slice()
              .reverse()
              .map((tx) => (tx.type === "income" ? tx.amount : 0))}
            expenseData={formattedTransactions
              .slice()
              .reverse()
              .map((tx) => (tx.type === "expense" ? tx.amount : 0))}
          />
        </div>
      {:else}
        <p class="text-xs sm:text-base">No hay datos para mostrar.</p>
      {/if}
    </div>
  </div>
</div>