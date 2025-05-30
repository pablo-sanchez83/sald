<script lang="ts">
  import { db, user } from "$lib/firebase";
  import type { UserData } from "$lib/types";
  import { doc, getDoc } from "firebase/firestore";
  import { onMount } from "svelte";

  let userData;

  $: if ($user) {
    fetchUserData();
  }

  async function fetchUserData() {
    try {
      const docRef = doc(db, "users", $user ? $user.uid : "");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        userData = docSnap.data() as UserData;
        console.log("User data fetched successfully:", userData);
      } else {
        console.error("No such document!");
        userData = null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
</script>