import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Download,
  Grid3x3,
  List,
  ArrowUpDown,
  Receipt as ReceiptIcon,
  X,
  ChevronDown,
  Map as MapIcon,
  MoveRight,
  ArrowRight,
  Search,
  Check,
  ChevronRight,
  Lock,
  User,
  MapPin,
  Building2,
  Mail,
  CreditCard,
  Plus,
  Clock,
  FileText,
} from "lucide-react";

type Trip = {
  id: number;
  merchant: string;
  merchantLocation?: string;
  traveler?: string;
  travelerLocation?: string;
  transactionDate?: string;
  flags?: string | null;
  bookingSource?: string | null;
  bookingStatus?: string | null;
  bookingStartDate?: string | null;
  destination?: string | null;
  receipt?: string | null;
  memo?: string | null;
  spentFrom?: string | null;
  paymentType?: string | null;
  amount?: string | null;
};

type Group = {
  id: string;
  title: string;
  date: string;
  totalSpend: string;
  trips: Trip[];
};

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import travelGroups from "@/data/travelGroup.json";
// Grouped travel data

const tabs = ["All trips", "Active", "Upcoming", "Completed", "Requests"];

type FilterChip = {
  id: string;
  label: string;
};

type ColumnConfig = {
  key: keyof Trip;
  label: string;
  locked?: boolean;
};

const FILTER_SECTIONS = [
  {
    title: "Suggested",
    options: ["Amount", "Transaction date"],
  },
  {
    title: "All",
    options: [
      "Accounting Billable",
      "Accounting Category",
      "Accounting Class",
      "Booking source",
      "Booking status",
      "Booking start date",
      "Booking end date",
      "Destination",
      "Flags",
      "Memo",
      "Merchant",
      "Payment type",
      "Receipt",
      "Spent from",
      "Traveler",
      "Transaction date",
    ],
  },
];

const GROUP_OPTIONS = ["Trip", "User"] as const;

const COLUMN_CONFIG: ColumnConfig[] = [
  { key: "merchant", label: "Merchant", locked: true },
  { key: "traveler", label: "Traveler" },
  { key: "transactionDate", label: "Transaction date" },
  { key: "flags", label: "Flags" },
  { key: "bookingSource", label: "Booking source" },
  { key: "bookingStatus", label: "Booking status" },
  { key: "bookingStartDate", label: "Booking start date" },
  { key: "destination", label: "Destination" },
  { key: "receipt", label: "Receipt" },
  { key: "memo", label: "Memo" },
  { key: "spentFrom", label: "Spent from" },
  { key: "paymentType", label: "Payment type" },
  { key: "amount", label: "Amount" },
] as const;

const DEFAULT_VISIBLE_COLUMNS = COLUMN_CONFIG.map((c) => c.key);

const defaultFilterChips: FilterChip[] = [
  { id: "transaction-date", label: "Transaction date" },
  { id: "relative-range", label: "Last 3 months to next 3 months" },
];

const travelGroupData = travelGroups as Group[];

