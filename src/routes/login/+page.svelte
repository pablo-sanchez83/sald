<script lang="ts">
    import { goto } from "$app/navigation";
    import { auth, db, user } from "$lib/firebase";
    import {
        GoogleAuthProvider,
        signInWithEmailAndPassword,
        signInWithPopup,
    } from "@firebase/auth";
    import { doc, getDoc } from "@firebase/firestore";

    const data = {
        email: "",
        password: "",
    };

    let errorMessage: string = "";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                const user = result.user;
                await getDoc(doc(db, "users", user.uid));
                goto("/dashboard");
            } else {
                const result_v2 = await signInWithPopup(auth, provider);
                const user = result_v2.user;
                await getDoc(doc(db, "users", user.uid));
                goto("/dashboard");
            }
            console.log("User signed in:", user);
        } catch (error) {
            console.error("Error signing in with Google:", error);
            errorMessage = "Error al iniciar sesión con Google.";
        }
    }

    async function signIn() {
        try {
            const result = await signInWithEmailAndPassword(auth, data.email, data.password)
            const user = result.user;
            await getDoc(doc(db, "users", user.uid));
            goto("/dashboard");
        } catch(error) {
            console.error("Error signing up:", error);
            errorMessage = "Email o contraseña incorrectos.";
        }
    }
</script>

{#if errorMessage}
<div class="toast toast-end">
  <div class="alert alert-error">
    <span>{errorMessage}</span>
  </div>
</div>
{/if}
{#if $user}
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
            <h2 class="text-xl font-semibold mb-4">Ya has iniciado sesión</h2>
            <button
                class="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
                type="button"
                on:click={() => auth.signOut()}
            >
                Cerrar sesión
            </button>
        </div>
    </div>
{:else}
    <div class="min-h-screen flex items-center justify-center bg-gray-100" >
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
            Iniciar sesión
        </h1>
        <div class="space-y-4">
            <input
                type="text"
                placeholder="Email"
                class="input w-full"
                bind:value={data.email}
            />
            <input
                type="password"
                placeholder="Contraseña"
                class="input w-full"
                bind:value={data.password}
            />
        </div>
        <button
            class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
            type="button"
            on:click="{signIn}"
        >
            Iniciar sesión
        </button>
        <a href="/signup" class="btn btn-soft btn-xs mt-1.5">
            No tienes cuenta? Crea una
        </a>
        <div class="flex items-center my-4">
            <div class="flex-grow h-px bg-gray-300"></div>
            <span class="mx-2 text-gray-400 text-sm">o</span>
            <div class="flex-grow h-px bg-gray-300"></div>
        </div>
        <button class="btn btn-primary w-full" on:click={signInWithGoogle}
            >Continuar con Google</button>
    </div>
</div>
{/if}
