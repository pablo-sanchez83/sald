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
    class="absolute top-3 right-3 transition-colors text-xl"
    on:click={() => dispatch("close")}
    aria-label="Cerrar"
    tabindex="0"
  >
    &times;
  </button>
  <h2 class="text-xl font-bold mb-1 text-center">
    Nueva transacción
  </h2>
  <div class="flex flex-col gap-2">
    <label class="flex flex-col gap-1">
      <span class="text-sm font-medium">Tipo</span>
      <select
        bind:value={newType}
        required
        class="border rounded-lg p-2 focus:outline-none focus:ring-2 transition"
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
        class="border rounded-lg p-2 focus:outline-none focus:ring-2 transition"
        placeholder="Descripción"
      />
    </label>
    <label class="flex flex-col gap-1">
      <span class="text-sm font-medium">Monto</span>
      <input
        type="number"
        min="0.01"
        step="0.01"
        bind:value={newAmount}
        required
        class="border rounded-lg p-2 focus:outline-none focus:ring-2 transition"
        placeholder="Monto"
      />
    </label>
  </div>
  <div class="flex gap-3 justify-end mt-2">
    <button
      type="button"
      class="px-4 py-2 rounded-lg transition font-semibold"
      on:click={() => dispatch("close")}
    >
      Cancelar
    </button>
    <button
      type="submit"
      class="px-4 py-2 rounded-lg transition font-semibold shadow"
    >
      Guardar
    </button>
  </div>
</form>