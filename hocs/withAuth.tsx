"use client";

import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

const withAuth = <P extends object>(
	WrappedComponent: React.ComponentType<P>,
	id: string
) => {
	const WithAuth = (props: P) => {
		const [isAuthenticated, setIsAuthenticated] = useState(true); // TODO: 默认认为是通过鉴权的, 但会导致无权用户出现 true -> false 的闪
		const [isLoading, setIsLoading] = useState<boolean>(true);

		const handleWebSocketError = () => {
			setIsAuthenticated(false);
		};

		const ydoc = new Y.Doc();
		// TODO: websocket连接
		const provider = new WebsocketProvider(
			`ws://your-websocket-server/${id}`,
			id as string,
			ydoc,
			{
				params: {
					auth: "cookie", // 可以通过添加其他参数来进行鉴权，例如从Cookie中获取token
				},
				WebSocketPolyfill: WebSocket, // 如果需要
			}
		);

		provider.on("connect", (event: any) => {
			setIsLoading(false);
		});
		provider.on("status", (event: any) => {
			console.log(event.status); // logs "connected" or "disconnected"
		});

		provider.on("sync", (isSynced: boolean) => {
			if (isSynced) {
				console.log("Document synced successfully");
			}
		});

		provider.on("connection-close", (event: any) => {
			console.error("WebSocket connection closed", event);
			// TODO: handle close
			handleWebSocketError();
		});

		provider.on("connection-error", (event: any) => {
			console.error("WebSocket connection error", event);
			handleWebSocketError();
		});

		useEffect(() => {
			// 这里不做显式的鉴权检查，而是通过WebSocket连接进行鉴权
			return () => {
				provider.destroy();
				ydoc.destroy();
			};
		}, []);

		if (isAuthenticated && isLoading) return <div>loading...</div>;
		return isAuthenticated ? (
			<WrappedComponent {...props} />
		) : (
			<div>
				您无权查看此文档! 点此
				<Link href="/document">
					<span style={{ color: "blue" }}>离开</span>
				</Link>
			</div>
		);
	};

	return WithAuth;
};

export default withAuth;
