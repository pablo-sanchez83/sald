<script lang="ts">
    import type { Snippet } from "svelte";
    import type { LayoutData } from "./$types";
    import { Menu, Home, Settings, User, Table } from "lucide-svelte";
    import type { UserData } from "$lib/types";
    import { db, user } from "$lib/firebase";
    import { doc, getDoc, updateDoc } from "firebase/firestore";
    import { reloadTrigger } from "$lib/reload";
    import { goto } from '$app/navigation';
    import {selectedAccountId} from "$lib/accountStore";

    let { data, children }: { data: LayoutData; children: Snippet } = $props();

    let isOpen = $state(false);

    function toggleSidebar() {
        isOpen = !isOpen;
    }

    selectedAccountId.subscribe(value => $selectedAccountId = value);

    let theme: 'light' | 'dark' = $state('light');
    let isDarkTheme = $state(false);

    let userData: UserData | null = $state(null);
    let showProfileModal = $state(false);
    let showSettingsModal = $state(false);
    let profileDisplayName = $state("");
    let profileSalary: number = $state(0);
    let hasInitialized = $state(false); // Para saber si ya se inicializó el modal
    let originalSalary: number = $state(0); // Almacenar el salario original

    // --- LOADING Y REDIRECCIÓN ---
    let loading = $state(true);
    let timeout: ReturnType<typeof setTimeout>;

    $effect(() => {
        // Si el usuario ya está cargado, deja de cargar y limpia timeout
        if ($user) {
            loading = false;
            clearTimeout(timeout);
            fetchUserData();
        } else {
            loading = true;
            timeout = setTimeout(() => {
                if (!user) goto('/login');
            }, 2500);
        }
    });

    function initializeProfileModal() {
        if (!hasInitialized && userData) {
            const selectedAccount = userData.accounts.find(acc => acc.id === $selectedAccountId);
            profileDisplayName = userData.username;
            profileSalary = selectedAccount?.salary || 0;
            hasInitialized = true;
        }
    }

    $effect(() => {
        if (showProfileModal && userData) {
            initializeProfileModal();
        }
    });

    $effect(() => {
        if (showSettingsModal && userData) {
            theme = userData.settings?.theme || 'light';
        }
    });

    async function handleThemeChange(event: Event) {
        const checked = (event.target as HTMLInputElement).checked;
        theme = checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);

        if (userData && $user) {
            try {
                const userDoc = doc(db, "users", $user.uid);
                await updateDoc(userDoc, {
                    'settings.theme': theme
                });
                userData.settings.theme = theme;
            } catch (e) {
                alert("Error al guardar el tema");
            }
        }
    }

    $effect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    });

    async function fetchUserData() {
        try {
            const docRef = doc(db, "users", $user ? $user.uid : "");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                userData = docSnap.data() as UserData;
                let selectedAccount = null;
                if (userData && userData.accounts) {
                    selectedAccount = userData.accounts.find(acc => acc.id === $selectedAccountId);
                }
                if (selectedAccount && !selectedAccount.transactions) {
                    selectedAccount.transactions = [];
                }
                if (userData && userData.settings && userData.settings.theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    isDarkTheme = true;
                } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                    isDarkTheme = false;
                }
                // Refresh data after account change
                if (userData) {
                    fetchUserData();
                }
            } else {
                userData = null;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
</script>

<div class="flex h-screen">
    <!-- Sidebar -->
    <nav
    class={`fixed top-0 left-0 h-full z-30 transition-all duration-300 ${isOpen ? "w-64 px-4" : "w-16 px-2"} flex flex-col justify-between border-r`}
>
    <!-- Arriba: enlaces -->
    <div>
        <ul class="menu p-0 mb-2">
            <li>
                <a
                    href="/dashboard"
                    data-tip="Panel de control"
                    class="flex items-center gap-2 tooltip"
                >
                    <Home class="h-6 w-6 fill-current text-base-content" />
                    {#if isOpen}<span>Panel de control</span>{/if}
                </a>
            </li>
            <li>
                <a
                    href="/dashboard/table"
                    data-tip="Tabla de transacciones"
                    class="flex items-center gap-2 tooltip"
                >
                    <Table class="h-6 w-6 fill-current text-base-content" />
                    {#if isOpen}<span>Tabla de transacciones</span>{/if}
                </a>
            </li>
        </ul>
    </div>

    <!-- Abajo: select, settings, profile, toggle -->
    <div>
        <ul class="menu p-0 mb-2">
            {#if userData && userData.accounts && userData.accounts.length > 0}
                <li>

                </li>
            {/if}
            <li>
                <button
                    class="flex items-center gap-2 tooltip"
                    data-tip="Ajustes"
                    onclick={() => (showSettingsModal = true)}
                >
                    <Settings class="h-6 w-6 fill-current text-base-content" />
                    {#if isOpen}<span>Ajustes</span>{/if}
                </button>
            </li>
            <li>
                <button
                    class="flex items-center gap-2 tooltip"
                    data-tip="Perfil"
                    onclick={() => (showProfileModal = true)}
                >
                    <User class="h-6 w-6 fill-current text-base-content" />
                    {#if isOpen}<span>Perfil</span>{/if}
                </button>
            </li>
            <li>
                <button
                    class="flex items-center gap-2"
                    aria-label="Toggle sidebar"
                    onclick={toggleSidebar}
                >
                    <Menu class="h-6 w-6 fill-current text-base-content" />
                </button>
            </li>
        </ul>
    </div>
</nav>

    <!-- Main content -->
    <div class={`flex-1 transition-all duration-300 ${isOpen ? "ml-64" : "ml-16"}`}>
        {@render children()}
    </div>
</div>

<!-- Modal Profile -->
{#if showProfileModal}
    <div class="modal modal-open">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">Perfil</h3>
            <form
                onsubmit={async (event) => {
                    event.preventDefault();
                    if (userData && $user) {
                        try {
                            // Use Firestore modular API

                            const userDoc = doc(db, "users", $user.uid);
                            await updateDoc(userDoc, {
                                username: profileDisplayName,
                                accounts: userData.accounts.map(acc => 
                                    acc.id === $selectedAccountId
                                        ? { ...acc, salary: typeof profileSalary === "number" ? profileSalary : Number(profileSalary) }
                                        : acc
                                )
                            });
                            userData.username = profileDisplayName;
                            userData.accounts = userData.accounts.map(acc =>
                                acc.id === $selectedAccountId
                                    ? { ...acc, salary: typeof profileSalary === "number" ? profileSalary : Number(profileSalary) }
                                    : acc
                            );
                            showProfileModal = false;
                            reloadTrigger.update((n) => n + 1);
                        } catch (e) {
                            alert("Error al guardar los cambios");
                        }
                    }
                }}
                class="flex flex-col gap-4"
            >
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Cuenta</span>
                    </div>
                    <select
                        class="select select-bordered w-full"
                        bind:value={$selectedAccountId}
                        onchange={async (e) => {
                            const target = e.target as HTMLSelectElement | null;
                            if (target && userData) {
                                selectedAccountId.set(target.value);
                                const selectedAccount = userData.accounts.find(acc => acc.id === target.value);
                                if (selectedAccount) {
                                    profileSalary = selectedAccount.salary;
                                }
                                reloadTrigger.update((n) => n + 1);
                            }
                        }}
                    >
                        {#if userData}
                            {#each userData.accounts as account}
                                <option value={account.id}>{account.name}</option>
                            {/each}
                        {/if}
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
                        >Cancelar</button
                    >
                    <button type="submit" class="btn btn-primary"
                        >Guardar</button
                    >
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Modal Settings -->
{#if showSettingsModal}
    <div class="modal modal-open">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Configuración</h3>
            <label class="flex cursor-pointer gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <circle cx="12" cy="12" r="5" />
                    <path
                        d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
                    />
                </svg>
                <input
                    type="checkbox"
                    value="dark"
                    class="toggle theme-controller"
                    checked={theme === 'dark'}
                    onchange={handleThemeChange}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    ></path>
                </svg>
            </label>
            <div class="modal-action">
                <button class="btn" onclick={() => (showSettingsModal = false)}
                    >Cerrar</button
                >
            </div>
        </div>
    </div>
{/if}
