"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

const documents = [
	{ id: "1", title: "Document 1" },
	{ id: "2", title: "Document 2" },
	{ id: "3", title: "Document 3" },
	// 添加更多文档
];

const Documents = () => {
	const router = useRouter();

	return (
		<div>
			<h1 className="text-4xl underline m-4">Documents</h1>
			<ul className="w-full flex justify-center items-center flex-col gap-4">
				{documents.map(doc => (
					<li
						key={doc.id}
						className="text-2xl border-slate-500 rounded-sm border-2"
					>
						<Link href={`/document/${doc.id}`}>{doc.title}</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Documents;
