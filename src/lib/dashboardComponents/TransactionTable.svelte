<script lang="ts">
    import type { FormattedTransaction } from "$lib/types";

  export let transactions: FormattedTransaction[] = [];
</script>

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
      {#if transactions.length > 0}
        {#each transactions as transaction, index}
          <tr
            class="border-b last:border-b-0 {transaction.type == 'income' ? 'bg-green-50' : 'bg-red-50'}"
          >
            <td class="py-2 px-2">{index + 1}</td>
            <td class="py-2 px-2">{transaction.formattedDate}</td>
            <td class="py-2 px-2">{transaction.description}</td>
            <td
              class="py-2 px-2 font-semibold {transaction.type == 'income' ? 'text-green-600' : 'text-red-600'}"
            >
              {transaction.amount}
            </td>
          </tr>
        {/each}
      {:else}
        <tr>
          <td colspan="4" class="text-center py-4 text-gray-400">
            No hay transacciones registradas.
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>