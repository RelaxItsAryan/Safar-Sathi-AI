import React, { useState } from "react";
import "../App.css";
import "../index.css";

const navLinks = [
	{ name: "Home", href: "#home" },
	{ name: "About", href: "#about" },
	{ name: "Services", href: "#services" },
	{ name: "Contact", href: "#contact" },
];

export default function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	return (
		<nav className="fabulous-navbar">
			<div className="navbar-logo">
				<span className="logo-gradient">SafarSaathi</span>
			</div>
			<div className={`navbar-links ${menuOpen ? "open" : ""}`} style={menuOpen ? { zIndex: 50 } : {}}>
				{navLinks.map((link) => (
					<a
						key={link.name}
						href={link.href}
						className="nav-link"
						onClick={() => setMenuOpen(false)}
					>
						{link.name}
					</a>
				))}
	            <div className="navbar-auth-buttons">
	                <button className="auth-btn signup-btn">Sign Up</button>
	                <button className="auth-btn login-btn">Login</button>
	            </div>
			</div>
			<div
				className={`navbar-burger ${menuOpen ? "open" : ""}`}
				onClick={() => setMenuOpen((v) => !v)}
				aria-label="Toggle menu"
				tabIndex={0}
				role="button"
			>
				<span />
				<span />
				<span />
			</div>
			<div className={`navbar-bg-blob ${menuOpen ? "open" : ""}`}></div>
		</nav>
	);
}
