import { useState, useRef } from "react";
import {
  Shield, Eye, EyeOff, LayoutDashboard, CalendarDays, Users, FileText,
  Bell, LogOut, Plus, X, ChevronRight, MapPin, Clock, Tag, AlertTriangle,
  CheckCircle, MessageSquare, Video, Navigation, Upload, Send, Search,
  Edit2, Trash2, Save, ChevronDown, Activity, Phone, AlertCircle,
  Car, Flag, Zap, History, FilePlus, FileCheck, UserPlus, UserMinus,
  RefreshCw, Download, Eye as EyeIcon, XCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "protokoler" | "pimpinan";
type View = "dashboard" | "agenda" | "pejabat" | "dokumen";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  tipe: "rundown" | "sambutan" | "lampiran";
  uploadedAt: string;
  url: string;
}

interface RiwayatPejabat {
  id: string;
  jenis: "pelantikan" | "mutasi" | "pensiun";
  jabatanLama: string;
  jabatanBaru: string;
  instansiLama: string;
  instansiBaru: string;
  tanggal: string;
  noSK: string;
  keterangan: string;
}

interface Pejabat {
  id: string;
  nama: string;
  jabatan: string;
  instansi: string;
  eselon: string;
  inisial: string;
  status: "aktif" | "pensiun" | "mutasi";
  noHP: string;
  nip: string;
  riwayat: RiwayatPejabat[];
}

interface Event {
  id: string;
  judul: string;
  tanggal: string;
  waktu: string;
  tempat: string;
  dresscode: string;
  deskripsi: string;
  pejabatIds: string[];
  status: "akan_datang" | "berlangsung" | "selesai" | "dibatalkan";
  prioritas: "tinggi" | "sedang" | "rendah";
  koordinatMaps: string;
  statusPimpinan: Record<string, "menunggu" | "otw" | "tunda" | "batal" | "hadir">;
  notifikasi: boolean;
  kategori: string;
  pesertaCount: number;
  files: UploadedFile[];
}

