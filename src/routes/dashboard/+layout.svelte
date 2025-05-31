<script lang="ts">
    import type { Snippet } from "svelte";
    import type { LayoutData } from "./$types";
    import { Menu, Home, Settings, User } from "lucide-svelte";
    import type { UserData } from "$lib/types";
    import { db, user } from "$lib/firebase";
    import { doc, getDoc, updateDoc } from "firebase/firestore";
    import { reloadTrigger } from "$lib/reload";
    import { goto } from '$app/navigation';

    let { data, children }: { data: LayoutData; children: Snippet } = $props();

    let isOpen = $state(true);

    function toggleSidebar() {
        isOpen = !isOpen;
    }

    let theme: 'light' | 'dark' = $state('light');

    let userData: UserData | null;
    let showProfileModal = $state(false);
    let showSettingsModal = $state(false);
    let profileDisplayName = $state("");
    let profileSalary: number = $state(0);

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

    $effect(() => {
        if (showProfileModal && userData) {
            profileDisplayName = userData.username;
            profileSalary = userData.salary;
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
                if (!userData.transactions) {
                    userData.transactions = [];
                }
                if (userData.settings.theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                    document.documentElement.setAttribute('data-theme', 'light');
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
        class={`transition-all duration-300 border-base-400 bg-base-300 ${isOpen ? "w-64 px-4" : "w-16 px-2"} flex flex-col justify-between`}
    >
        <!-- Top: Dashboard -->
        <ul class="menu p-0">
            <li>
                <button
                    class="flex items-center gap-2 tooltip"
                    data-tip="Dashboard"
                >
                    <Home class="h-6 w-6" />
                    {#if isOpen}<span>Dashboard</span>{/if}
                </button>
            </li>
        </ul>

        <!-- Bottom: Settings, Profile y Toggle -->
        <div>
            <ul class="menu p-0 mb-2">
                <li>
                    <button
                        class="flex items-center gap-2 tooltip"
                        data-tip="Settings"
                        onclick={() => (showSettingsModal = true)}
                    >
                        <Settings class="h-6 w-6" />
                        {#if isOpen}<span>Settings</span>{/if}
                    </button>
                </li>
                <li>
                    <button
                        class="flex items-center gap-2 tooltip"
                        data-tip="Profile"
                        onclick={() => (showProfileModal = true)}
                    >
                        <User class="h-6 w-6" />
                        {#if isOpen}<span>Profile</span>{/if}
                    </button>
                </li>
                <li>
                    <button
                        class="flex items-center gap-2"
                        aria-label="Toggle sidebar"
                        onclick={toggleSidebar}
                    >
                        <Menu class="h-6 w-6" />
                    </button>
                </li>
            </ul>
        </div>
    </nav>

    <!-- Main content -->
    <div class="flex-1 bg-base-200">
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
                                // Only update fields that exist in UserData
                                username: profileDisplayName,
                                salary:
                                    typeof profileSalary === "number"
                                        ? profileSalary
                                        : Number(profileSalary),
                            });
                            userData.username = profileDisplayName;
                            userData.salary =
                                typeof profileSalary === "number"
                                    ? profileSalary
                                    : Number(profileSalary);
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
