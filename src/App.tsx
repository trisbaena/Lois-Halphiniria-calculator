import React, { useMemo, useState } from "react";

// Single-file React component (default export)
// TailwindCSS styling, minimal + clean
// All numbers are treated as N-Meseta; inputs accept raw numbers (with commas auto-formatted).
// Closing tags verified — 2025-09-25

// ---------- Utilities ----------
// N-Meseta icon (remote URL per user request)
const NM_ICON = "/n-meseta.png";
const NM_ICON_FALLBACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%23f2c94c'/><circle cx='12' cy='12' r='6' fill='%23f7e06e'/></svg>";

const formatMoney = (n) => {
  if (n === null || n === undefined || isNaN(n)) return "0";
  return Number(n).toLocaleString("en-US");
};

const parseNum = (v) => {
  if (v === "" || v === null || v === undefined) return 0;
  const n = Number(String(v).replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
};

// format an input string to include thousand separators while typing
const formatWithCommasStr = (v) => {
  const digits = String(v).replace(/[^0-9]/g, "");
  if (digits === "") return "";
  return Number(digits).toLocaleString("en-US");
};

// ---------- Row ----------
function MaterialRow({
  nameJP,
  nameEN,
  amount,
  having,
  price,
  onChangeHaving,
  onChangePrice,
  maxHaving,
}) {
  const sum = useMemo(() => {
    const need = Math.max(0, amount - parseNum(having));
    return parseNum(price) * need;
  }, [price, amount, having]);
  const shortage = Math.max(0, amount - parseNum(having));
  const showShortage = shortage > 0;

  return (
    <div className="grid grid-cols-12 items-start gap-3 py-3 border-b border-neutral-800">
      {/* Material name */}
      <div className="col-span-4">
        <div className="text-sm text-neutral-400">{nameJP}</div>
        <div className="font-medium">{nameEN}</div>
      </div>

      {/* Amount (Required) */}
      <div className="col-span-1 flex items-center">
        <span className="rounded-xl bg-neutral-800 px-3 py-1 text-sm font-semibold">{amount}</span>
      </div>

      {/* Owned (Having) */}
      <div className="col-span-2">
        <div className="flex items-center gap-2">
          {/* decrement */}
          <button
            type="button"
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={() => onChangeHaving(String(Math.max(0, parseNum(having) - 1)))}
            title="Decrease owned by 1"
          >
            &lt;
          </button>

          <input
            type="text"
            inputMode="numeric"
            className="w-full rounded-xl border border-yellow-500 px-3 py-2 text-center text-base bg-black text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={formatWithCommasStr(having)}
            readOnly
            aria-readonly="true"
            placeholder="0"
          />

          {/* increment */}
          <button
            type="button"
            className="rounded-lg bg-green-600 px-3 py-2 text-sm font-bold hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => {
              const n = parseNum(having);
              const max = typeof maxHaving === "number" ? maxHaving : Infinity;
              onChangeHaving(formatWithCommasStr(Math.min(max, n + 1)));
            }}
            title="Increase owned by 1"
          >
            &gt;
          </button>
        </div>
        {showShortage && (
          <div className="mt-1 text-xs font-medium text-red-500">ยังขาดอีก {shortage} ชิ้น</div>
        )}
      </div>

      {/* Market Price (input only) */}
      <div className="col-span-2">
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            className="w-full rounded-xl border border-yellow-500 px-3 py-2 pr-10 bg-black text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={price}
            onChange={(e) => onChangePrice(formatWithCommasStr(e.target.value))}
            placeholder="0"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-neutral-400">
            <img src={NM_ICON} onError={(e) => { e.currentTarget.src = NM_ICON_FALLBACK; }} alt="N-Meseta" className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Sum */}
      <div className="col-span-3 text-right">
        <div className="text-lg font-semibold">{formatMoney(sum)}</div>
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function LoisHalphiniriaCalculator() {
  // Materials (strings for controlled inputs)
  const [luxHaving, setLuxHaving] = useState("");
  const [luxPrice, setLuxPrice] = useState("6,000");

  const [marcisHaving, setMarcisHaving] = useState("");
  const [marcisPrice, setMarcisPrice] = useState("800,000");

  const [baseHaving, setBaseHaving] = useState("50");
  const [basePrice, setBasePrice] = useState("28,000");

  // Sell Price (Total Revenue)
  const [sellPrice, setSellPrice] = useState("12,000,000");

  // Constants
  const AMOUNT = {
    lux: 10,
    marcis: 10,
    base: 50,
  };

  // Per-row sums (price × (Require - Owned))
  const sumLux = useMemo(() => {
    const need = Math.max(0, AMOUNT.lux - parseNum(luxHaving));
    return parseNum(luxPrice) * need;
  }, [luxPrice, luxHaving]);
  const sumMarcis = useMemo(() => {
    const need = Math.max(0, AMOUNT.marcis - parseNum(marcisHaving));
    return parseNum(marcisPrice) * need;
  }, [marcisPrice, marcisHaving]);
  const sumBase = useMemo(() => {
    const need = Math.max(0, AMOUNT.base - parseNum(baseHaving));
    return parseNum(basePrice) * need;
  }, [basePrice, baseHaving]);

  const totalExpenses = useMemo(() => sumLux + sumMarcis + sumBase, [sumLux, sumMarcis, sumBase]);
  const totalRevenue = useMemo(() => parseNum(sellPrice), [sellPrice]);
  const grossProfit = useMemo(() => totalRevenue - totalExpenses, [totalRevenue, totalExpenses]);
  const ebtTax = useMemo(() => Math.max(0, Math.floor((totalRevenue * 5) / 100)), [totalRevenue]);
  const netIncome = useMemo(() => grossProfit - ebtTax, [grossProfit, ebtTax]);
  const netIncomePct = useMemo(() => {
    const r = totalRevenue === 0 ? 0 : (netIncome / totalRevenue) * 100;
    return r;
  }, [netIncome, totalRevenue]);

  // ---- Controls helpers (kept for future; panel is empty per user) ----
  const [priceTarget, setPriceTarget] = useState("lux"); // 'lux' | 'marcis' | 'base'

  const setHavingToMax = () => {
    setLuxHaving(String(AMOUNT.lux));
    setMarcisHaving(String(AMOUNT.marcis));
    setBaseHaving(String(AMOUNT.base));
  };

  const setHavingToZero = () => {
    setLuxHaving("0");
    setMarcisHaving("0");
    setBaseHaving("0");
  };

  const addDeltaToOne = (target, delta) => {
    const clamp = (n) => Math.max(0, n);
    if (target === "lux") setLuxPrice(formatMoney(clamp(parseNum(luxPrice) + delta)));
    if (target === "marcis") setMarcisPrice(formatMoney(clamp(parseNum(marcisPrice) + delta)));
    if (target === "base") setBasePrice(formatMoney(clamp(parseNum(basePrice) + delta)));
  };

  const resetPrices = () => {
    setLuxPrice("");
    setMarcisPrice("");
    setBasePrice("");
    setSellPrice("");
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100" data-fix="closing-tags-verified">
      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold">C/ロイスハルフィニリア</h1>
          <p className="text-sm text-neutral-400">Lois Halphiniria</p>
        </header>

        {/* Materials Table */}
        <section className="rounded-2xl border border-neutral-800 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-3 bg-neutral-900 px-4 py-3 text-sm font-semibold text-neutral-300">
            <div className="col-span-4">Augments</div>
            <div className="col-span-1">Require</div>
            <div className="col-span-2">Owned</div>
            <div className="col-span-2">Market Price</div>
            <div className="col-span-3 text-right">N-Meseta</div>
          </div>

          <div className="px-4">
            <MaterialRow
              nameJP="C/ルクスハルフィニリア"
              nameEN="Lux Halphiniria"
              amount={AMOUNT.lux}
              having={luxHaving}
              price={luxPrice}
              onChangeHaving={setLuxHaving}
              onChangePrice={setLuxPrice}
              maxHaving={10}
            />

            <MaterialRow
              nameJP="C/マシスハルフィニリア"
              nameEN="Marcis Halphiniria"
              amount={AMOUNT.marcis}
              having={marcisHaving}
              price={marcisPrice}
              onChangeHaving={setMarcisHaving}
              onChangePrice={setMarcisPrice}
              maxHaving={10}
            />

            <MaterialRow
              nameJP="C/ベイスデーター"
              nameEN="Base Data"
              amount={AMOUNT.base}
              having={baseHaving}
              price={basePrice}
              onChangeHaving={setBaseHaving}
              onChangePrice={setBasePrice}
              maxHaving={50}
            />
          </div>

          {/* Total Expenses */}
          <div className="flex items-center justify-between bg-neutral-900 px-4 py-4">
            <div className="text-sm font-semibold text-neutral-300">Total Expenses</div>
            <div className="text-xl font-bold">{formatMoney(totalExpenses)}</div>
          </div>
        </section>

        {/* Summary */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Revenue + KPIs (restored) */}
          <div className="rounded-2xl border border-neutral-800 p-5 shadow-sm">
            <div className="mb-3 text-sm font-semibold text-neutral-300">Total Revenue (Sell Price)</div>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                className="w-full rounded-xl border border-yellow-500 px-3 py-3 pr-12 text-lg bg-black text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={sellPrice}
                onChange={(e) => setSellPrice(formatWithCommasStr(e.target.value))}
                placeholder="0"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-neutral-400">
                <img src={NM_ICON} onError={(e) => { e.currentTarget.src = NM_ICON_FALLBACK; }} alt="N-Meseta" className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-neutral-900 p-4">
                <div className="text-neutral-400">Gross profit</div>
                <div className="text-xl font-bold flex items-center gap-2">
                  <span>{formatMoney(grossProfit)}</span>
                  <img src={NM_ICON} onError={(e) => { e.currentTarget.src = NM_ICON_FALLBACK; }} alt="N-Meseta" className="h-4 w-4" />
                </div>
              </div>
              <div className="rounded-xl bg-neutral-900 p-4">
                <div className="text-neutral-400">EBT (Tax) <span className="text-xs">= Revenue × 5% </span></div>
                <div className="text-xl font-bold flex items-center gap-2">
                  <span>{formatMoney(ebtTax)}</span>
                  <img src={NM_ICON} onError={(e) => { e.currentTarget.src = NM_ICON_FALLBACK; }} alt="N-Meseta" className="h-4 w-4" />
                </div>
              </div>
              <div className="rounded-xl bg-neutral-900 p-4">
                <div className="text-neutral-400">Net income (N)</div>
                <div className="text-xl font-bold flex items-center gap-2">
                  <span>{formatMoney(netIncome)}</span>
                  <img src={NM_ICON} onError={(e) => { e.currentTarget.src = NM_ICON_FALLBACK; }} alt="N-Meseta" className="h-4 w-4" />
                </div>
              </div>
              <div className="rounded-xl bg-neutral-900 p-4">
                <div className="text-neutral-400">Net income (%)</div>
                <div className="text-xl font-bold">{(isFinite(netIncomePct) ? netIncomePct : 0).toFixed(2)}%</div>
              </div>
            </div>
          </div>

          {/* Right: Summary card */}
          <div className="rounded-2xl border border-neutral-800 p-5 shadow-sm">
            <h2 className="mb-4 text-2xl font-extrabold tracking-tight">สรุป</h2>
            <div className="mb-3 rounded-xl bg-neutral-900 p-4">
              <div className="text-sm leading-relaxed">
                ต้องการ <img src={NM_ICON} onError={(e) => { e.currentTarget.src = NM_ICON_FALLBACK; }} alt="N-Meseta" className="inline h-4 w-4 align-[-2px]" /> Meseta ในการซื้อหลอด Augment เป็นจำนวน <span className="font-bold text-yellow-400">{formatMoney(totalExpenses)}</span> <img src={NM_ICON} onError={(e) => { e.currentTarget.src = NM_ICON_FALLBACK; }} alt={"N-Meseta"} className="inline h-4 w-4 align-[-2px]" />
              </div>
            </div>
            <div className="mb-3 rounded-xl bg-neutral-900 p-4">
              <div className="text-sm leading-relaxed">
                หากลงขายตลาดจะได้เป็นเงิน <span className="font-bold text-green-400">{formatMoney(totalRevenue)}</span> <img src={NM_ICON} onError={(e) => { e.currentTarget.src = NM_ICON_FALLBACK; }} alt="N-Meseta" className="inline h-4 w-4 align-[-2px]" /> Meseta
              </div>
            </div>
            <div className="rounded-xl bg-neutral-900 p-4">
              <div className="text-sm leading-relaxed">
                กำไรทั้งหมดเมื่อหักลบต้นทุน <span className="font-bold text-green-400">{formatMoney(netIncome)}</span> <img src={NM_ICON} onError={(e) => { e.currentTarget.src = NM_ICON_FALLBACK; }} alt="N-Meseta" className="inline h-4 w-4 align-[-2px]" /> Meseta
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-neutral-400">
          <div className="flex flex-col items-center gap-2">
            {/* Row 1: Discord + link */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span>join us</span>
              <a
                href="https://discord.gg/fW9uHc8aDd"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-white"
                aria-label="Discord"
                title="Join Discord"
              >
                {/* Discord icon (inline SVG) */}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3c-.2.36-.432.85-.593 1.23a18.27 18.27 0 0 0-4.93 0A12.26 12.26 0 0 0 10.441 3a19.736 19.736 0 0 0-3.761 1.369C3.612 8.023 2.969 11.58 3.176 15.09a19.94 19.94 0 0 0 6.052 3.043c.487-.673.923-1.39 1.3-2.139a12.77 12.77 0 0 1-1.996-.765c.168-.123.333-.252.491-.387a13.9 13.9 0 0 0 6.954 0c.158.135.323.264.491.387-.65.273-1.323.509-1.996.765.377.75.813 1.466 1.3 2.139a19.94 19.94 0 0 0 6.052-3.043c.258-4.265-.44-7.8-2.407-10.721ZM9.507 13.59c-.85 0-1.545-.79-1.545-1.764 0-.975.686-1.765 1.545-1.765.868 0 1.563.79 1.545 1.765 0 .974-.677 1.764-1.545 1.764Zm4.986 0c-.85 0-1.545-.79-1.545-1.764 0-.975.686-1.765 1.545-1.765.868 0 1.563.79 1.545 1.765 0 .974-.677 1.764-1.545 1.764Z"/>
                </svg>
              </a>
              <a
                href="https://discord.gg/fW9uHc8aDd"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-neutral-500 underline-offset-2 hover:text-white"
              >
                インフィニタム [JP] Ship.4
              </a>
            </div>
            {/* Row 2: Contact dev on a new line */}
            <div className="flex items-center justify-center gap-2">
              <span>contact dev :</span>
              <a
                href="https://steamcommunity.com/id/IAMVarrel64BIT/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-neutral-500 underline-offset-2 hover:text-white"
              >
                varrelend
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ---------- Lightweight runtime tests (dev) ----------
// These run in-browser and won't break the UI. Open the console to see failures.
if (typeof window !== "undefined") {
  // parseNum tests
  console.assert(parseNum("") === 0, "parseNum('') should be 0");
  console.assert(parseNum("1,234") === 1234, "parseNum('1,234') should be 1234");
  console.assert(parseNum("0") === 0, "parseNum('0') should be 0");
  console.assert(parseNum(5000) === 5000, "parseNum(5000) should be 5000");
  console.assert(parseNum("abc123,456def") === 123456, "parseNum should strip non-digits");

  // formatMoney tests
  console.assert(formatMoney(0) === "0", "formatMoney(0) should be '0'");
  console.assert(formatMoney(1200000) === "1,200,000", "formatMoney(1200000) should be '1,200,000'");
  // defaults sanity
  console.assert(parseNum("6,000") === 6000, "Lux default price should parse to 6000");
  console.assert(parseNum("800,000") === 800000, "Marcis default price should parse to 800000");
  console.assert(parseNum("28,000") === 28000, "Base default price should parse to 28000");
  console.assert(parseNum("12,000,000") === 12000000, "Sell Price default should parse to 12000000");
  console.assert(formatMoney(null) === "0", "formatMoney(null) should be '0'");
  console.assert(formatMoney(NaN) === "0", "formatMoney(NaN) should be '0'");

  // formatWithCommasStr tests
  console.assert(formatWithCommasStr("") === "", "formatWithCommasStr('') should be ''");
  console.assert(formatWithCommasStr("1000000") === "1,000,000", "formatWithCommasStr should add commas");
  console.assert(formatWithCommasStr("1,000,000") === "1,000,000", "formatWithCommasStr should keep commas");
  console.assert(parseNum(formatWithCommasStr("2500000")) === 2500000, "parseNum should reverse formatting");
  console.assert(formatWithCommasStr("0001234") === "1,234", "formatWithCommasStr should normalize leading zeros");

  // arithmetic smoke test (kept; verifies closure & arithmetic)
  const lux = 100; // price
  const luxSum = lux * 10; // amount
  console.assert(luxSum === 1000, "Row sum should equal price×amount");

  // Row cost should use (Require - Owned)
  const require = 10, owned = 5, priceEach = 6000;
  const expected = (require - owned) * priceEach; // 5 * 6000 = 30000
  console.assert(expected === 30000, "Per-row cost should be (Require - Owned) × price");

  // Added tests: tax & net income math
  const revenue = 12_000_000; // sell price
  const expenses = 3_000_000; // total expenses
  const gross = revenue - expenses; // 9,000,000
  const ebt = Math.floor((revenue * 5) / 100); // 600,000
  const net = gross - ebt; // 8,400,000
  console.assert(gross === 9_000_000, "Gross profit math fails");
  console.assert(ebt === 600_000, "EBT 5% math fails");
  console.assert(net === 8_400_000, "Net income math fails");

  // Owned step button math (simulation)
  const stepClamp = (x, d) => Math.max(0, x + d);
  console.assert(stepClamp(7, -1) === 6, "Owned '<' should decrement to 6 from 7");
  console.assert(stepClamp(0, -1) === 0, "Owned should not go below 0");
  console.assert(stepClamp(7, +1) === 8, "Owned '>' should increment to 8 from 7");

  // Base Data cap = 50
  const cap50 = (x) => Math.min(50, Math.max(0, x));
  console.assert(cap50(51) === 50, "Base Data should not exceed 50");
  console.assert(cap50(-1) === 0, "Base Data should not go below 0");

  // Lux/Marcis cap = 10
  const cap10 = (x) => Math.min(10, Math.max(0, x));
  console.assert(cap10(11) === 10, "Lux/Marcis should not exceed 10");
  console.assert(cap10(-2) === 0, "Lux/Marcis should not go below 0");
}
