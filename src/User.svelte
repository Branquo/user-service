<script>
    import axios from "axios";

    let users = [];
    let newPassword = "";
    const PORT = 3000;

    async function fetchUsers() {
        try {
            const response = await axios.get(`http://localhost:${PORT}/users`, {
                headers: {
                    "X-API-TOKEN": localStorage.getItem("userToken"),
                },
            });
            users = response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    async function updatePassword() {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                throw new Error("User ID is missing.");
            }
            await axios.put(
                `http://localhost:${PORT}/users/password`,
                { newPassword: newPassword },
                {
                    headers: {
                        "X-API-TOKEN": localStorage.getItem("userToken"),
                    },
                }
            );
            alert("Password updated successfully!");
        } catch (error) {
            console.error("Error updating password:", error);
        }
    }

    fetchUsers();
</script>

<div>
    <h2>User Panel</h2>

    <h3>All Users</h3>
    <ul>
        {#each users as user (user.username)}
            <li>{user.username} ({user.role})</li>
        {/each}
    </ul>

    <div>
        <h3>Update Password</h3>
        <input
            type="password"
            bind:value={newPassword}
            placeholder="New Password"
        />
        <button on:click={updatePassword}>Update Password</button>
    </div>
</div>
