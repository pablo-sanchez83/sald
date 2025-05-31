<script lang="ts">
  import { db, user } from "$lib/firebase";
  import type { FormattedTransaction, UserData } from "$lib/types";
  import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
  import Chart from "$lib/dashboardComponents/Chart.svelte";
  import TransactionTable from "$lib/dashboardComponents/TransactionTable.svelte";
    import NewTransactionForm from "$lib/dashboardComponents/NewTransactionForm.svelte";

  let userData: UserData | null;
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

        const currentMonthExpenses = userData.transactions.filter(
          (tx) =>
            tx.type === "expense" &&
            tx.date.toDate().getMonth() === currentMonth &&
            tx.date.toDate().getFullYear() === currentYear
        );

        diferencia =
          userData.salary -
          currentMonthExpenses.reduce((acc, tx) => acc + tx.amount, 0);
      } else {
        userData = null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

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
      <!-- Botón para agregar transacción -->
      <button
        class="col-span-1 md:col-span-5 row-span-1 bg-blue-600 text-white rounded-xl shadow-lg p-4 sm:p-6 flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        on:click={() => transactionModal.showModal()}
      >
        <span class="text-base sm:text-lg font-semibold"
          >Agregar transacción</span
        >
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
        class="col-span-1 md:col-span-2 row-span-5 bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 flex flex-col min-w-0"
      >
        <h2
          class="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4"
        >
          Transacciones
        </h2>
        <TransactionTable transactions={formattedTransactions} />
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
            <Chart
              {labels}
              incomeData={formattedTransactions.map((tx) =>
                tx.type === "income" ? tx.amount : 0,
              )}
              expenseData={formattedTransactions.map((tx) =>
                tx.type === "expense" ? tx.amount : 0,
              )}
            />
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
