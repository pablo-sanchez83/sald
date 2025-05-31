<script lang="ts">
    import { auth, db, user } from "$lib/firebase";
    import {
        createUserWithEmailAndPassword,
        GoogleAuthProvider,
        signInWithPopup,
    } from "@firebase/auth";
    import { doc, setDoc } from "@firebase/firestore";

    const reUsername = /^(?![._])[a-zA-Z0-9._]+(?<![._])$/;
    const reEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    let error = "";

    const data = {
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
    };
    $: isValidPassword = data.password?.length > 4 && data.password.length < 30;
    $: isTouchedPassword = data.password.length > 0;
    $: isEqualPassword = data.password === data.passwordConfirm;

    $: isValidUsername =
        data.username?.length > 4 &&
        data.username.length < 16 &&
        reUsername.test(data.username);
    $: isTouchedUsername = data.username.length > 0;

    $: isValidEmail = reEmail.test(data.email);
    $: isTouchedEmail = data.email.length > 0;

    async function signUpWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // The signed-in user info.
            const user = result.user;
            await setDoc(doc(db, "users", user.uid), {
                username: user.displayName,
                email: user.email,
                settings: {
                    theme: "light",
                    notifications: false,
                },
                createdAt: new Date(),
                salary: 0,
            });
            console.log("User signed in:", user);
        } catch (err) {
            console.error("Error signing in with Google:", err);
            error = "Error al registrarse con Google.";
        }
    }

    async function signUp() {
        try {
            // Validate form inputs
            if (
                !isValidUsername ||
                !isValidEmail ||
                !isValidPassword ||
                !isEqualPassword
            ) {
                error = "Por favor, completa todos los campos correctamente.";
                return;
            }

            const result = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password,
            );
            const user = result.user;
            await setDoc(doc(db, "users", user.uid), {
                username: data.username,
                email: data.email,
                settings: {
                    theme: "light",
                    notifications: false,
                },
                createdAt: new Date(),
                salary: 0,
            });
        } catch (err) {
            console.error("Error signing up:", err);
            error = "Error al crear la cuenta. Intenta con otro correo.";
        }
    }
</script>

{#if error}
    <div class="toast toast-end">
        <div class="alert alert-error">
            <span>{error}</span>
        </div>
    </div>
{/if}
{#if $user}
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div
            class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center"
        >
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
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
            <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
                Crear cuenta
            </h1>
            <form class="space-y-4" on:submit|preventDefault={signUp}>
                <input
                    type="text"
                    placeholder="Username (5-15 letras/números, puede usar . o _)"
                    class="input w-full"
                    bind:value={data.username}
                    class:input-error={!isValidUsername && isTouchedUsername}
                    class:input-success={isValidUsername}
                />
                <input
                    type="text"
                    placeholder="Email válido (ej: usuario@email.com)"
                    class="input w-full"
                    bind:value={data.email}
                    class:input-error={!isValidEmail && isTouchedEmail}
                    class:input-success={isValidEmail}
                />
                <input
                    type="password"
                    placeholder="Contraseña (5-29 caracteres)"
                    class="input w-full"
                    bind:value={data.password}
                    class:input-error={!isValidPassword && isTouchedPassword}
                    class:input-success={isValidPassword}
                />
                <input
                    type="password"
                    placeholder="Confirmar Contraseña"
                    class="input w-full"
                    bind:value={data.passwordConfirm}
                    class:input-error={!isEqualPassword &&
                        !isValidPassword &&
                        isTouchedPassword}
                    class:input-success={isEqualPassword && isValidPassword}
                />
                <p class="text-red-500 text-sm mt-2">{error}</p>
                <button
                    class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
                    type="submit"
                >
                    Crear cuenta
                </button>
            </form>

            <a href="/login" class="btn btn-soft btn-xs mt-1.5">
                Ya tienes cuenta? Inicia sesión
            </a>
            <div class="flex items-center my-4">
                <div class="flex-grow h-px bg-gray-300"></div>
                <span class="mx-2 text-gray-400 text-sm">o</span>
                <div class="flex-grow h-px bg-gray-300"></div>
            </div>
            <button class="btn btn-primary w-full" on:click={signUpWithGoogle}
                >Continuar con Google</button
            >
        </div>
    </div>
{/if}
