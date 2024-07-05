import Link from "next/link";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<div>
				Login, Auth(cookie), open doc, websocket, auth, error then blank,
				success then yjs
				<Link href="/login">
					<span className="text-blue-500 hover:underline m-4">登录</span>
				</Link>
			</div>
		</main>
	);
}
