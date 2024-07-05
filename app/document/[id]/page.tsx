"use client";

import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

import { EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import {
    syntaxHighlighting,
    defaultHighlightStyle,
} from "@codemirror/language";
import { yCollab } from "y-codemirror.next";

export default function Page({ params }: { params: { id: string } }) {
    return <DataProvider id={params.id} />;
}

function DataProvider({ id }: { id: string }) {
    const [ydoc, setYdoc] = useState<Y.Doc | undefined>(undefined);
    const [provider, setProvider] = useState<WebsocketProvider | undefined>(
        undefined
    );
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        const doc = new Y.Doc();

        const provider = new WebsocketProvider(
            "ws://localhost:8000",
            "ws",
            doc,
            { disableBc: true }
        );

        provider.awareness.setLocalStateField("user", {
            name: "Anonymous " + Math.floor(Math.random() * 100),
            color: "#ffffff",
            colorLight: "#000000",
        });

        setYdoc(doc);
        setProvider(provider);

        provider.on("connection-error", () => {
            setAuth(false);
        });

        provider.on("status", (event: { status: string }) => {
            if (event.status == "connected") {
                setAuth(true);
            }
        });
    }, []);

    {
        return auth ? (
            ydoc && provider && (
                <DocRenderer provider={provider} ydoc={ydoc} type={id} />
            )
        ) : (
            <>Unable to join</>
        );
    }
}

function DocRenderer({
    provider,
    ydoc,
    type,
}: {
    provider: WebsocketProvider;
    ydoc: Y.Doc;
    type: string;
}) {
    useEffect(() => {
        const ytext = ydoc.getText(type);
        const undoManager = new Y.UndoManager(ytext);

        const state = EditorState.create({
            doc: ytext.toString(),
            extensions: [
                javascript(),
                syntaxHighlighting(defaultHighlightStyle),
                yCollab(ytext, provider.awareness, { undoManager }),
            ],
        });

        const view = new EditorView({
            state,
            parent: document.querySelector("#editor") ?? undefined,
        });

        return () => {
            view.destroy();
            provider.disconnect();
        };
    }, []);

    return <div id="editor"></div>;
}
