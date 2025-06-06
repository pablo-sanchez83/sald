<script lang="ts">
    import type { Snippet } from "svelte";
    import type { LayoutData } from "./$types";
    import {
        Menu,
        Home,
        Settings,
        User,
        Table,
        PiggyBank,
    } from "lucide-svelte";
    import type { UserData } from "$lib/types";
    import { db, user, auth } from "$lib/firebase";
    import { doc, getDoc, updateDoc } from "firebase/firestore";
    import { reloadTrigger } from "$lib/reload";
    import { goto } from "$app/navigation";
    import { selectedAccountId } from "$lib/accountStore";

    let { data, children }: { data: LayoutData; children: Snippet } = $props();

    let isOpen = $state(false);

    function toggleSidebar() {
        isOpen = !isOpen;
    }

    let mobileMenuOpen = $state(false);

    selectedAccountId.subscribe((value) => ($selectedAccountId = value));

    let theme: "light" | "dark" = $state("light");
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
                if (!user) goto("/login");
            }, 2500);
        }
    });

    function initializeProfileModal() {
        if (!hasInitialized && userData) {
            const selectedAccount = userData.accounts.find(
                (acc) => acc.id === $selectedAccountId,
            );
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
            theme = userData.settings?.theme || "light";
        }
    });

    async function handleThemeChange(event: Event) {
        const checked = (event.target as HTMLInputElement).checked;
        theme = checked ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);

        if (userData && $user) {
            try {
                const userDoc = doc(db, "users", $user.uid);
                await updateDoc(userDoc, {
                    "settings.theme": theme,
                });
                userData.settings.theme = theme;
            } catch (e) {
                alert("Error al guardar el tema");
            }
        }
    }

    $effect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    });

    async function fetchUserData() {
        try {
            const docRef = doc(db, "users", $user ? $user.uid : "");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                userData = docSnap.data() as UserData;
                let selectedAccount = null;
                if (userData && userData.accounts) {
                    selectedAccount = userData.accounts.find(
                        (acc) => acc.id === $selectedAccountId,
                    );
                }
                if (selectedAccount && !selectedAccount.transactions) {
                    selectedAccount.transactions = [];
                }
                if (
                    userData &&
                    userData.settings &&
                    userData.settings.theme === "dark"
                ) {
                    document.documentElement.setAttribute("data-theme", "dark");
                    isDarkTheme = true;
                } else {
                    document.documentElement.setAttribute(
                        "data-theme",
                        "light",
                    );
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
        class={`fixed top-2 left-0 h-full z-30 transition-all duration-300 border-r ${isOpen ? "w-64 px-4" : "w-16 px-2"} md:flex flex-col justify-between hidden`}
    >
        <!-- Arriba: enlaces -->
        <div>
            <ul class="menu p-0 mb-2">
                <li>
                    <a
                        href="/dashboard"
                        data-tip="Panel de control"
                        class="flex items-center gap-2 tooltip tooltip-right"
                        class:tooltip={!isOpen}
                    >
                        <Home class="h-6 w-6 text-base-content" />
                        {#if isOpen}<span>Panel de control</span>{/if}
                    </a>
                </li>
                <li>
                    <a
                        href="/dashboard/table"
                        data-tip="Tabla de transacciones"
                        class="flex items-center gap-2 tooltip tooltip-right"
                        class:tooltip={!isOpen}
                    >
                        <Table class="h-6 w-6 text-base-content" />
                        {#if isOpen}<span>Tabla de transacciones</span>{/if}
                    </a>
                </li>
                <li>
                    <a
                        href="/dashboard/budgets"
                        data-tip="Presupuestos"
                        class="flex items-center gap-2 tooltip tooltip-right"
                        class:tooltip={!isOpen}
                    >
                        <PiggyBank class="h-6 w-6 text-base-content" />
                        {#if isOpen}<span>Presupuestos</span>{/if}
                    </a>
                </li>
            </ul>
        </div>

        <!-- Abajo: select, settings, profile, toggle -->
        <div>
            <ul class="menu p-0 mb-2">
                {#if userData && userData.accounts && userData.accounts.length > 0}
                    <li></li>
                {/if}
                <li>
                    <button
                        class="flex items-center gap-2 tooltip tooltip-right"
                        data-tip="Ajustes"
                        onclick={() => (showSettingsModal = true)}
                        class:tooltip={!isOpen}
                    >
                        <Settings class="h-6 w-6 text-base-content" />
                        {#if isOpen}<span>Ajustes</span>{/if}
                    </button>
                </li>
                <li>
                    <button
                        class="flex items-center gap-2 tooltip tooltip-right"
                        data-tip="Perfil"
                        onclick={() => (showProfileModal = true)}
                        class:tooltip={!isOpen}
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
                <!-- Opciones a la izquierda -->
                <ul class="menu p-2 flex flex-col gap-2">
                    <li>
                        <a
                            href="/dashboard"
                            onclick={() => (mobileMenuOpen = false)}
                        >
                            <Home class="h-5 w-5" /> Panel de control
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/table"
                            onclick={() => (mobileMenuOpen = false)}
                        >
                            <Table class="h-5 w-5" /> Tabla de transacciones
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/budgets"
                            onclick={() => (mobileMenuOpen = false)}
                        >
                            <PiggyBank class="h-5 w-5" /> Presupuestos
                        </a>
                    </li>
                </ul>
                <!-- Opciones a la derecha -->
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
                                accounts: userData.accounts.map((acc) =>
                                    acc.id === $selectedAccountId
                                        ? {
                                              ...acc,
                                              salary:
                                                  typeof profileSalary ===
                                                  "number"
                                                      ? profileSalary
                                                      : Number(profileSalary),
                                          }
                                        : acc,
                                ),
                            });
                            userData.username = profileDisplayName;
                            userData.accounts = userData.accounts.map((acc) =>
                                acc.id === $selectedAccountId
                                    ? {
                                          ...acc,
                                          salary:
                                              typeof profileSalary === "number"
                                                  ? profileSalary
                                                  : Number(profileSalary),
                                      }
                                    : acc,
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
                                const selectedAccount = userData.accounts.find(
                                    (acc) => acc.id === target.value,
                                );
                                if (selectedAccount) {
                                    profileSalary = selectedAccount.salary;
                                }
                                reloadTrigger.update((n) => n + 1);
                            }
                        }}
                    >
                        {#if userData}
                            {#each userData.accounts as account}
                                <option value={account.id}
                                    >{account.name}</option
                                >
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
                <div class="modal-action w-full">
                    <button
                        class="btn btn-error justify-start"
                        type="button"
                        onclick={() => {
                            auth.signOut()
                            document.documentElement.setAttribute(
                                "data-theme",
                                "light",
                            );
                            goto("/");
                        }}
                    >
                        Cerrar sesión
                    </button>
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
                    checked={theme === "dark"}
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
