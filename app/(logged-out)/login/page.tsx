"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		const res = await fetch("http://localhost:8000/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
			credentials: "include", // 允许携带cookie
		});

		if (res.ok) {
			router.push("/document");
		} else {
			alert("Login failed");
		}
	};

	return (
		<form
			onSubmit={handleLogin}
			className="flex flex-col items-center justify-center gap-4"
		>
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
			<button type="submit">Login</button>
		</form>
	);
};

export default Login;
