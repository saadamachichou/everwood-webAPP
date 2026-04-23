"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Banknote,
  Loader2,
  MapPin,
  Package,
  Phone,
  ShieldAlert,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { D, DataTable, PageHeader, Pagination, SearchBar, StatusBadge, TabBar } from "@/components/studio/StudioShell";

type CodStatus = "Unassigned" | "Assigned" | "In Transit" | "Delivered" | "Failed";
type Priority = "Normal" | "High" | "Urgent";

interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  zone: string;
  vehicle: string;
  status: "Active" | "Break" | "Offline";
}

interface CodOrder {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  zone: string;
  address: string;
  itemsSummary: string;
  amountDue: number;
  paymentMethod: "COD";
  status: CodStatus;
  priority: Priority;
  courierId: string | null;
  courierName: string;
  notes: string;
  createdAt: string;
  assignedAt: string | null;
}

const STATUS_OPTIONS: CodStatus[] = ["Unassigned", "Assigned", "In Transit", "Delivered", "Failed"];
const PRIORITY_OPTIONS: Priority[] = ["Normal", "High", "Urgent"];
const PER_PAGE = 8;

const COLUMNS = [
  { key: "order", label: "COD Order", width: "2.1fr" },
  { key: "destination", label: "Destination", width: "1.4fr" },
  { key: "amount", label: "Amount", width: "100px", mono: true, align: "right" as const },
  { key: "priority", label: "Priority", width: "100px" },
  { key: "courier", label: "Courier", width: "180px" },
  { key: "status", label: "Status", width: "120px" },
];

const labelStyle: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 11,
  color: D.subtle,
  marginBottom: 5,
  display: "block",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: D.raised,
  border: `1px solid ${D.border}`,
  borderRadius: 8,
  padding: "9px 12px",
  color: D.body,
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function priorityColor(priority: Priority) {
  if (priority === "Urgent") return D.red;
  if (priority === "High") return D.amber;
  return D.blue;
}

function deriveStatus(currentStatus: CodStatus, courierId: string | null): CodStatus {
  if (!courierId) return "Unassigned";
  if (currentStatus === "Unassigned") return "Assigned";
  return currentStatus;
}

function SelectField({
  value,
  onChange,
  children,
  muted = false,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={event => onChange(event.target.value)}
      style={{
        ...inputStyle,
        padding: "7px 10px",
        fontSize: 12,
        color: muted ? D.subtle : D.body,
        minWidth: 0,
      }}
    >
      {children}
    </select>
  );
}

