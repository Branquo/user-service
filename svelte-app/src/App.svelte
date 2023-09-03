<script>
	// imports
	import axios from "axios";
	import Admin from "./Admin.svelte";
	import User from "./User.svelte";

	// init variables
	let username = "";
	let password = "";
	const PORT = 3000;

	// check if auth
	let authenticated = !!localStorage.getItem("userToken"); // "falsy"

	// retrieve role from localStorage (set happens upon login)
	let role = localStorage.getItem("role");

	async function handleLogin() {
		try {
			// POST request to login endpoint (server.js)
			const response = await axios.post(
				`http://localhost:${PORT}/login`,
				{
					username,
					password,
				}
			);

			// extract token, user role and id
			const token = response.data.token;
			const userRole = response.data.role;
			const userId = response.data.id;

			// store token, role and id
			localStorage.setItem("userToken", token);
			localStorage.setItem("role", userRole);
			localStorage.setItem("userId", userId);
			role = userRole; // update role variable

			authenticated = true;
		} catch (error) {
			console.error("Error logging in:", error);
			// TODO: notify user about error
		}
	}

	async function handleLogout() {
		const token = localStorage.getItem("userToken");

		try {
			// notify server to blacklist token
			await axios.post(
				`http://localhost:${PORT}/logout`,
				{},
				{
					headers: {
						"X-API-TOKEN": localStorage.getItem("userToken"),
					},
				}
			);

			// remove token and role from local storage
			localStorage.removeItem("userToken");
			localStorage.removeItem("role");

			// set authenticated to false
			authenticated = false;
		} catch (error) {
			console.error("Error during logout:", error);
			// TODO: notify user about error
		}
	}

	async function validateTokenOnLoad() {
		try {
			const token = localStorage.getItem("userToken");
			if (token) {
				const response = await axios.get(
					`http://localhost:${PORT}/users`,
					{
						headers: {
							"X-API-TOKEN": token,
						},
					}
				);
				// Token is valid.
				authenticated = true;
			}
		} catch (error) {
			// Token is invalid
			authenticated = false;
			localStorage.removeItem("userToken");
			localStorage.removeItem("role");
		}
	}

	validateTokenOnLoad();
</script>

{#if authenticated}
	<button on:click={handleLogout}>Logout</button>
	{#if role === "admin"}
		<Admin />
	{:else}
		<User />
	{/if}
{:else}
	<main>
		<h1>User Service Login</h1>

		<form on:submit|preventDefault={handleLogin}>
			<div>
				<label for="username">Username:</label>
				<input
					type="text"
					bind:value={username}
					id="username"
					required
				/>
			</div>

			<div>
				<label for="password">Password:</label>
				<input
					type="password"
					bind:value={password}
					id="password"
					required
				/>
			</div>

			<button type="submit">Login</button>
		</form>
	</main>
{/if}
