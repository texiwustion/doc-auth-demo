"use client";

import { useEffect, useRef } from "react";
import { Doc } from "yjs";
import withAuth from "@/hocs/withAuth";

interface IDocumentPage {
	params: {
		id: string;
	};
	ydoc: Doc;
}
const DocumentPage = ({ params, ydoc }: IDocumentPage) => {
	const { id } = params;

	const AuthedDocument = withAuth(Document, id);
	return <AuthedDocument id={id} />;
};

interface IDocument {
	id: string;
}
export function Document({ id }: IDocument) {
	return (
		<div>
			<h1>Document {id}</h1>
			<div>content</div>
		</div>
	);
}

export default DocumentPage;
