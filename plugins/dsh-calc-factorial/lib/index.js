/**
 * 计算工具：阶乘 — 计算工具
 */

export const name = "dsh-calc-factorial";
export const inject = ["tools"];

const NL = String.fromCharCode(10);
const SITE = "https://deepseekbase.com/zh/tools/";
const TEXT_OUTPUT = {
  schema: { type: "object", additionalProperties: false, properties: { text: { type: "string" } }, required: ["text"] },
  render: (_args, value) => [{ type: "text", text: (value && value.text) || "" }],
};

function n(v, d) { const x = Number(v); return Number.isFinite(x) ? x : d; }
function f(x) { return (Math.round(x * 10000) / 10000).toString(); }
function nums(t) { return String(t || "").split(/[\s,;]+/).map((x) => Number(x)).filter((x) => Number.isFinite(x)); }

const OPS = {
  percent_of: (t, a) => f(n(a, 0) * n(t, 0) / 100),
  percent_change: (t, a) => { const from = n(t, 0), to = n(a, 0); return from === 0 ? "原值为 0" : f((to - from) / Math.abs(from) * 100) + "%"; },
  discount: (t, a) => { const p = n(t, 0), d = n(a, 0); return "折后价: " + f(p * (1 - d / 100)) + "（省 " + f(p * d / 100) + "）"; },
  markup: (t, a) => { const c = n(t, 0), m = n(a, 0); return "售价: " + f(c * (1 + m / 100)) + "（毛利 " + f(c * m / 100) + "）"; },
  margin: (t, a) => { const price = n(t, 0), cost = n(a, 0); return price === 0 ? "售价为 0" : "毛利率: " + f((price - cost) / price * 100) + "%"; },
  vat: (t, a) => { const amt = n(t, 0), rate = n(a, 13); return "税额: " + f(amt * rate / 100) + "；含税: " + f(amt * (1 + rate / 100)); },
  tip: (t, a) => { const bill = n(t, 0), pct = n(a, 10); return "小费: " + f(bill * pct / 100) + "；合计: " + f(bill * (1 + pct / 100)); },
  split_bill: (t, a) => { const total = n(t, 0), people = Math.max(1, n(a, 1)); return "每人: " + f(total / people); },
  compound_interest: (t, a, b) => { const p = n(t, 0), r = n(a, 0) / 100, y = n(b, 1); const v = p * Math.pow(1 + r, y); return "终值: " + f(v) + "；利息: " + f(v - p); },
  simple_interest: (t, a, b) => { const p = n(t, 0), r = n(a, 0) / 100, y = n(b, 1); const i = p * r * y; return "利息: " + f(i) + "；本息: " + f(p + i); },
  loan_payment: (t, a, b) => {
    const principal = n(t, 0), rate = n(a, 0) / 100 / 12, months = n(b, 0);
    if (months <= 0) return "期数必须大于 0";
    const m = rate === 0 ? principal / months : principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
    return "月供: " + f(m) + "；总还: " + f(m * months) + "；利息: " + f(m * months - principal);
  },
  roi: (t, a) => { const cost = n(t, 0), gain = n(a, 0); return cost === 0 ? "成本为 0" : "ROI: " + f((gain - cost) / cost * 100) + "%"; },
  cagr: (t, a, b) => { const begin = n(t, 0), end = n(a, 0), years = n(b, 1); if (begin <= 0 || years <= 0) return "参数无效"; return "CAGR: " + f((Math.pow(end / begin, 1 / years) - 1) * 100) + "%"; },
  breakeven: (t, a, b) => { const fixed = n(t, 0), price = n(a, 0), varcost = n(b, 0); const cm = price - varcost; return cm <= 0 ? "单位边际贡献 ≤ 0，无法盈亏平衡" : "盈亏平衡销量: " + Math.ceil(fixed / cm); },
  unit_price: (t, a) => { const total = n(t, 0), qty = n(a, 0); return qty === 0 ? "数量为 0" : "单价: " + f(total / qty); },
  total_cost: (t, a) => { const p = n(t, 0), q = n(a, 0); return "总额: " + f(p * q); },
  profit: (t, a) => { const revenue = n(t, 0), cost = n(a, 0); return "利润: " + f(revenue - cost) + "；利润率: " + (revenue === 0 ? "—" : f((revenue - cost) / revenue * 100) + "%"); },
  ratio_scale: (t, a) => { const sx = n(t, 0), sy = n(a, 0); return sx === 0 ? "比例为 0" : "比例 1:" + f(sy / sx); },
  proportion: (t, a) => { const p = n(t, 0), total = n(a, 0); return total === 0 ? "总数为 0" : "占比: " + f(p / total * 100) + "%"; },
  average: (t) => { const xs = nums(t); return xs.length ? "平均: " + f(xs.reduce((x, y) => x + y, 0) / xs.length) : "无有效数字"; },
  median: (t) => { const xs = nums(t).sort((x, y) => x - y); if (!xs.length) return "无有效数字"; const m = Math.floor(xs.length / 2); return "中位数: " + f(xs.length % 2 ? xs[m] : (xs[m - 1] + xs[m]) / 2); },
  stddev: (t) => { const xs = nums(t); if (xs.length < 2) return "至少两个数"; const mean = xs.reduce((x, y) => x + y, 0) / xs.length; const v = xs.reduce((s, x) => s + (x - mean) * (x - mean), 0) / (xs.length - 1); return "样本标准差: " + f(Math.sqrt(v)); },
  min_max: (t) => { const xs = nums(t); return xs.length ? "最小: " + Math.min.apply(null, xs) + "；最大: " + Math.max.apply(null, xs) : "无有效数字"; },
  sum: (t) => { const xs = nums(t); return "和: " + f(xs.reduce((x, y) => x + y, 0)); },
  product: (t) => { const xs = nums(t); return "积: " + f(xs.reduce((x, y) => x * y, 1)); },
  factorial: (t) => { const x = Math.floor(n(t, 0)); if (x < 0 || x > 170) return "范围 0–170"; let r = 1; for (let i = 2; i <= x; i++) r *= i; return f(r); },
  prime_check: (t) => { const x = Math.floor(n(t, 0)); if (x < 2) return "不是质数"; for (let i = 2; i * i <= x; i++) if (x % i === 0) return "不是质数（可被 " + i + " 整除）"; return "是质数"; },
  gcd: (t, a) => { let x = Math.abs(Math.floor(n(t, 0))), y = Math.abs(Math.floor(n(a, 0))); while (y) { const r = x % y; x = y; y = r; } return "GCD: " + x; },
  lcm: (t, a) => { const x = Math.abs(Math.floor(n(t, 0))), y = Math.abs(Math.floor(n(a, 0))); if (!x || !y) return "参数为 0"; let g = x, h = y; while (h) { const r = g % h; g = h; h = r; } return "LCM: " + (x / g * y); },
  power: (t, a) => f(Math.pow(n(t, 0), n(a, 2))),
  sqrt: (t) => { const x = n(t, 0); return x < 0 ? "不能对负数开方" : f(Math.sqrt(x)); },
  log: (t) => { const x = n(t, 0); return x <= 0 ? "需大于 0" : "ln: " + f(Math.log(x)) + "；lg: " + f(Math.log10(x)); },
  exp: (t) => f(Math.exp(n(t, 0))),
  rounding: (t, a) => { const x = n(t, 0), d = Math.max(0, Math.floor(n(a, 0))); return f(Number(x.toFixed(d))); },
  ceil_floor: (t) => { const x = n(t, 0); return "向上: " + Math.ceil(x) + "；向下: " + Math.floor(x); },
  abs: (t) => f(Math.abs(n(t, 0))),
  sign: (t) => { const x = n(t, 0); return x > 0 ? "+1" : x < 0 ? "-1" : "0"; },
  percent_error: (t, a) => { const actual = n(t, 0), measured = n(a, 0); return actual === 0 ? "实际值为 0" : "误差: " + f(Math.abs(measured - actual) / Math.abs(actual) * 100) + "%"; },
  ratio_simplify: (t, a) => { let x = Math.abs(Math.floor(n(t, 1))), y = Math.abs(Math.floor(n(a, 1))); if (!x || !y) return "参数为 0"; let g = x, h = y; while (h) { const r = g % h; g = h; h = r; } return "最简比: " + (x / g) + ":" + (y / g); },
  fraction_to_decimal: (t) => { const m = String(t).match(/^(\d+)\s*\/\s*(\d+)$/); if (!m) return "格式如 3/4"; return f(Number(m[1]) / Number(m[2])); },
  decimal_to_fraction: (t) => {
    const x = n(t, 0); if (!Number.isFinite(x)) return "无效数字";
    let den = 1; while (Math.abs(x * den - Math.round(x * den)) > 1e-9 && den < 100000) den *= 10;
    let num = Math.round(x * den); let g = Math.abs(num), h = den; while (h) { const r = g % h; g = h; h = r; }
    return (num / g) + "/" + (den / g);
  },
  hours_to_decimal: (t) => { const m = String(t).match(/^(\d+):(\d+)$/); if (!m) return "格式如 1:30"; return f(Number(m[1]) + Number(m[2]) / 60) + " 小时"; },
  overtime_pay: (t, a, b) => { const hourly = n(t, 0), hours = n(a, 0), mult = n(b, 1.5); return "加班费: " + f(hourly * hours * mult); },
  piece_rate: (t, a) => { const rate = n(t, 0), pcs = n(a, 0); return "计件工资: " + f(rate * pcs); },
  commission: (t, a) => { const sales = n(t, 0), pct = n(a, 0); return "提成: " + f(sales * pct / 100); },
  depreciation_straight: (t, a, b) => { const cost = n(t, 0), salvage = n(a, 0), years = n(b, 1); return years <= 0 ? "年限无效" : "年折旧: " + f((cost - salvage) / years); },
  depreciation_declining: (t, a, b) => { const cost = n(t, 0), rate = n(a, 20) / 100, years = n(b, 1); let v = cost; for (let i = 0; i < years; i++) v *= (1 - rate); return "残值: " + f(v); },
  inflation_adjust: (t, a, b) => { const amt = n(t, 0), rate = n(a, 3) / 100, years = n(b, 1); return "等值: " + f(amt * Math.pow(1 + rate, years)); },
  npv: (t, a) => {
    const rate = n(a, 10) / 100; const cf = nums(t);
    if (!cf.length) return "请给现金流（逗号分隔）";
    const v = cf.reduce((s, x, i) => s + x / Math.pow(1 + rate, i), 0);
    return "NPV: " + f(v);
  },
  irr: (t) => {
    const cf = nums(t); if (cf.length < 2) return "至少两期现金流";
    let lo = -0.999, hi = 10;
    const fv = (r) => cf.reduce((s, x, i) => s + x / Math.pow(1 + r, i), 0);
    if (fv(lo) * fv(hi) > 0) return "未找到 IRR 区间";
    for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (fv(lo) * fv(mid) <= 0) hi = mid; else lo = mid; }
    return "IRR: " + f((lo + hi) / 2 * 100) + "%";
  },
};

export function apply(ctx, config) {
  void config;
  ctx.tools.register({
    name: "calc_factorial",
    description: "阶乘：n 的阶乘",
    parameters: {
      text: { "type": "string", required: true, "description": "输入" },
    },
    output: TEXT_OUTPUT,
    async execute(args) {
      const t = args && args.text != null ? String(args.text) : "";
      const a = args && args.a != null ? String(args.a) : "";
      const b = args && args.b != null ? String(args.b) : "";
      const op = "factorial";
      try {
        const fn = OPS[op];
        if (!fn) throw new Error("未知操作: " + op);
        return { text: ["计算工具：阶乘", "=".repeat(52), String(fn(t, a, b)), "", "更多工具：" + SITE].join(NL) };
      } catch (e) {
        return { text: "处理失败: " + String((e && e.message) || e) };
      }
    },
  });
}