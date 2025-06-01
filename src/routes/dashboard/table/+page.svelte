<script lang="ts">
    import { db, user } from "$lib/firebase";
    import type { FormattedTransaction, UserData } from "$lib/types";
    import { doc, getDoc } from "firebase/firestore";
    import { ArrowDownCircle, ArrowUpCircle } from "lucide-svelte";
    import { onMount } from "svelte";

    let transactions: FormattedTransaction[] = [];
    let userData: UserData | null = null;

    let unsubscribe: () => void;

    onMount(() => {
        unsubscribe = user.subscribe(async ($user) => {
            if ($user) {
                await fetchUserData();
            } else {
                transactions = [];
                userData = null;
            }
        });
        return () => {
            if (unsubscribe) unsubscribe();
        };
    });

    async function fetchUserData() {
        try {
            const docRef = doc(db, "users", $user ? $user.uid : "");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                userData = docSnap.data() as UserData;
                if (!userData.transactions) {
                    userData.transactions = [];
                }
                transactions = userData.transactions.map((tx) => {
                    return {
                        ...tx,
                        formattedDate: tx.date.toDate().toLocaleString(),
                    };
                });
            } else {
                userData = null;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    let currentPage = 1;
    let itemsPerPage = 10;
    const itemsPerPageOptions = [5, 10, 20, 50];

    // Ordenamiento
    let sortField: "formattedDate" | "amount" | "type" | null = null;
    let sortDirection: "asc" | "desc" = "asc";

    function sortBy(field: "formattedDate" | "amount" | "type") {
        if (sortField === field) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortField = field;
            sortDirection = "asc";
        }
        currentPage = 1;
    }

    $: sortedTransactions = [...transactions].sort((a, b) => {
        if (!sortField) return 0;
        let aValue, bValue;
        if (sortField === "formattedDate") {
            const parseDMY = (str: string) => {
                const [d, m, y] = str.split("/");
                return new Date(`${y}-${m}-${d}`).getTime();
            };
            aValue = parseDMY(a.formattedDate.toString());
            bValue = parseDMY(b.formattedDate.toString());
        } else if (sortField === "amount") {
            aValue = Number(a.amount);
            bValue = Number(b.amount);
        } else if (sortField === "type") {
            aValue = a.type;
            bValue = b.type;
        } else {
            return 0;
        }
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    $: totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

    $: paginatedTransactions = sortedTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    function goToPage(page: number) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }

    function handleItemsPerPageChange(event: Event) {
        itemsPerPage = parseInt((event.target as HTMLSelectElement).value);
        currentPage = 1;
    }
</script>

<div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto">
        <table class="min-w-full text-xs sm:text-sm">
            <thead>
                <tr class="text-base border-b">
                    <th class="py-2 px-2 text-left">#</th>
                    <th
                        class="py-2 px-2 text-left cursor-pointer select-none"
                        on:click={() => sortBy("formattedDate")}
                    >
                        Fecha
                        {#if sortField === "formattedDate"}
                            <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                        {/if}
                    </th>
                    <th class="py-2 px-2 text-left">Descripción</th>
                    <th
                        class="py-2 px-2 text-left cursor-pointer select-none"
                        on:click={() => sortBy("type")}
                    >
                        Tipo
                        {#if sortField === "type"}
                            <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                        {/if}
                    </th>
                    <th
                        class="py-2 px-2 text-left cursor-pointer select-none"
                        on:click={() => sortBy("amount")}
                    >
                        Monto
                        {#if sortField === "amount"}
                            <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                        {/if}
                    </th>
                </tr>
            </thead>
            <tbody>
                {#if paginatedTransactions.length > 0}
                    {#each paginatedTransactions as transaction, index}
                        <tr class="border-b last:border-b-0">
                            <td class="py-2 px-2">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td class="py-2 px-2"
                                >{transaction.formattedDate}</td
                            >
                            <td class="py-2 px-2">{transaction.description}</td>
                            <td class="py-2 px-2 flex items-center gap-1">
                                {#if transaction.type === "income"}
                                    <ArrowUpCircle
                                        class="w-4 h-4 text-success"
                                    />
                                    <span>Ingreso</span>
                                {:else}
                                    <ArrowDownCircle
                                        class="w-4 h-4 text-error"
                                    />
                                    <span>Gasto</span>
                                {/if}
                            </td>
                            <td class="py-2 px-2 font-semibold">
                                {transaction.amount}
                            </td>
                        </tr>
                    {/each}
                {:else}
                    <tr>
                        <td colspan="6" class="text-center py-4 text-gray-400">
                            No hay transacciones registradas.
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
    <div class="flex justify-end mt-4 mb-4 mr-4">
        <div class="flex items-center gap-4">
            <div>
                <label for="itemsPerPage" class="mr-2 text-xs sm:text-sm"
                    >Filas por página:</label
                >
                <select
                    id="itemsPerPage"
                    bind:value={itemsPerPage}
                    on:change={handleItemsPerPageChange}
                    class="border rounded px-1 py-0.5 text-xs sm:text-sm"
                >
                    {#each itemsPerPageOptions as option}
                        <option value={option}>{option}</option>
                    {/each}
                </select>
            </div>
            <div class="flex items-center gap-2">
                <button
                    on:click={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    class="px-2 py-1 text-xs border rounded disabled:opacity-50"
                    >Anterior</button
                >
                <span class="text-xs sm:text-sm"
                    >Página {currentPage} de {totalPages}</span
                >
                <button
                    on:click={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    class="px-2 py-1 text-xs border rounded disabled:opacity-50"
                    >Siguiente</button
                >
            </div>
        </div>
    </div>
</div>
