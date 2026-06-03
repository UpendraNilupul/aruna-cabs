import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

// ─── DATA ────────────────────────────────────────────────────────────────────

const SERVICES = [
    {
        title: "Airport Transfers",
        desc: "Seamless, punctual airport pick-up and drop-off across Sri Lanka.",
        features: ["Real-time Tracking", "Meet & Greet VIP", "24/7 Dispatch"],
        icon: "✈️",
        img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
    },
    {
        title: "Private Car Hire",
        desc: "Discrete and comfortable vehicles for your personal journeys.",
        features: ["Climate Control", "Vetted Chauffeurs", "Flexible Billing"],
        icon: "🚗",
        img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80",
    },
    {
        title: "Group Van Transit",
        desc: "Spacious luxury vans perfect for families and tour groups.",
        features: ["Up to 15 Passengers", "Dual AC Systems", "Extra Luggage Space"],
        icon: "🚐",
        img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
    },
    {
        title: "Luxury Coach Hire",
        desc: "Premium buses designed for corporate events and large tours.",
        features: ["Reclining Seats", "Onboard Entertainment", "Panoramic Windows"],
        icon: "🚌",
        img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80",
    },
    {
        title: "Freight & Movers",
        desc: "Secure goods transport with our modern lorry fleet.",
        features: ["Island-wide Logistics", "Multiple Capacities", "Cargo Insurance"],
        icon: "🚚",
        img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
    },
    {
        title: "Executive Travel",
        desc: "Top-tier transport tailored for business professionals.",
        features: ["Premium Fleet", "Non-Disclosure Signed", "Monthly Retainers"],
        icon: "💼",
        img: "https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=600&q=80",
    },
];

const FLEET_TABS = ["CARS", "VANS", "LORRIES", "BUSES"];

