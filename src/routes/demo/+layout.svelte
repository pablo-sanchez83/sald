<script lang="ts">
    import {
        Menu,
        Home,
        Settings,
        User,
        Table,
        PiggyBank,
    } from "lucide-svelte";

    // Datos demo locales
    let userData = {
        username: "DemoUser",
        accounts: [
            {
                id: "demo-account",
                name: "Cuenta Demo",
                salary: 2000,
                balance: 1800,
                currency: "EUR",
                transactions: [],
            },
        ],
        settings: {
            theme: "light",
        },
    };

    let isOpen = false;
    let mobileMenuOpen = false;
    let showProfileModal = false;
    let showSettingsModal = false;
    let profileDisplayName = userData.username;
    let profileSalary: number = userData.accounts[0].salary;
    let selectedAccountId = userData.accounts[0].id;

    function toggleSidebar() {
        isOpen = !isOpen;
    }

    function handleProfileSubmit(event: Event) {
        event.preventDefault();
        userData.username = profileDisplayName;
        userData.accounts = userData.accounts.map((acc) =>
            acc.id === selectedAccountId
                ? { ...acc, salary: Number(profileSalary) }
                : acc
        );
        showProfileModal = false;
    }
</script>

<div class="flex h-screen">
    <!-- Sidebar -->
    <nav
        class={`fixed top-2 left-0 h-full z-30 transition-all duration-300 border-r ${isOpen ? "w-64 px-4" : "w-16 px-2"} md:flex flex-col justify-between hidden`}
    >
        <div>
            <ul class="menu p-0 mb-2">
                <li>
                    <a href="/demo" class="flex items-center gap-2">
                        <Home class="h-6 w-6 text-base-content" />
                        {#if isOpen}<span>Panel de control</span>{/if}
                    </a>
                </li>
                <li>
                    <a href="/demo/table" class="flex items-center gap-2">
                        <Table class="h-6 w-6 text-base-content" />
                        {#if isOpen}<span>Tabla de transacciones</span>{/if}
                    </a>
                </li>
                <li>
                    <a href="/demo/budgets" class="flex items-center gap-2">
                        <PiggyBank class="h-6 w-6 text-base-content" />
                        {#if isOpen}<span>Presupuestos</span>{/if}
                    </a>
                </li>
            </ul>
        </div>
        <div>
            <ul class="menu p-0 mb-2">
                <li>
                    <button
                        class="flex items-center gap-2 tooltip tooltip-right"
                        data-tip="Abrir ajustes (deshabilitado en la demo)"
                        disabled
                    >
                        <Settings class="h-6 w-6 text-base-content" />
                        {#if isOpen}<span>Ajustes</span>{/if}
                    </button>
                </li>
                <li>
                    <button
                        class="flex items-center gap-2 tooltip tooltip-right"
                        data-tip="Abrir perfil"
                        onclick={() => (showProfileModal = true)}
                    >
                        <User class="h-6 w-6 text-base-content" />
                        {#if isOpen}<span>Perfil</span>{/if}
                    </button>
                </li>
                <li>
                    <button
                        class="flex items-center gap-2"
                        aria-label="Toggle sidebar"
                        onclick={toggleSidebar}
                    >
                        <Menu class="h-6 w-6 text-base-content" />
                    </button>
                </li>
            </ul>
        </div>
    </nav>

    <nav
        class="flex md:hidden items-center justify-between px-4 py-2 bg-base-100 border-b w-full fixed top-0 left-0 z-40"
    >
        <button
            class="flex items-center"
            aria-label="Abrir menú"
            onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
        >
            <Menu class="h-6 w-6 text-base-content" />
        </button>
        <span class="font-bold text-lg">Saldo</span>
        <div></div>
    </nav>

    {#if mobileMenuOpen}
        <div
            class="fixed top-12 left-0 w-full bg-base-100 shadow-lg z-50 md:hidden"
        >
            <div class="flex justify-between">
                <ul class="menu p-2 flex flex-col gap-2">
                    <li>
                        <a href="/demo" onclick={() => (mobileMenuOpen = false)}>
                            <Home class="h-5 w-5" /> Panel de control
                        </a>
                    </li>
                    <li>
                        <a href="/demo/table" onclick={() => (mobileMenuOpen = false)}>
                            <Table class="h-5 w-5" /> Tabla de transacciones
                        </a>
                    </li>
                    <li>
                        <a href="/demo/budgets" onclick={() => (mobileMenuOpen = false)}>
                            <PiggyBank class="h-5 w-5" /> Presupuestos
                        </a>
                    </li>
                </ul>
                <ul class="menu p-2 flex flex-col gap-2 items-end">
                    <li>
                        <button
                            onclick={() => {
                                showSettingsModal = true;
                                mobileMenuOpen = false;
                            }}
                        >
                            <Settings class="h-5 w-5" /> Ajustes
                        </button>
                    </li>
                    <li>
                        <button
                            onclick={() => {
                                showProfileModal = true;
                                mobileMenuOpen = false;
                            }}
                        >
                            <User class="h-5 w-5" /> Perfil
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    {/if}

    <!-- Main content -->
    <div
        class={`flex-1 transition-all duration-300 pt-12 md:pt-0 ${isOpen ? "md:ml-64" : "md:ml-16"}`}
    >
        <slot />
    </div>
</div>

<!-- Modal Profile -->
{#if showProfileModal}
    <div class="modal modal-open">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">Perfil</h3>
            <form onsubmit={handleProfileSubmit} class="flex flex-col gap-4">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Cuenta</span>
                    </div>
                    <select
                        class="select select-bordered w-full"
                        bind:value={selectedAccountId}
                        onchange={(e) => {
                            const target = e.target as HTMLSelectElement | null;
                            if (target) {
                                selectedAccountId = target.value;
                                const selectedAccount = userData.accounts.find(
                                    (acc) => acc.id === target.value
                                );
                                if (selectedAccount) {
                                    profileSalary = selectedAccount.salary;
                                }
                            }
                        }}
                    >
                        {#each userData.accounts as account}
                            <option value={account.id}>{account.name}</option>
                        {/each}
                    </select>
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Nombre de usuario</span>
                    </div>
                    <input
                        type="text"
                        class="input input-bordered w-full"
                        bind:value={profileDisplayName}
                        placeholder="Nombre"
                        required
                    />
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Salario mensual</span>
                    </div>
                    <input
                        type="number"
                        class="input input-bordered w-full"
                        bind:value={profileSalary}
                        min="0"
                        step="0.01"
                        placeholder="Salario"
                        required
                    />
                </label>
                <div class="modal-action">
                    <button
                        type="button"
                        class="btn"
                        onclick={() => (showProfileModal = false)}
                    >Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        </div>
    </div>
{/if}