function OrderModal({
  order,
  couriers,
  saving,
  onClose,
  onSave,
}: {
  order: CodOrder | null;
  couriers: DeliveryAgent[];
  saving: boolean;
  onClose: () => void;
  onSave: (payload: Omit<CodOrder, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<CodOrder, "id">>(() => ({
    customerName: order?.customerName ?? "",
    phone: order?.phone ?? "",
    city: order?.city ?? "Casablanca",
    zone: order?.zone ?? "",
    address: order?.address ?? "",
    itemsSummary: order?.itemsSummary ?? "",
    amountDue: order?.amountDue ?? 0,
    paymentMethod: "COD",
    status: order?.status ?? "Unassigned",
    priority: order?.priority ?? "Normal",
    courierId: order?.courierId ?? null,
    courierName: order?.courierName ?? "",
    notes: order?.notes ?? "",
    createdAt: order?.createdAt ?? new Date().toISOString(),
    assignedAt: order?.assignedAt ?? null,
  }));

  const setField = <K extends keyof Omit<CodOrder, "id">>(key: K, value: Omit<CodOrder, "id">[K]) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const handleCourierChange = (courierId: string) => {
    const selectedCourier = couriers.find(courier => courier.id === courierId);
    const nextCourierId = courierId || null;
    setForm(current => ({
      ...current,
      courierId: nextCourierId,
      courierName: selectedCourier?.name ?? "",
      status: deriveStatus(current.status, nextCourierId),
      assignedAt: nextCourierId ? current.assignedAt ?? new Date().toISOString() : null,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={event => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.96, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          background: D.surface,
          border: `1px solid ${D.border}`,
          borderRadius: 16,
          padding: 24,
          width: "100%",
          maxWidth: 760,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: D.heading }}>
              {order ? "Edit COD order" : "New COD order"}
            </p>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle, marginTop: 4 }}>
              Assign the parcel to a delivery person and track COD collection.
            </p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: D.subtle, cursor: "pointer", padding: 4, margin: 0 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>Customer name</label>
            <input style={inputStyle} value={form.customerName} onChange={event => setField("customerName", event.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle} value={form.phone} onChange={event => setField("phone", event.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>City</label>
            <input style={inputStyle} value={form.city} onChange={event => setField("city", event.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Zone</label>
            <input style={inputStyle} value={form.zone} onChange={event => setField("zone", event.target.value)} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Address</label>
            <input style={inputStyle} value={form.address} onChange={event => setField("address", event.target.value)} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Items / package summary</label>
            <input style={inputStyle} value={form.itemsSummary} onChange={event => setField("itemsSummary", event.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Amount due (MAD)</label>
            <input
              style={inputStyle}
              type="number"
              min={0}
              value={form.amountDue}
              onChange={event => setField("amountDue", Number(event.target.value))}
            />
          </div>
          <div>
            <label style={labelStyle}>Priority</label>
            <SelectField value={form.priority} onChange={value => setField("priority", value as Priority)}>
              {PRIORITY_OPTIONS.map(priority => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </SelectField>
          </div>

          <div>
            <label style={labelStyle}>Courier</label>
            <SelectField value={form.courierId ?? ""} onChange={handleCourierChange} muted={!form.courierId}>
              <option value="">Not assigned yet</option>
              {couriers.map(courier => (
                <option key={courier.id} value={courier.id}>
                  {courier.name} · {courier.zone}
                </option>
              ))}
            </SelectField>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <SelectField value={form.status} onChange={value => setField("status", value as CodStatus)}>
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </SelectField>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Notes</label>
            <textarea
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
              value={form.notes}
              onChange={event => setField("notes", event.target.value)}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
          <button
            onClick={onClose}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13,
              cursor: "pointer",
              background: D.raised,
              border: `1px solid ${D.border}`,
              color: D.body,
              borderRadius: 8,
              padding: "9px 16px",
              margin: 0,
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.customerName.trim() || !form.phone.trim() || !form.address.trim()}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13,
              cursor: "pointer",
              background: D.gold,
              border: "none",
              color: "#1A120A",
              borderRadius: 8,
              padding: "9px 18px",
              fontWeight: 600,
              opacity: saving ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              margin: 0,
            }}
          >
            {saving && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
            {order ? "Save changes" : "Create order"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CodPage() {
  const [orders, setOrders] = useState<CodOrder[]>([]);
  const [couriers, setCouriers] = useState<DeliveryAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<CodOrder | null | "create">(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [ordersRes, couriersRes] = await Promise.all([
      fetch("/api/v1/cod-orders"),
      fetch("/api/v1/delivery-agents"),
    ]);

    const [ordersData, couriersData] = await Promise.all([
      ordersRes.json() as Promise<CodOrder[]>,
      couriersRes.json() as Promise<DeliveryAgent[]>,
    ]);

    setOrders(
      [...ordersData].sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
    );
    setCouriers(couriersData);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const selectedOrder = useMemo(
    () => orders.find(order => order.id === selectedId) ?? null,
    [orders, selectedId],
  );

  const tabs = useMemo(
    () => [
      { label: "All", count: orders.length },
      { label: "Unassigned", count: orders.filter(order => order.status === "Unassigned").length },
      { label: "Assigned", count: orders.filter(order => order.status === "Assigned").length },
      { label: "In Transit", count: orders.filter(order => order.status === "In Transit").length },
      { label: "Delivered", count: orders.filter(order => order.status === "Delivered").length },
      { label: "Issues", count: orders.filter(order => order.status === "Failed").length },
    ],
    [orders],
  );

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter(order => {
      const matchTab =
        tab === 0 ||
        (tab === 1 && order.status === "Unassigned") ||
        (tab === 2 && order.status === "Assigned") ||
        (tab === 3 && order.status === "In Transit") ||
        (tab === 4 && order.status === "Delivered") ||
        (tab === 5 && order.status === "Failed");

      if (!matchTab) return false;
      if (!query) return true;

      return [
        order.id,
        order.customerName,
        order.phone,
        order.city,
        order.zone,
        order.itemsSummary,
        order.courierName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [orders, search, tab]);

  const paginatedOrders = useMemo(
    () => filteredOrders.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filteredOrders, page],
  );

  const courierLoad = useMemo(() => {
    return couriers.map(courier => {
      const assignedOrders = orders.filter(
        order =>
          order.courierId === courier.id &&
          ["Assigned", "In Transit"].includes(order.status),
      );

      return {
        ...courier,
        activeOrders: assignedOrders.length,
        totalDue: assignedOrders.reduce((sum, order) => sum + order.amountDue, 0),
      };
    });
  }, [couriers, orders]);

  async function persistOrder(orderId: string, patch: Partial<CodOrder>) {
    await fetch(`/api/v1/cod-orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await load();
  }

  async function handleAssign(order: CodOrder, courierId: string) {
    const selectedCourier = couriers.find(courier => courier.id === courierId);
    const nextCourierId = courierId || null;

    await persistOrder(order.id, {
      courierId: nextCourierId,
      courierName: selectedCourier?.name ?? "",
      status: deriveStatus(order.status, nextCourierId),
      assignedAt: nextCourierId ? order.assignedAt ?? new Date().toISOString() : null,
    });
  }

  async function handleStatusChange(order: CodOrder, status: CodStatus) {
    await persistOrder(order.id, { status });
  }

  async function handleSave(payload: Omit<CodOrder, "id">) {
    setSaving(true);

    const normalized = {
      ...payload,
      status: deriveStatus(payload.status, payload.courierId),
      courierName: payload.courierId ? couriers.find(courier => courier.id === payload.courierId)?.name ?? payload.courierName : "",
      assignedAt: payload.courierId ? payload.assignedAt ?? new Date().toISOString() : null,
    };

    if (editingOrder === "create") {
      await fetch("/api/v1/cod-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
    } else if (editingOrder) {
      await fetch(`/api/v1/cod-orders/${editingOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
    }

    setSaving(false);
    setEditingOrder(null);
    await load();
  }

  const rows = paginatedOrders.map(order => ({
    order: (
      <div>
        <p style={{ fontFamily: "monospace", fontSize: 12, color: D.gold, marginBottom: 2 }}>{order.id}</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading }}>{order.customerName}</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle }}>{order.itemsSummary}</p>
      </div>
    ),
    destination: (
      <div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body }}>{order.city} · {order.zone}</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {order.address}
        </p>
      </div>
    ),
    amount: <span style={{ fontFamily: "monospace", color: D.gold }}>{order.amountDue.toLocaleString()} MAD</span>,
    priority: (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 11,
          color: priorityColor(order.priority),
          background: `${priorityColor(order.priority)}18`,
          borderRadius: 999,
          padding: "3px 9px",
        }}
      >
        {order.priority}
      </span>
    ),
    courier: (
      <div onClick={event => event.stopPropagation()}>
        <SelectField
          value={order.courierId ?? ""}
          onChange={value => void handleAssign(order, value)}
          muted={!order.courierId}
        >
          <option value="">Not assigned</option>
          {couriers
            .filter(courier => courier.status !== "Offline")
            .map(courier => (
              <option key={courier.id} value={courier.id}>
                {courier.name}
              </option>
            ))}
        </SelectField>
      </div>
    ),
    status: <StatusBadge status={order.status} />,
  }));

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div>
          <PageHeader
            title="COD Dispatch"
            breadcrumb={["Operations", "COD Dispatch"]}
            subtitle="Assign cash-on-delivery orders to delivery staff and track collection status."
            stats={[
              { label: "orders", value: orders.length, color: D.gold },
              { label: "unassigned", value: orders.filter(order => order.status === "Unassigned").length, color: D.amber },
              { label: "in transit", value: orders.filter(order => order.status === "In Transit").length, color: D.blue },
              {
                label: "cash due",
                value: `${orders
                  .filter(order => order.status !== "Delivered")
                  .reduce((sum, order) => sum + order.amountDue, 0)
                  .toLocaleString()} MAD`,
                color: D.green,
              },
            ]}
            action={{ label: "Add COD Order", onClick: () => setEditingOrder("create") }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              {
                icon: Package,
                label: "Waiting assignment",
                value: orders.filter(order => order.status === "Unassigned").length,
                color: D.amber,
              },
              {
                icon: Truck,
                label: "Out with riders",
                value: orders.filter(order => ["Assigned", "In Transit"].includes(order.status)).length,
                color: D.blue,
              },
              {
                icon: Banknote,
                label: "Collected today",
                value: `${orders
                  .filter(order => order.status === "Delivered")
                  .reduce((sum, order) => sum + order.amountDue, 0)
                  .toLocaleString()} MAD`,
                color: D.green,
              },
              {
                icon: ShieldAlert,
                label: "Delivery issues",
                value: orders.filter(order => order.status === "Failed").length,
                color: D.red,
              },
            ].map(({ icon: Icon, label, value, color }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                style={{
                  background: D.surface,
                  border: `1px solid ${D.border}`,
                  borderRadius: 12,
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={17} style={{ color }} />
                </div>
                <div>
                  <p style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 600, color: D.heading, lineHeight: 1 }}>{value}</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginTop: 4 }}>{label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <TabBar tabs={tabs} active={tab} onChange={nextTab => { setTab(nextTab); setPage(1); }} />
          <SearchBar placeholder="Search order, client, area, courier..." onSearch={value => { setSearch(value); setPage(1); }} />

          {loading ? (
            <div style={{ padding: 60, textAlign: "center", color: D.subtle, fontFamily: "'Space Grotesk', sans-serif" }}>
              Loading COD orders...
            </div>
          ) : (
            <>
              <DataTable
                columns={COLUMNS}
                rows={rows}
                onRowClick={(_, index) => setSelectedId(paginatedOrders[index]?.id ?? null)}
              />
              <Pagination total={filteredOrders.length} perPage={PER_PAGE} page={page} onChange={setPage} />
            </>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20 }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading, marginBottom: 4 }}>
              Delivery team
            </p>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle, marginBottom: 16 }}>
              Active courier workload for COD shipments.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {courierLoad.map(courier => (
                <div
                  key={courier.id}
                  style={{
                    background: D.raised,
                    border: `1px solid ${D.border}`,
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading }}>{courier.name}</p>
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle }}>{courier.vehicle} · {courier.zone}</p>
                    </div>
                    <StatusBadge status={courier.status === "Break" ? "Pending" : courier.status} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ background: D.surface, borderRadius: 8, padding: "10px 12px" }}>
                      <p style={{ fontFamily: "monospace", fontSize: 16, color: D.heading, marginBottom: 4 }}>{courier.activeOrders}</p>
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: D.subtle }}>active orders</p>
                    </div>
                    <div style={{ background: D.surface, borderRadius: 8, padding: "10px 12px" }}>
                      <p style={{ fontFamily: "monospace", fontSize: 16, color: D.gold, marginBottom: 4 }}>{courier.totalDue.toLocaleString()} MAD</p>
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: D.subtle }}>cash pending</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedOrder && (
              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                style={{
                  background: D.surface,
                  border: `1px solid ${D.border}`,
                  borderRadius: 12,
                  padding: 20,
                  position: "sticky",
                  top: 88,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <p style={{ fontFamily: "monospace", fontSize: 12, color: D.gold, marginBottom: 4 }}>{selectedOrder.id}</p>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <button onClick={() => setSelectedId(null)} style={{ background: "transparent", border: "none", color: D.subtle, cursor: "pointer", padding: 0, margin: 0 }}>
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {[
                    { icon: UserRound, label: "Customer", value: selectedOrder.customerName },
                    { icon: Phone, label: "Phone", value: selectedOrder.phone },
                    { icon: MapPin, label: "Address", value: `${selectedOrder.city}, ${selectedOrder.zone} · ${selectedOrder.address}` },
                    { icon: Package, label: "Parcel", value: selectedOrder.itemsSummary },
                    { icon: Banknote, label: "Amount due", value: `${selectedOrder.amountDue.toLocaleString()} MAD` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: D.raised, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={14} style={{ color: D.gold }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginBottom: 2 }}>{label}</p>
                        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body, lineHeight: 1.45 }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>Assigned courier</label>
                  <SelectField value={selectedOrder.courierId ?? ""} onChange={value => void handleAssign(selectedOrder, value)} muted={!selectedOrder.courierId}>
                    <option value="">Not assigned</option>
                    {couriers.filter(courier => courier.status !== "Offline").map(courier => (
                      <option key={courier.id} value={courier.id}>
                        {courier.name}
                      </option>
                    ))}
                  </SelectField>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Delivery status</label>
                  <SelectField value={selectedOrder.status} onChange={value => void handleStatusChange(selectedOrder, value as CodStatus)}>
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </SelectField>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  <div style={{ background: D.raised, borderRadius: 8, padding: "10px 12px" }}>
                    <p style={{ fontFamily: "monospace", fontSize: 11, color: D.muted, marginBottom: 4 }}>created</p>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body }}>{formatDateTime(selectedOrder.createdAt)}</p>
                  </div>
                  <div style={{ background: D.raised, borderRadius: 8, padding: "10px 12px" }}>
                    <p style={{ fontFamily: "monospace", fontSize: 11, color: D.muted, marginBottom: 4 }}>assigned</p>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body }}>
                      {selectedOrder.assignedAt ? formatDateTime(selectedOrder.assignedAt) : "Waiting"}
                    </p>
                  </div>
                </div>

                <div style={{ background: D.raised, borderRadius: 10, padding: 14, marginBottom: 14 }}>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginBottom: 6 }}>Notes</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body, lineHeight: 1.5 }}>
                    {selectedOrder.notes || "No notes on this order."}
                  </p>
                </div>

                <button
                  onClick={() => setEditingOrder(selectedOrder)}
                  style={{
                    width: "100%",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 12,
                    cursor: "pointer",
                    background: D.gold,
                    border: "none",
                    color: "#1A120A",
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Edit order
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {editingOrder && (
          <OrderModal
            order={editingOrder === "create" ? null : editingOrder}
            couriers={couriers}
            saving={saving}
            onClose={() => setEditingOrder(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </>
  );
}
