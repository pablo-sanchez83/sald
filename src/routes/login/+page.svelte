<script lang="ts">
    import { goto } from "$app/navigation";
    import { auth, db, user } from "$lib/firebase";
    import {
    createUserWithEmailAndPassword,
        GoogleAuthProvider,
        signInWithPopup,
    } from "@firebase/auth";
    import { doc, setDoc } from "@firebase/firestore";

    const reUsername = /^(?![._])[a-zA-Z0-9._]+(?<![._])$/;
    const reEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

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

    async function signInWithGoogle() {
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
            });
            console.log("User signed in:", user);
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    }

    async function signIn() {
        try {
            const result = await createUserWithEmailAndPassword(auth, data.email, data.password)
            const user = result.user;
            await setDoc(doc(db, "users", user.uid), {
                    username: data.username,
                    email: data.email,
                    settings: {
                        theme: "light",
                        notifications: false,
                    },
                    createdAt: new Date(),
        });
        } catch(error) {
            console.error("Error signing up:", error);
            // ..
        }
    }
</script>
{#if $user}
    {goto("/")}
{:else}
    <div class="min-h-screen flex items-center justify-center bg-gray-100" >
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
            Iniciar sesión
        </h1>
        <div class="space-y-4">
            <input
                type="text"
                placeholder="Username"
                class="input w-full"
                bind:value={data.username}
                class:input-error={!isValidUsername && isTouchedUsername}
                class:input-success={isValidUsername}
            />
            <input
                type="text"
                placeholder="Email"
                class="input w-full"
                bind:value={data.email}
                class:input-error={!isValidEmail && isTouchedEmail}
                class:input-success={isValidEmail}
            />
            <input
                type="password"
                placeholder="Contraseña"
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
        </div>
        <button
            class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
            type="button"
            on:click="{signIn}"
        >
            Iniciar sesión
        </button>
        <div class="flex items-center my-4">
            <div class="flex-grow h-px bg-gray-300"></div>
            <span class="mx-2 text-gray-400 text-sm">o</span>
            <div class="flex-grow h-px bg-gray-300"></div>
        </div>
        <button class="btn btn-primary" on:click={signInWithGoogle}
            >Sign in with Google</button>
    </div>
</div>
{/if}
