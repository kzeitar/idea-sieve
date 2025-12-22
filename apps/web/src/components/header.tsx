import { Link } from "@tanstack/react-router";

import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function Header() {
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/ideas", label: "Ideas" },
		{ to: "/ideas/new", label: "New Idea" },
		{ to: "/frameworks", label: "Frameworks" },
	] as const;

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
				<div className="flex items-center gap-4 md:gap-6">
					<Link to="/" className="flex items-center gap-2">
						<span className="hidden font-bold text-lg sm:inline-block">
							Idea Sieve
						</span>
					</Link>
					<Separator orientation="vertical" className="hidden h-6 sm:block" />
					<nav className="flex items-center gap-1 md:gap-2">
						{links.map(({ to, label }) => {
							return (
								<Link key={to} to={to} activeOptions={{ exact: to !== "/" }}>
									{({ isActive }) => (
										<Button variant={isActive ? "default" : "ghost"} size="sm">
											{label}
										</Button>
									)}
								</Link>
							);
						})}
					</nav>
				</div>
				<div className="flex items-center gap-2">
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
