<script>
    import axios from "axios";

    let users = [];
    let username = "";
    let password = "";
    let role = "ordinary";
    const PORT = 3000;
    const BASE_URL = `http://localhost:${PORT}`;


    async function fetchUsers() {
        try {
            const response = await axios.get(`${BASE_URL}/users`, {
                headers: {
                    "X-API-TOKEN": localStorage.getItem("userToken"),
                },
            });
            users = response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    async function addUser() {
        try {
            await axios.post(
                `${BASE_URL}/users`,
                { username, password, role },
                {
                    headers: {
                        "X-API-TOKEN": localStorage.getItem("userToken"),
                    },
                }
            );
            fetchUsers();
        } catch (error) {
            console.error("Error adding user:", error);
        }
    }

    async function deleteUser(user) {
        try {
            await axios.delete(`${BASE_URL}/users/${user.id}`, {
                headers: {
                    "X-API-TOKEN": localStorage.getItem("userToken"),
                },
            });

            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }

    async function updateUserPassword(user) {
        if (!user.newPassword) {
            alert("Please enter a new password.");
            return;
        }

        try {
            await axios.put(
                `${BASE_URL}/users/${user.id}/password`,
                { newPassword: user.newPassword },
                {
                    headers: {
                        "X-API-TOKEN": localStorage.getItem("userToken"),
                    },
                }
            );
            alert("Password updated successfully!");
        } catch (error) {
            console.error("Error updating user password:", error);
        }
    }

    fetchUsers();
</script>

<div>
    <h2>Admin Panel</h2>

    <div>
        <h3>Add User</h3>
        <input bind:value={username} placeholder="Username" />
        <input type="password" bind:value={password} placeholder="Password" />
        <select bind:value={role}>
            <option value="ordinary">Ordinary</option>
            <option value="admin">Admin</option>
        </select>
        <button on:click={addUser}>Add User</button>
    </div>

    <h3>All Users</h3>
    <ul>
        {#each users as user (user.username)}
            <li>
                {user.id}
                {user.username} ({user.role})
                <input
                    type="password"
                    placeholder="New Password"
                    bind:value={user.newPassword}
                />
                <button on:click={() => updateUserPassword(user)}
                    >Change Password</button
                >
                <button on:click={() => deleteUser(user)}>Delete user</button>
            </li>
        {/each}
    </ul>
</div>