const parseCurrencyValue = (value?: string | null) => {
  if (!value) return 0;
  const numeric = Number(String(value).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);

const buildUserGroups = (groups: Group[]): Group[] => {
  const userMap = new Map<
    string,
    { id: string; title: string; date: string; total: number; trips: Trip[] }
  >();

  groups.forEach((group) => {
    group.trips.forEach((trip) => {
      const travelerName = trip.traveler || "Unknown traveler";
      const key = travelerName.toLowerCase();
      const amountValue = parseCurrencyValue(trip.amount);

      if (!userMap.has(key)) {
        userMap.set(key, {
          id: `user-${key}`,
          title: travelerName,
          date: trip.transactionDate || group.date,
          total: 0,
          trips: [],
        });
      }

      const entry = userMap.get(key)!;
      entry.total += amountValue;
      entry.trips.push(trip);
    });
  });

  return Array.from(userMap.values()).map((entry) => ({
    id: entry.id,
    title: entry.title,
    date: entry.date,
    totalSpend: formatCurrency(entry.total),
    trips: entry.trips,
  }));
};

const buildUngroupedGroups = (groups: Group[]): Group[] => {
  const allTrips = groups.flatMap((group) => group.trips);
  const total = allTrips.reduce(
    (sum, trip) => sum + parseCurrencyValue(trip.amount),
    0
  );

  return [
    {
      id: "all-trips",
      title: "All trips",
      date: `${allTrips.length} transactions`,
      totalSpend: formatCurrency(total),
      trips: allTrips,
    },
  ];
};

export function Travel() {
  const [activeTab, setActiveTab] = useState("All trips");
  const [groupBy, setGroupBy] = useState<(typeof GROUP_OPTIONS)[number] | null>(
    "Trip"
  );
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "group1",
    "group2",
    "group3",
    "group4",
  ]);
  const [selectedTrip, setSelectedTrip] = useState<Group | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [showWhatsThis, setShowWhatsThis] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [groupPopoverOpen, setGroupPopoverOpen] = useState(false);
  const [columnsPopoverOpen, setColumnsPopoverOpen] = useState(false);
  const [filterChips, setFilterChips] =
    useState<FilterChip[]>(defaultFilterChips);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    () => new Set(DEFAULT_VISIBLE_COLUMNS)
  );
  const [selectedRows, setSelectedRows] = useState<Set<number>>(
    () => new Set()
  );

  const searchRef = useRef<HTMLDivElement | null>(null);
  const popoverRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visibleColumnCount = Math.max(visibleColumns.size, 1);

  const baseGroups = useMemo(() => {
    if (groupBy === "User") {
      return buildUserGroups(travelGroupData);
    }
    if (groupBy === null) {
      return buildUngroupedGroups(travelGroupData);
    }
    return travelGroupData;
  }, [groupBy]);

  const handleGroupByChange = useCallback(
    (next: (typeof GROUP_OPTIONS)[number] | null) => {
      setGroupBy(next);
      setExpandedGroups(
        (next === "User"
          ? buildUserGroups(travelGroupData)
          : next === null
          ? buildUngroupedGroups(travelGroupData)
          : travelGroupData
        ).map((group) => group.id)
      );
      setCurrentPage(1);
    },
    []
  );

  // compute filtered and sorted groups/trips
  const filteredGroups: Group[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const comparator = (a: Trip, b: Trip) => {
      if (!sortBy) return 0;
      let va: unknown = a[sortBy as keyof Trip];
      let vb: unknown = b[sortBy as keyof Trip];

      if (sortBy === "transactionDate") {
        va = Date.parse(String(va)) || 0;
        vb = Date.parse(String(vb)) || 0;
      }

      if (sortBy === "amount") {
        const parseAmt = (s: string) =>
          Number(String(s).replace(/[^0-9.-]+/g, "")) || 0;
        va = parseAmt(String(va));
        vb = parseAmt(String(vb));
      }

      const aVal = typeof va === "number" ? va : String(va || "");
      const bVal = typeof vb === "number" ? vb : String(vb || "");

      if (typeof aVal === "number" && typeof bVal === "number") {
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      }

      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    };

    return baseGroups
      .map((group: Group) => {
        const trips = group.trips.filter((trip: Trip) => {
          if (!q) return true;
          return (
            String(trip.merchant || "")
              .toLowerCase()
              .includes(q) ||
            String(trip.traveler || "")
              .toLowerCase()
              .includes(q) ||
            String(trip.destination || "")
              .toLowerCase()
              .includes(q) ||
            String(trip.memo || "")
              .toLowerCase()
              .includes(q) ||
            String(trip.receipt || "")
              .toLowerCase()
              .includes(q) ||
            String(trip.spentFrom || "")
              .toLowerCase()
              .includes(q)
          );
        });

        if (sortBy) trips.sort(comparator);

        return {
          ...group,
          trips,
        } as Group;
      })
      .filter((g) => g.trips.length > 0);
  }, [baseGroups, searchQuery, sortBy, sortDir]) as Group[];

  const totalMatches = filteredGroups.length;
  const totalPages = Math.ceil(totalMatches / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (key: string) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const handleGroupClick = (group: Group) => {
    setSelectedTrip(group);
  };

  const handleBackToList = () => {
    setSelectedTrip(null);
  };

  const toggleColumn = (key: string, locked?: boolean) => {
    if (locked) return;
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleRowSelection = (rowId: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  const isColumnVisible = (key: string) => visibleColumns.has(key);

  const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as Node;
    if (
      searchOpen &&
      searchRef.current &&
      !searchRef.current.contains(target)
    ) {
      setSearchOpen(false);
    }
    popoverRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      const setters = [setGroupPopoverOpen, setColumnsPopoverOpen];
      if (ref && !ref.contains(target)) {
        setters[idx](false);
      }
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  });

  const renderColumnToggle = (option: (typeof COLUMN_CONFIG)[number]) => (
    <button
      key={option.key}
      onClick={() => toggleColumn(option.key, option.locked)}
      className={`flex items-center justify-between w-full px-2 py-1 text-sm rounded hover:bg-neutral-100 ${
        option.locked
          ? "text-neutral-400 cursor-not-allowed"
          : "text-neutral-800"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`h-4 w-4 border rounded-sm flex items-center justify-center ${
            visibleColumns.has(option.key)
              ? "bg-black text-white border-black"
              : "border-neutral-300"
          }`}
        >
          {visibleColumns.has(option.key) && <Check className="h-3 w-3" />}
        </span>
        {option.label}
      </div>
      {option.locked && <Lock className="h-3 w-3 text-neutral-400" />}
    </button>
  );

  const renderFilterOption = (label: string) => (
    <button
      key={label}
      className="flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-neutral-50"
    >
      <span>{label}</span>
      <ChevronRight className="h-4 w-4 text-neutral-400" />
    </button>
  );

  if (selectedTrip) {
    return (
      <div className="flex flex-col h-full bg-white overflow-y-auto">
        {/* Trip Detail Header */}
        <div className="flex-none px-6 py-4 border-b border-neutral-200">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-4"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Trips
          </button>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-neutral-200 flex items-center justify-center">
                <MapIcon className="h-8 w-8 text-neutral-600" />
              </div>
              <div>
                <h1 className="text-3xl font-medium">{selectedTrip.title}</h1>
                <p className="text-sm text-neutral-600">{selectedTrip.date}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUserProfile(true)}
            >
              Edit trip
            </Button>
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="flex-none px-6 py-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold mb-2">Itinerary</h2>
          <p className="text-sm text-neutral-600 mb-4">
            Your booking details will appear here when you book a flight, hotel,
            or car.
          </p>
          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpDown className="h-4 w-4" />
              <span className="text-sm font-medium">
                Explore in-policy options for flights, hotels, and cars
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
                size="sm"
              >
                Search flights
              </Button>
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
                size="sm"
              >
                Search hotels
              </Button>
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
                size="sm"
              >
                Search cars
              </Button>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Expenses</h2>
              <div className="text-xs text-neutral-600 mt-1">Total spend</div>
              <div className="text-2xl font-semibold">
                {selectedTrip.totalSpend}
              </div>
            </div>
            <Button variant="outline" size="sm">
              Add
            </Button>
          </div>

          {/* Color bar */}
          <div className="h-2 bg-neutral-100 rounded-none overflow-hidden mb-6">
            <div className="h-full flex">
              <div className="bg-[#439858]" style={{ width: "60%" }}></div>
              <div className="bg-[#C4A15C]" style={{ width: "20%" }}></div>
              <div className="bg-[#7B5C8E]" style={{ width: "20%" }}></div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search or filter..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-200"
              />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Expenses Table */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50">
                  <TableHead className="text-xs">Merchant</TableHead>
                  <TableHead className="text-xs">Transaction date</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Expense policy</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTrip.trips.map((trip) => (
                  <TableRow key={trip.id} className="hover:bg-neutral-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs">
                          {trip.merchantLocation === "Airlines"
                            ? ""
                            : trip.merchantLocation === "Lodging"
                            ? ""
                            : ""}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {trip.merchant}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {trip.merchantLocation}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {trip.transactionDate}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs text-green-700 bg-green-50 border-green-200"
                      >
                        Cleared
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {trip.merchantLocation}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-neutral-100 rounded">
                          <span className="text-neutral-400">
                            <Clock />
                          </span>
                        </button>
                        <button className="p-1 hover:bg-neutral-100 rounded">
                          <span className="text-neutral-400">
                            <FileText />
                          </span>
                        </button>
                        <button className="p-1 hover:bg-neutral-100 rounded">
                          <span className="text-neutral-400">
                            <Check />
                          </span>
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-right">
                      {trip.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* User Profile Modal */}
        {showUserProfile && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowUserProfile(false)}
            />
            <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">David Wallace</h2>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowUserProfile(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-neutral-200 mb-6">
                  <button className="pb-2 text-sm font-medium border-b-2 border-black">
                    Overview
                  </button>
                  <button className="pb-2 text-sm text-neutral-600">
                    Activity
                  </button>
                </div>

                {/* Location & Department */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-xs text-neutral-600 mb-1">
                      Location
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <MapPin className="h-3 w-3" />
                      San Francisco →
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-600 mb-1">
                      Department
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Building2 className="h-3 w-3" />
                      Executive →
                    </div>
                  </div>
                </div>

                {/* Role & Email */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-xs text-neutral-600 mb-1">Role</div>
                    <div className="text-sm">Owner</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-600 mb-1">Email</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      tanmay@thefasoftware.ai
                    </div>
                  </div>
                </div>

                {/* Physical Card Section */}
                <div className="bg-neutral-50 rounded-lg p-6 mb-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 rounded-lg border-2 border-neutral-300 flex items-center justify-center">
                      <CreditCard className="h-8 w-8 text-neutral-400" />
                    </div>
                  </div>
                  <div className="text-sm text-neutral-600 mb-3">
                    David doesn't have a physical card (yet!)
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Issue a Ramp Card →
                  </Button>
                </div>

                {/* Funds Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold">
                      Funds that David can spend
                    </h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="border border-neutral-200 rounded-lg p-3">
                      <div className="text-sm font-medium mb-1">
                        Travel Expenses
                      </div>
                      <div className="text-xs text-neutral-600">
                        $5,000.00 remaining · $5,000.00 USD / Monthly
                      </div>
                    </div>
                    <div className="border border-neutral-200 rounded-lg p-3">
                      <div className="text-sm font-medium mb-1">Equipment</div>
                      <div className="text-xs text-neutral-600">
                        $8,000.00 remaining · $8,000.00 USD / Monthly
                      </div>
                    </div>
                    <div className="border border-neutral-200 rounded-lg p-3">
                      <div className="text-sm font-medium mb-1">
                        Entertainment
                      </div>
                      <div className="text-xs text-neutral-600">
                        $7,000.00 remaining · $7,000.00 USD / Monthly
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white py-3 md:py-6 overflow-x-visible overflow-y-none">
      {/* Page Header - Fixed */}
      <div className="flex-none px-3 sm:px-6 py-4 border-b border-neutral-200 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl sm:text-3xl font-medium">Travel</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto ">
            <Button variant="outline" size="sm" className="hidden sm:flex py-5">
              <MapIcon className="h-4 w-4 mr-2" />
              <p className="text-lg">Traveler map</p>
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex py-5">
              <p className="text-lg">Manage</p>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            <Button
              size="sm"
              className="bg-[#E4F222] hover:bg-[#ebfc00] text-black flex-1 sm:flex-none py-5 hover:underline"
            >
              <p className="text-lg">Book travel</p>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-col gap-2 mt-8">
          <div className="text-xs text-neutral-600">Travel spend</div>
          <div className="text-4xl font-medium flex gap-2 mb-2">
            $52,634.57 USD{" "}
            <p className="flex items-end justify-end ">
              <ChevronDown className="text-xs" />
              <span className="text-xs text-neutral-400 mb-1">+22%</span>
            </p>
          </div>

          <div className="h-2 bg-neutral-100 rounded-none overflow-hidden mb-4">
            <div className="h-full flex">
              <div className="bg-[#439858]" style={{ width: "40%" }}></div>
              <div className="bg-[#75876F]" style={{ width: "20%" }}></div>
              <div className="bg-[#5E540E]" style={{ width: "15%" }}></div>
              <div className="bg-[#C87F8D]" style={{ width: "10%" }}></div>
              <div className="bg-[#684162]" style={{ width: "15%" }}></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col gap-4">
            <div className="">
              <div className="text-xs text-neutral-600 mb-1">Card spend</div>
              <div className="text-lg font-semibold">$789.52</div>
            </div>
            <div>
              <div className="text-xs text-neutral-600">Price drop savings</div>
              <div className="text-sm"> $200.00</div>
              <div className="text-xs text-neutral-500">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowWhatsThis(true);
                  }}
                  className="underline text-blue-600"
                  aria-haspopup="dialog"
                >
                  What's this?
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-xs text-neutral-600 mb-1">
                Average trip cost
              </div>
              <div className="text-lg font-semibold flex items-center ">
                $1,380.94 <ChevronDown className="text-neutral-600 ml-2" />
                <span className="text-xs text-neutral-600">1%</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-neutral-600 mt-2">
                Top destination
              </div>
              <button
                onClick={() => setSearchQuery("New York")}
                className="text-sm font-medium text-left text-neutral-800 hover:underline"
                aria-label="Filter by top destination New York"
              >
                New York
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-xs text-neutral-600 mb-1">Biggest trip</div>
              <div className="text-lg font-semibold">$6,232.08</div>
            </div>
            <div>
              <div className="text-xs text-neutral-600 mt-2">
                Top hotel chain
              </div>
              <div className="text-sm font-medium">
                The St. Regis San Francisco
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-xs text-neutral-600 mb-1">
                Biggest spender
              </div>
              <button
                onClick={() => setSearchQuery("Creed Bratton")}
                className="text-lg font-semibold text-left text-neutral-900 hover:underline"
                aria-label="Filter by biggest spender Creed Bratton"
              >
                Creed Bratton
              </button>
            </div>
            <div>
              <div className="text-xs text-neutral-600 mt-2">Top airline</div>
              <div className="text-sm font-medium">United Airlines</div>
            </div>
          </div>
        </div>
      </div>

      {/* What's this modal */}
      {showWhatsThis && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowWhatsThis(false)}
          />
          <div className="relative max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-start justify-between p-6">
              <h2 className="text-lg font-semibold">
                Why settle for the first price you see?
              </h2>
              <button
                className="p-1 rounded hover:bg-neutral-100"
                onClick={() => setShowWhatsThis(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5 text-neutral-600" />
              </button>
            </div>
            <div className="px-6 pb-6">
              <p className="text-sm text-neutral-600 mb-4">
                Booking on Ramp saves you money automatically.
              </p>

              <div className="bg-neutral-50 rounded-md p-6 mb-6">
                <div className="bg-white rounded-md p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <div className="font-medium">The Empire</div>
                      <div className="text-xs text-neutral-500">
                        Confirmed reservation
                      </div>
                    </div>
                  </div>

                  <div className="h-40 bg-white rounded-md border border-neutral-100 flex items-center justify-center text-sm text-neutral-500">
                    [price drop chart]
                  </div>
                </div>
              </div>

              <ol className="space-y-4">
                <li>
                  <div className="font-semibold">1. Book refundable hotels</div>
                  <div className="text-sm text-neutral-600">
                    When your team books a refundable hotel on Ramp, we've got
                    you covered. If the price drops, we will rebook at the lower
                    rate automatically, so you save without lifting a finger.
                  </div>
                </li>
                <li>
                  <div className="font-semibold">
                    2. We track price drops for you
                  </div>
                  <div className="text-sm text-neutral-600">
                    Ramp checks hotel prices every day. If your rate drops by
                    $50 or more, we'll rebook automatically and cancel the
                    original reservation.
                  </div>
                </li>
                <li>
                  <div className="font-semibold">
                    3. Same hotel stay, better price
                  </div>
                  <div className="text-sm text-neutral-600">
                    Your hotel, dates, and room stay exactly the same, just at a
                    lower cost. You save money while we do the work.
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Tabs - Fixed */}
      <div className="flex-none flex items-center gap-6 px-6 border-b border-neutral-200 bg-white z-20">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-black text-black"
                : "border-transparent text-neutral-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters and Search - Fixed */}
      <div className="flex-none flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-3 sm:px-6 py-3 border-b border-neutral-200 bg-white z-20 relative">
        <div className="relative w-full sm:w-1/3" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search or filter..."
              className="w-full pl-10 pr-10 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          </div>
          {searchOpen && (
            <div className="absolute mt-2 w-[420px] bg-white rounded-lg shadow-xl border border-neutral-200 z-30">
              <div className="px-3 py-2 border-b border-neutral-100 text-xs text-neutral-500">
                Suggested filters
              </div>
              <div className="max-h-64 overflow-y-auto z-100">
                {FILTER_SECTIONS.map((section) => (
                  <div key={section.title}>
                    <div className="px-3 pt-3 pb-1 text-xs uppercase text-neutral-400">
                      {section.title}
                    </div>
                    {section.options.map((option) =>
                      renderFilterOption(option)
                    )}
                  </div>
                ))}
              </div>
              <div className="px-3 py-2 text-xs text-neutral-400 border-t border-neutral-100 flex justify-between">
                <span>
                  Use <kbd className="px-1">↑</kbd>{" "}
                  <kbd className="px-1">↓</kbd> to navigate
                </span>
                <span>Select with ↵</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
          {filterChips.map((chip) => (
            <Badge key={chip.id} variant="outline" className="gap-1">
              {chip.label}
              <button
                className="ml-1 text-neutral-400 hover:text-black"
                onClick={() =>
                  setFilterChips((prev) => prev.filter((c) => c.id !== chip.id))
                }
                aria-label={`Remove ${chip.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="hidden sm:flex flex-1" />
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div
            ref={(el) => {
              popoverRefs.current[0] = el;
            }}
            className="relative"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setGroupPopoverOpen((prev) => !prev)}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            {groupPopoverOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg p-3 space-y-1 z-50">
                <div className="text-xs text-neutral-500 mb-2">Group by</div>
                {GROUP_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleGroupByChange(option)}
                    className={`w-full flex items-center justify-between text-sm px-2 py-2 rounded hover:bg-neutral-50 ${
                      groupBy === option ? "text-black" : "text-neutral-600"
                    }`}
                  >
                    {option}
                    {groupBy === option && <Check className="h-4 w-4" />}
                  </button>
                ))}
                <div className="flex justify-between pt-2 text-sm text-neutral-500">
                  <button
                    onClick={() => handleGroupByChange(null)}
                    className="hover:text-black"
                  >
                    Remove grouping
                  </button>
                  <button
                    onClick={() => handleGroupByChange("Trip")}
                    className="hover:text-black"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
          <div
            ref={(el) => {
              popoverRefs.current[1] = el;
            }}
            className="relative"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setColumnsPopoverOpen((prev) => !prev)}
            >
              <List className="h-4 w-4" />
            </Button>
            {columnsPopoverOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg p-3 max-h-72 overflow-y-auto z-50">
                <div className="flex items-center justify-between mb-2 text-sm text-neutral-500">
                  <div>Columns</div>
                  <div className="space-x-2 text-xs">
                    <button
                      onClick={() =>
                        setVisibleColumns(new Set(DEFAULT_VISIBLE_COLUMNS))
                      }
                      className="hover:text-black"
                    >
                      Select all
                    </button>
                    <button
                      onClick={() =>
                        setVisibleColumns(
                          new Set(
                            COLUMN_CONFIG.filter((c) => c.locked).map(
                              (c) => c.key
                            )
                          )
                        )
                      }
                      className="hover:text-black"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  {COLUMN_CONFIG.map((option) => renderColumnToggle(option))}
                </div>
              </div>
            )}
          </div>

          <div
            ref={(el) => {
              popoverRefs.current[3] = el;
            }}
            className="relative"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {}}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table - Scrollable Content */}
      <div className="flex-1 overflow-x-auto overflow-y-auto z-10">
        <Table className="min-w-[800px] lg:min-w-[2000px]">
          <TableHeader className="sticky top-0 z-30 bg-white shadow-sm">
            <TableRow className="border-b border-neutral-200 hover:bg-transparent">
              {isColumnVisible("merchant") && (
                <TableHead className="sticky left-0 z-40 bg-white w-[220px] px-4 py-2.5 text-left text-xs font-normal text-neutral-500 uppercase tracking-wide border-r border-neutral-200">
                  <button
                    onClick={() => toggleSort("merchant")}
                    className="flex items-center gap-1"
                    aria-label="Sort by merchant"
                  >
                    Merchant
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
              )}
              {isColumnVisible("traveler") && (
                <TableHead className="w-[180px] px-4 py-2.5 text-left text-xs font-normal text-neutral-500 uppercase tracking-wide">
                  Traveler
                </TableHead>
              )}
              {isColumnVisible("transactionDate") && (
                <TableHead className="w-40 px-4 py-2.5 text-left text-xs font-normal text-neutral-500 uppercase tracking-wide">
                  <button
                    onClick={() => toggleSort("transactionDate")}
                    className="flex items-center gap-1"
                    aria-label="Sort by transaction date"
                  >
                    Transaction date
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
              )}
              {isColumnVisible("flags") && (
                <TableHead className="w-[180px] px-4 py-2.5 text-left text-xs font-normal text-neutral-500 uppercase tracking-wide">
                  Flags
                </TableHead>
              )}
              {isColumnVisible("bookingSource") && (
                <TableHead className="w-40 px-4 py-2.5 text-left text-xs font-normal text-neutral-500 uppercase tracking-wide">
                  Booking source
                </TableHead>
              )}
              {isColumnVisible("bookingStatus") && (
                <TableHead className="w-40 px-4 py-2.5 text-left text-xs font-normal text-neutral-500 uppercase tracking-wide">
                  Booking status
                </TableHead>
              )}
              {isColumnVisible("bookingStartDate") && (
                <TableHead className="w-40 px-4 py-2.5 text-left text-xs font-normal text-neutral-500 uppercase tracking-wide">
                  Booking start date
                </TableHead>
              )}
              {isColumnVisible("destination") && (
                <TableHead className="w-[180px] px-4 py-2.5 text-left text-xs font-normal text-neutral-500 uppercase tracking-wide">
                  Destination
                </TableHead>
              )}
              {isColumnVisible("receipt") && (
                <TableHead className="w-[140px] px-4 py-2.5 text-left text-xs font-normal text-neutral-500 uppercase tracking-wide">
                  Receipt
                </TableHead>
              )}
              {isColumnVisible("memo") && (
                <TableHead className="w-[120px] px-4 py-2.5 text-left text-xs font-normal text-neutral-500 uppercase tracking-wide">
                  Memo
                </TableHead>
              )}
              {isColumnVisible("spentFrom") && (
                <TableHead className="w-[200px] px-4 py-2.5 text-left text-xs font-normal text-neutral-500 uppercase tracking-wide">
                  Spent from
                </TableHead>
              )}
              {isColumnVisible("paymentType") && (
                <TableHead className="w-40 px-4 py-2.5 text-left text-xs font-normal text-neutral-500 uppercase tracking-wide">
                  Payment type
                </TableHead>
              )}
              {isColumnVisible("amount") && (
                <TableHead className="sticky right-0 z-40 bg-white w-[120px] px-4 py-2.5 text-right text-xs font-normal text-neutral-500 uppercase tracking-wide border-l border-neutral-200">
                  <button
                    onClick={() => toggleSort("amount")}
                    className="flex items-center justify-end gap-1 w-full"
                    aria-label="Sort by amount"
                  >
                    Amount
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGroups.map((group) => (
              <React.Fragment key={group.id}>
                {/* Group Separator Row */}
                <TableRow className=" bg-neutral-50 hover:bg-neutral-50 border-y border-neutral-200 ">
                  <TableCell colSpan={visibleColumnCount} className="p-0 ">
                    <button
                      onClick={() => handleGroupClick(group)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-neutral-100 transition-colors"
                    >
                      <div className="flex gap-1 flex-col left-5 sticky z-20 ">
                        <span className="font-semibold text-sm text-neutral-900">
                          {group.title} <MoveRight className="inline h-4 w-4" />
                        </span>
                        <span className="text-xs text-neutral-500">
                          {group.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 right-5 sticky z-20">
                        <div className="text-right">
                          <div className="text-sm font-semibold text-neutral-900">
                            {group.totalSpend}
                          </div>
                          <div className="text-xs text-neutral-500">
                            Total spend
                          </div>
                        </div>
                      </div>
                    </button>
                  </TableCell>
                </TableRow>

                {/* Group Items */}
                {expandedGroups.includes(group.id) &&
                  group.trips.map((trip: Trip) => (
                    <TableRow
                      key={trip.id}
                      className={`group/row border-b border-neutral-100 hover:bg-gray-50 ${
                        selectedRows.has(trip.id) ? "bg-neutral-50" : ""
                      }`}
                      onClick={() => toggleRowSelection(trip.id)}
                    >
                      {isColumnVisible("merchant") && (
                        <TableCell className="sticky left-0 z-20 bg-white group-hover/row:bg-gray-50 px-4 py-3.5 border-r border-neutral-100">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-sm shrink-0">
                              {trip.merchantLocation === "Airlines"
                                ? ""
                                : trip.merchantLocation === "Lodging"
                                ? ""
                                : ""}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-sm text-neutral-900 truncate">
                                {trip.merchant}
                              </div>
                              <div className="text-xs text-neutral-500">
                                {trip.merchantLocation}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      {isColumnVisible("traveler") && (
                        <TableCell className="px-4 py-3.5">
                          <div className="font-medium text-sm text-neutral-900">
                            {trip.traveler}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {trip.travelerLocation}
                          </div>
                        </TableCell>
                      )}
                      {isColumnVisible("transactionDate") && (
                        <TableCell className="px-4 py-3.5 text-sm text-neutral-700">
                          {trip.transactionDate}
                        </TableCell>
                      )}
                      {isColumnVisible("flags") && (
                        <TableCell className="px-4 py-3.5">
                          {trip.flags && (
                            <Badge
                              variant="warning"
                              className="text-xs whitespace-nowrap font-normal"
                            >
                              {trip.flags}
                            </Badge>
                          )}
                        </TableCell>
                      )}
                      {isColumnVisible("bookingSource") && (
                        <TableCell className="px-4 py-3.5">
                          {trip.bookingSource && (
                            <Badge
                              variant="warning"
                              className="text-xs whitespace-nowrap font-normal"
                            >
                              {trip.bookingSource}
                            </Badge>
                          )}
                        </TableCell>
                      )}
                      {isColumnVisible("bookingStatus") && (
                        <TableCell className="px-4 py-3.5">
                          {trip.bookingStatus && (
                            <Badge
                              variant="outline"
                              className="text-xs whitespace-nowrap font-normal"
                            >
                              {trip.bookingStatus}
                            </Badge>
                          )}
                        </TableCell>
                      )}
                      {isColumnVisible("bookingStartDate") && (
                        <TableCell className="px-4 py-3.5 text-sm text-neutral-700">
                          {trip.bookingStartDate || "—"}
                        </TableCell>
                      )}
                      {isColumnVisible("destination") && (
                        <TableCell className="px-4 py-3.5 text-sm text-neutral-700">
                          {trip.destination || "—"}
                        </TableCell>
                      )}
                      {isColumnVisible("receipt") && (
                        <TableCell className="px-4 py-3.5">
                          {trip.receipt && (
                            <div className="flex items-center gap-1.5 text-sm text-neutral-700">
                              <ReceiptIcon className="h-3.5 w-3.5" />
                              <span>{trip.receipt}</span>
                            </div>
                          )}
                        </TableCell>
                      )}
                      {isColumnVisible("memo") && (
                        <TableCell className="px-4 py-3.5 text-sm text-neutral-700">
                          {trip.memo || "—"}
                        </TableCell>
                      )}
                      {isColumnVisible("spentFrom") && (
                        <TableCell className="px-4 py-3.5 text-sm text-neutral-700">
                          {trip.spentFrom || "—"}
                        </TableCell>
                      )}
                      {isColumnVisible("paymentType") && (
                        <TableCell className="px-4 py-3.5">
                          {
                            <Badge
                              variant="outline"
                              className="text-xs whitespace-nowrap font-normal"
                            >
                              {trip.paymentType}
                            </Badge>
                          }
                        </TableCell>
                      )}
                      {isColumnVisible("amount") && (
                        <TableCell className="sticky right-0 z-20 bg-white group-hover/row:bg-gray-50 px-4 py-3.5 text-right border-l border-neutral-100">
                          <span className="text-sm font-semibold text-neutral-900">
                            {trip.amount}
                          </span>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer - Fixed */}
      <div className=" px-6 py-3 border-t border-neutral-200 bg-white flex items-center justify-end text-sm text-neutral-600 z-20 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center">
          {totalMatches === 0
            ? "0 items"
            : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                currentPage * itemsPerPage,
                totalMatches
              )} of ${totalMatches} matching items`}
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={currentPage === totalPages ? "text-neutral-700" : ""}
          >
            <ArrowRight className="" />
          </Button>
        </div>
      </div>
    </div>
  );
}
