interface ILayout {
	children: React.ReactNode;
}
export default function LoggedOutLayout({ children }: ILayout) {
	return (
		<div className="flex flex-col justify-center items-center p-16 min-h-screen">
			{children}
		</div>
	);
}