const FLEET = {
    CARS: [
        { name: "Wagon R - Mini", badge: "ECONOMY", seats: 4, bags: 2, ac: true, img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&q=80" },
        { name: "Alto - Micro", badge: "ECONOMY", seats: 4, bags: 1, ac: true, img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80" },
        { name: "Prius / Axio", badge: "EXECUTIVE", seats: 4, bags: 3, ac: true, img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80" },
    ],
    VANS: [
        { name: "Toyota KDH", badge: "PREMIUM", seats: 9, bags: 5, ac: true, img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80" },
        { name: "Super High Roof", badge: "PREMIUM", seats: 15, bags: 8, ac: true, img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80" },
    ],
    LORRIES: [
        { name: "Standard Cargo", badge: "FREIGHT", seats: 2, bags: 0, ac: false, img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&q=80" },
        { name: "Heavy Hauler", badge: "FREIGHT", seats: 2, bags: 0, ac: false, img: "https://images.unsplash.com/photo-1519003300449-424ad0405076?w=400&q=80" },
    ],
    BUSES: [
        { name: "Executive Mini (30)", badge: "TOUR", seats: 30, bags: 10, ac: true, img: "https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=400&q=80" },
        { name: "Luxury Coach (45)", badge: "VIP", seats: 45, bags: 20, ac: true, img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80" },
    ],
};

const WHY = [
    { icon: "🛡️", title: "Uncompromising Safety", desc: "Rigorous vehicle maintenance and strictly vetted professional chauffeurs." },
    { icon: "⚡", title: "Instant Dispatch", desc: "Our 24/7 command center ensures your ride is always just moments away." },
    { icon: "📍", title: "Border-to-Border", desc: "Complete island-wide coverage. Wherever you are, Aruna Cabs is there." },
    { icon: "💎", title: "Transparent Luxury", desc: "Premium service with upfront, fixed pricing. Zero hidden surge fees." },
];

// ─── STYLES (Modern Dark Theme) ────────────────────────────────────────────────
const S = {
    // Page Reset - Dark Mode Base
    page: { fontFamily: "'Inter', 'Segoe UI', sans-serif", margin: 0, padding: 0, color: "#F8FAFC", background: "#020617" },

    // NAV - Frosted Glass
    nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 80, background: "rgba(2, 6, 23, 0.7)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "sticky", top: 0, zIndex: 100 },
    logo: { display: "flex", alignItems: "center", gap: 12 },
    logoCircle: { width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #10B981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", color: "#020617", fontWeight: 900, fontSize: 10, textAlign: "center", lineHeight: 1.1, letterSpacing: 1 },
    navLinks: { display: "flex", gap: 36, listStyle: "none", margin: 0, padding: 0 },
    navLink: { color: "#94A3B8", textDecoration: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 },
    navLinkActive: { color: "#10B981", textDecoration: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 },
    navPhone: { display: "flex", alignItems: "center", gap: 8, color: "#F8FAFC", fontWeight: 600, fontSize: 15 },

    // Auth Buttons
    navLoginBtn: { background: "#10B981", color: "#020617", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", textDecoration: "none" },
    navRegBtn: { background: "transparent", color: "#10B981", border: "1px solid #10B981", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", textDecoration: "none", marginLeft: "12px" },
    navLogoutBtn: { background: "rgba(239, 68, 68, 0.1)", color: "#F87171", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 8, padding: "8px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "0.3s" },

    // HERO - Immersive Full Height
    hero: { position: "relative", minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", padding: "0 20px" },
    heroBg: { position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center" },
    heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(2,6,23,0.4), #020617)" },
    heroContent: { position: "relative", zIndex: 10, maxWidth: 800 },
    heroBadge: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 100, padding: "8px 24px", color: "#10B981", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 24 },
    heroTitle: { fontSize: 72, fontWeight: 900, color: "#fff", margin: "0 0 16px", letterSpacing: -1, lineHeight: 1.1 },
    heroDesc: { fontSize: 18, color: "#94A3B8", lineHeight: 1.6, margin: "0 auto 40px", maxWidth: 600 },
    heroBtns: { display: "flex", gap: 16, justifyContent: "center" },
    heroBtnPrimary: { padding: "16px 32px", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, border: "none", background: "#10B981", color: "#020617" },
    heroBtnOutline: { padding: "16px 32px", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", backdropFilter: "blur(8px)" },

    // GLOBAL SECTION STYLES
    section: { padding: "100px 60px", position: "relative" },
    sectionAlt: { padding: "100px 60px", background: "#0B1120" },
    sectionHeader: { textAlign: "center", marginBottom: 64 },
    chip: { display: "inline-block", color: "#10B981", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 },
    h2: { fontSize: 44, fontWeight: 800, color: "#fff", margin: "0 0 16px", letterSpacing: -0.5 },
    subText: { color: "#94A3B8", fontSize: 18, maxWidth: 600, margin: "0 auto" },

    // WHY CARDS
    whyGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 },
    whyCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 32, transition: "transform 0.3s" },
    whyIcon: { width: 56, height: 56, borderRadius: 12, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 24, color: "#10B981" },
    whyTitle: { fontSize: 18, fontWeight: 600, color: "#fff", margin: "0 0 12px" },
    whyDesc: { color: "#94A3B8", fontSize: 14, lineHeight: 1.7, margin: 0 },

    // SERVICE CARDS
    servGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 },
    servCard: { background: "#0F172A", borderRadius: 16, overflow: "hidden", border: "1px solid #1E293B" },
    servImgWrap: { position: "relative", height: 240 },
    servImg: { width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 },
    servImgOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, #0F172A 0%, transparent 100%)" },
    servBody: { padding: "0 32px 32px", position: "relative", top: -20 },
    servTitle: { fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 12px" },
    servDesc: { color: "#94A3B8", fontSize: 15, lineHeight: 1.6, margin: "0 0 24px" },
    servFeature: { display: "flex", alignItems: "center", gap: 12, color: "#CBD5E1", fontSize: 14, marginBottom: 12 },
    servCheck: { color: "#10B981", fontSize: 16, fontWeight: 900 },
    servBtn: { width: "100%", background: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 8, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 24 },

    // FLEET
    fleetTabs: { display: "flex", gap: 8, background: "#0F172A", borderRadius: 12, padding: 8, width: "fit-content", margin: "0 auto 48px", border: "1px solid #1E293B" },
    fleetTab: { padding: "12px 32px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#64748B", border: "none", background: "transparent", letterSpacing: 1 },
    fleetTabActive: { padding: "12px 32px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#020617", border: "none", background: "#10B981", letterSpacing: 1 },
    fleetGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 },
    fleetCard: { background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", position: "relative", padding: 24 },
    fleetBadge: { position: "absolute", top: 24, left: 24, background: "rgba(16, 185, 129, 0.15)", color: "#10B981", fontSize: 10, fontWeight: 800, borderRadius: 4, padding: "6px 12px", letterSpacing: 1 },
    fleetImgWrap: { height: 180, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 24, marginBottom: 16 },
    fleetImg: { maxHeight: "100%", maxWidth: "100%", objectFit: "contain", dropShadow: "0 20px 30px rgba(0,0,0,0.5)" },
    fleetName: { fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 16px", textAlign: "center" },
    fleetMetaWrapper: { background: "#0F172A", borderRadius: 8, padding: 16, display: "flex", justifyContent: "space-between", border: "1px solid #1E293B" },
    fleetMetaItem: { color: "#94A3B8", fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
    fleetMetaLabel: { color: "#475569", fontSize: 10, textTransform: "uppercase", fontWeight: 700 },

    // FOOTER CTA
    ctaBg: { background: "#064E3B", padding: "80px 60px", textAlign: "center", position: "relative", overflow: "hidden" },
    ctaTitle: { fontSize: 40, fontWeight: 800, color: "#fff", margin: "0 0 16px" },
    ctaDesc: { color: "#A7F3D0", fontSize: 18, margin: "0 auto 40px", maxWidth: 600 },
    ctaBtnPrimary: { padding: "16px 40px", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer", border: "none", background: "#fff", color: "#064E3B" },

    // FOOTER
    footer: { background: "#000", padding: "64px 60px 32px", color: "#64748B" },
    footerGrid: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", gap: 64, marginBottom: 64 },
    footerTitle: { color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 24, textTransform: "uppercase", letterSpacing: 1 },
    footerLink: { display: "block", color: "#94A3B8", textDecoration: "none", fontSize: 14, marginBottom: 16, cursor: "pointer" },
    footerDivider: { borderTop: "1px solid #1E293B", paddingTop: 32, display: "flex", justifyContent: "space-between", fontSize: 14 },

    revealHidden: { opacity: 0, transform: "translateY(40px)", transition: "opacity 0.8s ease-out, transform 0.8s ease-out" },
    revealVisible: { opacity: 1, transform: "translateY(0)" },
};

// ─── CUSTOM HOOK FOR SCROLL ANIMATIONS ───────────────────────────────────────
function useScrollReveal() {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    return { ref, isVisible };
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Navbar({ active, setActive }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={S.nav}>
            <div style={S.logo}>
                <div style={S.logoCircle}>
                    <span>ARUNA<br />CABS</span>
                </div>
                <div style={{ lineHeight: 1.2 }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: -0.5 }}>Aruna Cabs</div>
                    <div style={{ fontSize: 11, color: "#10B981", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>VIP Transport</div>
                </div>
            </div>

            <ul style={S.navLinks}>
                {["Home", "About", "Services", "Fleet", "Contact"].map(item => (
                    <li key={item}>
                        <span
                            style={active === item ? S.navLinkActive : S.navLink}
                            onClick={() => setActive(item)}
                        >
                            {item}
                        </span>
                    </li>
                ))}
            </ul>

            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                <div style={S.navPhone}>0766 221 422</div>

                <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)" }} />

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ color: '#10B981', fontWeight: 600, fontSize: 14 }}>
                            Welcome, {user.name}
                        </span>
                        <button onClick={handleLogout} style={S.navLogoutBtn}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Link to="/login" style={S.navLoginBtn}>Login</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

function Hero() {
    return (
        <section style={S.hero}>
            <div style={S.heroBg} />
            <div style={S.heroOverlay} />

            <div style={S.heroContent}>
                <div style={S.heroBadge}>✦ Premium Sri Lankan Transport ✦</div>
                <h1 style={S.heroTitle}>Arrive in Comfort.<br />Travel in Style.</h1>
                <p style={S.heroDesc}>
                    Experience Sri Lanka's most reliable and luxurious cab service. From seamless airport transfers to executive corporate hire, we redefine your journey.
                </p>
                <div style={S.heroBtns}>
                    <button style={S.heroBtnPrimary}>Reserve a Vehicle</button>
                    <button style={S.heroBtnOutline}>Explore Our Fleet</button>
                </div>
            </div>
        </section>
    );
}

function WhySection() {
    const { ref, isVisible } = useScrollReveal();
    return (
        <section ref={ref} style={{ ...S.sectionAlt, ...(isVisible ? S.revealVisible : S.revealHidden) }}>
            <div style={S.sectionHeader}>
                <div style={S.chip}>The Aruna Standard</div>
                <h2 style={S.h2}>Why Choose Us</h2>
                <p style={S.subText}>We deliver more than just a ride; we deliver peace of mind, punctuality, and uncompromising luxury.</p>
            </div>
            <div style={S.whyGrid}>
                {WHY.map(w => (
                    <div key={w.title} style={S.whyCard}>
                        <div style={S.whyIcon}>{w.icon}</div>
                        <h3 style={S.whyTitle}>{w.title}</h3>
                        <p style={S.whyDesc}>{w.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function ServicesSection() {
    const { ref, isVisible } = useScrollReveal();
    return (
        <section ref={ref} style={{ ...S.section, ...(isVisible ? S.revealVisible : S.revealHidden) }}>
            <div style={S.sectionHeader}>
                <div style={S.chip}>Expertise</div>
                <h2 style={S.h2}>Our Core Services</h2>
                <p style={S.subText}>Tailored transportation solutions designed to meet the highest standards of personal and corporate travel.</p>
            </div>
            <div style={S.servGrid}>
                {SERVICES.map(s => (
                    <div key={s.title} style={S.servCard}>
                        <div style={S.servImgWrap}>
                            <img src={s.img} alt={s.title} style={S.servImg} />
                            <div style={S.servImgOverlay} />
                        </div>
                        <div style={S.servBody}>
                            <h3 style={S.servTitle}>{s.title}</h3>
                            <p style={S.servDesc}>{s.desc}</p>
                            {s.features.map(f => (
                                <div key={f} style={S.servFeature}>
                                    <div style={S.servCheck}>✓</div>
                                    <span>{f}</span>
                                </div>
                            ))}
                            <button style={S.servBtn}>View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function FleetSection() {
    const [tab, setTab] = useState("CARS");
    const { ref, isVisible } = useScrollReveal();

    return (
        <section ref={ref} style={{ ...S.sectionAlt, ...(isVisible ? S.revealVisible : S.revealHidden) }}>
            <div style={S.sectionHeader}>
                <div style={S.chip}>Our Collection</div>
                <h2 style={S.h2}>Select Your Vehicle</h2>
                <p style={S.subText}>A meticulously maintained fleet ranging from executive sedans to luxury coaches.</p>
            </div>

            <div style={S.fleetTabs}>
                {FLEET_TABS.map(t => (
                    <button
                        key={t}
                        style={tab === t ? S.fleetTabActive : S.fleetTab}
                        onClick={() => setTab(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div style={S.fleetGrid}>
                {FLEET[tab].map(car => (
                    <div key={car.name} style={S.fleetCard}>
                        <div style={S.fleetBadge}>{car.badge}</div>
                        <div style={S.fleetImgWrap}>
                            <img src={car.img} alt={car.name} style={S.fleetImg} />
                        </div>
                        <h3 style={S.fleetName}>{car.name}</h3>

                        <div style={S.fleetMetaWrapper}>
                            <div style={S.fleetMetaItem}>
                                <span style={S.fleetMetaLabel}>Capacity</span>
                                <span style={{ color: "#fff", fontWeight: 600 }}>{car.seats} Seats</span>
                            </div>
                            <div style={S.fleetMetaItem}>
                                <span style={S.fleetMetaLabel}>Luggage</span>
                                <span style={{ color: "#fff", fontWeight: 600 }}>{car.bags > 0 ? `${car.bags} Bags` : 'None'}</span>
                            </div>
                            <div style={S.fleetMetaItem}>
                                <span style={S.fleetMetaLabel}>Climate</span>
                                <span style={{ color: "#fff", fontWeight: 600 }}>{car.ac ? "A/C" : "Non A/C"}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function CtaSection() {
    const { ref, isVisible } = useScrollReveal();
    return (
        <section ref={ref} style={{ ...S.ctaBg, ...(isVisible ? S.revealVisible : S.revealHidden) }}>
            <h2 style={S.ctaTitle}>Secure Your Journey Today</h2>
            <p style={S.ctaDesc}>Experience the Aruna Cabs difference. Our dispatch team is standing by 24/7 to assist you.</p>
            <button style={S.ctaBtnPrimary}>Make a Reservation</button>
        </section>
    );
}

function Footer() {
    return (
        <footer style={S.footer}>
            <div style={S.footerGrid}>
                <div>
                    <div style={{ ...S.logoCircle, marginBottom: 24, width: 48, height: 48, fontSize: 11 }}>ARUNA<br />CABS</div>
                    <p style={{ fontSize: 14, lineHeight: 1.8, maxWidth: 280, color: "#64748B" }}>
                        Setting the standard for premium, reliable, and secure ground transportation across Sri Lanka since 2010.
                    </p>
                </div>
                <div>
                    <div style={S.footerTitle}>Expertise</div>
                    {["Airport Transfers", "Executive Travel", "Group Logistics", "Freight Transport", "Corporate Accounts"].map(l => (
                        <span key={l} style={S.footerLink}>{l}</span>
                    ))}
                </div>
                <div>
                    <div style={S.footerTitle}>Company</div>
                    {["About Aruna", "Our Fleet", "Safety Standards", "Careers", "Contact Us"].map(l => (
                        <span key={l} style={S.footerLink}>{l}</span>
                    ))}
                </div>
                <div>
                    <div style={S.footerTitle}>24/7 Dispatch Center</div>
                    <span style={{ ...S.footerLink, color: "#10B981", fontWeight: 700, fontSize: 20 }}>0766 221 422</span>
                    <span style={S.footerLink}>reservations@arunacabs.lk</span>
                    <span style={S.footerLink}>Colombo, Sri Lanka</span>
                </div>
            </div>
            <div style={S.footerDivider}>
                <span>© 2026 Aruna Cabs VIP Transport. All rights reserved.</span>
                <div style={{ display: "flex", gap: 24 }}>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                </div>
            </div>
        </footer>
    );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function Home() {
    const [active, setActive] = useState("Home");

    return (
        <div style={S.page}>
            <Navbar active={active} setActive={setActive} />
            <Hero />
            <WhySection />
            <ServicesSection />
            <FleetSection />
            <CtaSection />
            <Footer />
        </div>
    );
}