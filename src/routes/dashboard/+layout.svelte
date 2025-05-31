<!-- ...existing code... -->
<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';
    import { Menu, Home, Settings, User } from 'lucide-svelte';

    let { data, children }: { data: LayoutData, children: Snippet } = $props();

    let isOpen = $state(true);

    function toggleSidebar() {
        isOpen = !isOpen;
    }
</script>

<!-- ...existing code... -->
<div class="flex h-screen">
    <!-- Sidebar -->
    <nav class={`transition-all duration-300 bg-base-200 p-4 ${isOpen ? 'w-64' : 'w-16'} flex flex-col justify-between`}>
        <!-- Top: Dashboard -->
        <ul class="menu p-0">
            <li>
                <a class="flex items-center gap-2 tooltip" data-tip="Dashboard">
                    <Home class="h-6 w-6" />
                    {#if isOpen}<span>Dashboard</span>{/if}
                </a>
            </li>
        </ul>

        <!-- Bottom: Settings, Profile y Toggle -->
        <div>
            <ul class="menu p-0 mb-2">
                <li>
                    <a class="flex items-center gap-2 tooltip" data-tip="Settings">
                        <Settings class="h-6 w-6" />
                        {#if isOpen}<span>Settings</span>{/if}
                    </a>
                </li>
                <li>
                    <a class="flex items-center gap-2 tooltip" data-tip="Profile">
                        <User class="h-6 w-6" />
                        {#if isOpen}<span>Profile</span>{/if}
                    </a>
                </li>
                <li>
                    <button class="flex items-center gap-2" aria-label="Toggle sidebar" onclick={toggleSidebar}>
                        <Menu class="h-6 w-6" />
                    </button>
                </li>
            </ul>
        </div>
    </nav>

    <!-- Main content -->
    <div class="flex-1 p-4 overflow-auto bg-base-100">
        {@render children()}
    </div>
</div>
<!-- ...existing code... -->