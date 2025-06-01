<script lang="ts">
    import { Pencil, Save, Trash, X } from "lucide-svelte";

    // Demo: datos locales
    let userData = {
        username: "DemoUser",
        accounts: [
            {
                id: "demo-account",
                name: "Cuenta Demo",
                salary: 2000,
                currency: "EUR",
                budget: {
                    total: 1200,
                    remaining: 800,
                    items: [
                        { description: "Alquiler", category: "Vivienda", amount: 700 },
                        { description: "Supermercado", category: "Comida", amount: 200 },
                        { description: "Transporte", category: "Movilidad", amount: 100 },
                    ],
                },
            },
        ],
    };

    let selectedAccount = userData.accounts[0];
    let budget = selectedAccount.budget;
    let newBudget = JSON.parse(JSON.stringify(budget));
    let budgetError = "";

    let gastosTotales = 0;
    let saldoRestante = 0;
    let porcentajeGastado = 0;
    let porcentajeRestante = 0;

    $: if (budget && selectedAccount) {
        gastosTotales = budget.items.reduce(
            (sum: number, item: { amount: number }) => sum + Number(item.amount),
            0,
        );
        saldoRestante = selectedAccount.salary - gastosTotales;
        porcentajeGastado = (gastosTotales / selectedAccount.salary) * 100 || 0;
        porcentajeRestante = 100 - porcentajeGastado;
    }

    let showEditModal = false;

    function openEditModal() {
        newBudget = JSON.parse(JSON.stringify(budget));
        showEditModal = true;
    }

    function closeEditModal() {
        showEditModal = false;
    }

    function addItem() {
        newBudget.items = [
            ...newBudget.items,
            { amount: 0, description: "", category: "" },
        ];
    }

    function removeItem(index: number) {
        newBudget.items = newBudget.items.filter((_: any, i: number) => i !== index);
    }

    function createBudget() {
        // Validación simple
        const itemsTotal = newBudget.items.reduce(
            (sum: number, item: { amount: number }) => sum + Number(item.amount),
            0,
        );
        if (itemsTotal > Number(newBudget.total)) {
            budgetError =
                "La suma de los items no puede ser mayor que el total del presupuesto.";
            return;
        } else {
            budgetError = "";
        }
        newBudget.total = Number(newBudget.total);
        newBudget.remaining = selectedAccount.salary - itemsTotal;
        // Actualiza el presupuesto localmente
        budget = JSON.parse(JSON.stringify(newBudget));
        selectedAccount.budget = budget;
        showEditModal = false;
    }
</script>

