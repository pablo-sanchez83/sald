<script lang="ts">
  import { db, user } from "$lib/firebase";
  import type { FormattedTransaction, UserData } from "$lib/types";
  import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
  import Chart from "$lib/dashboardComponents/Chart.svelte";
  import TransactionTable from "$lib/dashboardComponents/TransactionTable.svelte";
  import NewTransactionForm from "$lib/dashboardComponents/NewTransactionForm.svelte";
  import { TrendingDown, TrendingUp, Wallet } from "lucide-svelte";
  import { onDestroy, onMount } from "svelte";
  import { reloadTrigger } from "$lib/reload";

  let userData: UserData | null;
  let unsubscribe: () => void;
  let formattedTransactions: FormattedTransaction[] = [];
  let diferencia = 0;

  let transactionModal: HTMLDialogElement;
  let newType = "";
  let newDescription = "";
  let newAmount: number = 0;

  $: labels = formattedTransactions.map((tx) => {
    const date = tx.date?.toDate
      ? tx.date.toDate()
      : new Date(tx.date.nanoseconds);
    return date.toLocaleDateString("es-ES", {
      month: "short",
      year: "2-digit",
    });
  });

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

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filtrar ingresos y gastos del mes actual
        const currentMonthIncomes = userData.transactions.filter(
          (tx) =>
            tx.type === "income" &&
            tx.date.toDate().getMonth() === currentMonth &&
            tx.date.toDate().getFullYear() === currentYear,
        );
        const currentMonthExpenses = userData.transactions.filter(
          (tx) =>
            tx.type === "expense" &&
            tx.date.toDate().getMonth() === currentMonth &&
            tx.date.toDate().getFullYear() === currentYear,
        );

        // Calcular diferencia: salario + ingresos - gastos
        const totalIncomes = currentMonthIncomes.reduce(
          (acc, tx) => acc + tx.amount,
          0,
        );
        const totalExpenses = currentMonthExpenses.reduce(
          (acc, tx) => acc + tx.amount,
          0,
        );

        diferencia = userData.salary + totalIncomes - totalExpenses;
      } else {
        userData = null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  onMount(() => {
    fetchUserData();

    unsubscribe = reloadTrigger.subscribe((value) => {
      fetchUserData();
    });
  });

  onDestroy(() => {
    if (typeof unsubscribe === "function") {
      unsubscribe();
    }
  });

  function handleTransactionSubmit(event: Event) {
    event.preventDefault();
    if (userData && $user) {
      if (!newType || !newDescription || newAmount <= 0) return;

      const newTransaction = {
        type: newType as "income" | "expense",
        description: newDescription,
        amount: parseFloat(newAmount.toFixed(2)),
        date: Timestamp.now(),
      };

      // Agregar la nueva transacción al usuario
      userData.transactions.push(newTransaction);
      userData.transactions.sort((a, b) => b.date.seconds - a.date.seconds);

      // Actualizar el usuario en Firestore
      const docRef = doc(db, "users", $user.uid);
      updateDoc(docRef, {
        transactions: userData.transactions,
      }).then(() => {
        // Limpiar el formulario y cerrar el modal
        newType = "";
        newDescription = "";
        newAmount = 0;
        transactionModal.close();
        fetchUserData(); // Refrescar los datos del usuario
      });
    }
  }
</script>

{#if userData}
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
            ${userData.salary.toLocaleString()}
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
          <div class="flex-1 w-full flex items-center justify-center overflow-x-auto">
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
{:else}
  <div
    class="p-4 sm:p-8 flex justify-center items-center min-h-screen"
  >
    <h1
      class="text-xl sm:text-2xl font-bold animate-pulse"
    >
      Cargando datos del usuario...
    </h1>
  </div>
{/if}
