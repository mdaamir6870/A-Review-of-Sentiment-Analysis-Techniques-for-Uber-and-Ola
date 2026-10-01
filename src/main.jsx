import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard,
  Users,
  ContactRound,
  FileText,
  BriefcaseBusiness,
  HardHat,
  CalendarClock,
  FolderOpen,
  ChartNoAxesCombined,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Download,
  MoreHorizontal,
  X,
  Menu,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  CircleHelp,
  Sun,
  Moon,
  Check,
  CheckCheck,
  SlidersHorizontal,
  CalendarDays,
  Clock3,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Building2,
  CheckCircle2,
  Circle,
  Upload,
  Eye,
  Pencil,
  Send,
  FileCheck2,
  Target,
  TrendingUp,
  EllipsisVertical,
  ExternalLink,
  ShieldCheck,
  GripVertical,
  Filter,
  RefreshCw,
} from "lucide-react";
import * as D from "./data";
import "./styles.css";
const TODAY = "2026-10-01";
const nav = [
  ["Dashboard", LayoutDashboard],
  ["Customers", Users],
  ["Leads & Enquiries", ContactRound],
  ["Quotations", FileText],
  ["Tenders", FileCheck2],
  ["Projects", BriefcaseBusiness],
  ["Manpower", HardHat],
  ["Follow-ups", CalendarClock],
  ["Documents", FolderOpen],
  ["Reports", ChartNoAxesCombined],
];
const subtitles = {
  Customers: "Build stronger relationships. Keep every customer in view.",
  "Leads & Enquiries": "Turn the next conversation into a lasting opportunity.",
  Quotations: "From first proposal to final approval, all in one place.",
  Tenders: "Discover opportunities and stay ahead of every deadline.",
  Projects: "A clear view of every project, from mobilization to closure.",
  Manpower: "The right expertise, in the right place, at the right time.",
  "Follow-ups": "Keep your commitments moving and your relationships growing.",
  Documents: "Your project knowledge, organized and always accessible.",
  Reports: "The numbers behind your business. The insight to move forward.",
  Settings: "Make Bright CRM work for your team.",
};
function useLocal(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bright-" + key)) ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("bright-" + key, JSON.stringify(value));
    } catch {
      window.dispatchEvent(new Event("bright-storage-error"));
    }
  }, [value, key]);
  return [value, setValue];
}
function Badge({ children }) {
  return (
    <span
      className={
        "badge " +
        (/Active|Won|Approved|Completed|Selected|Deployed|Closed|Available/.test(
          children,
        )
          ? "green"
          : /High|Overdue|Lost|Rejected|Expired/.test(children)
            ? "red"
            : /Pending|Negotiation|Preparing|Medium|Under|Interview/.test(
                  children,
                )
              ? "amber"
              : /Inactive|Draft|Low/.test(children)
                ? "neutral"
                : "blue")
      }
    >
      <i />
      {children}
    </span>
  );
}
function Avatar({ name = "Adam Mitchell", small = false, index = 0 }) {
  return (
    <span
      title={name}
      className={"avatar avatar-" + (index % 5) + (small ? " small" : "")}
    >
      {D.initials(name)}
    </span>
  );
}
function Logo() {
  return (
    <div className="brand">
      <div className="brand-symbol">
        <span />
        <span />
        <span />
        <b />
      </div>
      <div>
        <strong>
          BRIGHT<span>®</span>
        </strong>
        <small>INDUSTRIAL CONSULTANCY SERVICE</small>
      </div>
    </div>
  );
}
function App() {
  const [page, setPage] = useState("Dashboard"),
    [collapsed, setCollapsed] = useLocal("sidebar", false),
    [mobile, setMobile] = useState(false),
    [dark, setDark] = useLocal("dark", false);
  const [customers, setCustomers] = useLocal("customers", D.initialCustomers),
    [projects, setProjects] = useLocal("projects", D.initialProjects),
    [leads, setLeads] = useLocal("leads", D.initialLeads),
    [quotes, setQuotes] = useLocal("quotes", D.initialQuotes),
    [tenders, setTenders] = useLocal("tenders", D.initialTenders),
    [people, setPeople] = useLocal("people", D.initialPeople),
    [followups, setFollowups] = useLocal("followups", D.initialFollowups),
    [docs, setDocs] = useLocal("docs", D.initialDocs);
  const [contacts, setContacts] = useLocal("contacts", {}),
    [activities, setActivities] = useLocal("activities", {});
  const [query, setQuery] = useState(""),
    [search, setSearch] = useState(""),
    [mobileSearch, setMobileSearch] = useState(false),
    [status, setStatus] = useState("All statuses"),
    [detail, setDetail] = useState(null),
    [tab, setTab] = useState("Overview"),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState(""),
    [notifications, setNotifications] = useState(false),
    [profile, setProfile] = useState(false),
    [read, setRead] = useLocal("read", false),
    [period, setPeriod] = useState("This month"),
    [followTab, setFollowTab] = useState("Today"),
    [view, setView] = useState("Table"),
    [note, setNote] = useState(""),
    [notes, setNotes] = useLocal("notes", {}),
    [extraFilters, setExtraFilters] = useState(false),
    [filters, setFilters] = useState({}),
    [companySettings, setCompanySettings] = useLocal("company", {
      name: "Bright Industrial Consultancy Service",
      email: "info@brightindustrial.com",
      location: "Dammam, Saudi Arabia",
      currency: "USD",
    });
  const toastTimer = useRef(null);
  const notify = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4000);
  };
  useEffect(() => {
    const onError = () =>
      notify(
        "Changes could not be saved on this device. Browser storage may be full or disabled.",
      );
    window.addEventListener("bright-storage-error", onError);
    return () => window.removeEventListener("bright-storage-error", onError);
  }, []);
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector('[aria-label="Search CRM"]')?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    if (!modal && !detail) return;
    const dialogs = document.querySelectorAll("[role=dialog]");
    const dialog = dialogs[dialogs.length - 1];
    const previous = document.activeElement;
    const getFocusable = () =>
      Array.from(
        dialog.querySelectorAll(
          "button:not(:disabled),input,select,textarea,a[href]",
        ),
      ).filter((el) => el.getClientRects().length);
    getFocusable()[0]?.focus();
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const els = getFocusable();
      const first = els[0],
        last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    dialog.addEventListener("keydown", trap);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.removeEventListener("keydown", trap);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [modal, detail]);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  useEffect(() => {
    document.title = `${page} — BRIGHT CRM`;
  }, [page]);
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setModal(null);
        setDetail(null);
        setNotifications(false);
        setProfile(false);
        setMobile(false);
        setMobileSearch(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  function go(p) {
    window.scrollTo({ top: 0 });
    setMobileSearch(false);
    setPage(p);
    setQuery("");
    setStatus("All statuses");
    setFilters({});
    setDetail(null);
    setTab("Overview");
    setMobile(false);
    setView("Table");
    setExtraFilters(false);
  }
  const collections = {
    Customers: customers,
    "Leads & Enquiries": leads,
    Quotations: quotes,
    Tenders: tenders,
    Projects: projects,
    Manpower: people,
    "Follow-ups": followups,
    Documents: docs,
  };
  const setters = {
    Customers: setCustomers,
    "Leads & Enquiries": setLeads,
    Quotations: setQuotes,
    Tenders: setTenders,
    Projects: setProjects,
    Manpower: setPeople,
    "Follow-ups": setFollowups,
    Documents: setDocs,
  };
  function download(name, content, type = "text/plain") {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exportData() {
    const rows = collections[page] || projects;
    const fields = Object.keys(rows[0] || {});
    const csv = [
      fields.join(","),
      ...rows.map((r) =>
        fields
          .map((k) => {
            const raw = String(r[k] ?? "");
            const safe = /^[=+@\-\t\r]/.test(raw) ? "'" + raw : raw;
            return '"' + safe.replace(/"/g, '""') + '"';
          })
          .join(","),
      ),
    ].join("\n");
    download(`Bright-${page.toLowerCase()}-${TODAY}.csv`, csv, "text/csv");
    notify("Your report has been exported");
  }
  function openDetail(kind, item) {
    setDetail({ kind, item });
    setTab("Overview");
  }
  function completeFollow(id) {
    setFollowups((v) =>
      v.map((f) =>
        f.id === id
          ? { ...f, status: f.status === "Completed" ? "Pending" : "Completed" }
          : f,
      ),
    );
    notify("Follow-up updated");
  }
  const todayFollow = followups.filter((f) => f.due === TODAY),
    overdue = followups.filter(
      (f) => f.due < TODAY && f.status !== "Completed",
    );
  const globalResults = Object.entries(collections)
    .flatMap(([kind, rows]) => rows.map((item) => ({ kind, item })))
    .filter(({ item }) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase()),
    )
    .slice(0, 7);
  async function printQuote(q) {
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF();
      pdf.setFillColor(22, 40, 64);
      pdf.rect(0, 0, 210, 46, "F");
      pdf.setTextColor(237, 195, 105);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(26);
      pdf.text("BRIGHT", 20, 23);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(240, 244, 250);
      pdf.setFontSize(10);
      pdf.text("Industrial Consultancy Service", 20, 33);
      pdf.setTextColor(35, 52, 75);
      pdf.setFontSize(20);
      pdf.text("QUOTATION", 20, 65);
      pdf.setFontSize(10);
      let y = 79;
      const fields = [
        ["Quotation number", q.id],
        ["Prepared for", q.customer],
        ["Project", q.project],
        ["Quotation date", q.date],
        ["Valid until", q.validity],
        ["Service", q.service],
        ["Estimated value (USD)", D.money(q.value)],
        ["Assigned employee", q.assigned],
        ["Status", q.status],
      ];
      for (const [label, value] of fields) {
        const lines = pdf.splitTextToSize(String(value || "—"), 105);
        const height = Math.max(14, lines.length * 5 + 8);
        if (y + height > 260) {
          pdf.addPage();
          y = 25;
        }
        pdf.setFont("helvetica", "bold");
        pdf.text(label, 20, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(lines, 82, y);
        pdf.setDrawColor(229, 233, 239);
        pdf.line(20, y + height - 6, 190, y + height - 6);
        y += height;
      }
      if (y > 245) {
        pdf.addPage();
        y = 25;
      }
      pdf.setTextColor(130, 140, 153);
      pdf.setFontSize(9);
      pdf.text(
        [
          "Demonstration quotation. Subject to agreed scope and commercial terms.",
          "Thank you for considering Bright Industrial Consultancy Service.",
        ],
        20,
        y + 12,
      );
      pdf.save(q.id + ".pdf");
      notify("Quotation PDF downloaded");
    } catch {
      notify("The quotation PDF could not be generated. Please try again.");
    }
  }
  const metrics = [
    [
      "Total Customers",
      String(125 + customers.length - 6),
      "12.5%",
      Users,
      "blue",
      "vs. last month",
      "Customers",
    ],
    [
      "Active Leads",
      String(24 + leads.length - 7),
      "8.2%",
      ContactRound,
      "purple",
      "vs. last month",
      "Leads & Enquiries",
    ],
    [
      "Open Enquiries",
      "18",
      "6.4%",
      MessageSquare,
      "cyan",
      "vs. last month",
      "Leads & Enquiries",
    ],
    [
      "Active Projects",
      String(7 + projects.length - 4),
      "16.7%",
      BriefcaseBusiness,
      "green",
      "vs. last month",
      "Projects",
    ],
    [
      "Pending Quotations",
      String(12 + quotes.length - 5),
      "4.8%",
      FileText,
      "orange",
      "vs. last month",
      "Quotations",
    ],
    [
      "Active Tenders",
      String(8 + tenders.length - 5),
      "14.3%",
      FileCheck2,
      "gold",
      "vs. last month",
      "Tenders",
    ],
    [
      "Manpower Requirements",
      "15",
      "7.1%",
      HardHat,
      "steel",
      "vs. last month",
      "Manpower",
    ],
    [
      "Pending Follow-ups",
      String(21 - followups.filter((f) => f.status === "Completed").length),
      "3 overdue",
      CalendarClock,
      "rose",
      "need your attention",
      "Follow-ups",
    ],
  ];
  return (
    <div className={"app " + (collapsed ? "is-collapsed" : "")}>
      {mobile && (
        <div className="sidebar-overlay" onClick={() => setMobile(false)} />
      )}
      <aside className={"sidebar " + (mobile ? "mobile-open" : "")}>
        <Logo />
        <div className="workspace-label">
          WORKSPACE
          <button
            className="sidebar-collapse"
            title="Collapse sidebar"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronsRight size={15} />
            ) : (
              <ChevronsLeft size={15} />
            )}
          </button>
        </div>
        <nav>
          {nav.map(([label, Icon], i) => (
            <button
              key={label}
              onClick={() => go(label)}
              className={"nav-item " + (page === label ? "active" : "")}
              title={label}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "Leads & Enquiries" && <em>24</em>}
              {label === "Follow-ups" && <em className="gold-count">21</em>}
              {page === label && <b />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">
              <ShieldCheck size={19} />
            </span>
            <strong>Excellence. Every inspection.</strong>
            <p>Your trusted industrial partner.</p>
            <span className="iso-label">
              QUALITY. SAFETY. INTEGRITY. <ArrowUpRight size={12} />
            </span>
          </div>
          <button
            className={"nav-item " + (page === "Settings" ? "active" : "")}
            onClick={() => go("Settings")}
            title="Settings"
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <button
            className="nav-item"
            onClick={() => setModal({ kind: "help" })}
            title="Help & support"
          >
            <CircleHelp size={18} />
            <span>Help & support</span>
            <ExternalLink size={13} />
          </button>
          <div className="sidebar-user">
            <Avatar />
            <div>
              <strong>Adam Mitchell</strong>
              <small>Administrator</small>
            </div>
            <button title="Open profile" onClick={() => setProfile(!profile)}>
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              aria-label="Open menu"
              onClick={() => setMobile(true)}
            >
              <Menu size={20} />
            </button>
            <div className="product-name">
              BRIGHT <span>CRM</span>
              <small>Customer & Project Management System</small>
            </div>
          </div>
          <div className="topbar-tools">
            <button
              className="icon-button mobile-search-button"
              aria-label="Open search"
              onClick={() => setMobileSearch(!mobileSearch)}
            >
              <Search size={19} />
            </button>
            <div
              className={"global-search" + (mobileSearch ? " search-open" : "")}
            >
              <Search size={17} />
              <input
                aria-label="Search CRM"
                placeholder="Search anything..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <kbd>⌘ K</kbd>
              {search && (
                <div className="search-results">
                  <div className="popover-heading">
                    Search results
                    <button
                      aria-label="Close search"
                      onClick={() => setSearch("")}
                    >
                      <X size={15} />
                    </button>
                  </div>
                  {globalResults.length ? (
                    globalResults.map(({ kind, item }) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          go(kind);
                          openDetail(kind, item);
                          setSearch("");
                        }}
                      >
                        <Search size={15} />
                        <div>
                          <strong>
                            {item.name ||
                              item.company ||
                              item.title ||
                              item.task ||
                              item.id}
                          </strong>
                          <small>
                            {kind} · {item.id}
                          </small>
                        </div>
                        <ArrowUpRight size={15} />
                      </button>
                    ))
                  ) : (
                    <p>No records found for “{search}”</p>
                  )}
                </div>
              )}
            </div>
            <button
              className="icon-button theme-toggle"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun size={19} /> : <Moon size={18} />}
            </button>
            <div className="notification-wrap">
              <button
                className="icon-button bell-button"
                aria-label="Notifications"
                onClick={() => {
                  setNotifications(!notifications);
                  setProfile(false);
                }}
              >
                <Bell size={20} />
                {!read && <i />}
              </button>
              {notifications && (
                <div className="notifications popover">
                  <div className="popover-heading">
                    Notifications
                    <button
                      title="Mark all as read"
                      onClick={() => {
                        setRead(true);
                        notify("All notifications marked as read");
                      }}
                    >
                      <CheckCheck size={18} />
                    </button>
                  </div>
                  {[
                    [
                      "Tender deadline approaching",
                      "Annual NDT Inspection · due in 3 days",
                      "Tenders",
                      "amber",
                    ],
                    [
                      "Follow-up due",
                      "Saudi Aramco · Today, 10:00 AM",
                      "Follow-ups",
                      "red",
                    ],
                    [
                      "New enquiry received",
                      "Petrofac · Advanced NDT services",
                      "Leads & Enquiries",
                      "blue",
                    ],
                    [
                      "Quotation expiring",
                      "QT-2026-082 · 5 October",
                      "Quotations",
                      "amber",
                    ],
                    [
                      "Project pending closure",
                      "L&T · Manpower deployment",
                      "Projects",
                      "blue",
                    ],
                    [
                      "Payment follow-up",
                      "Petrofac · September invoice",
                      "Follow-ups",
                      "red",
                    ],
                    [
                      "Manpower requirement",
                      "SABIC · 2 QA/QC engineers",
                      "Manpower",
                      "blue",
                    ],
                  ].map(([title, body, dest, color]) => (
                    <button
                      className="notification-item"
                      key={title}
                      onClick={() => {
                        go(dest);
                        setNotifications(false);
                      }}
                    >
                      <span className={"notification-dot " + color} />
                      <div>
                        <strong>{title}</strong>
                        <p>{body}</p>
                      </div>
                      <ChevronRight size={15} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className="icon-button top-settings"
              aria-label="Settings"
              onClick={() => go("Settings")}
            >
              <Settings size={19} />
            </button>
            <div className="top-divider" />
            <div className="profile-wrap">
              <button
                className="profile-button"
                onClick={() => {
                  setProfile(!profile);
                  setNotifications(false);
                }}
              >
                <Avatar small />
                <div>
                  <strong>Adam Mitchell</strong>
                  <small>Admin</small>
                </div>
                <ChevronDown size={13} />
              </button>
              {profile && (
                <div className="profile-menu popover">
                  <strong>Adam Mitchell</strong>
                  <small>Administrator · Bright Industrial</small>
                  <button
                    onClick={() => {
                      go("Settings");
                      setProfile(false);
                    }}
                  >
                    <Settings size={16} /> Account settings
                  </button>
                  <button
                    onClick={() => {
                      setDark(!dark);
                      setProfile(false);
                    }}
                  >
                    <Moon size={16} /> {dark ? "Light" : "Dark"} appearance
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main>
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={12} />
            <strong>{page}</strong>
          </div>
          <div className="page-heading">
            <div>
              <div className="heading-eyebrow">
                {page === "Dashboard"
                  ? "YOUR BUSINESS, AT A GLANCE"
                  : "BRIGHT WORKSPACE"}
              </div>
              <h1>{page === "Dashboard" ? "Business overview" : page}</h1>
              <p>
                {page === "Dashboard" ? (
                  <>
                    Welcome back, Adam <span className="wave">✦</span> Here’s
                    what’s happening at Bright today.
                  </>
                ) : (
                  subtitles[page]
                )}
              </p>
            </div>
            <div className="heading-actions">
              {page === "Dashboard" || page === "Reports" ? (
                <>
                  <div className="period-control">
                    <CalendarDays size={15} />
                    <select
                      aria-label="Reporting period"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      <option>This month</option>
                      <option>Last month</option>
                      <option>This quarter</option>
                      <option>This year</option>
                    </select>
                  </div>
                  <button className="button secondary" onClick={exportData}>
                    <Download size={15} /> Export
                  </button>
                  {page === "Dashboard" && (
                    <button
                      className="button primary"
                      onClick={() => setModal({ kind: "quick" })}
                    >
                      <Plus size={17} /> Quick add
                    </button>
                  )}
                </>
              ) : (
                page !== "Settings" && (
                  <>
                    <button className="button secondary" onClick={exportData}>
                      <Download size={15} /> Export
                    </button>
                    <button
                      className="button primary"
                      onClick={() => setModal({ kind: page })}
                    >
                      {page === "Documents" ? (
                        <Upload size={16} />
                      ) : (
                        <Plus size={16} />
                      )}{" "}
                      {
                        {
                          Customers: "Add customer",
                          "Leads & Enquiries": "Add enquiry",
                          Quotations: "Create quotation",
                          Tenders: "Add tender",
                          Projects: "New project",
                          Manpower: "Add candidate",
                          "Follow-ups": "Add follow-up",
                          Documents: "Upload document",
                        }[page]
                      }
                    </button>
                  </>
                )
              )}
            </div>
          </div>
          {page === "Dashboard" ? (
            <>
              <div className="overview-meta">
                <span>
                  <i /> Business is moving forward. Let’s keep the momentum.
                </span>
                <small>
                  <RefreshCw size={12} /> Updated just now <span>•</span> Oct 1,
                  2026
                </small>
              </div>
              <div className="kpi-grid">
                {metrics.map(
                  ([label, value, trend, Icon, color, sub, dest], i) => (
                    <button
                      className="kpi-card"
                      key={label}
                      onClick={() => go(dest)}
                    >
                      <div className="kpi-top">
                        <span>{label}</span>
                        <span className={"kpi-icon " + color}>
                          <Icon size={18} />
                        </span>
                      </div>
                      <div className="kpi-value">
                        {value}
                        <svg
                          className={"sparkline " + color}
                          viewBox="0 0 100 32"
                        >
                          <path
                            d={
                              i % 3 === 0
                                ? "M0 28L10 21L20 25L30 15L40 18L50 9L60 13L70 5L80 9L90 2L100 5"
                                : i % 3 === 1
                                  ? "M0 25L12 26L24 17L36 21L48 12L60 14L72 6L84 11L100 3"
                                  : "M0 28L12 22L24 25L36 18L48 21L60 10L72 14L84 4L100 8"
                            }
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className="kpi-bottom">
                        <span className={i === 7 ? "trend warning" : "trend"}>
                          {i === 7 ? (
                            <Clock3 size={12} />
                          ) : (
                            <TrendingUp size={12} />
                          )}{" "}
                          {trend}
                        </span>
                        <small>{sub}</small>
                      </div>
                    </button>
                  ),
                )}
              </div>
              <div className="dashboard-middle">
                <section className="panel performance-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>
                        Business performance{" "}
                        <span
                          className="subtle-info"
                          title="Illustrative business performance for the selected period"
                        >
                          i
                        </span>
                      </h2>
                      <p>Revenue and opportunity growth</p>
                    </div>
                    <select
                      aria-label="Chart period"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      <option>This month</option>
                      <option>Last month</option>
                      <option>This quarter</option>
                      <option>This year</option>
                    </select>
                  </div>
                  <div className="revenue-summary">
                    <div>
                      <span>Total revenue</span>
                      <strong>
                        {period === "This year"
                          ? "$2,845,000"
                          : period === "This quarter"
                            ? "$842,500"
                            : period === "Last month"
                              ? "$248,900"
                              : "$284,500"}
                      </strong>
                      <small>
                        <TrendingUp size={13} /> 14.3%{" "}
                        <span>vs. previous period</span>
                      </small>
                    </div>
                    <div className="chart-legend">
                      <span>
                        <i className="navy-dot" />
                        Revenue
                      </span>
                      <span>
                        <i className="gold-dot" />
                        Pipeline value
                      </span>
                    </div>
                  </div>
                  <RevenueChart period={period} />
                  <div className="performance-footer">
                    <span>
                      <span className="goal-dot" />
                      <strong>78%</strong> of monthly revenue target achieved
                    </span>
                    <button onClick={() => go("Reports")}>
                      View analytics <ArrowUpRight size={14} />
                    </button>
                  </div>
                </section>
                <section className="panel followup-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>
                        Today’s follow-ups{" "}
                        <span className="count-bubble">
                          {
                            todayFollow.filter((x) => x.status !== "Completed")
                              .length
                          }
                        </span>
                      </h2>
                      <p>A little follow-up goes a long way.</p>
                    </div>
                    <button
                      className="icon-button"
                      aria-label="Add follow-up"
                      onClick={() => setModal({ kind: "Follow-ups" })}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="followup-list">
                    {todayFollow.slice(0, 4).map((f, i) => (
                      <div
                        className={
                          "followup-item " +
                          (f.status === "Completed" ? "done" : "")
                        }
                        key={f.id}
                      >
                        <button
                          className="task-check"
                          aria-label={"Complete " + f.client + " follow-up"}
                          onClick={() => completeFollow(f.id)}
                        >
                          {f.status === "Completed" ? (
                            <CheckCircle2 size={19} />
                          ) : (
                            <Circle size={19} />
                          )}
                        </button>
                        <div className="followup-copy">
                          <div>
                            <strong>{f.client}</strong>
                            <span
                              className={
                                "priority-dot " + f.priority.toLowerCase()
                              }
                            >
                              {f.priority}
                            </span>
                          </div>
                          <p>{f.task}</p>
                          <small>
                            <Clock3 size={11} />
                            {f.time}
                            <span>•</span>
                            {f.assigned}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="panel-bottom-link"
                    onClick={() => go("Follow-ups")}
                  >
                    View all follow-ups <ArrowRight size={14} />
                  </button>
                </section>
              </div>
              <div className="dashboard-lower">
                <section className="panel projects-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>
                        Active projects <span className="count-bubble">7</span>
                      </h2>
                      <p>Keeping our commitments on track.</p>
                    </div>
                    <button
                      className="text-link"
                      onClick={() => go("Projects")}
                    >
                      View all projects <ArrowUpRight size={14} />
                    </button>
                  </div>
                  <div className="table-scroll">
                    <table className="overview-table">
                      <thead>
                        <tr>
                          <th>PROJECT / CLIENT</th>
                          <th>PROGRESS</th>
                          <th>TEAM</th>
                          <th>STATUS</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {projects.slice(0, 4).map((p, i) => (
                          <tr
                            key={p.id}
                            onClick={() => {
                              go("Projects");
                              openDetail("Projects", p);
                            }}
                          >
                            <td>
                              <div className="project-cell">
                                <span className={"project-icon " + p.color}>
                                  <BriefcaseBusiness size={16} />
                                </span>
                                <div>
                                  <strong>{p.name}</strong>
                                  <small>
                                    {p.client} <span>·</span> {p.id}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="table-progress">
                                <span>{p.progress}%</span>
                                <div>
                                  <i style={{ width: p.progress + "%" }} />
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="avatar-stack">
                                <Avatar name={p.manager} small index={i} />
                                <Avatar
                                  name={D.team[(i + 1) % 5]}
                                  small
                                  index={i + 1}
                                />
                                <span>+{p.team - 2}</span>
                              </div>
                            </td>
                            <td>
                              <Badge>{p.status}</Badge>
                            </td>
                            <td>
                              <button
                                className="icon-button"
                                aria-label={"View " + p.name}
                              >
                                <ChevronRight size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="project-footer">
                    <span>
                      <i className="green-dot" /> All active projects are on
                      schedule
                    </span>
                    <small>2 projects nearing completion</small>
                  </div>
                </section>
                <section className="panel service-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Revenue by service</h2>
                      <p>A balanced portfolio of expertise</p>
                    </div>
                    <button
                      className="icon-button"
                      aria-label="View service analytics"
                      onClick={() => go("Reports")}
                    >
                      <MoreHorizontal size={19} />
                    </button>
                  </div>
                  <div className="donut-wrap">
                    <svg viewBox="0 0 200 200">
                      <circle
                        cx="100"
                        cy="100"
                        r="76"
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth="23"
                      />
                      <circle
                        cx="100"
                        cy="100"
                        r="76"
                        fill="none"
                        stroke="#243d61"
                        strokeWidth="23"
                        strokeDasharray="231 478"
                        transform="rotate(-90 100 100)"
                      />
                      <circle
                        cx="100"
                        cy="100"
                        r="76"
                        fill="none"
                        stroke="#e8bd55"
                        strokeWidth="23"
                        strokeDasharray="145 478"
                        strokeDashoffset="-237"
                        transform="rotate(-90 100 100)"
                      />
                      <circle
                        cx="100"
                        cy="100"
                        r="76"
                        fill="none"
                        stroke="#93b6c6"
                        strokeWidth="23"
                        strokeDasharray="84 478"
                        strokeDashoffset="-388"
                        transform="rotate(-90 100 100)"
                      />
                    </svg>
                    <div>
                      <small>Total revenue</small>
                      <strong>$284.5K</strong>
                      <span>
                        <TrendingUp size={11} /> 14.3%
                      </span>
                    </div>
                  </div>
                  <div className="service-legend">
                    {[
                      ["#243d61", "NDT & Advanced NDT", "50%"],
                      ["#e8bd55", "Skilled Manpower Supply", "32%"],
                      ["#93b6c6", "TPI, QA & QC Services", "18%"],
                    ].map(([c, t, p]) => (
                      <button
                        key={t}
                        onClick={() => {
                          go("Reports");
                          setFilters({ service: t });
                        }}
                      >
                        <i style={{ background: c }} />
                        <span>{t}</span>
                        <strong>{p}</strong>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
              <section className="panel pipeline-preview">
                <div className="panel-heading">
                  <div>
                    <h2>Business pipeline</h2>
                    <p>Every opportunity, one step closer.</p>
                  </div>
                  <button
                    className="text-link"
                    onClick={() => {
                      go("Leads & Enquiries");
                      setView("Pipeline");
                    }}
                  >
                    Open pipeline <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="pipeline-summary">
                  {D.stages.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => {
                        go("Leads & Enquiries");
                        setView("Pipeline");
                      }}
                    >
                      <span>
                        <i
                          style={{
                            background: [
                              "#a1aebf",
                              "#8cabc6",
                              "#6488aa",
                              "#d3b46c",
                              "#dab044",
                              "#50a483",
                              "#284566",
                            ][i],
                          }}
                        />
                        {s}
                      </span>
                      <strong>
                        {[8, 6, 5, 4, 3, 2, 7][i]}
                        <small>
                          {D.shortMoney(
                            [
                              215000, 180000, 340000, 285000, 160000, 95000,
                              640000,
                            ][i],
                          )}
                        </small>
                      </strong>
                      {i < 6 && (
                        <ChevronRight className="stage-arrow" size={16} />
                      )}
                    </button>
                  ))}
                </div>
              </section>
            </>
          ) : page === "Settings" ? (
            <SettingsPage
              settings={companySettings}
              setSettings={setCompanySettings}
              notify={notify}
              dark={dark}
              setDark={setDark}
            />
          ) : page === "Reports" ? (
            <Reports
              period={period}
              filters={filters}
              setFilters={setFilters}
              customers={customers}
              projects={projects}
              leads={leads}
              tenders={tenders}
              people={people}
            />
          ) : (
            <>
              {page === "Projects" && (
                <SummaryCards
                  items={[
                    ["Total projects", projects.length, BriefcaseBusiness],
                    [
                      "Active projects",
                      projects.filter((p) => p.status === "Active").length,
                      TrendingUp,
                    ],
                    [
                      "Completed projects",
                      projects.filter((p) => p.status === "Completed").length,
                      CheckCircle2,
                    ],
                    [
                      "Pending closure",
                      projects.filter((p) => p.status === "Pending Closure")
                        .length,
                      Clock3,
                    ],
                  ]}
                />
              )}
              {page === "Quotations" && (
                <SummaryCards
                  items={[
                    [
                      "Total quotation value",
                      D.shortMoney(
                        quotes.reduce((a, q) => a + Number(q.value), 0),
                      ),
                      FileText,
                    ],
                    [
                      "Awaiting approval",
                      quotes.filter((q) =>
                        ["Sent", "Under Review", "Negotiation"].includes(
                          q.status,
                        ),
                      ).length,
                      Clock3,
                    ],
                    [
                      "Approved value",
                      D.shortMoney(
                        quotes
                          .filter((q) => q.status === "Approved")
                          .reduce((a, q) => a + Number(q.value), 0),
                      ),
                      CheckCircle2,
                    ],
                    [
                      "Draft quotations",
                      quotes.filter((q) => q.status === "Draft").length,
                      Pencil,
                    ],
                  ]}
                />
              )}
              {page === "Tenders" && (
                <>
                  <SummaryCards
                    items={[
                      [
                        "Upcoming deadlines",
                        tenders.filter(
                          (t) =>
                            t.deadline >= TODAY &&
                            !["Won", "Lost"].includes(t.status),
                        ).length,
                        CalendarClock,
                      ],
                      [
                        "Submitted tenders",
                        tenders.filter((t) => t.status === "Submitted").length,
                        Send,
                      ],
                      [
                        "Won tenders",
                        tenders.filter((t) => t.status === "Won").length,
                        CheckCircle2,
                      ],
                      [
                        "Lost tenders",
                        tenders.filter((t) => t.status === "Lost").length,
                        Target,
                      ],
                    ]}
                  />
                  <div className="deadline-banner">
                    <Clock3 size={19} />
                    <div>
                      <strong>Upcoming submission deadline</strong>
                      <span>
                        Annual NDT Inspection Services · Saudi Aramco · October
                        4, 2026
                      </span>
                    </div>
                    <Badge>High priority</Badge>
                    <button
                      className="text-link"
                      onClick={() => openDetail("Tenders", tenders[0])}
                    >
                      Review tender <ArrowRight size={15} />
                    </button>
                  </div>
                </>
              )}
              {page === "Follow-ups" && (
                <div className="follow-tabs">
                  {[
                    ["Today", todayFollow.length],
                    ["Overdue", overdue.length],
                    ["Upcoming", followups.filter((f) => f.due > TODAY).length],
                    ["All", followups.length],
                  ].map(([t, c]) => (
                    <button
                      className={followTab === t ? "selected" : ""}
                      onClick={() => setFollowTab(t)}
                      key={t}
                    >
                      {t === "Today" ? "Today's follow-ups" : t}
                      <span>{c}</span>
                    </button>
                  ))}
                </div>
              )}
              {page === "Documents" && (
                <div className="document-categories">
                  {[
                    "All documents",
                    "Work Orders",
                    "Purchase Orders",
                    "Quotations",
                    "Invoices",
                    "Inspection Reports",
                    "Certificates",
                    "Client Documents",
                    "Employee Documents",
                    "Tender Documents",
                  ].map((c) => (
                    <button
                      className={
                        (filters.category || "All documents") === c
                          ? "selected"
                          : ""
                      }
                      onClick={() => setFilters({ ...filters, category: c })}
                      key={c}
                    >
                      <FolderOpen size={17} />
                      {c}
                    </button>
                  ))}
                </div>
              )}
              <section className="panel records-panel">
                <div className="table-toolbar">
                  <div className="table-search">
                    <Search size={17} />
                    <input
                      aria-label={"Search " + page}
                      placeholder={"Search " + page.toLowerCase() + "..."}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <div className="table-toolbar-right">
                    {page !== "Documents" && (
                      <select
                        aria-label="Filter by status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option>All statuses</option>
                        {[
                          ...new Set(
                            (collections[page] || []).map((x) => x.status),
                          ),
                        ].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    )}
                    <button
                      className={
                        "button secondary " + (extraFilters ? "selected" : "")
                      }
                      onClick={() => setExtraFilters(!extraFilters)}
                    >
                      <SlidersHorizontal size={15} /> Filters
                    </button>
                    {page === "Leads & Enquiries" && (
                      <div className="view-switch">
                        {["Table", "Pipeline"].map((v) => (
                          <button
                            key={v}
                            className={view === v ? "selected" : ""}
                            onClick={() => setView(v)}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {extraFilters && (
                  <div className="filter-row">
                    <label>
                      Service
                      <select
                        value={filters.service || ""}
                        onChange={(e) =>
                          setFilters({ ...filters, service: e.target.value })
                        }
                      >
                        <option value="">All services</option>
                        {D.services.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Location
                      <input
                        placeholder="Any location"
                        value={filters.location || ""}
                        onChange={(e) =>
                          setFilters({ ...filters, location: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Priority
                      <select
                        value={filters.priority || ""}
                        onChange={(e) =>
                          setFilters({ ...filters, priority: e.target.value })
                        }
                      >
                        <option value="">All priorities</option>
                        {["High", "Medium", "Low"].map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Employee
                      <select
                        value={filters.employee || ""}
                        onChange={(e) =>
                          setFilters({ ...filters, employee: e.target.value })
                        }
                      >
                        <option value="">All employees</option>
                        {D.team.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      From date
                      <input
                        type="date"
                        value={filters.date || ""}
                        onChange={(e) =>
                          setFilters({ ...filters, date: e.target.value })
                        }
                      />
                    </label>
                    <button
                      className="text-link"
                      onClick={() => {
                        setFilters({});
                        setStatus("All statuses");
                        setQuery("");
                      }}
                    >
                      Reset
                    </button>
                  </div>
                )}
                {(() => {
                  let rows = (collections[page] || []).filter(
                    (r) =>
                      JSON.stringify(r)
                        .toLowerCase()
                        .includes(query.toLowerCase()) &&
                      (status === "All statuses" || r.status === status) &&
                      (!filters.service ||
                        String(r.service || r.services || "").includes(
                          filters.service,
                        )) &&
                      (!filters.location ||
                        String(r.location || "")
                          .toLowerCase()
                          .includes(filters.location.toLowerCase())) &&
                      (!filters.priority || r.priority === filters.priority) &&
                      (!filters.employee ||
                        [r.assigned, r.manager].includes(filters.employee)) &&
                      (!filters.date ||
                        (r.date ||
                          r.start ||
                          r.followup ||
                          r.due ||
                          r.deadline ||
                          "") >= filters.date) &&
                      (!filters.category ||
                        filters.category === "All documents" ||
                        r.category === filters.category),
                  );
                  if (page === "Follow-ups")
                    rows = rows.filter(
                      (r) =>
                        followTab === "All" ||
                        (followTab === "Today"
                          ? r.due === TODAY
                          : followTab === "Overdue"
                            ? r.due < TODAY && r.status !== "Completed"
                            : r.due > TODAY),
                    );
                  return (
                    <>
                      {view === "Pipeline" && page === "Leads & Enquiries" ? (
                        <Pipeline
                          leads={rows.filter((lead) => lead.status !== "Lost")}
                          setLeads={setLeads}
                          open={(l) => openDetail(page, l)}
                        />
                      ) : page === "Documents" ? (
                        <div className="document-grid">
                          {rows.map((d) => (
                            <div className="document-card" key={d.id}>
                              <div className="document-art">
                                <FileText size={40} />
                                <span>PDF</span>
                              </div>
                              <strong>{d.name}</strong>
                              <small>
                                {d.client} · {d.category}
                              </small>
                              <div className="document-meta">
                                <span>
                                  {d.version} · {d.size}
                                </span>
                                <span>{d.date}</span>
                              </div>
                              <div className="document-actions">
                                <button
                                  className="button secondary"
                                  onClick={() => openDetail("Documents", d)}
                                >
                                  <Eye size={14} /> Preview
                                </button>
                                <button
                                  aria-label={"Download " + d.name}
                                  className="icon-button"
                                  onClick={() => downloadDocument(d)}
                                >
                                  <Download size={17} />
                                </button>
                                <button
                                  aria-label={"Upload new version of " + d.name}
                                  className="icon-button"
                                  onClick={() =>
                                    setModal({ kind: "Documents", edit: d })
                                  }
                                >
                                  <Upload size={17} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <RecordTable
                          page={page}
                          rows={rows}
                          open={(r) => openDetail(page, r)}
                          edit={(r) => setModal({ kind: page, edit: r })}
                          complete={completeFollow}
                          print={printQuote}
                          send={(q) => setModal({ kind: "send", quote: q })}
                        />
                      )}
                      {!rows.length && (
                        <div className="empty-state">
                          <Search size={30} />
                          <h3>No matching records</h3>
                          <p>Try another search or reset your filters.</p>
                          <button
                            className="button secondary"
                            onClick={() => {
                              setQuery("");
                              setStatus("All statuses");
                              setFilters({});
                            }}
                          >
                            Clear filters
                          </button>
                        </div>
                      )}
                      <div className="table-footer">
                        <span>
                          Showing {rows.length} of{" "}
                          {(collections[page] || []).length} records
                        </span>
                        <span className="demo-label">
                          <i /> Sample workspace · Saved on this device
                        </span>
                        <div className="pagination">
                          <button disabled aria-label="Previous page">
                            <ChevronLeft size={15} />
                          </button>
                          <button className="selected">1</button>
                          <button disabled aria-label="Next page">
                            <ChevronRight size={15} />
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </section>
            </>
          )}
          <footer className="page-footer">
            <span>© 2026 Bright Industrial Consultancy Service</span>
            <span>
              <i /> All systems operational <b>·</b>{" "}
              <span className="footer-tag">
                Built on trust. Driven by quality.
              </span>
            </span>
          </footer>
        </main>
      </div>
      {detail && (
        <div className="drawer-backdrop" onClick={() => setDetail(null)}>
          <section
            className="detail-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Record details"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-heading">
              <div>
                <span className="eyebrow">
                  {detail.kind} / {detail.item.id}
                </span>
                <h2>
                  {detail.item.name ||
                    detail.item.title ||
                    detail.item.company ||
                    detail.item.customer ||
                    detail.item.client}
                </h2>
              </div>
              <button
                className="icon-button"
                aria-label="Close details"
                onClick={() => setDetail(null)}
              >
                <X size={21} />
              </button>
            </div>
            <div className="detail-hero">
              <span className="detail-company-icon">
                <Building2 size={29} />
              </span>
              <div>
                <h3>
                  {detail.item.name ||
                    detail.item.project ||
                    detail.item.task ||
                    detail.item.title ||
                    detail.item.company}
                </h3>
                <p>
                  <MapPin size={13} />
                  {detail.item.location ||
                    detail.item.client ||
                    detail.item.customer ||
                    "Bright Industrial Consultancy Service"}
                </p>
              </div>
              {detail.item.status && <Badge>{detail.item.status}</Badge>}
            </div>
            <div className="detail-tabs">
              {(detail.kind === "Customers"
                ? [
                    "Overview",
                    "Contacts",
                    "Enquiries",
                    "Quotations",
                    "Projects",
                    "Documents",
                    "Communication History",
                    "Notes",
                  ]
                : detail.kind === "Projects"
                  ? [
                      "Overview",
                      "Scope",
                      "Team",
                      "Daily Updates",
                      "Documents",
                      "Client Communication",
                      "Billing",
                      "Closure",
                    ]
                  : detail.kind === "Documents"
                    ? ["Preview", "Version history"]
                    : ["Overview", "Notes"]
              ).map((t) => (
                <button
                  key={t}
                  className={
                    tab === t || (t === "Preview" && tab === "Overview")
                      ? "selected"
                      : ""
                  }
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="detail-body">{renderDetail()}</div>
            <div className="drawer-footer">
              <button
                className="button secondary"
                onClick={() => setDetail(null)}
              >
                Close
              </button>
              {detail.kind !== "Documents" && (
                <button
                  className="button primary"
                  onClick={() => {
                    setModal({ kind: detail.kind, edit: detail.item });
                    setDetail(null);
                  }}
                >
                  <Pencil size={15} /> Edit record
                </button>
              )}
            </div>
          </section>
        </div>
      )}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={modal.kind === "quick" ? "Quick add" : modal.kind}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">BRIGHT CRM</span>
                <h2>
                  {modal.kind === "quick"
                    ? "What would you like to add?"
                    : modal.kind === "help"
                      ? "How can we help?"
                      : modal.kind === "send"
                        ? "Prepare client email"
                        : (modal.edit ? "Edit " : "New ") +
                          ({
                            Customers: "customer",
                            "Leads & Enquiries": "enquiry",
                            Quotations: "quotation",
                            Tenders: "tender",
                            Projects: "project",
                            Manpower: "candidate",
                            "Follow-ups": "follow-up",
                            Documents: modal.edit
                              ? "document version"
                              : "document",
                          }[modal.kind] || modal.kind)}
                </h2>
              </div>
              <button
                className="icon-button"
                aria-label="Close dialog"
                onClick={() => setModal(null)}
              >
                <X size={20} />
              </button>
            </div>
            {modal.kind === "quick" ? (
              <div className="quick-add-grid">
                {nav.slice(1, 9).map(([n, I]) => (
                  <button key={n} onClick={() => setModal({ kind: n })}>
                    <span>
                      <I size={22} />
                    </span>
                    <strong>{n}</strong>
                    <Plus size={16} />
                  </button>
                ))}
              </div>
            ) : modal.kind === "help" ? (
              <div className="help-content">
                <p>
                  Use the sidebar to explore your workspace. Search across
                  clients, projects, quotations and follow-ups from the top bar.
                </p>
                <h3>A workspace that stays with you</h3>
                <p>
                  Records are saved in this browser. Add a customer, track a
                  lead through the pipeline, or create your next project using
                  Quick add.
                </p>
                <h3>Need a hand?</h3>
                <p>
                  Contact your Bright workspace administrator for access and
                  company support.
                </p>
                <button
                  className="button primary"
                  onClick={() => setModal(null)}
                >
                  Got it
                </button>
              </div>
            ) : modal.kind === "send" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const q = modal.quote;
                  window.location.href = `mailto:${encodeURIComponent(fd.get("email"))}?subject=${encodeURIComponent("Bright quotation " + q.id)}&body=${encodeURIComponent(fd.get("message"))}`;
                  notify(
                    "Email draft prepared in your mail app. Attach the quotation PDF before sending.",
                  );
                  setModal(null);
                }}
              >
                <div className="form-fields">
                  <label className="full">
                    Client email
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="client@company.com"
                    />
                  </label>
                  <label className="full">
                    Message
                    <textarea
                      name="message"
                      defaultValue={`Dear client,\n\nPlease find our quotation ${modal.quote.id} for ${modal.quote.service}. Estimated value: ${D.money(modal.quote.value)}. Valid until ${modal.quote.validity}.\n\nBest regards,\nBright Industrial Consultancy Service`}
                      rows={7}
                    />
                  </label>
                  <p className="form-hint">
                    Opens an email draft in your mail app. Download and attach
                    the quotation PDF before sending.
                  </p>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => printQuote(modal.quote)}
                  >
                    Download PDF
                  </button>
                  <button className="button primary">
                    <Mail size={15} /> Open email draft
                  </button>
                </div>
              </form>
            ) : (
              <RecordForm
                kind={modal.kind}
                initial={modal.edit}
                customers={customers}
                projects={projects}
                onCancel={() => setModal(null)}
                onSave={saveRecord}
              />
            )}
          </section>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          {toast}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
  function downloadDocument(d) {
    if (d.data) {
      const a = document.createElement("a");
      a.href = d.data;
      a.download = d.name;
      a.click();
    } else
      download(
        d.name.replace(/\.pdf$/i, ".txt"),
        `BRIGHT INDUSTRIAL CONSULTANCY SERVICE\nSample document record\n\n${d.name}\nCustomer: ${d.client}\nCategory: ${d.category}\nVersion: ${d.version}\nDate: ${d.date}\n\nThis is a sample document summary. Upload an actual file to store and download its contents.`,
      );
    notify(
      d.data ? "Document downloaded" : "Sample document summary downloaded",
    );
  }
  function saveRecord(record) {
    const kind = modal.kind,
      old = modal.edit;
    const prefix = {
      Customers: "CUS",
      "Leads & Enquiries": "LD",
      Quotations: "QT",
      Tenders: "TND",
      Projects: "PRJ",
      Manpower: "EMP",
      "Follow-ups": "FU",
      Documents: "DOC",
    }[kind];
    let data = {
      ...(old || {}),
      ...record,
      id: old?.id || `${prefix}-${Date.now().toString(36).toUpperCase()}`,
    };
    if (kind === "Customers") {
      data.projects = old?.projects || 0;
      data.lastContact = old?.lastContact || TODAY;
    }
    if (kind === "Leads & Enquiries") {
      data.stage = {
        New: "New Lead",
        Contacted: "Contacted",
        Qualified: "Requirement Received",
        "Proposal Sent": "Quotation Sent",
        Negotiation: "Negotiation",
        Won: "Won",
        Lost: "New Lead",
      }[data.status];
    }
    if (kind === "Projects") {
      data.progress = Number(data.progress || 0);
      data.team = Number(data.team || 1);
      data.color = old?.color || "blue";
    }
    if (kind === "Follow-ups" && /^\d{2}:\d{2}$/.test(data.time)) {
      const [h, m] = data.time.split(":");
      data.time =
        String(Number(h) % 12 || 12).padStart(2, "0") +
        ":" +
        m +
        (Number(h) >= 12 ? " PM" : " AM");
    }
    if (kind === "Documents") {
      data.date = TODAY;
      data.version = old
        ? "v" + ((parseInt(old.version.replace("v", "")) || 1) + 1) + ".0"
        : "v1.0";
      data.history = [
        ...(old?.history || []),
        ...(old
          ? [{ version: old.version, date: old.date, name: old.name }]
          : []),
      ];
    }
    const next = old
      ? collections[kind].map((x) => (x.id === old.id ? data : x))
      : [data, ...collections[kind]];
    try {
      localStorage.setItem(
        "bright-" +
          {
            Customers: "customers",
            "Leads & Enquiries": "leads",
            Quotations: "quotes",
            Tenders: "tenders",
            Projects: "projects",
            Manpower: "people",
            "Follow-ups": "followups",
            Documents: "docs",
          }[kind],
        JSON.stringify(next),
      );
    } catch {
      notify(
        "This browser could not save the record. Storage may be full or disabled. Try a smaller file.",
      );
      return;
    }
    setters[kind](next);
    setModal(null);
    notify(
      old ? "Record updated successfully" : "New record added successfully",
    );
  }
  function renderDetail() {
    const { kind, item } = detail;
    if (kind === "Documents") {
      if (tab === "Version history")
        return (
          <div className="activity-timeline">
            {[
              { version: item.version, date: item.date, name: item.name },
              ...(item.history || []),
            ].map((v, i) => (
              <div key={i}>
                <span className="activity-icon">
                  <FileText size={18} />
                </span>
                <h4>
                  {v.version} {i === 0 && <Badge>Active</Badge>}
                </h4>
                <p>{v.name}</p>
                <small>{v.date}</small>
              </div>
            ))}
          </div>
        );
      return (
        <>
          <div className="document-preview">
            <FileText size={54} />
            <h3>{item.name}</h3>
            <p>
              {item.category} · {item.version} · {item.size}
            </p>
            {item.data && item.data.startsWith("data:image/") ? (
              <img src={item.data} alt={item.name} />
            ) : item.data && item.data.startsWith("data:application/pdf") ? (
              <iframe title="Document preview" src={item.data} />
            ) : (
              <p>
                {item.data
                  ? "This file is ready to download."
                  : "Sample document. Upload a file to view its full contents."}
              </p>
            )}
            <button
              className="button primary"
              onClick={() => downloadDocument(item)}
            >
              <Download size={16} />{" "}
              {item.data ? "Download file" : "Download sample summary"}
            </button>
          </div>
        </>
      );
    }
    if (tab === "Notes")
      return (
        <>
          <h3>Internal notes</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!note.trim()) return;
              setNotes((v) => ({
                ...v,
                [item.id]: [
                  ...(v[item.id] || []),
                  { text: note, date: new Date().toLocaleString() },
                ],
              }));
              setNote("");
              notify("Note added");
            }}
          >
            <textarea
              className="note-input"
              placeholder="Add context for your team..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
            <button className="button primary">
              <Plus size={15} /> Add note
            </button>
          </form>
          {(notes[item.id] || []).map((n, i) => (
            <div className="note-card" key={i}>
              <strong>
                Adam Mitchell <small>{n.date}</small>
              </strong>
              <p>{n.text}</p>
            </div>
          ))}
        </>
      );
    if (["Communication History", "Client Communication"].includes(tab))
      return (
        <>
          <h3>Communication timeline</h3>
          <form
            className="inline-detail-form"
            onSubmit={(e) => {
              e.preventDefault();
              const entry = Object.fromEntries(new FormData(e.currentTarget));
              const now = new Date();
              setActivities((v) => ({
                ...v,
                [item.id]: [
                  {
                    ...entry,
                    person: "Adam Mitchell",
                    date: now.toLocaleDateString("en-GB"),
                    time: now.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  },
                  ...(v[item.id] || []),
                ],
              }));
              e.currentTarget.reset();
              notify("Communication logged");
            }}
          >
            <label>
              Communication type
              <select name="type">
                {["Email", "Phone Call", "WhatsApp", "Meeting", "Note"].map(
                  (t) => (
                    <option key={t}>{t}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              Summary
              <input
                name="summary"
                placeholder="What did you discuss?"
                required
              />
            </label>
            <label>
              Next action
              <input name="next" placeholder="What happens next?" required />
            </label>
            <button className="button primary">
              <Plus size={15} /> Log activity
            </button>
          </form>
          <div className="activity-timeline">
            {[...(activities[item.id] || []), ...D.communication].map(
              (a, i) => (
                <div key={i}>
                  <span className="activity-icon">
                    {a.type === "Email" ? (
                      <Mail size={18} />
                    ) : a.type === "Phone Call" ? (
                      <Phone size={18} />
                    ) : a.type === "WhatsApp" ? (
                      <MessageSquare size={18} />
                    ) : a.type === "Note" ? (
                      <Pencil size={18} />
                    ) : (
                      <Users size={18} />
                    )}
                  </span>
                  <h4>
                    {a.type}{" "}
                    <span>
                      {a.date} · {a.time}
                    </span>
                  </h4>
                  <strong>{a.person}</strong>
                  <p>{a.summary}</p>
                  <small>Next action: {a.next}</small>
                </div>
              ),
            )}
          </div>
        </>
      );
    if (tab === "Contacts")
      return (
        <>
          <h3>Client contacts</h3>
          {[
            {
              name: item.contact,
              email: item.email,
              phone: item.phone,
              role: "Primary contact",
            },
            ...(contacts[item.id] || []),
          ].map((c, i) => (
            <div className="contact-card" key={i}>
              <Avatar name={c.name} index={i} />
              <div>
                <h4>{c.name}</h4>
                <p>{c.role}</p>
                <a href={"mailto:" + c.email}>
                  <Mail size={14} />
                  {c.email}
                </a>
                <a href={"tel:" + c.phone}>
                  <Phone size={14} />
                  {c.phone}
                </a>
              </div>
            </div>
          ))}
          <h3 className="section-title">Add a contact</h3>
          <form
            className="inline-detail-form"
            onSubmit={(e) => {
              e.preventDefault();
              const c = Object.fromEntries(new FormData(e.currentTarget));
              setContacts((v) => ({
                ...v,
                [item.id]: [...(v[item.id] || []), c],
              }));
              e.currentTarget.reset();
              notify("Contact added");
            }}
          >
            {[
              ["name", "Full name"],
              ["role", "Job title"],
              ["email", "Email address"],
              ["phone", "Phone number"],
            ].map(([name, label]) => (
              <label key={name}>
                {label}
                <input
                  name={name}
                  type={
                    name === "email"
                      ? "email"
                      : name === "phone"
                        ? "tel"
                        : "text"
                  }
                  required
                />
              </label>
            ))}
            <button className="button primary">
              <Plus size={15} /> Add contact
            </button>
          </form>
        </>
      );
    if (["Enquiries", "Quotations", "Projects", "Documents"].includes(tab)) {
      const list =
        tab === "Enquiries"
          ? leads
          : tab === "Quotations"
            ? quotes
            : tab === "Projects"
              ? projects
              : docs;
      const related = list.filter(
        (x) =>
          (x.client || x.customer || x.company) === (item.name || item.client),
      );
      return (
        <>
          <h3>
            {tab} <span className="count-bubble">{related.length}</span>
          </h3>
          {related.length ? (
            related.map((r) => (
              <button
                className="related-record"
                key={r.id}
                onClick={() =>
                  openDetail(tab === "Enquiries" ? "Leads & Enquiries" : tab, r)
                }
              >
                <FileText size={19} />
                <div>
                  <strong>{r.name || r.project || r.company}</strong>
                  <small>{r.id}</small>
                </div>
                {r.status && <Badge>{r.status}</Badge>}
                <ChevronRight size={16} />
              </button>
            ))
          ) : (
            <p className="muted">
              No {tab.toLowerCase()} linked to this record yet.
            </p>
          )}
        </>
      );
    }
    if (tab === "Scope")
      return (
        <>
          <h3>Scope of work</h3>
          <p className="detail-paragraph">
            Provide {item.service.toLowerCase()} for {item.client} at{" "}
            {item.location}. Activities include planning, site assessment,
            certified personnel deployment, execution, quality review and
            delivery of final inspection reports.
          </p>
          {[
            "Review approved work order and technical specifications",
            "Mobilize certified engineers and calibrated equipment",
            "Perform inspection in accordance with client requirements",
            "Submit verified reports and recommendations",
          ].map((t) => (
            <div className="scope-item" key={t}>
              <CheckCircle2 size={17} />
              {t}
            </div>
          ))}
        </>
      );
    if (tab === "Team")
      return (
        <>
          <h3>Project team · {item.team} members</h3>
          {[
            item.manager,
            ...D.team.filter((n) => n !== item.manager).slice(0, 2),
          ].map((n, i) => (
            <div className="contact-card" key={n}>
              <Avatar name={n} index={i} />
              <div>
                <h4>{n}</h4>
                <p>
                  {i === 0
                    ? "Project Manager"
                    : i === 1
                      ? "Inspection Engineer"
                      : "QA/QC Engineer"}
                </p>
              </div>
              <Badge>Active</Badge>
            </div>
          ))}
        </>
      );
    if (tab === "Daily Updates")
      return (
        <>
          <h3>Daily progress</h3>
          <div className="activity-timeline">
            {[
              "Inspection activities progressing as scheduled. No safety observations.",
              "Equipment calibration verified. Client witnessed inspection activities.",
              "Team mobilized and site induction completed.",
            ].map((t, i) => (
              <div key={t}>
                <span className="activity-icon">
                  <Check size={18} />
                </span>
                <h4>{i === 0 ? "October 1" : "September " + (31 - i)}, 2026</h4>
                <p>{t}</p>
                <small>{item.manager} · Project Manager</small>
              </div>
            ))}
          </div>
        </>
      );
    if (tab === "Billing")
      return (
        <>
          <h3>Billing summary</h3>
          <div className="detail-info-grid">
            {[
              ["Quotation", "Approved"],
              ["Purchase / Work Order", "Received"],
              ["Invoice", "In preparation"],
              ["Payment", "Pending"],
            ].map(([a, b]) => (
              <div key={a}>
                <span>{a}</span>
                <strong>{b}</strong>
              </div>
            ))}
          </div>
          <p className="muted">
            Illustrative billing milestones for this sample project.
          </p>
        </>
      );
    if (tab === "Closure")
      return (
        <>
          <h3>Project closure</h3>
          <p className="muted">
            Confirm each deliverable before closing the project.
          </p>
          {[
            "Inspection activities completed",
            "Final reports submitted",
            "Client acceptance received",
            "Equipment demobilized",
            "Final invoice approved",
          ].map((t, i) => (
            <label className="closure-check" key={t}>
              <input
                type="checkbox"
                defaultChecked={item.progress === 100 && i < 2}
              />
              {t}
            </label>
          ))}
          <button
            className="button primary"
            onClick={() => {
              const checked = document.querySelectorAll(
                ".closure-check input:checked",
              ).length;
              if (checked < 5) {
                notify("Complete all five closure requirements first");
                return;
              }
              setProjects((v) =>
                v.map((p) =>
                  p.id === item.id
                    ? { ...p, status: "Closed", progress: 100 }
                    : p,
                ),
              );
              setDetail(null);
              notify("Project closed successfully");
            }}
          >
            Confirm project closure
          </button>
        </>
      );
    return (
      <>
        <h3>
          {kind === "Customers"
            ? "Company information"
            : kind === "Projects"
              ? "Project overview"
              : "Record overview"}
        </h3>
        <div className="detail-info-grid">
          {Object.entries(item)
            .filter(
              ([k]) => !["id", "color", "stage", "data", "history"].includes(k),
            )
            .map(([k, v]) => (
              <div key={k}>
                <span>{k.replace(/([A-Z])/g, " $1")}</span>
                <strong>
                  {k === "value"
                    ? D.money(v)
                    : Array.isArray(v)
                      ? v.join(", ")
                      : String(v)}
                </strong>
              </div>
            ))}
        </div>
        {kind === "Projects" && (
          <>
            <h3 className="section-title">Project timeline</h3>
            <div className="project-timeline">
              {[
                "Enquiry",
                "Quotation",
                "PO/WO",
                "Mobilization",
                "Execution",
                "Reporting",
                "Billing",
                "Closure",
              ].map((s, i) => (
                <div
                  className={
                    i < (item.progress === 100 ? 6 : 5) ? "finished" : ""
                  }
                  key={s}
                >
                  <span>
                    {i < (item.progress === 100 ? 6 : 4) ? (
                      <Check size={13} />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <small>{s}</small>
                </div>
              ))}
            </div>
          </>
        )}
        {kind === "Quotations" && (
          <div className="detail-actions">
            <button
              className="button secondary"
              onClick={() => printQuote(item)}
            >
              <Download size={16} /> Download PDF
            </button>
            <button
              className="button primary"
              onClick={() => setModal({ kind: "send", quote: item })}
            >
              <Send size={16} /> Send to client
            </button>
          </div>
        )}
      </>
    );
  }
}
function RevenueChart({ period }) {
  const yearly = period === "This year",
    quarter = period === "This quarter",
    last = period === "Last month";
  return (
    <div className="revenue-chart">
      <svg
        viewBox="0 0 650 210"
        role="img"
        aria-label={"Revenue and pipeline value trend for " + period}
      >
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#456991" stopOpacity=".15" />
            <stop offset="100%" stopColor="#456991" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[30, 70, 110, 150, 190].map((y, i) => (
          <g key={y}>
            <line
              x1="48"
              y1={y}
              x2="630"
              y2={y}
              stroke="var(--border)"
              strokeDasharray="3 5"
            />
            <text x="0" y={y + 4} fill="var(--muted)" fontSize="10">
              ${[400, 300, 200, 100, 0][i]}K
            </text>
          </g>
        ))}
        <path
          d={
            last
              ? "M48 173 C95 170 110 142 150 147 S230 116 265 130 S335 102 375 115 S445 65 485 90 S575 60 630 69 L630 190 L48 190Z"
              : "M48 167 C90 167 104 141 145 149 S215 118 258 130 S330 91 374 107 S436 79 478 88 S572 46 630 46 L630 190 L48 190Z"
          }
          fill="url(#revenueFill)"
        />
        <path
          d={
            last
              ? "M48 173 C95 170 110 142 150 147 S230 116 265 130 S335 102 375 115 S445 65 485 90 S575 60 630 69"
              : "M48 167 C90 167 104 141 145 149 S215 118 258 130 S330 91 374 107 S436 79 478 88 S572 46 630 46"
          }
          stroke="#2e4d73"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M48 145 C86 148 107 112 145 118 S220 83 258 92 S329 65 374 76 S440 39 478 50 S570 16 630 20"
          stroke="#d3aa44"
          strokeWidth="2.5"
          strokeDasharray="5 5"
          fill="none"
        />
        {(yearly
          ? ["Jan", "Mar", "May", "Jul", "Sep", "Nov"]
          : quarter
            ? ["Jul 01", "Jul 15", "Aug 01", "Aug 15", "Sep 01", "Sep 30"]
            : last
              ? ["Sep 01", "Sep 06", "Sep 12", "Sep 18", "Sep 24", "Sep 30"]
              : ["Oct 01", "Oct 06", "Oct 12", "Oct 18", "Oct 24", "Oct 31"]
        ).map((t, i) => (
          <text
            x={48 + i * 116}
            y="209"
            fontSize="10"
            fill="var(--muted)"
            textAnchor={i === 5 ? "end" : "start"}
            key={t}
          >
            {t}
          </text>
        ))}
      </svg>
    </div>
  );
}
function SummaryCards({ items }) {
  return (
    <div className="summary-cards">
      {items.map(([title, value, I]) => (
        <div className="panel summary-card" key={title}>
          <div>
            <span>{title}</span>
            <strong>{value}</strong>
          </div>
          <span className="kpi-icon blue">
            <I size={22} />
          </span>
        </div>
      ))}
    </div>
  );
}
const tableColumns = {
  Customers: [
    ["name", "Customer name"],
    ["company", "Company"],
    ["industry", "Industry"],
    ["contact", "Contact person"],
    ["phone", "Phone"],
    ["email", "Email"],
    ["location", "Location"],
    ["services", "Services used"],
    ["projects", "Active projects"],
    ["lastContact", "Last contact"],
    ["followup", "Next follow-up"],
    ["status", "Status"],
  ],
  "Leads & Enquiries": [
    ["id", "Lead ID"],
    ["company", "Company"],
    ["contact", "Contact person"],
    ["service", "Service required"],
    ["location", "Project location"],
    ["value", "Est. value"],
    ["source", "Source"],
    ["assigned", "Assigned to"],
    ["priority", "Priority"],
    ["status", "Status"],
    ["followup", "Next follow-up"],
  ],
  Quotations: [
    ["id", "Quotation number"],
    ["customer", "Customer"],
    ["service", "Service"],
    ["project", "Project"],
    ["date", "Quotation date"],
    ["validity", "Valid until"],
    ["value", "Est. value"],
    ["assigned", "Assigned to"],
    ["status", "Status"],
  ],
  Tenders: [
    ["id", "Tender ID"],
    ["title", "Tender title"],
    ["client", "Client / Organization"],
    ["source", "Source"],
    ["service", "Service category"],
    ["deadline", "Submission deadline"],
    ["value", "Est. value"],
    ["assigned", "Assigned to"],
    ["status", "Status"],
  ],
  Projects: [
    ["id", "Project ID"],
    ["name", "Project name"],
    ["client", "Client"],
    ["location", "Location"],
    ["service", "Service"],
    ["manager", "Project manager"],
    ["start", "Start date"],
    ["end", "End date"],
    ["team", "Team"],
    ["progress", "Progress"],
    ["status", "Status"],
  ],
  Manpower: [
    ["name", "Candidate name"],
    ["qualification", "Qualification"],
    ["experience", "Experience"],
    ["specialization", "Specialization"],
    ["certification", "Certification"],
    ["availability", "Availability"],
    ["location", "Location"],
    ["requirement", "Client requirement"],
    ["interview", "Interview status"],
    ["status", "Deployment status"],
    ["project", "Linked project"],
  ],
  "Follow-ups": [
    ["client", "Client"],
    ["task", "Task"],
    ["type", "Type"],
    ["due", "Due date"],
    ["assigned", "Assigned to"],
    ["priority", "Priority"],
    ["status", "Status"],
  ],
};
function RecordTable({ page, rows, open, edit, complete, print, send }) {
  return (
    <div className="table-scroll">
      <table className="record-table">
        <thead>
          <tr>
            {(tableColumns[page] || []).map(([k, t]) => (
              <th key={k}>{t}</th>
            ))}
            <th className="sticky-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id}>
              {(tableColumns[page] || []).map(([k], j) => (
                <td key={k}>
                  {["status", "priority"].includes(k) ? (
                    <Badge>{r[k]}</Badge>
                  ) : k === "value" ? (
                    <strong>{D.money(r[k])}</strong>
                  ) : k === "progress" ? (
                    <div className="table-progress">
                      <span>{r[k]}%</span>
                      <div>
                        <i style={{ width: r[k] + "%" }} />
                      </div>
                    </div>
                  ) : j === 0 ? (
                    <button className="record-name" onClick={() => open(r)}>
                      {["Customers", "Manpower"].includes(page) && (
                        <Avatar name={r[k]} small index={i} />
                      )}
                      <strong>{r[k]}</strong>
                    </button>
                  ) : Array.isArray(r[k]) ? (
                    <div className="service-tags">
                      {r[k].map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  ) : k === "email" ? (
                    <a href={"mailto:" + r[k]}>{r[k]}</a>
                  ) : ["assigned", "manager"].includes(k) ? (
                    <span className="assigned-cell">
                      <Avatar name={r[k]} small index={i} />
                      {r[k]}
                    </span>
                  ) : (
                    String(r[k] ?? "—")
                  )}
                </td>
              ))}
              <td className="sticky-actions">
                <div className="row-actions">
                  <button
                    className="icon-button"
                    title="View"
                    onClick={() => open(r)}
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    className="icon-button"
                    title="Edit"
                    onClick={() => edit(r)}
                  >
                    <Pencil size={14} />
                  </button>
                  {page === "Quotations" && (
                    <>
                      <button
                        className="icon-button"
                        title="Download PDF"
                        onClick={() => print(r)}
                      >
                        <Download size={15} />
                      </button>
                      <button
                        className="icon-button"
                        title="Send to client"
                        onClick={() => send(r)}
                      >
                        <Send size={14} />
                      </button>
                    </>
                  )}
                  {page === "Follow-ups" && (
                    <button
                      className="icon-button"
                      title={
                        r.status === "Completed"
                          ? "Reopen task"
                          : "Complete task"
                      }
                      onClick={() => complete(r.id)}
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Pipeline({ leads, setLeads, open }) {
  const [dragged, setDragged] = useState(null);
  const update = (id, stage) => {
    setLeads((all) =>
      all.map((l) =>
        l.id === id
          ? {
              ...l,
              stage,
              status: {
                "New Lead": "New",
                Contacted: "Contacted",
                "Requirement Received": "Qualified",
                "Quotation Sent": "Proposal Sent",
                Negotiation: "Negotiation",
                Won: "Won",
                "Project Started": "Won",
              }[stage],
            }
          : l,
      ),
    );
  };
  return (
    <div className="kanban">
      {D.stages.map((s, i) => (
        <div
          className={"kanban-column stage-" + i}
          key={s}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (dragged) update(dragged, s);
            setDragged(null);
          }}
        >
          <div className="kanban-heading">
            <span>
              <i />
              {s}
            </span>
            <b>{leads.filter((l) => l.stage === s).length}</b>
          </div>
          <small className="column-total">
            {D.money(
              leads
                .filter((l) => l.stage === s)
                .reduce((a, l) => a + Number(l.value), 0),
            )}
          </small>
          {leads
            .filter((l) => l.stage === s)
            .map((l) => (
              <article
                className="kanban-card"
                key={l.id}
                draggable
                onDragStart={() => setDragged(l.id)}
                onDragEnd={() => setDragged(null)}
              >
                <div className="kanban-card-top">
                  <Badge>{l.priority}</Badge>
                  <GripVertical size={15} />
                </div>
                <button onClick={() => open(l)}>
                  <h3>{l.company}</h3>
                </button>
                <p>{l.service.join(", ")}</p>
                <strong className="kanban-value">{D.money(l.value)}</strong>
                <small>
                  <CalendarClock size={12} />
                  {l.followup}
                </small>
                <div className="kanban-assignee">
                  <Avatar name={l.assigned} small />
                  <span>{l.assigned}</span>
                </div>
                <select
                  aria-label={"Move " + l.company + " to stage"}
                  value={s}
                  onChange={(e) => update(l.id, e.target.value)}
                >
                  {D.stages.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </article>
            ))}
        </div>
      ))}
    </div>
  );
}
function toInputTime(time) {
  if (/^\d{2}:\d{2}$/.test(time)) return time;
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  return match
    ? String(
        (Number(match[1]) % 12) + (match[3].toUpperCase() === "PM" ? 12 : 0),
      ).padStart(2, "0") +
        ":" +
        match[2]
    : "";
}
function RecordForm({ kind, initial, customers, projects, onSave, onCancel }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState(
      initial?.services || initial?.service || [],
    );
  const cNames = customers.map((c) => c.name),
    pNames = projects.map((p) => p.name);
  const text = (
    key,
    label,
    type = "text",
    options = null,
    required = true,
  ) => ({ key, label, type, options, required });
  const select = (key, label, opts, required = true) =>
    text(key, label, "select", opts, required);
  const fields =
    {
      Customers: [
        text("name", "Customer name"),
        text("company", "Company"),
        select("industry", "Industry", [
          "Oil & Gas",
          "Petrochemical",
          "Engineering",
          "Energy",
          "Manufacturing",
          "Construction",
        ]),
        text("contact", "Contact person"),
        text("phone", "Phone", "tel"),
        text("email", "Email", "email"),
        text("location", "Location"),
        text("followup", "Next follow-up", "date"),
        select("status", "Status", ["Active", "Prospect", "Inactive"]),
      ],
      "Leads & Enquiries": [
        select("company", "Company", cNames),
        text("contact", "Contact person"),
        text("location", "Project location"),
        text("value", "Estimated value (USD)", "number"),
        select("source", "Source", [
          "Website",
          "LinkedIn",
          "WhatsApp",
          "Referral",
          "Tender",
          "Existing Client",
          "Direct Enquiry",
        ]),
        select("assigned", "Assigned to", D.team),
        select("priority", "Priority", ["High", "Medium", "Low"]),
        select("status", "Status", [
          "New",
          "Contacted",
          "Qualified",
          "Proposal Sent",
          "Negotiation",
          "Won",
          "Lost",
        ]),
        text("followup", "Next follow-up", "date"),
      ],
      Quotations: [
        select("customer", "Customer", cNames),
        select("service", "Service", D.services),
        text("project", "Project"),
        text("date", "Quotation date", "date"),
        text("validity", "Valid until", "date"),
        text("value", "Estimated value (USD)", "number"),
        select("assigned", "Assigned employee", D.team),
        select("status", "Status", [
          "Draft",
          "Sent",
          "Under Review",
          "Negotiation",
          "Approved",
          "Rejected",
          "Expired",
        ]),
      ],
      Tenders: [
        text("title", "Tender title"),
        select("client", "Client / Organization", cNames),
        text("source", "Tender source"),
        select("service", "Service category", Object.keys(D.serviceGroups)),
        text("deadline", "Submission deadline", "date"),
        text("value", "Estimated value (USD)", "number"),
        select("assigned", "Assigned to", D.team),
        select("status", "Status", [
          "Identified",
          "Under Evaluation",
          "Preparing",
          "Submitted",
          "Technical Qualified",
          "Financial Submitted",
          "Won",
          "Lost",
        ]),
      ],
      Projects: [
        text("name", "Project name"),
        select("client", "Client", cNames),
        text("location", "Location"),
        select("service", "Service", Object.keys(D.serviceGroups)),
        select("manager", "Project manager", D.team),
        text("start", "Start date", "date"),
        text("end", "End date", "date"),
        text("team", "Team size", "number"),
        text("progress", "Progress (%)", "number"),
        select("status", "Status", [
          "Planning",
          "Active",
          "On Hold",
          "Completed",
          "Pending Closure",
          "Closed",
        ]),
      ],
      Manpower: [
        text("name", "Candidate name"),
        text("qualification", "Qualification"),
        text("experience", "Experience"),
        text("specialization", "Specialization"),
        text("certification", "Certification"),
        select("availability", "Availability", [
          "Available",
          "2 weeks notice",
          "1 month notice",
          "On project",
        ]),
        text("location", "Location"),
        text("requirement", "Client requirement"),
        select("interview", "Interview status", [
          "Pending",
          "Scheduled",
          "Completed",
        ]),
        select("status", "Candidate status", [
          "New",
          "Shortlisted",
          "Interview Scheduled",
          "Selected",
          "Rejected",
          "Deployed",
        ]),
        select("project", "Linked project", pNames, false),
      ],
      "Follow-ups": [
        select("client", "Client", cNames),
        text("task", "Task"),
        select("type", "Follow-up type", [
          "Client Follow-up",
          "Quotation Follow-up",
          "Tender Follow-up",
          "Payment Follow-up",
          "Recruitment Follow-up",
          "Project Follow-up",
          "Document Follow-up",
        ]),
        text("due", "Due date", "date"),
        text("time", "Time", "time"),
        select("assigned", "Assigned to", D.team),
        select("priority", "Priority", ["High", "Medium", "Low"]),
        select("status", "Status", ["Pending", "Completed"]),
      ],
      Documents: [
        select("category", "Category", [
          "Work Orders",
          "Purchase Orders",
          "Quotations",
          "Invoices",
          "Inspection Reports",
          "Certificates",
          "Client Documents",
          "Employee Documents",
          "Tender Documents",
        ]),
        select("client", "Client", cNames),
      ],
    }[kind] || [];
  async function submit(e) {
    e.preventDefault();
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (kind === "Customers" || kind === "Leads & Enquiries") {
      if (!selected.length) {
        setError("Select at least one service.");
        return;
      }
      data[kind === "Customers" ? "services" : "service"] = selected;
    }
    if (data.end && data.start && data.end < data.start) {
      setError("The end date must be on or after the start date.");
      return;
    }
    if (data.validity && data.date && data.validity < data.date) {
      setError("Quotation validity must be on or after its date.");
      return;
    }
    if (kind === "Documents") {
      const file = data.file;
      if (!file || !file.size) {
        setError("Choose a file to upload.");
        return;
      }
      if (file.size > 2000000) {
        setError(
          "Please select a file smaller than 2 MB for this local workspace.",
        );
        return;
      }
      setBusy(true);
      try {
        data.data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        data.name = file.name;
        data.size = Math.round(file.size / 1024) + " KB";
        delete data.file;
      } catch {
        setError("This file could not be read. Try again.");
        setBusy(false);
        return;
      }
    }
    onSave(data);
  }
  return (
    <form onSubmit={submit}>
      <div className="form-fields">
        {kind === "Documents" && (
          <label className="upload-zone full">
            <Upload size={28} />
            <strong>
              {initial ? "Upload a new version" : "Choose a document"}
            </strong>
            <span>PDF, images, Word or Excel · up to 2 MB</span>
            <input
              type="file"
              name="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.csv,.txt"
              required
            />
          </label>
        )}
        {fields.map((f) => (
          <label key={f.key}>
            {f.label}
            {f.required && <span className="required"> *</span>}
            {f.type === "select" ? (
              <select
                name={f.key}
                defaultValue={initial?.[f.key] || ""}
                required={f.required}
              >
                <option value="">Select {f.label.toLowerCase()}</option>
                {f.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                name={f.key}
                type={f.type}
                defaultValue={
                  f.type === "time" && initial?.time
                    ? toInputTime(initial.time)
                    : initial?.[f.key] || (f.type === "date" ? TODAY : "")
                }
                required={f.required}
                min={f.type === "number" ? 0 : undefined}
                max={f.key === "progress" ? 100 : undefined}
                placeholder={f.label}
              />
            )}
          </label>
        ))}
        {["Customers", "Leads & Enquiries"].includes(kind) && (
          <fieldset className="full service-fieldset">
            <legend>
              Services required <span className="required">*</span>
            </legend>
            {Object.entries(D.serviceGroups).map(([group, opts]) => (
              <div key={group}>
                <strong>{group}</strong>
                <div>
                  {opts.map((s) => (
                    <label key={s}>
                      <input
                        type="checkbox"
                        checked={selected.includes(s)}
                        onChange={(e) =>
                          setSelected((v) =>
                            e.target.checked
                              ? [...v, s]
                              : v.filter((x) => x !== s),
                          )
                        }
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
        )}
        {error && (
          <p className="form-error full" role="alert">
            {error}
          </p>
        )}
      </div>
      <div className="form-actions">
        <button className="button secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="button primary" disabled={busy}>
          {busy
            ? "Uploading…"
            : initial
              ? "Save changes"
              : kind === "Documents"
                ? "Upload document"
                : "Create record"}
          <Check size={15} />
        </button>
      </div>
    </form>
  );
}
function Reports({
  period,
  filters,
  setFilters,
  customers,
  projects,
  leads,
  tenders,
  people,
}) {
  return (
    <>
      <div className="report-filter-bar">
        <Filter size={17} />
        <strong>Report filters</strong>
        {[
          ["service", Object.keys(D.serviceGroups), "All services"],
          ["client", customers.map((c) => c.name), "All clients"],
          ["employee", D.team, "All employees"],
        ].map(([k, opts, label]) => (
          <select
            key={k}
            aria-label={label}
            value={filters[k] || ""}
            onChange={(e) => setFilters({ ...filters, [k]: e.target.value })}
          >
            <option value="">{label}</option>
            {opts.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ))}
        <button className="text-link" onClick={() => setFilters({})}>
          Reset
        </button>
      </div>
      {Object.values(filters).some(Boolean) && (
        <div className="report-context">
          Report scope: {Object.values(filters).filter(Boolean).join(" · ")}.
          Charts show illustrative performance for this selection.
        </div>
      )}
      <SummaryCards
        items={[
          [
            "Revenue",
            period === "This year"
              ? "$2.84M"
              : period === "This quarter"
                ? "$842.5K"
                : "$284.5K",
            TrendingUp,
          ],
          [
            "Lead conversion",
            Math.round(
              (leads.filter((l) => l.status === "Won").length / leads.length) *
                100,
            ) + "%",
            Target,
          ],
          [
            "Tender success",
            Math.round(
              (tenders.filter((t) => t.status === "Won").length /
                Math.max(
                  1,
                  tenders.filter((t) => ["Won", "Lost"].includes(t.status))
                    .length,
                )) *
                100,
            ) + "%",
            FileCheck2,
          ],
          [
            "Manpower deployed",
            people.filter((p) => p.status === "Deployed").length,
            HardHat,
          ],
        ]}
      />
      <div className="reports-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Quotation value & revenue</h2>
              <p>Business performance · {period}</p>
            </div>
            <TrendingUp size={19} />
          </div>
          <RevenueChart period={period} />
        </section>
        {[
          [
            "Lead conversion",
            ["New", "Contacted", "Qualified", "Proposal", "Won"],
            [24, 18, 15, 12, 8],
          ],
          [
            "Monthly enquiries",
            ["Jun", "Jul", "Aug", "Sep", "Oct"],
            [12, 16, 14, 22, 18],
          ],
          [
            "Tender participation",
            ["Identified", "Preparing", "Submitted", "Won", "Lost"],
            [8, 5, 6, 3, 2],
          ],
          [
            "Tender success",
            ["May", "Jun", "Jul", "Aug", "Sep"],
            [35, 42, 38, 52, 65],
          ],
          [
            "Revenue by service",
            ["NDT & Advanced NDT", "Skilled Manpower", "TPI, QA & QC"],
            [50, 32, 18],
          ],
          [
            "Projects by status",
            ["Planning", "Active", "Completed", "Pending closure"],
            [2, 7, 18, 2],
          ],
          [
            "Customer acquisition",
            ["Jun", "Jul", "Aug", "Sep", "Oct"],
            [9, 12, 8, 14, 16],
          ],
          [
            "Manpower deployment",
            ["Engineers", "NDT Technicians", "QA/QC", "Skilled manpower"],
            [12, 24, 18, 15],
          ],
        ].map(([title, labels, values], idx) => (
          <section className="panel report-chart" key={title}>
            <div className="panel-heading">
              <div>
                <h2>{title}</h2>
                <p>
                  {period} · {filters.service || "All services"}
                </p>
              </div>
              <ChartNoAxesCombined size={19} />
            </div>
            <div className="bar-chart">
              {labels.map((label, i) => (
                <div key={label}>
                  <span>{label}</span>
                  <div>
                    <i
                      style={{
                        width:
                          (values[i] / Math.max(...values)) *
                            90 *
                            (Object.values(filters).filter(Boolean).length
                              ? 0.72
                              : 1) +
                          "%",
                        background: i % 2 === 0 ? "#28486b" : "#dfb65a",
                      }}
                    />
                  </div>
                  <strong>
                    {Math.round(
                      values[i] *
                        (Object.values(filters).filter(Boolean).length
                          ? 0.72
                          : 1),
                    )}
                    {idx === 3 || idx === 4 ? "%" : ""}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="report-note">
        Illustrative analytics for the sample workspace. Live reporting requires
        a connected business data source.
      </p>
    </>
  );
}
function SettingsPage({ settings, setSettings, notify, dark, setDark }) {
  const [tab, setTab] = useState("Company"),
    [role, setRole] = useState("Admin");
  const modules = [
    "Customers",
    "Leads & Enquiries",
    "Quotations",
    "Tenders",
    "Projects",
    "Manpower",
    "Follow-ups",
    "Documents",
    "Reports",
    "Settings",
  ];
  const roles = {
    Admin: modules,
    Management: [
      "Customers",
      "Leads & Enquiries",
      "Quotations",
      "Tenders",
      "Projects",
      "Manpower",
      "Follow-ups",
      "Documents",
      "Reports",
    ],
    "Business Development": [
      "Customers",
      "Leads & Enquiries",
      "Quotations",
      "Tenders",
      "Follow-ups",
      "Documents",
    ],
    Operations: ["Projects", "Manpower", "Follow-ups", "Documents"],
    Recruitment: ["Manpower", "Follow-ups", "Documents"],
    "Project Manager": ["Projects", "Follow-ups", "Documents"],
  };
  return (
    <section className="panel settings-panel">
      <div className="detail-tabs">
        {["Company", "Users & permissions", "Appearance"].map((t) => (
          <button
            key={t}
            className={t === tab ? "selected" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Company" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSettings(Object.fromEntries(new FormData(e.currentTarget)));
            notify("Company settings saved");
          }}
        >
          <div className="settings-intro">
            <h2>Company information</h2>
            <p>Manage your company profile and workspace defaults.</p>
          </div>
          <div className="form-fields">
            {[
              ["name", "Company name"],
              ["email", "Company email"],
              ["location", "Head office"],
            ].map(([k, label]) => (
              <label key={k}>
                {label}
                <input
                  name={k}
                  defaultValue={settings[k]}
                  type={k === "email" ? "email" : "text"}
                  required
                />
              </label>
            ))}
            <label>
              Reporting currency
              <select name="currency" defaultValue={settings.currency}>
                <option value="USD">USD — US Dollar</option>
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button className="button primary">Save changes</button>
          </div>
        </form>
      ) : tab === "Appearance" ? (
        <div className="settings-intro">
          <h2>Workspace appearance</h2>
          <p>Choose a comfortable look for your working day.</p>
          <div className="appearance-options">
            <button
              className={!dark ? "selected" : ""}
              onClick={() => setDark(false)}
            >
              <Sun size={28} />
              <strong>Light</strong>
              <span>Clear and bright</span>
            </button>
            <button
              className={dark ? "selected" : ""}
              onClick={() => setDark(true)}
            >
              <Moon size={28} />
              <strong>Dark</strong>
              <span>Easy on the eyes</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="settings-intro">
          <h2>Roles & permissions</h2>
          <p>
            Preview the suggested access policy for each team role.
            Server-enforced access and user invitations require an
            authentication backend.
          </p>
          <div className="role-selector">
            {Object.keys(roles).map((r) => (
              <button
                className={role === r ? "selected" : ""}
                key={r}
                onClick={() => setRole(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <table className="permissions-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>View</th>
                <th>Edit</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m}>
                  <td>{m}</td>
                  {[0, 1, 2].map((n) => (
                    <td key={n}>
                      {roles[role].includes(m) &&
                      (n < 2 || role === "Admin" || role === "Management") ? (
                        <CheckCircle2 size={18} className="permission-yes" />
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
createRoot(document.getElementById("root")).render(<App />);