{#if userData && budget && selectedAccount}
    <div
        class="w-full max-w-lg mx-auto mt-0 sm:mt-8 rounded-none sm:rounded-2xl shadow-none sm:shadow-lg p-4 sm:p-8 border-0 sm:border bg-transparent sm:bg-base-100 animate-fade-in"
    >
        <h2 class="text-2xl font-bold text-center mb-6 text-primary">
            Presupuesto de <span class="text-success">{userData.username}</span>
        </h2>
        <div class="flex flex-col gap-3 mb-6">
            <div class="flex justify-between">
                <span class="font-medium text-base-content/70"
                    >Salario mensual:</span
                >
                <span class="font-semibold"
                    >€{selectedAccount.salary.toFixed(2)}</span
                >
            </div>
            <div class="flex justify-between">
                <span class="font-medium text-base-content/70"
                    >Total Presupuesto:</span
                >
                <span class="font-semibold">€{budget.total.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-medium text-base-content/70"
                    >Gastos Totales:</span
                >
                <span class="font-semibold">€{gastosTotales.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-medium text-base-content/70"
                    >Saldo Restante (basado en salario):</span
                >
                <span
                    class="font-semibold {saldoRestante >= 0
                        ? 'text-success'
                        : 'text-error'}">{saldoRestante.toFixed(2)} €</span
                >
            </div>
        </div>
        <div
            class="w-full h-4 bg-base-200 rounded-lg overflow-hidden mb-2 border border-base-300"
        >
            <div
                class="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
                style="width: {porcentajeGastado}%"
            ></div>
        </div>
        <div class="flex justify-between text-xs text-base-content/60 mb-2">
            <span>{porcentajeGastado.toFixed(1)}% del salario gastado</span>
            <span>{porcentajeRestante.toFixed(1)}% restante</span>
        </div>
        <div class="flex justify-between text-sm text-base-content/60">
            <span>0 €</span>
            <span>{selectedAccount.salary.toFixed(2)} €</span>
        </div>
        {#if budget.items.length > 0}
            <div class="mt-6">
                <h3 class="text-lg font-semibold mb-2 text-base-content">
                    Detalle de gastos
                </h3>
                <ul class="divide-y divide-base-200">
                    {#each budget.items as item, i}
                        <li class="py-2 flex justify-between items-center">
                            <div>
                                <span class="font-medium"
                                    >{item.description}</span
                                >
                                <span class="ml-2 text-xs text-base-content/60"
                                    >({item.category})</span
                                >
                            </div>
                            <span class="font-semibold"
                                >€{Number(item.amount).toFixed(2)}</span
                            >
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
    <button
        class="absolute bottom-4 right-4 bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary-focus transition"
        title="Editar presupuesto"
        on:click={openEditModal}
    >
        <Pencil class="w-5 h-5" />
    </button>
{/if}

{#if showEditModal}
    <div
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
        <div
            class="bg-base-100 rounded-xl shadow-xl p-8 w-full max-w-md relative"
        >
            <button
                class="absolute top-3 right-3 text-base-content/60 hover:text-error"
                on:click={closeEditModal}
                title="Cerrar"
            >
                <X class="w-6 h-6" />
            </button>
            <h2 class="text-xl font-bold mb-4">Editar presupuesto</h2>
            {#if budgetError}
                <div class="alert alert-error mb-4">
                    <span>{budgetError}</span>
                </div>
            {/if}
            <form
                on:submit|preventDefault={createBudget}
                class="space-y-6"
            >
                <div>
                    <label
                        for="edit-total"
                        class="block font-semibold mb-1 text-base-content"
                        >Total presupuesto (€)</label
                    >
                    <input
                        id="edit-total"
                        type="number"
                        min="0"
                        step="0.01"
                        bind:value={newBudget.total}
                        class="input input-bordered w-full"
                        required
                    />
                </div>
                <div>
                    <h2 class="font-semibold mb-2 text-base-content">
                        Items del presupuesto
                    </h2>
                    <div class="space-y-2">
                        {#each newBudget.items as item, i (i)}
                            <div
                                class="flex flex-col items-center sm:flex-row gap-2 p-3 rounded-lg"
                            >
                                <input
                                    type="text"
                                    placeholder="Descripción"
                                    bind:value={item.description}
                                    class="input input-sm input-bordered flex-1"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Categoría"
                                    bind:value={item.category}
                                    class="input input-sm input-bordered flex-1"
                                    required
                                />
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Cantidad (€)"
                                    bind:value={item.amount}
                                    class="input input-sm input-bordered w-28"
                                    required
                                />
                                <button
                                    type="button"
                                    class="btn btn-error btn-sm"
                                    on:click={() => removeItem(i)}
                                    title="Quitar item"
                                >
                                    <Trash class="w-4 h-4" />
                                </button>
                            </div>
                        {/each}
                    </div>
                    <button
                        type="button"
                        class="btn btn-outline btn-m mt-3"
                        on:click={addItem}
                    >
                        Añadir item
                    </button>
                </div>
                <div>
                    <button
                        type="submit"
                        class="btn btn-primary w-full text-lg font-semibold"
                    >
                        Guardar cambios <Save class="w-5 h-5 ml-2" />
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}