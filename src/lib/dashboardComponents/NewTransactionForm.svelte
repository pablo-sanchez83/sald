<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let newType = "";
  export let newDescription = "";
  export let newAmount: number = 0;

  const dispatch = createEventDispatcher();

  function handleSubmit(event: Event) {
    event.preventDefault();
    dispatch("submit");
  }
</script>

<form on:submit={handleSubmit} method="dialog">
  <button
    type="button"
    class="absolute top-3 right-3 text-gray-400 hover:text-blue-600 transition-colors text-xl"
    on:click={() => dispatch("close")}
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
      <span class="text-sm font-medium text-gray-600">Descripción</span>
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
      on:click={() => dispatch("close")}
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