interface ChatMsg {
  id: string;
  sender: string;
  isi: string;
  waktu: string;
  type: "text" | "info" | "alert";
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seedPejabat: Pejabat[] = [
  {
    id: "PJB-001", inisial: "RK", status: "aktif",
    nama: "H. Ridwan Kamil, S.T., M.U.D.", jabatan: "Gubernur", instansi: "Pemerintah Provinsi Banten",
    eselon: "Jabatan Politik", nip: "—", noHP: "+62811-2222-0001",
    riwayat: [
      { id: "R1", jenis: "pelantikan", jabatanLama: "Walikota Serang", jabatanBaru: "Gubernur Banten", instansiLama: "Pemkot Serang", instansiBaru: "Pemprov Banten", tanggal: "2018-09-05", noSK: "SK.PRESIDEN/2018/BTN-GOV", keterangan: "Pelantikan Gubernur periode 2018–2023 oleh Presiden RI" },
      { id: "R2", jenis: "pelantikan", jabatanLama: "Gubernur Banten", jabatanBaru: "Gubernur Banten", instansiLama: "Pemprov Banten", instansiBaru: "Pemprov Banten", tanggal: "2023-09-05", noSK: "SK.PRESIDEN/2023/BTN-GOV", keterangan: "Pelantikan kembali Gubernur periode 2023–2028" },
    ],
  },
  {
    id: "PJB-002", inisial: "RU", status: "aktif",
    nama: "Dr. H. Uu Ruzhanul Ulum, S.E., M.Si.", jabatan: "Wakil Gubernur", instansi: "Pemerintah Provinsi Banten",
    eselon: "Jabatan Politik", nip: "—", noHP: "+62812-4444-0002",
    riwayat: [
      { id: "R1", jenis: "pelantikan", jabatanLama: "Bupati Pandeglang", jabatanBaru: "Wakil Gubernur Banten", instansiLama: "Pemkab Pandeglang", instansiBaru: "Pemprov Banten", tanggal: "2018-09-05", noSK: "SK.PRESIDEN/2018/BTN-WAGOV", keterangan: "Pelantikan Wakil Gubernur bersama Gubernur" },
    ],
  },
  {
    id: "PJB-003", inisial: "SW", status: "aktif",
    nama: "Dr. Ir. Setiawan Wangsaatmaja, Dipl.SE., M.Eng.", jabatan: "Sekretaris Daerah", instansi: "Sekretariat Daerah Prov. Banten",
    eselon: "Eselon I-A", nip: "196612251994031001", noHP: "+62813-6666-0003",
    riwayat: [
      { id: "R1", jenis: "mutasi", jabatanLama: "Kepala Bappeda Prov. Banten", jabatanBaru: "Sekretaris Daerah Prov. Banten", instansiLama: "Bappeda Banten", instansiBaru: "Setda Prov. Banten", tanggal: "2021-03-15", noSK: "SK.GUB/2021/SETDA-001", keterangan: "Mutasi jabatan eselon I berdasarkan keputusan Gubernur" },
    ],
  },
  {
    id: "PJB-004", inisial: "SA", status: "aktif",
    nama: "Hj. Siti Aminah, S.H., M.H.", jabatan: "Kepala Biro Administrasi Pimpinan", instansi: "Sekretariat Daerah Prov. Banten",
    eselon: "Eselon II-A", nip: "197205141998032002", noHP: "+62815-1111-0004",
    riwayat: [
      { id: "R1", jenis: "pelantikan", jabatanLama: "Kabag Protokol & Humas", jabatanBaru: "Kepala Biro Administrasi Pimpinan", instansiLama: "Setda Prov. Banten", instansiBaru: "Setda Prov. Banten", tanggal: "2022-01-10", noSK: "SK.GUB/2022/BIRO-ADM-001", keterangan: "Pelantikan Kepala Biro berdasarkan restrukturisasi organisasi" },
    ],
  },
  {
    id: "PJB-005", inisial: "BS", status: "aktif",
    nama: "Drs. H. Budi Santosa, M.M.", jabatan: "Kepala Bagian Protokol", instansi: "Biro Administrasi Pimpinan",
    eselon: "Eselon III-A", nip: "196803122000121001", noHP: "+62816-3333-0005",
    riwayat: [
      { id: "R1", jenis: "mutasi", jabatanLama: "Kasubbag Protokol Kab. Serang", jabatanBaru: "Kepala Bagian Protokol Prov.", instansiLama: "Pemkab Serang", instansiBaru: "Biro Adm Pimpinan", tanggal: "2020-07-20", noSK: "SK.GUB/2020/PROT-BAG-002", keterangan: "Mutasi antar instansi pemerintah provinsi" },
    ],
  },
  {
    id: "PJB-006", inisial: "HW", status: "pensiun",
    nama: "Drs. Hendra Wijaya, M.Si.", jabatan: "Staf Ahli Gubernur Bid. Kemasyarakatan", instansi: "Pemerintah Provinsi Banten",
    eselon: "Eselon II-B", nip: "196002151985031004", noHP: "+62817-5555-0006",
    riwayat: [
      { id: "R1", jenis: "pensiun", jabatanLama: "Staf Ahli Gubernur", jabatanBaru: "—", instansiLama: "Pemprov Banten", instansiBaru: "—", tanggal: "2026-06-01", noSK: "SK.BKN/2026/PENSIUN-0128", keterangan: "Pensiun karena mencapai batas usia pensiun 60 tahun" },
    ],
  },
];

const TODAY = "2026-07-05";

const seedEvents: Event[] = [
  {
    id: "EVT-001", judul: "Upacara Peringatan Hari Jadi Provinsi ke-376",
    tanggal: TODAY, waktu: "07:30", tempat: "Lapangan KP3B, Serang",
    dresscode: "PSH (Pakaian Sipil Harian) warna abu-abu",
    deskripsi: "Upacara resmi peringatan hari jadi provinsi yang dihadiri seluruh kepala dinas dan undangan.",
    pejabatIds: ["PJB-001", "PJB-002", "PJB-003"], status: "berlangsung", prioritas: "tinggi",
    koordinatMaps: "-6.1666,106.1557", notifikasi: true,
    statusPimpinan: { "PJB-001": "hadir", "PJB-002": "otw", "PJB-003": "hadir" },
    kategori: "Seremonial", pesertaCount: 450,
    files: [
      { id: "f1", name: "Rundown_Upacara_HariJadi376.pdf", size: 245000, tipe: "rundown", uploadedAt: "2026-07-04 16:30", url: "" },
      { id: "f2", name: "Sambutan_Gubernur_HariJadi.pdf", size: 128000, tipe: "sambutan", uploadedAt: "2026-07-04 17:00", url: "" },
    ],
  },
  {
    id: "EVT-002", judul: "Rapat Koordinasi Penanganan Banjir Ciujung",
    tanggal: TODAY, waktu: "10:00", tempat: "Ruang Rapat Utama KP3B, Lt. 2",
    dresscode: "PSH Putih — Kemeja batik diperbolehkan",
    deskripsi: "Rapat koordinasi lintas SKPD terkait penanganan darurat banjir di kawasan DAS Ciujung.",
    pejabatIds: ["PJB-003", "PJB-004"], status: "akan_datang", prioritas: "tinggi",
    koordinatMaps: "-6.1678,106.1570", notifikasi: true,
    statusPimpinan: { "PJB-003": "menunggu", "PJB-004": "otw" },
    kategori: "Rapat", pesertaCount: 35,
    files: [
      { id: "f3", name: "Undangan_Rakor_Ciujung_No.005-2026.pdf", size: 312000, tipe: "lampiran", uploadedAt: "2026-07-03 09:00", url: "" },
    ],
  },
  {
    id: "EVT-003", judul: "Audiensi DPRD Provinsi — Pembahasan APBD Perubahan",
    tanggal: "2026-07-07", waktu: "09:00", tempat: "Gedung DPRD Provinsi Banten, Ruang Paripurna",
    dresscode: "Pakaian Dinas Upacara (PDU) lengkap",
    deskripsi: "Audiensi resmi dengan pimpinan DPRD untuk pembahasan postur anggaran perubahan.",
    pejabatIds: ["PJB-001", "PJB-003"], status: "akan_datang", prioritas: "tinggi",
    koordinatMaps: "-6.1710,106.1620", notifikasi: false,
    statusPimpinan: { "PJB-001": "menunggu", "PJB-003": "menunggu" },
    kategori: "Audiensi", pesertaCount: 60,
    files: [],
  },
];

const seedChats: Record<string, ChatMsg[]> = {
  "EVT-001": [
    { id: "c1", sender: "Sistem ProAktif", isi: "📋 Acara dimulai dalam 2 jam. Harap bersiap.", waktu: "05:30", type: "info" },
    { id: "c2", sender: "Ahmad Fauzi (Protokol)", isi: "Gubernur konfirmasi tiba pukul 07:15. Koordinasikan penyambutan.", waktu: "06:45", type: "text" },
    { id: "c3", sender: "Sistem ProAktif", isi: "🔴 STATUS UPDATE: Gubernur — HADIR di lokasi.", waktu: "07:18", type: "alert" },
  ],
  "EVT-002": [
    { id: "c1", sender: "Sistem ProAktif", isi: "📋 Rapat koordinasi 10:00 WIB. Agenda dikirim ke semua peserta.", waktu: "08:00", type: "info" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusPimpinanCfg = {
  menunggu: { label: "Menunggu", color: "text-muted-foreground", bg: "bg-muted border-border", icon: <Clock className="w-3 h-3" /> },
  otw:     { label: "OTW",      color: "text-blue-700",  bg: "bg-blue-50 border-blue-200",   icon: <Car className="w-3 h-3" /> },
  hadir:   { label: "Hadir",    color: "text-primary",   bg: "bg-green-50 border-green-200", icon: <CheckCircle className="w-3 h-3" /> },
  tunda:   { label: "Tunda",    color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: <AlertTriangle className="w-3 h-3" /> },
  batal:   { label: "Batal",    color: "text-destructive", bg: "bg-red-50 border-red-200",   icon: <XCircle className="w-3 h-3" /> },
};

const eventStatusCfg = {
  akan_datang: { label: "Akan Datang",  cls: "bg-blue-50 text-blue-700 border-blue-200" },
  berlangsung: { label: "Berlangsung",  cls: "bg-green-50 text-primary border-green-200" },
  selesai:     { label: "Selesai",      cls: "bg-muted text-muted-foreground border-border" },
  dibatalkan:  { label: "Dibatalkan",   cls: "bg-red-50 text-destructive border-red-200" },
};

const prioritasCfg = {
  tinggi: { label: "Prioritas Tinggi", dot: "bg-destructive" },
  sedang:  { label: "Prioritas Sedang", dot: "bg-accent" },
  rendah:  { label: "Prioritas Rendah", dot: "bg-muted-foreground" },
};

const riwayatCfg = {
  pelantikan: { label: "Pelantikan", icon: <UserPlus className="w-3.5 h-3.5" />, cls: "bg-blue-50 text-blue-700 border-blue-200" },
  mutasi:     { label: "Mutasi",     icon: <RefreshCw className="w-3.5 h-3.5" />, cls: "bg-amber-50 text-amber-700 border-amber-200" },
  pensiun:    { label: "Pensiun",    icon: <UserMinus className="w-3.5 h-3.5" />, cls: "bg-muted text-muted-foreground border-border" },
};

const fileTipeCfg = {
  rundown:   { label: "Rundown",   cls: "bg-blue-50 text-blue-700 border-blue-200",   icon: <FileText className="w-4 h-4 text-blue-600" /> },
  sambutan:  { label: "Sambutan",  cls: "bg-green-50 text-primary border-green-200",  icon: <FileText className="w-4 h-4 text-primary" /> },
  lampiran:  { label: "Lampiran",  cls: "bg-amber-50 text-amber-700 border-amber-200", icon: <FileText className="w-4 h-4 text-amber-600" /> },
};

const formatBytes = (b: number) => b > 1_000_000 ? `${(b / 1_000_000).toFixed(1)} MB` : `${(b / 1000).toFixed(0)} KB`;
const initials = (n: string) => n.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: (role: Role, name: string) => void }) {
  const [role, setRole] = useState<Role>("protokoler");
  const [nip, setNip] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const creds: Record<Role, { nip: string; pass: string; name: string }> = {
    protokoler: { nip: "protokol", pass: "admin123", name: "Hj. Siti Aminah, S.H., M.H." },
    pimpinan:   { nip: "gubernur", pass: "pimpinan", name: "H. Ridwan Kamil, S.T., M.U.D." },
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!nip || !pass) { setErr("NIP dan kata sandi wajib diisi."); return; }
    setLoading(true);
    setTimeout(() => {
      const c = creds[role];
      if (nip === c.nip && pass === c.pass) onLogin(role, c.name);
      else { setErr("Kredensial tidak valid. Akses ditolak."); setLoading(false); }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(150deg, #0a2e1a 0%, #1a5c38 55%, #2d8a54 100%)" }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="relative w-full max-w-sm px-5">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-18 h-18 rounded-full bg-white/10 border-2 border-white/25 mb-4 p-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Garuda_Pancasila%2C_Coat_Arms_of_Indonesia.svg/200px-Garuda_Pancasila%2C_Coat_Arms_of_Indonesia.svg.png"
              alt="Garuda" className="w-12 h-12 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          <h1 className="text-white text-xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>ProAktif</h1>
          <p className="text-white/60 text-[11px] mt-0.5 tracking-widest font-mono uppercase">Sistem Informasi Manajemen Protokoler</p>
          <p className="text-white/40 text-[10px] font-mono mt-0.5">Biro Administrasi Pimpinan · Pemprov Banten</p>
        </div>

        <div className="flex rounded-xl overflow-hidden border border-white/15 mb-5 bg-white/5">
          {(["protokoler", "pimpinan"] as Role[]).map(r => (
            <button key={r} onClick={() => { setRole(r); setNip(""); setPass(""); setErr(""); }}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all ${role === r ? "bg-white text-primary" : "text-white/60 hover:text-white"}`}>
              {r === "protokoler" ? "🛡 Protokoler" : "👤 Pimpinan"}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {role === "protokoler" ? "Login Operator Protokol" : "Login Akses Pimpinan"}
          </p>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">NIP / Akun</label>
              <input value={nip} onChange={e => setNip(e.target.value)} placeholder={creds[role].nip}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Kata Sandi</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••"
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <p className="text-xs text-destructive">{err}</p>
            </div>}
            <button type="submit" disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white rounded-xl py-3 text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 mt-1">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Memverifikasi...</> : "Masuk ke ProAktif"}
            </button>
          </form>
          <p className="text-[11px] text-muted-foreground text-center mt-4 pt-3 border-t border-border">
            Demo · <span className="font-mono text-primary">{creds[role].nip}</span> / <span className="font-mono text-primary">{creds[role].pass}</span>
          </p>
        </div>
        <p className="text-center text-white/30 text-[10px] font-mono mt-5 tracking-wider">AKSES TERBATAS — PERSONEL BERWENANG</p>
      </div>
    </div>
  );
}

// ─── Admin Sidebar ─────────────────────────────────────────────────────────────

function AdminSidebar({ view, setView, onLogout, name }: { view: View; setView: (v: View) => void; onLogout: () => void; name: string }) {
  const nav = [
    { id: "dashboard" as View, label: "Dasbor", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "agenda" as View, label: "Agenda & Acara", icon: <CalendarDays className="w-4 h-4" />, badge: seedEvents.filter(e => e.tanggal === TODAY).length },
    { id: "pejabat" as View, label: "Data Pejabat", icon: <Users className="w-4 h-4" /> },
    { id: "dokumen" as View, label: "Dokumen & Arsip", icon: <FileText className="w-4 h-4" /> },
  ];
  return (
    <aside className="w-56 bg-sidebar flex flex-col flex-shrink-0 shadow-xl">
      <div className="px-5 py-5">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center"><Zap className="w-3.5 h-3.5 text-white" /></div>
          <span className="text-white font-bold text-sm tracking-wide">ProAktif</span>
        </div>
        <p className="text-[10px] text-sidebar-foreground/50 font-mono ml-9">Panel Protokoler</p>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        <p className="text-[9px] font-mono tracking-[0.18em] text-sidebar-foreground/40 uppercase px-2 py-2">Menu Utama</p>
        {nav.map(item => (
          <button key={item.id} onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${view === item.id ? "bg-white/15 text-white" : "text-sidebar-foreground hover:bg-white/8 hover:text-white"}`}>
            <span className={view === item.id ? "text-white" : "text-sidebar-foreground/60"}>{item.icon}</span>
            <span className="flex-1 text-left text-[13px]">{item.label}</span>
            {item.badge ? <span className="text-[10px] bg-accent text-white px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span> : null}
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">{initials(name)}</div>
          <div className="min-w-0">
            <p className="text-[12px] text-white truncate">{name.split(",")[0]}</p>
            <p className="text-[10px] text-sidebar-foreground/50">Protokoler</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sidebar-foreground/60 hover:text-white hover:bg-white/10 transition-all text-[12px]">
          <LogOut className="w-3.5 h-3.5" />Keluar
        </button>
      </div>
    </aside>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

function AdminDashboard({ events, setView }: { events: Event[]; setView: (v: View) => void }) {
  const today = events.filter(e => e.tanggal === TODAY);
  const stats = [
    { label: "Agenda Hari Ini", value: today.length, icon: <CalendarDays className="w-5 h-5" />, color: "text-primary", bg: "bg-secondary" },
    { label: "Berlangsung",     value: today.filter(e => e.status === "berlangsung").length, icon: <Activity className="w-5 h-5" />, color: "text-emerald-700", bg: "bg-green-50" },
    { label: "Total Pejabat",   value: seedPejabat.filter(p => p.status === "aktif").length, icon: <Users className="w-5 h-5" />, color: "text-blue-700", bg: "bg-blue-50" },
    { label: "Dokumen Upload",  value: events.reduce((a, e) => a + e.files.length, 0), icon: <FileText className="w-5 h-5" />, color: "text-amber-700", bg: "bg-amber-50" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-7 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Sabtu, 05 Juli 2026</p>
          <h1 className="text-2xl font-bold text-foreground mt-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>Dasbor Protokoler</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Pantau agenda & status pimpinan secara real-time.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-primary font-semibold">Sistem Aktif</span>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
            <div className={`inline-flex w-10 h-10 rounded-xl ${s.bg} items-center justify-center mb-3`}>
              <span className={s.color}>{s.icon}</span>
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2"><div className="w-1 h-5 bg-primary rounded-full" />Agenda Hari Ini</h2>
          <button onClick={() => setView("agenda")} className="text-xs text-primary hover:underline flex items-center gap-1">Semua agenda <ChevronRight className="w-3 h-3" /></button>
        </div>
        <div className="space-y-3">
          {today.map(ev => (
            <div key={ev.id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/20 transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${eventStatusCfg[ev.status].cls}`}>{eventStatusCfg[ev.status].label}</span>
                    <span className={`w-2 h-2 rounded-full ${prioritasCfg[ev.prioritas].dot}`} />
                    {ev.notifikasi && <Bell className="w-3 h-3 text-amber-500" />}
                    {ev.files.length > 0 && <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><FileText className="w-3 h-3" />{ev.files.length} dok</span>}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{ev.judul}</h3>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" />{ev.waktu} WIB</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" />{ev.tempat}</span>
                <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-primary" />{ev.dresscode}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ev.statusPimpinan).map(([pjbId, st]) => {
                  const pjb = seedPejabat.find(p => p.id === pjbId);
                  if (!pjb) return null;
                  const cfg = statusPimpinanCfg[st as keyof typeof statusPimpinanCfg];
                  return (
                    <div key={pjbId} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.color}`}>
                      {cfg.icon}<span>{pjb.nama.split(" ").slice(-2).join(" ").replace(",", "")}</span><span className="opacity-60">· {cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {today.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Tidak ada agenda hari ini.</p>}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Notifikasi Otomatis Aktif</p>
          <p className="text-xs text-amber-700 mt-0.5">WA Gateway & Push akan terkirim H-1 dan 2 jam sebelum setiap acara bernotifikasi.</p>
        </div>
      </div>
    </div>
  );
}

// ─── File Upload Component ────────────────────────────────────────────────────

function FileUploadZone({ files, onAdd, onRemove }: {
  files: UploadedFile[];
  onAdd: (f: UploadedFile) => void;
  onRemove: (id: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [tipe, setTipe] = useState<UploadedFile["tipe"]>("lampiran");

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    onAdd({
      id: `f${Date.now()}`,
      name: file.name,
      size: file.size,
      tipe,
      uploadedAt: new Date().toLocaleString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      url,
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    Array.from(e.dataTransfer.files).forEach(handleFile);
  };

  return (
    <div className="space-y-3">
      {/* Uploaded list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(f => {
            const cfg = fileTipeCfg[f.tipe];
            return (
              <div key={f.id} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 group">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.cls} border`}>{cfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{f.name}</p>
                  <p className="text-[11px] text-muted-foreground">{cfg.label} · {formatBytes(f.size)} · {f.uploadedAt}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {f.url && (
                    <a href={f.url} target="_blank" rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                      <EyeIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {f.url && (
                    <a href={f.url} download={f.name}
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button onClick={() => onRemove(f.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tipe selector + upload zone */}
      <div className="flex gap-2 mb-2">
        {(["rundown", "sambutan", "lampiran"] as const).map(t => (
          <button key={t} type="button" onClick={() => setTipe(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${tipe === t ? fileTipeCfg[t].cls : "bg-muted text-muted-foreground border-border"}`}>
            {fileTipeCfg[t].label}
          </button>
        ))}
      </div>

      <div
        onDrop={onDrop} onDragOver={e => e.preventDefault()}
        onClick={() => ref.current?.click()}
        className="border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary/40 hover:bg-secondary/30 transition-all group">
        <FilePlus className="w-6 h-6 text-muted-foreground group-hover:text-primary mx-auto mb-2 transition-colors" />
        <p className="text-sm font-semibold text-foreground">Upload dokumen <span className="text-primary">{fileTipeCfg[tipe].label}</span></p>
        <p className="text-xs text-muted-foreground mt-0.5">PDF, Word, Excel · Seret ke sini atau klik</p>
        <input ref={ref} type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden"
          onChange={e => Array.from(e.target.files || []).forEach(handleFile)} />
      </div>
    </div>
  );
}

// ─── Agenda Management ────────────────────────────────────────────────────────

function AgendaManagement({ events, setEvents }: { events: Event[]; setEvents: (e: Event[]) => void }) {
  const [filter, setFilter] = useState("semua");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [showChat, setShowChat] = useState<string | null>(null);
  const [chatMsg, setChatMsg] = useState("");
  const [chats, setChats] = useState<Record<string, ChatMsg[]>>(seedChats);
  const [form, setForm] = useState<Partial<Event>>({ prioritas: "sedang", status: "akan_datang", kategori: "Rapat", pejabatIds: [], statusPimpinan: {}, notifikasi: false, files: [] });

  const filtered = events.filter(e => {
    const matchF = filter === "semua" || e.status === filter || (filter === "hari_ini" && e.tanggal === TODAY);
    const matchS = e.judul.toLowerCase().includes(search.toLowerCase()) || e.tempat.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const openAdd = () => { setEditing(null); setForm({ prioritas: "sedang", status: "akan_datang", kategori: "Rapat", pejabatIds: [], statusPimpinan: {}, notifikasi: false, files: [] }); setShowForm(true); };
  const openEdit = (ev: Event) => { setEditing(ev); setForm({ ...ev }); setShowForm(true); };

  const saveEvent = () => {
    if (!form.judul || !form.tanggal || !form.waktu || !form.tempat) return;
    const statusPimpinan: Record<string, Event["statusPimpinan"][string]> = {};
    (form.pejabatIds || []).forEach(id => { statusPimpinan[id] = (form.statusPimpinan?.[id]) || "menunggu"; });
    if (editing) {
      setEvents(events.map(e => e.id === editing.id ? { ...e, ...form, statusPimpinan } as Event : e));
    } else {
      const nEv: Event = {
        id: `EVT-${String(events.length + 1).padStart(3, "0")}`,
        judul: form.judul!, tanggal: form.tanggal!, waktu: form.waktu!, tempat: form.tempat!,
        dresscode: form.dresscode || "", deskripsi: form.deskripsi || "",
        pejabatIds: form.pejabatIds || [], status: (form.status as Event["status"]) || "akan_datang",
        prioritas: (form.prioritas as Event["prioritas"]) || "sedang",
        koordinatMaps: form.koordinatMaps || "", notifikasi: form.notifikasi || false,
        kategori: form.kategori || "Rapat", pesertaCount: Number(form.pesertaCount) || 0,
        statusPimpinan, files: form.files || [],
      };
      setEvents([...events, nEv]);
    }
    setShowForm(false);
  };

  const togglePejabat = (id: string) => {
    const cur = form.pejabatIds || [];
    setForm({ ...form, pejabatIds: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] });
  };

  const sendChat = (evId: string) => {
    if (!chatMsg.trim()) return;
    const msg: ChatMsg = { id: `cm${Date.now()}`, sender: "Protokoler", isi: chatMsg, waktu: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), type: "text" };
    setChats(prev => ({ ...prev, [evId]: [...(prev[evId] || []), msg] }));
    setChatMsg("");
  };

  const tabs = [
    { val: "semua", label: "Semua" }, { val: "hari_ini", label: "Hari Ini" },
    { val: "akan_datang", label: "Akan Datang" }, { val: "berlangsung", label: "Berlangsung" }, { val: "selesai", label: "Selesai" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-7">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Buat Acara</p>
          <h1 className="text-2xl font-bold text-foreground mt-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>Agenda & Kegiatan</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{events.length} kegiatan terdaftar</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors">
          <Plus className="w-4 h-4" />Buat Agenda
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari acara..."
            className="bg-card border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 w-52" />
        </div>
        <div className="flex items-center gap-1 border-b border-border flex-1">
          {tabs.map(t => (
            <button key={t.val} onClick={() => setFilter(t.val)}
              className={`px-4 py-2 text-xs font-semibold tracking-wide transition-colors border-b-2 -mb-px ${filter === t.val ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(ev => (
          <div key={ev.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-sm transition-all">
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${eventStatusCfg[ev.status].cls}`}>{eventStatusCfg[ev.status].label}</span>
                    <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{ev.kategori}</span>
                    <span className={`w-2 h-2 rounded-full ${prioritasCfg[ev.prioritas].dot}`} />
                    {ev.notifikasi && <Bell className="w-3 h-3 text-amber-500" />}
                    {ev.files.length > 0 && (
                      <span className="flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                        <FileCheck className="w-3 h-3" />{ev.files.length} dok
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground">{ev.judul}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.tanggal} · {ev.waktu} WIB</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.tempat}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ev.pejabatIds.length} pejabat</span>
                  </div>
                  {ev.dresscode && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-primary bg-secondary px-3 py-1 rounded-full w-fit">
                      <Tag className="w-3 h-3" /><span className="font-semibold">Dresscode:</span> {ev.dresscode}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setShowChat(showChat === ev.id ? null : ev.id)}
                    className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-primary transition-colors relative">
                    <MessageSquare className="w-4 h-4" />
                    {(chats[ev.id]?.length || 0) > 0 && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />}
                  </button>
                  <button onClick={() => openEdit(ev)} className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dokumen chips */}
              {ev.files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {ev.files.map(f => {
                    const cfg = fileTipeCfg[f.tipe];
                    return (
                      <a key={f.id} href={f.url || "#"} target="_blank" rel="noreferrer"
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${cfg.cls} hover:opacity-80 transition-opacity`}>
                        <FileText className="w-3 h-3" />{f.name.length > 28 ? f.name.slice(0, 25) + "…" : f.name}
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Status pimpinan */}
              {ev.pejabatIds.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {ev.pejabatIds.map(pjbId => {
                    const pjb = seedPejabat.find(p => p.id === pjbId);
                    if (!pjb) return null;
                    const st = ev.statusPimpinan[pjbId] || "menunggu";
                    const cfg = statusPimpinanCfg[st as keyof typeof statusPimpinanCfg];
                    return (
                      <div key={pjbId} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold border ${cfg.bg} ${cfg.color}`}>
                        {cfg.icon}<span>{pjb.nama.split(" ").slice(-2, -1).join("")}</span>· {cfg.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Chat panel */}
            {showChat === ev.id && (
              <div className="border-t border-border">
                <div className="flex items-center justify-between px-5 py-2.5 bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold">Grup Chat Acara</span>
                    <span className="text-[10px] text-muted-foreground">{chats[ev.id]?.length || 0} pesan</span>
                  </div>
                  <button className="text-[11px] text-primary font-semibold flex items-center gap-1 hover:underline"><Video className="w-3 h-3" />Video Call</button>
                </div>
                <div className="max-h-44 overflow-y-auto p-4 space-y-2 bg-background/50">
                  {(chats[ev.id] || []).map(msg => (
                    <div key={msg.id} className={msg.type !== "text" ? "flex justify-center" : "flex gap-2"}>
                      {msg.type === "info" && <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5 text-[11px] text-blue-700">{msg.isi}</div>}
                      {msg.type === "alert" && <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-1.5 text-[11px] text-red-700 font-semibold">{msg.isi}</div>}
                      {msg.type === "text" && <>
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-primary flex-shrink-0">{initials(msg.sender)}</div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">{msg.sender} · {msg.waktu}</p>
                          <div className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs mt-0.5">{msg.isi}</div>
                        </div>
                      </>}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 p-3 bg-card border-t border-border">
                  <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat(ev.id)}
                    placeholder="Koordinasi via chat..." className="flex-1 bg-input-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary/50" />
                  <button onClick={() => sendChat(ev.id)} className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"><Send className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground text-sm">Tidak ada agenda ditemukan.</div>}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-bold text-foreground">{editing ? "Edit Agenda" : "Buat Agenda Baru"}</h3>
              </div>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Judul Kegiatan *</label>
                <input value={form.judul || ""} onChange={e => setForm({ ...form, judul: e.target.value })} placeholder="Nama resmi kegiatan"
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Tanggal *</label>
                  <input type="date" value={form.tanggal || ""} onChange={e => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Waktu *</label>
                  <input type="time" value={form.waktu || ""} onChange={e => setForm({ ...form, waktu: e.target.value })}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Kategori</label>
                  <select value={form.kategori || "Rapat"} onChange={e => setForm({ ...form, kategori: e.target.value })}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none appearance-none">
                    {["Rapat", "Seremonial", "Audiensi", "Peresmian", "Pelatihan", "Kunjungan", "Lainnya"].map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Tempat *</label>
                <input value={form.tempat || ""} onChange={e => setForm({ ...form, tempat: e.target.value })} placeholder="Nama gedung / ruangan"
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Dresscode</label>
                <input value={form.dresscode || ""} onChange={e => setForm({ ...form, dresscode: e.target.value })} placeholder="Cth: PSH abu-abu, Batik Parahyangan"
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Deskripsi</label>
                <textarea value={form.deskripsi || ""} onChange={e => setForm({ ...form, deskripsi: e.target.value })} rows={2} placeholder="Keterangan singkat acara"
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Prioritas</label>
                  <select value={form.prioritas || "sedang"} onChange={e => setForm({ ...form, prioritas: e.target.value as Event["prioritas"] })}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none appearance-none">
                    <option value="tinggi">Tinggi</option><option value="sedang">Sedang</option><option value="rendah">Rendah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Status</label>
                  <select value={form.status || "akan_datang"} onChange={e => setForm({ ...form, status: e.target.value as Event["status"] })}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none appearance-none">
                    <option value="akan_datang">Akan Datang</option><option value="berlangsung">Berlangsung</option>
                    <option value="selesai">Selesai</option><option value="dibatalkan">Dibatalkan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Jml. Peserta</label>
                  <input type="number" value={form.pesertaCount || ""} onChange={e => setForm({ ...form, pesertaCount: Number(e.target.value) })} placeholder="0"
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tag Pejabat</label>
                <div className="grid grid-cols-2 gap-2">
                  {seedPejabat.filter(p => p.status === "aktif").map(pjb => {
                    const checked = (form.pejabatIds || []).includes(pjb.id);
                    return (
                      <button key={pjb.id} onClick={() => togglePejabat(pjb.id)} type="button"
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs transition-all ${checked ? "bg-secondary border-primary/40 text-primary" : "bg-input-background border-border text-foreground hover:border-primary/30"}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${checked ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{pjb.inisial}</div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate">{pjb.nama.split(",")[0].split(" ").slice(-2).join(" ")}</p>
                          <p className="text-muted-foreground text-[10px] truncate">{pjb.jabatan}</p>
                        </div>
                        {checked && <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notifikasi toggle */}
              <label className="flex items-center gap-3 cursor-pointer px-4 py-3 bg-input-background border border-border rounded-xl">
                <div onClick={() => setForm({ ...form, notifikasi: !form.notifikasi })}
                  className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${form.notifikasi ? "bg-primary" : "bg-muted"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.notifikasi ? "left-5" : "left-0.5"}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Aktifkan Notifikasi WA & Push</p>
                  <p className="text-[10px] text-muted-foreground">Kirim otomatis H-1 dan 2 jam sebelum acara</p>
                </div>
              </label>

              {/* File upload */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Upload Dokumen Resmi <span className="normal-case text-muted-foreground">(Rundown, Sambutan, Lampiran)</span>
                </label>
                <FileUploadZone
                  files={form.files || []}
                  onAdd={f => setForm({ ...form, files: [...(form.files || []), f] })}
                  onRemove={id => setForm({ ...form, files: (form.files || []).filter(x => x.id !== id) })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm text-muted-foreground border border-border rounded-xl hover:bg-muted transition-colors">Batal</button>
              <button onClick={saveEvent} className="flex items-center gap-2 px-5 py-2.5 text-sm bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-semibold shadow-sm">
                <Save className="w-4 h-4" />{editing ? "Perbarui" : "Simpan Agenda"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pejabat Database ─────────────────────────────────────────────────────────

function PejabatDatabase() {
  const [selected, setSelected] = useState<Pejabat | null>(null);
  const [showRiwayat, setShowRiwayat] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [rForm, setRForm] = useState<Partial<RiwayatPejabat>>({ jenis: "pelantikan" });

  const filtered = seedPejabat.filter(p => {
    const matchS = p.nama.toLowerCase().includes(search.toLowerCase()) || p.jabatan.toLowerCase().includes(search.toLowerCase());
    const matchF = filterStatus === "semua" || p.status === filterStatus;
    return matchS && matchF;
  });

  const statusCls = { aktif: "bg-green-50 text-primary border-green-200", pensiun: "bg-gray-100 text-gray-500 border-gray-200", mutasi: "bg-amber-50 text-amber-700 border-amber-200" };

  return (
    <div className="flex-1 overflow-y-auto p-7">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Kelola Struktur</p>
          <h1 className="text-2xl font-bold text-foreground mt-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>Data Pejabat</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Mutasi, Pelantikan, Pensiun</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors">
          <UserPlus className="w-4 h-4" />Tambah Pejabat
        </button>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama atau jabatan..."
            className="bg-card border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 w-56" />
        </div>
        <div className="flex items-center gap-1 border-b border-border">
          {[{ val: "semua", label: "Semua" }, { val: "aktif", label: "Aktif" }, { val: "mutasi", label: "Mutasi" }, { val: "pensiun", label: "Pensiun" }].map(t => (
            <button key={t.val} onClick={() => setFilterStatus(t.val)}
              className={`px-4 py-2 text-xs font-semibold tracking-wide transition-colors border-b-2 -mb-px ${filterStatus === t.val ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map(pjb => (
          <div key={pjb.id} className={`bg-card border rounded-2xl p-5 hover:shadow-sm transition-all group cursor-pointer ${selected?.id === pjb.id ? "border-primary/40 ring-2 ring-primary/10" : "border-border hover:border-primary/20"}`}
            onClick={() => setSelected(selected?.id === pjb.id ? null : pjb)}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                {pjb.inisial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm leading-snug">{pjb.nama}</h3>
                    <p className="text-xs text-primary font-semibold mt-0.5">{pjb.jabatan}</p>
                    <p className="text-xs text-muted-foreground">{pjb.instansi}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${statusCls[pjb.status]}`}>
                    {pjb.status === "aktif" ? "Aktif" : pjb.status === "pensiun" ? "Pensiun" : "Mutasi"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 pt-3 border-t border-border mt-2">
                  <span className="text-[11px] font-mono text-muted-foreground">{pjb.eselon}</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{pjb.id}</span>
                  {pjb.nip !== "—" && <span className="text-[11px] font-mono text-muted-foreground">NIP: {pjb.nip}</span>}
                </div>
              </div>
            </div>

            {/* Riwayat expanded */}
            {selected?.id === pjb.id && (
              <div className="mt-4 pt-4 border-t border-border" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5"><History className="w-3.5 h-3.5 text-primary" />Riwayat Jabatan</h4>
                  <button onClick={() => setShowForm(true)}
                    className="flex items-center gap-1 text-[11px] text-primary font-semibold hover:underline">
                    <Plus className="w-3 h-3" />Input {["Mutasi", "Pelantikan", "Pensiun"][0]}
                  </button>
                </div>
                <div className="space-y-2.5">
                  {[...pjb.riwayat].reverse().map(r => {
                    const cfg = riwayatCfg[r.jenis];
                    return (
                      <div key={r.id} className="bg-input-background rounded-xl p-3.5">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${cfg.cls}`}>
                              {cfg.icon}{cfg.label}
                            </span>
                            <span className="text-[11px] font-mono text-muted-foreground">{r.tanggal}</span>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground bg-card border border-border px-2 py-0.5 rounded-full">{r.noSK}</span>
                        </div>
                        {r.jenis !== "pensiun" ? (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-[10px] text-muted-foreground">Dari</p>
                              <p className="text-xs font-semibold text-foreground">{r.jabatanLama}</p>
                              <p className="text-[10px] text-muted-foreground">{r.instansiLama}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground">Menjadi</p>
                              <p className="text-xs font-semibold text-foreground">{r.jabatanBaru}</p>
                              <p className="text-[10px] text-muted-foreground">{r.instansiBaru}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">{r.jabatanLama} → Pensiun</p>
                        )}
                        {r.keterangan && <p className="text-[11px] text-muted-foreground mt-2 italic">{r.keterangan}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Riwayat Modal */}
      {showForm && selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-bold text-foreground">Input Perubahan Jabatan</h3>
              </div>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-secondary rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center text-xs font-bold text-primary">{selected.inisial}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{selected.nama.split(",")[0]}</p>
                  <p className="text-xs text-muted-foreground">{selected.jabatan}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Jenis Perubahan</label>
                <div className="flex gap-2">
                  {(["pelantikan", "mutasi", "pensiun"] as const).map(j => (
                    <button key={j} type="button" onClick={() => setRForm({ ...rForm, jenis: j })}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-all capitalize ${rForm.jenis === j ? riwayatCfg[j].cls : "bg-input-background border-border text-muted-foreground"}`}>
                      {riwayatCfg[j].icon}{riwayatCfg[j].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Jabatan Lama</label>
                  <input value={rForm.jabatanLama || ""} onChange={e => setRForm({ ...rForm, jabatanLama: e.target.value })} placeholder="Jabatan sebelumnya"
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Jabatan Baru</label>
                  <input value={rForm.jabatanBaru || ""} onChange={e => setRForm({ ...rForm, jabatanBaru: e.target.value })} placeholder="Jabatan setelah"
                    disabled={rForm.jenis === "pensiun"}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 disabled:opacity-40" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Tanggal Efektif</label>
                  <input type="date" value={rForm.tanggal || ""} onChange={e => setRForm({ ...rForm, tanggal: e.target.value })}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Nomor SK</label>
                  <input value={rForm.noSK || ""} onChange={e => setRForm({ ...rForm, noSK: e.target.value })} placeholder="SK.GUB/2026/..."
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 font-mono text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Keterangan</label>
                <textarea value={rForm.keterangan || ""} onChange={e => setRForm({ ...rForm, keterangan: e.target.value })} rows={2}
                  placeholder="Keterangan singkat dasar perubahan"
                  className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm border border-border rounded-xl hover:bg-muted text-muted-foreground">Batal</button>
              <button onClick={() => setShowForm(false)} className="flex items-center gap-2 px-5 py-2.5 text-sm bg-primary text-white rounded-xl hover:bg-primary/90 font-semibold">
                <Save className="w-4 h-4" />Simpan Riwayat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dokumen Arsip ─────────────────────────────────────────────────────────────

function DokumenArsip({ events }: { events: Event[] }) {
  const allFiles = events.flatMap(ev => ev.files.map(f => ({ ...f, eventJudul: ev.judul, eventId: ev.id, eventTanggal: ev.tanggal })));
  const [filter, setFilter] = useState("semua");

  const filtered = allFiles.filter(f => filter === "semua" || f.tipe === filter);

  return (
    <div className="flex-1 overflow-y-auto p-7">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Arsip Digital</p>
          <h1 className="text-2xl font-bold text-foreground mt-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>Dokumen & Arsip</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{allFiles.length} dokumen dari {events.filter(e => e.files.length > 0).length} acara</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(["rundown", "sambutan", "lampiran"] as const).map(t => {
          const cnt = allFiles.filter(f => f.tipe === t).length;
          const cfg = fileTipeCfg[t];
          return (
            <div key={t} className={`bg-card border rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all ${filter === t ? "border-primary/40 ring-2 ring-primary/10" : "border-border hover:border-primary/20"}`}
              onClick={() => setFilter(filter === t ? "semua" : t)}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cfg.cls}`}>{cfg.icon}</div>
              <div>
                <div className="text-xl font-bold font-mono text-foreground">{cnt}</div>
                <div className="text-xs text-muted-foreground">{cfg.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        {filtered.map(f => {
          const cfg = fileTipeCfg[f.tipe];
          return (
            <div key={f.id} className="bg-card border border-border rounded-2xl flex items-center gap-4 px-5 py-4 hover:border-primary/20 hover:shadow-sm transition-all group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${cfg.cls}`}>{cfg.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.eventJudul} · {f.eventTanggal} · {formatBytes(f.size)}</p>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${cfg.cls}`}>{cfg.label}</span>
              <p className="text-[11px] font-mono text-muted-foreground flex-shrink-0 hidden xl:block">{f.uploadedAt}</p>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {f.url && <a href={f.url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"><EyeIcon className="w-3.5 h-3.5" /></a>}
                {f.url && <a href={f.url} download={f.name} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"><Download className="w-3.5 h-3.5" /></a>}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold">Belum ada dokumen</p>
            <p className="text-xs mt-1">Upload dokumen di bagian Agenda & Kegiatan</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pimpinan View ─────────────────────────────────────────────────────────────

function PimpinanView({ name, onLogout }: { name: string; onLogout: () => void }) {
  const todayEvs = seedEvents.filter(e => e.tanggal === TODAY);
  const [myStatus, setMyStatus] = useState<Record<string, Event["statusPimpinan"][string]>>({ "EVT-001": "hadir", "EVT-002": "menunggu" });
  const [active, setActive] = useState<string | null>(todayEvs[0]?.id || null);
  const [showAlert, setShowAlert] = useState(true);
  const [chatMsg, setChatMsg] = useState("");
  const [chats, setChats] = useState<Record<string, ChatMsg[]>>(seedChats);

  const sendChat = (evId: string) => {
    if (!chatMsg.trim()) return;
    const msg: ChatMsg = { id: `cm${Date.now()}`, sender: name.split(",")[0], isi: chatMsg, waktu: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), type: "text" };
    setChats(prev => ({ ...prev, [evId]: [...(prev[evId] || []), msg] }));
    setChatMsg("");
  };

  const statusBtns: { val: Event["statusPimpinan"][string]; label: string; icon: React.ReactNode; cls: string }[] = [
    { val: "otw",   label: "OTW",   icon: <Car className="w-5 h-5" />,           cls: "bg-blue-500 text-white hover:bg-blue-600" },
    { val: "tunda", label: "TUNDA", icon: <AlertTriangle className="w-5 h-5" />, cls: "bg-amber-500 text-white hover:bg-amber-600" },
    { val: "batal", label: "BATAL", icon: <XCircle className="w-5 h-5" />,       cls: "bg-red-500 text-white hover:bg-red-600" },
  ];

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="sticky top-0 z-20">
        {showAlert && (
          <div className="bg-amber-400 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-900 flex-shrink-0" />
              <span className="text-xs font-semibold text-amber-900">Pengingat: Rapat Koordinasi Banjir Ciujung — 10:00 WIB di KP3B Lt.2</span>
            </div>
            <button onClick={() => setShowAlert(false)}><X className="w-4 h-4 text-amber-900" /></button>
          </div>
        )}
        <div className="flex items-center justify-between px-5 py-4" style={{ background: "linear-gradient(135deg, #0a2e1a, #1a5c38)" }}>
          <div>
            <p className="text-white/50 text-[10px] font-mono">ProAktif Pimpinan</p>
            <p className="text-white font-bold text-sm">{name.split(",")[0].split(" ").slice(1, 4).join(" ")}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative"><Bell className="w-5 h-5 text-white/70" /><span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">2</span></div>
            <button onClick={onLogout} className="text-white/60 hover:text-white"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        <div className="text-center">
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Sabtu, 05 Juli 2026</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">{todayEvs.length} agenda hari ini</p>
        </div>

        {todayEvs.map(ev => {
          const isActive = active === ev.id;
          const myEv = myStatus[ev.id] || "menunggu";
          const myCfg = statusPimpinanCfg[myEv as keyof typeof statusPimpinanCfg];

          return (
            <div key={ev.id} className={`bg-card rounded-2xl shadow-sm overflow-hidden border-2 transition-all ${isActive ? "border-primary" : "border-transparent"}`}>
              {/* Header */}
              <div className={`px-5 py-4 ${ev.status === "berlangsung" ? "" : "bg-secondary"}`}
                style={ev.status === "berlangsung" ? { background: "linear-gradient(135deg, #0f3d26, #1a5c38)" } : {}}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-bold ${ev.status === "berlangsung" ? "text-white/70" : "text-muted-foreground"}`}>{eventStatusCfg[ev.status].label.toUpperCase()} · {ev.kategori}</span>
                  {ev.files.length > 0 && <span className={`flex items-center gap-1 text-[10px] font-semibold ${ev.status === "berlangsung" ? "text-white/60" : "text-primary"}`}><FileCheck className="w-3 h-3" />{ev.files.length} dok</span>}
                </div>
                <h2 className={`font-bold text-base leading-snug ${ev.status === "berlangsung" ? "text-white" : "text-foreground"}`} style={{ fontFamily: "'Libre Baskerville', serif" }}>{ev.judul}</h2>
              </div>

              <div className="px-5 py-4 space-y-3">
                {/* Big info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary rounded-xl p-3">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Waktu</p>
                    <p className="text-2xl font-bold text-primary font-mono">{ev.waktu}</p>
                    <p className="text-[11px] text-muted-foreground">WIB · {ev.tanggal}</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-3">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Peserta</p>
                    <p className="text-2xl font-bold text-primary font-mono">{ev.pesertaCount}</p>
                    <p className="text-[11px] text-muted-foreground">orang hadir</p>
                  </div>
                </div>

                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Lokasi</p>
                  <p className="text-sm font-semibold text-foreground">{ev.tempat}</p>
                  <button className="mt-1.5 text-[11px] text-primary font-semibold flex items-center gap-1 hover:underline"><Navigation className="w-3 h-3" />Buka Navigasi Maps</button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-[10px] font-mono text-amber-600 uppercase mb-1">👔 Dresscode</p>
                  <p className="text-sm font-bold text-amber-900">{ev.dresscode || "Bebas rapi"}</p>
                </div>

                {/* My status */}
                <div className={`rounded-xl p-3 flex items-center gap-2 border ${myCfg.bg}`}>
                  <span className={myCfg.color}>{myCfg.icon}</span>
                  <span className={`text-sm font-bold ${myCfg.color}`}>Status Anda: {myCfg.label}</span>
                </div>

                {/* Status buttons */}
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Kirim Status</p>
                  <div className="grid grid-cols-3 gap-2">
                    {statusBtns.map(btn => (
                      <button key={btn.val} onClick={() => setMyStatus(prev => ({ ...prev, [ev.id]: btn.val }))}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-bold transition-all ${myStatus[ev.id] === btn.val ? btn.cls + " ring-2 ring-offset-1 ring-primary/30 scale-[1.03]" : "bg-muted text-muted-foreground hover:bg-secondary"}`}>
                        {btn.icon}<span className="text-xs">{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggle detail */}
                <button onClick={() => setActive(isActive ? null : ev.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground hover:text-foreground">
                  {isActive ? "Sembunyikan" : "Dokumen, Rundown & Chat"}
                  <ChevronDown className={`w-4 h-4 transition-transform ${isActive ? "rotate-180" : ""}`} />
                </button>

                {/* Expanded */}
                {isActive && (
                  <div className="space-y-3 pt-1">
                    {/* Documents */}
                    {ev.files.length > 0 && (
                      <div className="bg-input-background rounded-xl overflow-hidden">
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider px-4 pt-3 pb-2">📎 Dokumen Resmi</p>
                        <div className="px-3 pb-3 space-y-1.5">
                          {ev.files.map(f => {
                            const cfg = fileTipeCfg[f.tipe];
                            return (
                              <a key={f.id} href={f.url || "#"} target="_blank" rel="noreferrer"
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border hover:opacity-80 transition-opacity ${cfg.cls}`}>
                                {cfg.icon}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate">{f.name}</p>
                                  <p className="text-[10px] opacity-70">{cfg.label} · {formatBytes(f.size)}</p>
                                </div>
                                <Download className="w-3.5 h-3.5 flex-shrink-0" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Chat */}
                    <div className="bg-input-background rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card">
                        <div className="flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5 text-primary" /><span className="text-xs font-bold">Grup Chat Acara</span></div>
                        <button className="text-[11px] text-primary font-semibold flex items-center gap-1"><Video className="w-3 h-3" />VC</button>
                      </div>
                      <div className="max-h-40 overflow-y-auto p-3 space-y-2">
                        {(chats[ev.id] || []).map(msg => (
                          <div key={msg.id} className={msg.type !== "text" ? "flex justify-center" : "flex gap-2"}>
                            {msg.type === "info" && <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5 text-[11px] text-blue-700">{msg.isi}</div>}
                            {msg.type === "alert" && <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-1.5 text-[11px] text-red-700 font-semibold">{msg.isi}</div>}
                            {msg.type === "text" && <>
                              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-primary flex-shrink-0">{initials(msg.sender)}</div>
                              <div>
                                <p className="text-[10px] text-muted-foreground">{msg.sender} · {msg.waktu}</p>
                                <div className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs mt-0.5">{msg.isi}</div>
                              </div>
                            </>}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 p-3 border-t border-border">
                        <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat(ev.id)} placeholder="Ketik pesan..."
                          className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary/50" />
                        <button onClick={() => sendChat(ev.id)} className="p-2 bg-primary text-white rounded-xl"><Send className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {todayEvs.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Tidak ada agenda hari ini</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [auth, setAuth] = useState<{ role: Role; name: string } | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [events, setEvents] = useState<Event[]>(seedEvents);

  if (!auth) return <LoginPage onLogin={(role, name) => setAuth({ role, name })} />;
  if (auth.role === "pimpinan") return <PimpinanView name={auth.name} onLogout={() => setAuth(null)} />;

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <AdminSidebar view={view} setView={setView} onLogout={() => setAuth(null)} name={auth.name} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-11 border-b border-border flex items-center justify-between px-7 flex-shrink-0 bg-card">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="text-foreground font-bold">ProAktif</span>
            <ChevronRight className="w-3 h-3" />
            <span>{{ dashboard: "Dasbor", agenda: "Agenda & Kegiatan", pejabat: "Data Pejabat", dokumen: "Dokumen & Arsip" }[view]}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />Sistem Aktif</div>
            <span>·</span><span>Intranet Pemerintah</span>
          </div>
        </header>
        {view === "dashboard" && <AdminDashboard events={events} setView={setView} />}
        {view === "agenda"    && <AgendaManagement events={events} setEvents={setEvents} />}
        {view === "pejabat"   && <PejabatDatabase />}
        {view === "dokumen"   && <DokumenArsip events={events} />}
      </div>
    </div>
  );
}
