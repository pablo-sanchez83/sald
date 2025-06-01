import { writable, derived } from "svelte/store";
import { user } from "$lib/firebase";

// Store para el ID de la cuenta seleccionada
export const selectedAccountId = writable<string>("cuenta1");

// Store para el estado de carga
export const isLoading = writable<boolean>(false);

// Store derivado para el usuario actual
export const currentUser = derived(user, ($user) => $user);

// Function to initialize the account store
let unsubscribe: (() => void) | null = null;

function initializeAccountStore() {
    // Clear any existing subscription
    if (unsubscribe) {
        unsubscribe();
    }

    isLoading.set(true);
    unsubscribe = user.subscribe(async ($user) => {
        try {
            if ($user) {
                selectedAccountId.set("cuenta1");
            }
            isLoading.set(false);
        } catch (error) {
            console.error('Error in account store subscription:', error);
            isLoading.set(false);
        }
    });
}

// Limpieza al destruir el store
export const destroyAccountStore = () => {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
};

// Inicializar el store cuando se importa
initializeAccountStore();

// Cleanup when module is unloaded
export const cleanup = () => {
    destroyAccountStore();
};