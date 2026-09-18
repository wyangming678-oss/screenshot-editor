"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconLogo, IconUpload, NOTICE_ICONS, NAV_ICONS, NavPreview, BatteryPreview } from "./icons.js";

const NAV_GROUPS = [
  {
    id: "start",
    label: "开始",
    items: [["upload", "上传截图", "01"], ["device", "设备样式", "02"]],
  },
  {
    id: "status",
    label: "状态栏",
    items: [
      ["topbg", "状态栏背景", "03"], ["time", "时间", "04"], ["signal", "信号", "05"],
      ["wifi", "WiFi", "06"], ["battery", "电池", "07"], ["other", "其他图标", "08"], ["custom", "自定义图标", "09"],
    ],
  },
  {
    id: "navigation",
    label: "底部导航",
    items: [["bottom", "底部导航", "10"]],
  },
  {
    id: "tools",
    label: "工具与方案",
    items: [["erase", "消除笔", "11"], ["presets", "保存方案", "12"]],
  },
];

const OFF_ITEM = { on: false, side: "right", size: 100, dx: 0, dy: 0 };

const DEFAULT_ITEMS = {
  notices: { on: true, side: "left", size: 100, dx: 0, dy: 0 },
  sim1Question: { ...OFF_ITEM }, sim1Bars: { on: true, side: "right", size: 100, dx: 0, dy: 0 },
  sim1Arrow: { ...OFF_ITEM }, sim1Type: { on: true, side: "right", size: 100, dx: 0, dy: 0 },
  sim2Question: { ...OFF_ITEM }, sim2Bars: { ...OFF_ITEM }, sim2Arrow: { ...OFF_ITEM }, sim2Type: { ...OFF_ITEM },
  speed1: { ...OFF_ITEM, side: "right" }, speed2: { ...OFF_ITEM },
  mark1: { ...OFF_ITEM }, mark2: { ...OFF_ITEM }, mark3: { ...OFF_ITEM }, mark4: { ...OFF_ITEM }, mark5: { ...OFF_ITEM },
  signal6: { ...OFF_ITEM }, signal7: { ...OFF_ITEM }, signal8: { ...OFF_ITEM },
  wifiArrow1: { on: true, side: "right", size: 100, dx: 0, dy: 0 },
  wifi: { on: true, side: "right", size: 100, dx: 0, dy: 0 },
  powersave: { ...OFF_ITEM }, batt11: { ...OFF_ITEM }, batt12: { ...OFF_ITEM },
  chargeMark1: { ...OFF_ITEM }, batt13: { ...OFF_ITEM }, batt14: { ...OFF_ITEM },
  batt15: { ...OFF_ITEM }, batt16: { ...OFF_ITEM },
  battery: { on: true, side: "right", size: 100, dx: 0, dy: 0 },
  headphone1: { on: true, side: "right", size: 100, dx: 0, dy: 0 },
  vibrate1: { ...OFF_ITEM }, nfc1: { ...OFF_ITEM }, eyecare1: { ...OFF_ITEM },
  alarm1: { ...OFF_ITEM }, alarm2: { ...OFF_ITEM }, alarm3: { ...OFF_ITEM }, alarm4: { ...OFF_ITEM }, alarm5: { ...OFF_ITEM },
  bluetooth1: { ...OFF_ITEM }, bluetooth2: { ...OFF_ITEM }, bluetooth3: { ...OFF_ITEM }, bluetooth4: { ...OFF_ITEM },
  mute1: { ...OFF_ITEM }, mute2: { ...OFF_ITEM }, speaker1: { ...OFF_ITEM }, gauge1: { ...OFF_ITEM }, nosim1: { ...OFF_ITEM },
  speedIcon1: { ...OFF_ITEM }, speedIcon2: { ...OFF_ITEM }, speedIcon3: { ...OFF_ITEM }, speedIcon4: { ...OFF_ITEM },
  dualsim1: { ...OFF_ITEM }, dualsim2: { ...OFF_ITEM }, dualsim3: { ...OFF_ITEM },
};

const DEFAULT_CONFIG = {
  deviceType: "original",
  topHeight: 4.4,
  topStyle: "dark",
  topColor: "#0b0d12",
  topOpacity: 72,
  iconColor: "#ffffff",
  iconScale: 100,
  iconSide: "right",
  time: "16:01",
  timePosition: "left",
  timeX: 7,
  timeWeight: 650,
  timeSize: 100,
  timeOffsetY: 0,
  timeGap: 2,
  timeSuffix: "",
  showSuffix: false,
  carrier: "",
  showCarrier: false,
  simCount: 1,
  signalShape: 1,
  wifiSimOrder: "simFirst",
  signalBarGap: 3.2,
  signalLineGap: 1.6,
  signalLineWidth: 3.4,
  signalCap: "round",
  sim1Network: "5G",
  sim1Bars: 4,
  sim2Network: "4G",
  sim2Bars: 3,
  showSimNumber: false,
  callMark: "none",
  speed1Text: "",
  speed2Line1: "4.81",
  speed2Line2: "KB/s",
  wifiStyle: 1,
  wifiStrength: 3,
  wifiGap: 3.2,
  batteryType: 2,
  battery: 87,
  batteryGap: 3.2,
  batteryNumber: true,
  batteryCharging: false,
  batteryNumberLayout: "right",
  batteryInnerColor: "auto",
  otherGap: 3.2,
  notificationIcons: ["plane"],
  noticeSide: "left",
  eraseColor: "#111317",
  eraseSize: 24,
  bottomHeight: 6.2,
  bottomStyle: "gesture",
  bottomCover: "dark",
  bottomColor: "#101319",
  bottomOpacity: 64,
  bottomIconColor: "#ffffff",
  navIconScale: 100,
  navCount: 4,
  navIcons: ["home", "search", "plus", "user", "chat"],
  items: JSON.parse(JSON.stringify(DEFAULT_ITEMS)),
};

const DEVICE_PRESETS = [
  ["original", "原图模式（推荐）", "不改动任何参数，仅保留原图尺寸与画面"],
  ["ios", "苹果 iPhone", "细信号柱 + 弧线 WiFi + 圆角框电池（不显示百分比）+ 手势横条"],
  ["oneui", "三星 One UI", "斜切信号柱 + 弧线 WiFi + 数字回圈电池 + 三星三键"],
  ["harmony", "华为 HarmonyOS", "粗柱信号 + 填充扇形 WiFi + 框内数字电池 + 华为三键"],
  ["hyperos", "小米 HyperOS", "四格直柱信号 + 填充扇形 WiFi + 实心电池 + 小米三键"],
  ["origin", "vivo OriginOS", "细柱信号 + 弧线 WiFi + 紧凑电池 + vivo 三键"],
  ["oppo", "OPPO ColorOS", "四格直柱信号 + 弧线 WiFi + 实心分体掏空数字电池"],
  ["motorola", "摩托罗拉", "粗柱信号 + 弧线 WiFi + 竖向实心电池 + 手势细线"],
  ["pixel", "谷歌 Pixel", "四格直柱 + 三角 WiFi + 紧凑电池 + 手势细线"],
];

const DEVICE_PATCH = {
  ios: { signalShape: 2, wifiStyle: 1, batteryType: 4, bottomStyle: "gesture", timeWeight: 600, batteryNumber: false, batteryInnerColor: "icon" },
  oneui: { signalShape: 5, wifiStyle: 1, batteryType: 1, bottomStyle: "samsung", batteryNumber: false },
  harmony: { signalShape: 1, wifiStyle: 2, batteryType: 2, bottomStyle: "huawei" },
  hyperos: { signalShape: 6, wifiStyle: 2, batteryType: 5, bottomStyle: "xiaomi" },
  origin: { signalShape: 2, wifiStyle: 1, batteryType: 7, bottomStyle: "vivo" },
  oppo: { signalShape: 6, wifiStyle: 1, batteryType: 6, bottomStyle: "gesture", batteryNumber: false },
  motorola: { signalShape: 1, wifiStyle: 1, batteryType: 8, bottomStyle: "gestureThin" },
  pixel: { signalShape: 6, wifiStyle: 3, batteryType: 7, bottomStyle: "gestureThin", batteryNumber: false, batteryInnerColor: "icon" },
};

// System icons are not interchangeable between platforms. These metrics keep
// the same logical controls while preserving each platform's optical rhythm.
const DEVICE_METRICS = {
  original: {
    top: { iconScale: 1, groupGap: 6, sideMargin: 8, centerOffset: 0.5, textScale: 1 },
    bottom: { iconScale: 1, y: 0.49, stroke: 1.7 },
  },
  ios: {
    top: { iconScale: 0.96, groupGap: 5.3, sideMargin: 8.5, centerOffset: 0.35, textScale: 0.98 },
    bottom: { iconScale: 0.96, y: 0.72, stroke: 1.7 },
  },
  pixel: {
    top: { iconScale: 0.94, groupGap: 5.6, sideMargin: 8.5, centerOffset: 0.25, textScale: 0.96 },
    bottom: { iconScale: 0.98, y: 0.49, stroke: 1.55 },
  },
  harmony: {
    top: { iconScale: 1.03, groupGap: 5.8, sideMargin: 7.5, centerOffset: 0.65, textScale: 1 },
    bottom: { iconScale: 1.03, y: 0.5, stroke: 1.85 },
  },
  hyperos: {
    top: { iconScale: 1.02, groupGap: 5.6, sideMargin: 7.5, centerOffset: 0.45, textScale: 1 },
    bottom: { iconScale: 1.04, y: 0.5, stroke: 1.75 },
  },
  origin: {
    top: { iconScale: 0.98, groupGap: 5.9, sideMargin: 8, centerOffset: 0.45, textScale: 0.98 },
    bottom: { iconScale: 1.02, y: 0.5, stroke: 1.7 },
  },
  oneui: {
    top: { iconScale: 1.04, groupGap: 5.2, sideMargin: 7.5, centerOffset: 0.55, textScale: 1.02 },
    bottom: { iconScale: 1.04, y: 0.5, stroke: 1.8 },
  },
  oppo: {
    top: { iconScale: 1, groupGap: 5.8, sideMargin: 8, centerOffset: 0.45, textScale: 1 },
    bottom: { iconScale: 1, y: 0.49, stroke: 1.7 },
  },
  motorola: {
    top: { iconScale: 1.02, groupGap: 6, sideMargin: 8, centerOffset: 0.5, textScale: 1 },
    bottom: { iconScale: 1, y: 0.49, stroke: 1.7 },
  },
};

function getDeviceMetrics(deviceType) {
  return DEVICE_METRICS[deviceType] || DEVICE_METRICS.original;
}

const BATTERY_TYPES = [
  [1, "电池 1", "Samsung · 数字回圈"],
  [2, "电池 2", "华为 / 荣耀 · 粗框浅填充 + 框内数字"],
  [3, "电池 3", "华为 / 荣耀 · 经典外置数字"],
  [4, "电池 4", "iPhone · 圆角框"],
  [5, "电池 5", "小米 · 实心横向"],
  [6, "电池 6", "OPPO · 实心分体 + 掏空数字"],
  [7, "电池 7", "Pixel · 紧凑横向"],
  [8, "电池 8", "Motorola · 竖向实心"],
  [9, "电池 9", "参考胶囊 · 窄竖向"],
  [10, "电池 10", "框内百分比徽章"],
];

const SIGNAL_SHAPES = [
  [1, "信号 1 · 七格圆头"], [2, "信号 2 · 四格圆头柱"], [3, "信号 3 · 四格直角柱"], [4, "信号 4 · 五格圆头柱"],
  [5, "信号 5 · 四格细柱"], [6, "信号 6 · 四格宽柱"], [7, "信号 7 · 四格大柱"], [8, "信号 8 · 七格粗柱"],
  [9, "信号 9 · 五格细柱"], [10, "信号 10 · 四格圆头"],
];

const WIFI_STYLES = [
  [1, "WiFi 1 · 标准粗弧"], [2, "WiFi 2 · 大弧线"], [3, "WiFi 3 · 超粗弧线"], [4, "WiFi 4 · 紧凑弧"],
  [5, "WiFi 5 · 细线弧"], [6, "WiFi 6 · 加粗弧"], [7, "WiFi 7 · 标准弧"], [8, "WiFi 8 · 细紧弧"],
  [9, "WiFi 9 · 极细弧"], [10, "WiFi 10 · 标准弧"],
];

const NETWORK_OPTIONS = ["5G+", "5G", "4G+", "4G", "LTE", "H+", "3G", "E", "隐藏"];

const ICON_OPTIONS = [
  ["home", "首页"], ["search", "搜索"], ["plus", "添加"], ["user", "我的"],
  ["chat", "消息"], ["phone", "电话"], ["camera", "相机"], ["heart", "收藏"],
];

const NOTICE_OPTIONS = [
  ["plane", "飞行"], ["bell", "铃铛"], ["location", "定位"],
  ["telegram", "Telegram"], ["amazon", "亚马逊"], ["tiktok", "TikTok"],
  ["sms", "短信"], ["uber", "Uber"], ["facebook", "Facebook"],
  ["instagram", "Instagram"],
];

const NOTICE_BADGES = {
  telegram: { bg: "#2aabee", shape: "circle" },
  amazon: { bg: "#ff9900", shape: "square" },
  tiktok: { bg: "#000000", shape: "square" },
  sms: { bg: "#34c759", shape: "square" },
  uber: { bg: "#000000", shape: "square" },
  facebook: { bg: "#1877f2", shape: "square" },
  instagram: { bg: "gradient", shape: "square" },
};

const PRESET_KEY = "screenshot-editor-presets-v41";

function loadPresets() {
  try {
    const raw = localStorage.getItem(PRESET_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function coverRegion(ctx, img, x, y, w, h, style, color, opacity) {
  if (style === "manual") return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (style === "blur") {
    ctx.filter = `blur(${Math.max(8, w * 0.025)}px)`;
    ctx.drawImage(img, x, y, w, h, x - 4, y - 4, w + 8, h + 8);
    ctx.filter = "none";
    ctx.fillStyle = `rgba(10, 12, 18, ${opacity / 220})`;
  } else if (style === "light") {
    ctx.fillStyle = `rgba(250, 251, 255, ${opacity / 100})`;
  } else if (style === "custom") {
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = color;
  } else {
    ctx.fillStyle = `rgba(8, 10, 14, ${opacity / 100})`;
  }
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

function textWidth(ctx, text, font) {
  ctx.save();
  ctx.font = font;
  const w = ctx.measureText(text).width;
  ctx.restore();
  return w;
}

const sysFont = (px) => `700 ${px}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;

const SIGNAL_STYLE = {
  1: { n: 7, bw: 0.19, gap: 0.075, h: [0.32, 0.31, 0.34, 0.43, 0.55, 0.76, 1], pill: true },
  2: { n: 4, bw: 0.23, gap: 0.11, h: [0.41, 0.5, 0.76, 1], pill: true },
  3: { n: 4, bw: 0.23, gap: 0.11, h: [0.41, 0.51, 0.76, 1], pill: false },
  4: { n: 5, bw: 0.2, gap: 0.07, h: [0.34, 0.45, 0.58, 0.8, 1], pill: true },
  5: { n: 4, bw: 0.18, gap: 0.11, h: [0.4, 0.51, 0.77, 1], pill: false },
  6: { n: 4, bw: 0.25, gap: 0.14, h: [0.42, 0.53, 0.74, 1], pill: false },
  7: { n: 4, bw: 0.32, gap: 0.09, h: [0.42, 0.58, 0.78, 1], pill: true },
  8: { n: 7, bw: 0.19, gap: 0.05, h: [0.29, 0.3, 0.32, 0.44, 0.54, 0.76, 1], pill: true },
  9: { n: 5, bw: 0.19, gap: 0.04, h: [0.32, 0.44, 0.54, 0.76, 1], pill: false },
  10: { n: 4, bw: 0.23, gap: 0.13, h: [0.4, 0.53, 0.75, 1], pill: true },
};
const SIGNAL_H = 11;
const SIGNAL_BOTTOM = 4.6;

function signalShapeWidth(ctx, shape, s, c) {
  const sp = SIGNAL_STYLE[shape] || SIGNAL_STYLE[1];
  const bw = sp.bw * SIGNAL_H * s * (c.signalLineWidth / 3.4);
  const gap = (sp.gap * SIGNAL_H + c.signalLineGap * 0.5) * s * (c.signalBarGap / 3.2);
  return sp.n * bw + (sp.n - 1) * gap;
}

function drawSignalShape(ctx, x, cy, s, bars, color, shape, c) {
  const sp = SIGNAL_STYLE[shape] || SIGNAL_STYLE[1];
  const bottom = cy + SIGNAL_BOTTOM * s;
  const bw = sp.bw * SIGNAL_H * s * (c.signalLineWidth / 3.4);
  const gap = (sp.gap * SIGNAL_H + c.signalLineGap * 0.5) * s * (c.signalBarGap / 3.2);
  const lit = Math.max(0, Math.min(sp.n, Math.round(bars * sp.n / 4)));
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 1;
  const rad = sp.pill ? bw / 2 : (c.signalCap === "round" ? bw * 0.35 : 0);
  for (let i = 0; i < sp.n; i += 1) {
    ctx.globalAlpha = i < lit ? 1 : 0.26;
    const bh = sp.h[i] * SIGNAL_H * s;
    roundedRect(ctx, x + i * (bw + gap), bottom - bh, bw, bh, rad);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function networkTypeWidth(ctx, type, s) {
  if (type === "隐藏") return 0;
  return textWidth(ctx, type, sysFont(8.9 * s)) + 1.5 * s;
}

function drawNetworkType(ctx, type, x, cy, s, color) {
  if (type === "隐藏") return;
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = sysFont(8.9 * s);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(type, x, cy - 3.6 * s);
  ctx.restore();
}

function drawDataArrows(ctx, x, cy, s, color, dim) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = dim ? 0.4 : 1;
  ctx.beginPath();
  ctx.moveTo(x + 1.9 * s, cy - 3.6 * s);
  ctx.lineTo(x + 3.9 * s, cy - 0.8 * s);
  ctx.lineTo(x, cy - 0.8 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 5.6 * s, cy + 3.6 * s);
  ctx.lineTo(x + 7.6 * s, cy + 0.8 * s);
  ctx.lineTo(x + 3.7 * s, cy + 0.8 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawQuestion(ctx, x, cy, s, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = sysFont(10 * s);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("?", x, cy + 0.4 * s);
  ctx.restore();
}

function drawSpeedLines(ctx, x, cy, s, color, lines) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  if (lines.length === 1) {
    ctx.font = `600 ${7.2 * s}px system-ui, sans-serif`;
    ctx.fillText(lines[0], x, cy);
  } else {
    ctx.font = `600 ${6.2 * s}px system-ui, sans-serif`;
    ctx.fillText(lines[0], x, cy - 3.4 * s);
    ctx.fillText(lines[1], x, cy + 3.6 * s);
  }
  ctx.restore();
}

function speedWidth(ctx, s, lines) {
  const font = lines.length === 1 ? `600 ${7.2 * s}px system-ui, sans-serif` : `600 ${6.2 * s}px system-ui, sans-serif`;
  return Math.max(...lines.map((l) => textWidth(ctx, l, font)));
}

function drawMark(ctx, x, cy, s, color, kind) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  if (kind === "mark1") {
    ctx.lineWidth = 1 * s;
    roundedRect(ctx, x, cy - 4.6 * s, 13 * s, 9.2 * s, 2.2 * s);
    ctx.stroke();
    ctx.font = sysFont(6.4 * s);
    ctx.fillText("HD", x + 6.5 * s, cy + 0.3 * s);
  } else if (kind === "mark2") {
    ctx.font = sysFont(5.6 * s);
    ctx.fillText("Vo", x + 5.5 * s, cy - 3.2 * s);
    ctx.fillText("LTE", x + 5.5 * s, cy + 3.4 * s);
  } else if (kind === "mark3") {
    ctx.font = sysFont(8.6 * s);
    ctx.textAlign = "left";
    ctx.fillText("5G", x, cy + 0.3 * s);
  } else if (kind === "mark5") {
    ctx.lineWidth = 1 * s;
    roundedRect(ctx, x, cy - 4.6 * s, 11 * s, 9.2 * s, 2.2 * s);
    ctx.stroke();
    ctx.font = sysFont(5.8 * s);
    ctx.fillText("HD", x + 5.5 * s, cy + 0.3 * s);
    ctx.lineWidth = 0.8 * s;
    roundedRect(ctx, x + 12.2 * s, cy - 4.6 * s, 4.6 * s, 4.2 * s, 1.2 * s);
    ctx.stroke();
    roundedRect(ctx, x + 12.2 * s, cy + 0.4 * s, 4.6 * s, 4.2 * s, 1.2 * s);
    ctx.stroke();
    ctx.font = sysFont(3.4 * s);
    ctx.fillText("1", x + 14.5 * s, cy - 2.4 * s);
    ctx.fillText("2", x + 14.5 * s, cy + 2.6 * s);
  } else {
    ctx.font = sysFont(8.6 * s);
    ctx.textAlign = "left";
    ctx.fillText("4G", x, cy + 0.3 * s);
  }
  ctx.restore();
}

function markWidth(ctx, s, kind) {
  if (kind === "mark1") return 13 * s;
  if (kind === "mark2") return 11 * s;
  if (kind === "mark5") return 17 * s;
  return textWidth(ctx, kind === "mark3" ? "5G" : "4G", sysFont(8.6 * s));
}

const WIFI_STYLE = {
  1: { r: [7.4, 5, 2.6], st: 2.1, dot: 1.5 },
  2: { r: [8.0, 5.5, 3.0], st: 2.3, dot: 1.7 },
  3: { r: [8.6, 6.0, 3.2], st: 2.5, dot: 2.0 },
  4: { r: [7.0, 4.7, 2.4], st: 1.8, dot: 1.4 },
  5: { r: [7.6, 5.1, 2.6], st: 1.7, dot: 1.3 },
  6: { r: [8.3, 5.5, 2.8], st: 2.8, dot: 1.8 },
  7: { r: [7.3, 4.9, 2.5], st: 2.0, dot: 1.5 },
  8: { r: [6.7, 4.5, 2.3], st: 1.5, dot: 1.2 },
  9: { r: [6.9, 4.6, 2.4], st: 1.3, dot: 1.0 },
  10: { r: [7.6, 5.1, 2.6], st: 1.9, dot: 1.4 },
};

function drawWifi(ctx, x, cy, scale, color, strength, style) {
  const s = scale;
  const sp = WIFI_STYLE[style] || WIFI_STYLE[1];
  const cx = x + 10 * s;
  const apex = cy + 3.4 * s;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  ctx.lineWidth = sp.st * s;
  sp.r.forEach((r, i) => {
    ctx.globalAlpha = strength >= sp.r.length - i ? 1 : 0.22;
    ctx.beginPath();
    ctx.arc(cx, apex, r * s, Math.PI * 1.24, Math.PI * 1.76);
    ctx.stroke();
  });
  ctx.globalAlpha = strength > 0 ? 1 : 0.22;
  ctx.beginPath();
  ctx.arc(cx, apex + 1.6 * s, sp.dot * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawWifiArrows(ctx, x, cy, s, color) {
  drawDataArrows(ctx, x, cy, s, color);
}

function drawBolt(ctx, cx, cy, s, boltColor) {
  ctx.save();
  ctx.fillStyle = boltColor;
  ctx.beginPath();
  ctx.moveTo(cx + 1.8 * s, cy - 6.2 * s);
  ctx.lineTo(cx - 2.8 * s, cy + 0.9 * s);
  ctx.lineTo(cx - 0.5 * s, cy + 0.9 * s);
  ctx.lineTo(cx - 1.8 * s, cy + 6.2 * s);
  ctx.lineTo(cx + 2.8 * s, cy - 0.9 * s);
  ctx.lineTo(cx + 0.5 * s, cy - 0.9 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function batteryInnerColor(c) {
  if (c.batteryInnerColor === "green") return "#34c759";
  if (c.batteryInnerColor === "icon") return c.iconColor;
  if (c.battery <= 20) return "#ff4d58";
  if (c.battery <= 50) return "#ffc53d";
  return "#34c759";
}

function batteryBodyWidth(type, s) {
  if (type === 7) return 19.6 * s;
  if (type === 8) return 11.7 * s;
  if (type === 9) return 8.1 * s;
  return 24.5 * s;
}

function drawBatteryBody(ctx, type, bx, cy, s, c) {
  const val = Math.max(0, Math.min(100, c.battery));
  const color = c.iconColor;
  const inner = batteryInnerColor(c);
  const vertical = type === 8 || type === 9;
  const w = vertical ? (type === 8 ? 10 * s : 8 * s) : (type === 7 ? 18 * s : 22 * s);
  const h = vertical ? 20 * s : (type === 7 ? 8.4 * s : 10.5 * s);
  const cap = (alpha) => {
    ctx.save();
    ctx.globalAlpha = alpha === undefined ? 1 : alpha;
    ctx.fillStyle = color;
    if (vertical) roundedRect(ctx, bx + w / 2 - 2 * s, cy - h / 2 - 1.8 * s, 4 * s, 1.8 * s, 0.9 * s);
    else roundedRect(ctx, bx + w + 1.4 * s, cy - 2.2 * s, 1.8 * s, 4.4 * s, 0.9 * s);
    ctx.fill();
    ctx.restore();
  };
  const insideDigits = (punched) => {
    ctx.save();
    ctx.font = `700 ${6.6 * s}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = String(Math.round(val));
    if (punched) {
      punch(ctx, () => ctx.fillText(label, bx + w / 2, cy + 0.3 * s));
    } else {
      ctx.fillStyle = color;
      ctx.fillText(label, bx + w / 2, cy + 0.3 * s);
    }
    ctx.restore();
  };
  ctx.save();
  ctx.lineCap = "round";
  if (vertical) {
    if (type === 8) {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.32;
      roundedRect(ctx, bx, cy - h / 2, w, h, 2.8 * s);
      ctx.fill();
      ctx.globalAlpha = 1;
      const ih = (h - 1.6 * s) * val / 100;
      ctx.fillStyle = inner === "#34c759" && c.batteryInnerColor === "auto" ? color : inner;
      roundedRect(ctx, bx + 0.8 * s, cy + h / 2 - 0.8 * s - ih, w - 1.6 * s, ih, 2 * s);
      ctx.fill();
      cap(0.6);
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4 * s;
      roundedRect(ctx, bx, cy - h / 2, w, h, 2.6 * s);
      ctx.stroke();
      cap();
      const ih = (h - 2.8 * s) * val / 100;
      ctx.fillStyle = inner;
      roundedRect(ctx, bx + 1.4 * s, cy + h / 2 - 1.4 * s - ih, w - 2.8 * s, ih, 1.4 * s);
      ctx.fill();
      if (c.batteryCharging) drawBolt(ctx, bx + w / 2, cy, s * 0.7, color === "#ffffff" ? "#111318" : "#ffffff");
    }
  } else if (type === 5) {
    ctx.fillStyle = inner;
    roundedRect(ctx, bx, cy - h / 2, w, h, 3.2 * s);
    ctx.fill();
    cap();
  } else if (type === 6) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.35;
    roundedRect(ctx, bx, cy - h / 2, w, h, 3.2 * s);
    ctx.fill();
    ctx.globalAlpha = 1;
    const iw = (w - 1.2 * s) * val / 100;
    ctx.fillStyle = color;
    roundedRect(ctx, bx + 0.6 * s, cy - h / 2 + 0.6 * s, iw, h - 1.2 * s, 2.6 * s);
    ctx.fill();
    cap();
    insideDigits(true);
  } else if (type === 2) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6 * s;
    roundedRect(ctx, bx, cy - h / 2, w, h, 3.4 * s);
    ctx.stroke();
    cap();
    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = color;
    const iw = (w - 3.2 * s) * val / 100;
    roundedRect(ctx, bx + 1.6 * s, cy - h / 2 + 1.6 * s, iw, h - 3.2 * s, 1.8 * s);
    ctx.fill();
    ctx.restore();
    insideDigits(false);
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = type === 7 ? 0.9 * s : 1.4 * s;
    ctx.globalAlpha = type === 7 ? 1 : 0.85;
    roundedRect(ctx, bx, cy - h / 2, w, h, type === 7 ? h / 2 : 3.2 * s);
    ctx.stroke();
    cap();
    ctx.globalAlpha = 1;
    ctx.fillStyle = inner;
    const iw = (w - 3.2 * s) * val / 100;
    roundedRect(ctx, bx + 1.6 * s, cy - h / 2 + 1.6 * s, iw, h - 3.2 * s, 1.6 * s);
    ctx.fill();
  }
  if (type === 1 || type === 10) {
    const badgeR = type === 1 ? 4.6 * s : 0;
    const bw2 = type === 10 ? 12 * s : badgeR * 2;
    const bx2 = bx + w / 2 - bw2 / 2;
    ctx.fillStyle = type === 1 ? color : inner;
    if (type === 1) {
      ctx.beginPath();
      ctx.arc(bx + w / 2, cy, badgeR, 0, Math.PI * 2);
      ctx.fill();
    } else {
      roundedRect(ctx, bx2, cy - 3.6 * s, bw2, 7.2 * s, 2 * s);
      ctx.fill();
    }
    ctx.fillStyle = type === 1 ? (color === "#ffffff" ? "#111318" : "#ffffff") : "#ffffff";
    ctx.font = `700 ${5.2 * s}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(Math.round(val)), bx + w / 2, cy + 0.3 * s);
  }
  if (c.batteryCharging && type !== 9 && type !== 8 && type !== 6) {
    drawBolt(ctx, bx + w / 2, cy, s * 0.85, inner === "#34c759" || color === "#ffffff" ? "#111318" : "#ffffff");
  }
  ctx.restore();
}

function drawBatteryNumber(ctx, x, cy, s, c, withPercent) {
  const color = c.iconColor;
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `600 ${7 * s}px system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(withPercent ? `${Math.round(c.battery)}%` : String(Math.round(c.battery)), x, cy + 0.3 * s);
  ctx.restore();
}

function drawExtraBattery(ctx, id, x, cy, s, c) {
  const gray = "#c4c8cb";
  const green = "#34c759";
  ctx.save();
  ctx.lineCap = "round";
  const hFrame = (w, h, stroke, fill, ratio, num) => {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.6 * s;
    roundedRect(ctx, x, cy - h / 2, w, h, 3.4 * s);
    ctx.stroke();
    ctx.fillStyle = stroke;
    roundedRect(ctx, x + w + 1.4 * s, cy - 2.2 * s, 1.8 * s, 4.4 * s, 0.9 * s);
    ctx.fill();
    if (fill) {
      ctx.fillStyle = fill;
      const iw = (w - 3.2 * s) * ratio;
      roundedRect(ctx, x + 1.6 * s, cy - h / 2 + 1.6 * s, iw, h - 3.2 * s, 1.8 * s);
      ctx.fill();
    }
    if (num !== undefined) {
      ctx.fillStyle = "#ffffff";
      ctx.font = `700 ${6 * s}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(num, x + w / 2, cy + 0.3 * s);
    }
  };
  if (id === "batt11") hFrame(22 * s, 10.5 * s, gray, green, 0.51, "51");
  else if (id === "batt12") hFrame(22 * s, 10.5 * s, gray, green, 0.3, "30");
  else if (id === "batt13") hFrame(22 * s, 10.5 * s, gray, "#ff4d58", 0.15);
  else if (id === "batt14") {
    ctx.fillStyle = gray;
    roundedRect(ctx, x, cy - 5.2 * s, 22 * s, 10.4 * s, 5.2 * s);
    ctx.fill();
    ctx.fillStyle = "#111318";
    ctx.font = `700 ${6.4 * s}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("75", x + 11 * s, cy + 0.3 * s);
  } else if (id === "batt15") {
    ctx.fillStyle = c.iconColor;
    roundedRect(ctx, x, cy - 10 * s, 10 * s, 20 * s, 2.6 * s);
    ctx.fill();
    roundedRect(ctx, x + 3 * s, cy - 11.6 * s, 4 * s, 1.6 * s, 0.8 * s);
    ctx.fill();
  } else if (id === "batt16") {
    ctx.strokeStyle = c.iconColor;
    ctx.lineWidth = 1.1 * s;
    roundedRect(ctx, x, cy - 10 * s, 10 * s, 20 * s, 2.6 * s);
    ctx.stroke();
    roundedRect(ctx, x + 3 * s, cy - 11.6 * s, 4 * s, 1.6 * s, 0.8 * s);
    ctx.fill();
    drawBolt(ctx, x + 5 * s, cy, s * 0.75, c.iconColor);
  } else if (id === "powersave") {
    ctx.fillStyle = c.iconColor;
    ctx.beginPath();
    ctx.moveTo(x + 2.2 * s, cy + 5 * s);
    ctx.quadraticCurveTo(x + 1.4 * s, cy - 3.8 * s, x + 11.2 * s, cy - 5 * s);
    ctx.quadraticCurveTo(x + 12 * s, cy + 3.8 * s, x + 2.2 * s, cy + 5 * s);
    ctx.closePath();
    ctx.fill();
    punch(ctx, () => {
      ctx.strokeStyle = c.iconColor;
      ctx.lineWidth = 1.1 * s;
      ctx.beginPath();
      ctx.moveTo(x + 2.6 * s, cy + 4.4 * s);
      ctx.quadraticCurveTo(x + 5.4 * s, cy + 1.4 * s, x + 10.4 * s, cy - 4.2 * s);
      ctx.stroke();
    });
  } else if (id === "chargeMark1") {
    drawBolt(ctx, x + 4 * s, cy, s, c.iconColor);
  }
  ctx.restore();
}

function extraBatteryWidth(id, s) {
  if (id === "batt15" || id === "batt16") return 10 * s;
  if (id === "powersave") return 13 * s;
  if (id === "chargeMark1") return 8 * s;
  return 24.5 * s;
}

function punch(ctx, fn) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  fn();
  ctx.restore();
}

function alarmIcon(ctx, x, cy, s, o) {
  const cx = x + 6.5 * s;
  if (o.feet) {
    ctx.lineWidth = 1.9 * s;
    ctx.beginPath();
    ctx.moveTo(x + 3.2 * s, cy + 4.8 * s);
    ctx.lineTo(x + 2.1 * s, cy + 6.2 * s);
    ctx.moveTo(x + 9.8 * s, cy + 4.8 * s);
    ctx.lineTo(x + 10.9 * s, cy + 6.2 * s);
    ctx.stroke();
  }
  if (o.ears) {
    ctx.lineWidth = 1.9 * s;
    ctx.beginPath();
    ctx.moveTo(x + 2.5 * s, cy - 5 * s);
    ctx.lineTo(x + 4.5 * s, cy - 6.6 * s);
    ctx.moveTo(x + 10.5 * s, cy - 5 * s);
    ctx.lineTo(x + 8.5 * s, cy - 6.6 * s);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, 5.2 * s, 0, Math.PI * 2);
  if (o.fill) ctx.fill();
  else ctx.stroke();
  if (o.hand === "punch") {
    punch(ctx, () => {
      ctx.lineWidth = 1.5 * s;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.sin(o.angle) * 3 * s, cy - Math.cos(o.angle) * 3 * s);
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.sin(o.angle + 0.95) * 2 * s, cy - Math.cos(o.angle + 0.95) * 2 * s);
      ctx.stroke();
    });
  } else {
    ctx.lineWidth = 1.1 * s;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.sin(o.angle) * 3 * s, cy - Math.cos(o.angle) * 3 * s);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.sin(o.angle + 0.95) * 2 * s, cy - Math.cos(o.angle + 0.95) * 2 * s);
    ctx.stroke();
  }
}

function btGlyph(ctx, x, cy, s, lw) {
  ctx.lineWidth = lw * s;
  ctx.beginPath();
  ctx.moveTo(x + 3.6 * s, cy - 3.2 * s);
  ctx.lineTo(x + 9.6 * s, cy + 3 * s);
  ctx.lineTo(x + 6.5 * s, cy + 5.6 * s);
  ctx.lineTo(x + 6.5 * s, cy - 5.6 * s);
  ctx.lineTo(x + 9.6 * s, cy - 3 * s);
  ctx.lineTo(x + 3.6 * s, cy + 3.2 * s);
  ctx.stroke();
}

function speedArrowIcon(ctx, x, cy, s, o) {
  const w = (o.w || 2.8) * s;
  const h = (o.h || 5.4) * s;
  const gap = (o.gap || 2.0) * s;
  ctx.beginPath();
  ctx.moveTo(x + gap, cy + h / 2);
  ctx.lineTo(x + gap + w, cy + h / 2);
  ctx.lineTo(x + gap + w / 2, cy - h / 2);
  ctx.closePath();
  ctx.fill();
  const x2 = x + gap + w + gap;
  ctx.beginPath();
  ctx.moveTo(x2, cy - h / 2);
  ctx.lineTo(x2 + w, cy - h / 2);
  ctx.lineTo(x2 + w / 2, cy + h / 2);
  ctx.closePath();
  ctx.fill();
  if (o.dot) {
    ctx.beginPath();
    ctx.arc(x2 + w / 2, cy, (o.dot || 0.7) * s, 0, Math.PI * 2);
    ctx.fill();
  }
  if (o.baseline) {
    ctx.beginPath();
    ctx.moveTo(x + gap, cy + h / 2 + 1.6 * s);
    ctx.lineTo(x2 + w, cy + h / 2 + 1.6 * s);
    ctx.lineWidth = 0.9 * s;
    ctx.stroke();
  }
}

function simCardIcon(ctx, x, cy, s, o, color) {
  const w = o.w * s;
  const h = o.h * s;
  const r = o.r * s;
  const n = o.n * s;
  roundedRect(ctx, x, cy - h / 2, w, h, r);
  ctx.fill();
  punch(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(x + n, cy - h / 2);
    ctx.lineTo(x + r, cy - h / 2);
    ctx.lineTo(x + r, cy - h / 2 + n);
    ctx.closePath();
    ctx.fill();
  });
  ctx.strokeStyle = color;
  ctx.setLineDash([1.4 * s, 1.1 * s]);
  ctx.lineWidth = 0.9 * s;
  for (let i = 0; i < o.lines; i += 1) {
    ctx.beginPath();
    ctx.moveTo(x + r * 1.4, cy + h / 2 - (1.4 + i * 1.6) * s);
    ctx.lineTo(x + w - r * 1.4, cy + h / 2 - (1.4 + i * 1.6) * s);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawOtherIcon(ctx, id, x, cy, s, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.5 * s;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (id === "headphone1") {
    ctx.lineWidth = 2.1 * s;
    ctx.beginPath();
    ctx.arc(x + 6.5 * s, cy + 1.4 * s, 5.2 * s, Math.PI, 0);
    ctx.stroke();
    roundedRect(ctx, x + 0.3 * s, cy + 0.2 * s, 3.2 * s, 6.2 * s, 1.5 * s);
    ctx.fill();
    roundedRect(ctx, x + 9.5 * s, cy + 0.2 * s, 3.2 * s, 6.2 * s, 1.5 * s);
    ctx.fill();
  } else if (id === "vibrate1") {
    ctx.lineWidth = 1.5 * s;
    roundedRect(ctx, x + 4.5 * s, cy - 5.2 * s, 4.6 * s, 10.4 * s, 1.7 * s);
    ctx.stroke();
    ctx.lineWidth = 1.2 * s;
    ctx.beginPath();
    ctx.moveTo(x + 2.7 * s, cy - 3.4 * s);
    ctx.lineTo(x + 1.4 * s, cy - 1.7 * s);
    ctx.lineTo(x + 2.7 * s, cy);
    ctx.lineTo(x + 1.4 * s, cy + 1.7 * s);
    ctx.lineTo(x + 2.7 * s, cy + 3.4 * s);
    ctx.moveTo(x + 10.9 * s, cy - 3.4 * s);
    ctx.lineTo(x + 12.2 * s, cy - 1.7 * s);
    ctx.lineTo(x + 10.9 * s, cy);
    ctx.lineTo(x + 12.2 * s, cy + 1.7 * s);
    ctx.lineTo(x + 10.9 * s, cy + 3.4 * s);
    ctx.stroke();
  } else if (id === "nfc1") {
    ctx.lineWidth = 1.9 * s;
    roundedRect(ctx, x + 0.8 * s, cy - 6 * s, 12 * s, 12 * s, 3.2 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 3.6 * s, cy + 3.2 * s);
    ctx.lineTo(x + 10 * s, cy - 3.2 * s);
    ctx.stroke();
  } else if (id === "eyecare1") {
    ctx.beginPath();
    ctx.moveTo(x + 0.6 * s, cy);
    ctx.quadraticCurveTo(x + 6.5 * s, cy - 6.2 * s, x + 12.4 * s, cy);
    ctx.quadraticCurveTo(x + 6.5 * s, cy + 6.2 * s, x + 0.6 * s, cy);
    ctx.closePath();
    ctx.fill();
    punch(ctx, () => {
      ctx.beginPath();
      ctx.arc(x + 6.5 * s, cy, 2.5 * s, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.beginPath();
    ctx.arc(x + 7.5 * s, cy - 1 * s, 0.9 * s, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === "alarm1") {
    alarmIcon(ctx, x, cy, s, { ears: true, feet: true, fill: true, hand: "punch", angle: -0.5 });
  } else if (id === "alarm2") {
    alarmIcon(ctx, x, cy, s, { ears: true, feet: false, fill: true, hand: "punch", angle: 0.5 });
  } else if (id === "alarm3") {
    ctx.lineWidth = 1.9 * s;
    ctx.beginPath();
    ctx.moveTo(x + 2.5 * s, cy - 5 * s);
    ctx.lineTo(x + 4.5 * s, cy - 6.6 * s);
    ctx.moveTo(x + 10.5 * s, cy - 5 * s);
    ctx.lineTo(x + 8.5 * s, cy - 6.6 * s);
    ctx.moveTo(x + 3.2 * s, cy + 4.8 * s);
    ctx.lineTo(x + 2.1 * s, cy + 6.2 * s);
    ctx.moveTo(x + 9.8 * s, cy + 4.8 * s);
    ctx.lineTo(x + 10.9 * s, cy + 6.2 * s);
    ctx.stroke();
    alarmIcon(ctx, x, cy, s, { ears: false, feet: false, fill: false, hand: "line", angle: 0.8 });
  } else if (id === "alarm4") {
    alarmIcon(ctx, x, cy, s, { ears: false, feet: false, fill: true, hand: "punch", angle: 1.3 });
  } else if (id === "alarm5") {
    alarmIcon(ctx, x, cy, s, { ears: true, feet: false, fill: true, hand: "punch", angle: 0.2 });
  } else if (id === "bluetooth1") {
    btGlyph(ctx, x, cy, s, 1.7);
  } else if (id === "bluetooth2") {
    btGlyph(ctx, x, cy, s, 1.7);
    ctx.lineWidth = 1.2 * s;
    ctx.beginPath();
    ctx.arc(x + 11 * s, cy - 2.8 * s, 2.3 * s, -Math.PI * 0.34, Math.PI * 0.34);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 12.6 * s, cy - 2.8 * s, 2.3 * s, -Math.PI * 0.34, Math.PI * 0.34);
    ctx.stroke();
  } else if (id === "bluetooth3") {
    btGlyph(ctx, x, cy, s, 1.15);
  } else if (id === "bluetooth4") {
    btGlyph(ctx, x, cy, s, 1.7);
    ctx.fillStyle = color;
    ctx.lineWidth = 1.1 * s;
    ctx.strokeStyle = color;
    roundedRect(ctx, x + 10.4 * s, cy + 3.4 * s, 2.4 * s, 0.9 * s, 0.45 * s);
    ctx.fill();
    roundedRect(ctx, x + 3.6 * s, cy - 6.8 * s, 0.9 * s, 2.4 * s, 0.45 * s);
    ctx.fill();
  } else if (id === "mute2") {
    ctx.beginPath();
    ctx.arc(x + 6.5 * s, cy - 0.8 * s, 4.4 * s, Math.PI, 0);
    ctx.lineTo(x + 10.9 * s, cy + 2.6 * s);
    ctx.lineTo(x + 2.1 * s, cy + 2.6 * s);
    ctx.closePath();
    ctx.fill();
    punch(ctx, () => {
      ctx.lineWidth = 1.35 * s;
      ctx.beginPath();
      ctx.moveTo(x + 3.1 * s, cy - 3.2 * s);
      ctx.lineTo(x + 10.4 * s, cy + 3.1 * s);
      ctx.moveTo(x + 4.6 * s, cy - 3.9 * s);
      ctx.lineTo(x + 11 * s, cy + 3.6 * s);
      ctx.stroke();
    });
  } else if (id === "speedIcon1") {
    speedArrowIcon(ctx, x, cy, s, { w: 2.8, h: 5.4, gap: 2.0 });
  } else if (id === "speedIcon2") {
    speedArrowIcon(ctx, x, cy, s, { w: 2.4, h: 4.6, gap: 2.6 });
  } else if (id === "speedIcon3") {
    speedArrowIcon(ctx, x, cy, s, { w: 2.8, h: 5.4, gap: 2.0, baseline: true });
  } else if (id === "speedIcon4") {
    speedArrowIcon(ctx, x, cy, s, { w: 3.2, h: 5.8, gap: 2.2, dot: 0.8 });
  } else if (id === "dualsim1") {
    simCardIcon(ctx, x, cy, s, { w: 9, h: 12, r: 2.6, n: 3.4, lines: 1 }, color);
  } else if (id === "dualsim2") {
    simCardIcon(ctx, x, cy, s, { w: 10.4, h: 12, r: 2.6, n: 3.4, lines: 2 }, color);
  } else if (id === "dualsim3") {
    ctx.globalAlpha = 0.55;
    simCardIcon(ctx, x + 2.6 * s, cy + 1.9 * s, s, { w: 9, h: 12, r: 2.6, n: 3.4, lines: 1 }, color);
    ctx.globalAlpha = 1;
    simCardIcon(ctx, x, cy, s, { w: 9, h: 12, r: 2.6, n: 3.4, lines: 1 }, color);
  } else if (id === "mute1") {
    ctx.beginPath();
    ctx.arc(x + 6.5 * s, cy - 0.8 * s, 4.4 * s, Math.PI, 0);
    ctx.lineTo(x + 10.9 * s, cy + 2.6 * s);
    ctx.lineTo(x + 2.1 * s, cy + 2.6 * s);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 6.5 * s, cy + 4.2 * s, 1.5 * s, 0, Math.PI * 2);
    ctx.fill();
    punch(ctx, () => {
      ctx.lineWidth = 1.7 * s;
      ctx.beginPath();
      ctx.moveTo(x + 1.6 * s, cy - 5.6 * s);
      ctx.lineTo(x + 11.4 * s, cy + 4.8 * s);
      ctx.stroke();
    });
  } else if (id === "speaker1") {
    ctx.beginPath();
    ctx.moveTo(x + 1.4 * s, cy - 1.7 * s);
    ctx.lineTo(x + 3.8 * s, cy - 1.7 * s);
    ctx.lineTo(x + 6.8 * s, cy - 4.4 * s);
    ctx.lineTo(x + 6.8 * s, cy + 4.4 * s);
    ctx.lineTo(x + 3.8 * s, cy + 1.7 * s);
    ctx.lineTo(x + 1.4 * s, cy + 1.7 * s);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.4 * s;
    ctx.beginPath();
    ctx.arc(x + 7.6 * s, cy, 3 * s, -Math.PI * 0.32, Math.PI * 0.32);
    ctx.stroke();
    punch(ctx, () => {
      ctx.lineWidth = 1.6 * s;
      ctx.beginPath();
      ctx.moveTo(x + 1.2 * s, cy - 5.2 * s);
      ctx.lineTo(x + 11 * s, cy + 5.2 * s);
      ctx.stroke();
    });
  } else if (id === "gauge1") {
    ctx.lineWidth = 1.7 * s;
    ctx.beginPath();
    ctx.arc(x + 6.5 * s, cy, 5.4 * s, Math.PI * 0.72, Math.PI * 2.28);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 6.5 * s, cy);
    ctx.lineTo(x + 9.2 * s, cy - 3 * s);
    ctx.stroke();
  } else if (id === "nosim1") {
    roundedRect(ctx, x + 2.6 * s, cy - 5.6 * s, 7.8 * s, 11.2 * s, 2.2 * s);
    ctx.fill();
    punch(ctx, () => {
      roundedRect(ctx, x + 5.7 * s, cy - 3.4 * s, 1.6 * s, 4.2 * s, 0.8 * s);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 6.5 * s, cy + 2.6 * s, 0.9 * s, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.restore();
}

function drawBadge(ctx, badge, x, cy, s) {
  if (badge.bg === "gradient") {
    const g = ctx.createLinearGradient(x - 7 * s, cy + 7 * s, x + 7 * s, cy - 7 * s);
    g.addColorStop(0, "#ffdd55");
    g.addColorStop(0.5, "#dd2a7b");
    g.addColorStop(1, "#8134af");
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = badge.bg;
  }
  if (badge.shape === "circle") {
    ctx.beginPath();
    ctx.arc(x, cy, 7 * s, 0, Math.PI * 2);
    ctx.fill();
  } else {
    roundedRect(ctx, x - 7 * s, cy - 7 * s, 14 * s, 14 * s, 3.4 * s);
    ctx.fill();
  }
}

function drawNoticeGlyph(ctx, type, x, cy, s) {
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (type === "telegram") {
    ctx.beginPath();
    ctx.moveTo(x + 5.2 * s, cy - 3.7 * s);
    ctx.lineTo(x - 4.9 * s, cy - 0.5 * s);
    ctx.lineTo(x - 1.1 * s, cy + 0.9 * s);
    ctx.lineTo(x + 0.9 * s, cy + 4.3 * s);
    ctx.closePath();
    ctx.fill();
  } else if (type === "amazon") {
    ctx.font = `700 ${8.4 * s}px Arial, sans-serif`;
    ctx.fillText("a", x, cy - 1.5 * s);
    ctx.lineWidth = 1.15 * s;
    ctx.beginPath();
    ctx.arc(x, cy + 1.1 * s, 4.5 * s, 0.18 * Math.PI, 0.82 * Math.PI);
    ctx.stroke();
  } else if (type === "tiktok") {
    ctx.lineWidth = 1.9 * s;
    ctx.beginPath();
    ctx.moveTo(x + 1.2 * s, cy - 4.8 * s);
    ctx.lineTo(x + 1.2 * s, cy + 2.2 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 1.2 * s, cy - 4.6 * s);
    ctx.quadraticCurveTo(x + 2.7 * s, cy - 1.6 * s, x + 4.9 * s, cy - 1.5 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x - 1.5 * s, cy + 2.6 * s, 2.6 * s, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "sms") {
    roundedRect(ctx, x - 4.6 * s, cy - 4.2 * s, 9.2 * s, 7 * s, 2.2 * s);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 2.6 * s, cy + 2.2 * s);
    ctx.lineTo(x - 3.4 * s, cy + 5.2 * s);
    ctx.lineTo(x - 0.2 * s, cy + 2.6 * s);
    ctx.closePath();
    ctx.fill();
  } else if (type === "uber") {
    ctx.font = `700 ${8.2 * s}px Arial, sans-serif`;
    ctx.fillText("U", x, cy + 0.4 * s);
  } else if (type === "facebook") {
    ctx.font = `800 ${10.5 * s}px Arial, sans-serif`;
    ctx.fillText("f", x + 0.5 * s, cy + 0.9 * s);
  } else if (type === "instagram") {
    ctx.lineWidth = 1.25 * s;
    roundedRect(ctx, x - 4 * s, cy - 4 * s, 8 * s, 8 * s, 2.4 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, cy, 2.1 * s, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 2.6 * s, cy - 2.6 * s, 0.7 * s, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawNotice(ctx, type, x, cy, scale, color, customImage) {
  ctx.save();
  if (type === "custom" && customImage) {
    roundedRect(ctx, x - 7 * scale, cy - 7 * scale, 14 * scale, 14 * scale, 3.4 * scale);
    ctx.save();
    ctx.clip();
    ctx.drawImage(customImage, x - 7 * scale, cy - 7 * scale, 14 * scale, 14 * scale);
    ctx.restore();
  } else if (NOTICE_BADGES[type]) {
    drawBadge(ctx, NOTICE_BADGES[type], x, cy, scale);
    drawNoticeGlyph(ctx, type, x, cy, scale);
  } else {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (type === "plane") {
      ctx.translate(x, cy);
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(0, -7 * scale);
      ctx.quadraticCurveTo(1.2 * scale, -6 * scale, 1.3 * scale, -3 * scale);
      ctx.lineTo(7 * scale, 1.2 * scale);
      ctx.lineTo(7 * scale, 2.6 * scale);
      ctx.lineTo(1.3 * scale, 0.6 * scale);
      ctx.lineTo(1 * scale, 4.2 * scale);
      ctx.lineTo(3.2 * scale, 5.8 * scale);
      ctx.lineTo(3.2 * scale, 6.8 * scale);
      ctx.lineTo(0, 5.8 * scale);
      ctx.lineTo(-3.2 * scale, 6.8 * scale);
      ctx.lineTo(-3.2 * scale, 5.8 * scale);
      ctx.lineTo(-1 * scale, 4.2 * scale);
      ctx.lineTo(-1.3 * scale, 0.6 * scale);
      ctx.lineTo(-7 * scale, 2.6 * scale);
      ctx.lineTo(-7 * scale, 1.2 * scale);
      ctx.lineTo(-1.3 * scale, -3 * scale);
      ctx.quadraticCurveTo(-1.2 * scale, -6 * scale, 0, -7 * scale);
      ctx.closePath();
      ctx.fill();
    } else if (type === "bell") {
      ctx.translate(x, cy);
      ctx.beginPath();
      ctx.arc(0, -5.6 * scale, 0.9 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-4.9 * scale, 3.6 * scale);
      ctx.quadraticCurveTo(-3.9 * scale, 2.6 * scale, -3.9 * scale, 0.4 * scale);
      ctx.lineTo(-3.9 * scale, -1.6 * scale);
      ctx.arc(0, -1.6 * scale, 3.9 * scale, Math.PI, 0);
      ctx.lineTo(3.9 * scale, 0.4 * scale);
      ctx.quadraticCurveTo(3.9 * scale, 2.6 * scale, 4.9 * scale, 3.6 * scale);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 4.1 * scale, 1.5 * scale, 0, Math.PI);
      ctx.fill();
    } else if (type === "location") {
      ctx.translate(x, cy);
      ctx.beginPath();
      ctx.moveTo(6.2 * scale, -6.2 * scale);
      ctx.lineTo(-6.2 * scale, 0.8 * scale);
      ctx.lineTo(-1 * scale, 1.2 * scale);
      ctx.lineTo(-0.4 * scale, 6.2 * scale);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawEraseStrokes(ctx, strokes, w, h, c) {
  if (!strokes.length) return;
  const scale = Math.max(.62, w / 390);
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.beginPath();
  ctx.rect(0, 0, w, h * c.topHeight / 100);
  ctx.clip();
  for (const stroke of strokes) {
    if (!stroke.points.length) continue;
    ctx.strokeStyle = stroke.color;
    ctx.fillStyle = stroke.color;
    ctx.lineWidth = stroke.size * scale;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (stroke.points.length === 1) {
      ctx.beginPath();
      ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size * scale / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i += 1) ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function getItem(c, id) {
  return c.items?.[id] || DEFAULT_ITEMS[id] || OFF_ITEM;
}

function buildTopElements(ctx, w, c, customImages) {
  const metrics = getDeviceMetrics(c.deviceType);
  const base = Math.max(0.62, w / 390);
  const gs = base * Math.max(0.6, Math.min(1.6, c.iconScale / 100)) * 1.35 * metrics.top.iconScale;
  const els = [];
  const wifiFirst = c.wifiSimOrder === "wifiFirst";
  const wifiOrder = wifiFirst ? 26 : 44;
  const add = (id, order, width, draw) => {
    const item = getItem(c, id);
    if (!item.on || width <= 0) return;
    const s = gs * (item.size / 100);
    els.push({
      id, order, side: item.side,
      width: width * (item.size / 100),
      draw: (x, cy) => draw(x + item.dx * base, cy + item.dy * base, s),
    });
  };

  const notices = (c.notificationIcons || []).filter((n) => n !== "custom");
  if (notices.length) add("notices", 0, notices.length * 15 * gs, (x, cy, s) => {
    let px = x;
    for (const n of notices) {
      px += 7.5 * s;
      drawNotice(ctx, n, px, cy, s, c.iconColor, customImages.custom);
      px += 7.5 * s;
    }
  });
  (customImages.list || []).forEach((ci, i) => {
    add(`custom${i + 1}`, 1 + i, 15 * gs, (x, cy, s) => drawNotice(ctx, "custom", x + 7.5 * s, cy, s, c.iconColor, ci.img));
  });

  const OTHER_WIDTHS = { headphone1: 13, vibrate1: 13.6, nfc1: 13.6, eyecare1: 13, alarm1: 13, alarm2: 13, alarm3: 13, alarm4: 13, alarm5: 13, bluetooth1: 13, bluetooth2: 13, bluetooth3: 13, bluetooth4: 13, mute1: 13, mute2: 13, speaker1: 12.4, gauge1: 13, nosim1: 10.4, speedIcon1: 15, speedIcon2: 15, speedIcon3: 15, speedIcon4: 15, dualsim1: 12, dualsim2: 12, dualsim3: 12 };
  const others = ["headphone1", "vibrate1", "nfc1", "eyecare1", "alarm1", "alarm2", "alarm3", "alarm4", "alarm5", "bluetooth1", "bluetooth2", "bluetooth3", "bluetooth4", "mute1", "mute2", "speaker1", "gauge1", "nosim1", "speedIcon1", "speedIcon2", "speedIcon3", "speedIcon4", "dualsim1", "dualsim2", "dualsim3"];
  others.forEach((id, i) => add(id, 10 + i, OTHER_WIDTHS[id] * gs + (i < others.length - 1 ? c.otherGap * gs : 0), (x, cy, s) => drawOtherIcon(ctx, id, x, cy, s, c.iconColor)));

  [["mark1", 20], ["mark2", 21], ["mark5", 21.5], ["mark3", 22], ["mark4", 23]].forEach(([id, order]) => {
    add(id, order, markWidth(ctx, gs, id), (x, cy, s) => drawMark(ctx, x, cy, s, c.iconColor, id));
  });

  add("speed2", 25, speedWidth(ctx, gs, [c.speed2Line1 || "4.81", c.speed2Line2 || "KB/s"]), (x, cy, s) => drawSpeedLines(ctx, x, cy, s, c.iconColor, [c.speed2Line1 || "4.81", c.speed2Line2 || "KB/s"]));
  add("speed1", 24, speedWidth(ctx, gs, [c.speed1Text || "82.0 KB/S"]), (x, cy, s) => drawSpeedLines(ctx, x, cy, s, c.iconColor, [c.speed1Text || "82.0 KB/S"]));

  const simDefs = [
    { n: 1, baseOrder: 30, network: c.sim1Network, bars: c.sim1Bars },
    { n: 2, baseOrder: 34, network: c.sim2Network, bars: c.sim2Bars },
  ];
  for (const sim of simDefs) {
    if (sim.n === 2 && c.simCount < 2) continue;
    const prefix = `sim${sim.n}`;
    const numW = c.showSimNumber ? 6 * gs : 0;
    const shapeW = signalShapeWidth(ctx, c.signalShape, gs, c);
    const typeW = networkTypeWidth(ctx, sim.network, gs);
    const callW = c.callMark !== "none" ? textWidth(ctx, c.callMark, sysFont(7.4 * gs)) + 2 * gs : 0;
    add(`${prefix}Question`, sim.baseOrder, 8 * gs, (x, cy, s) => drawQuestion(ctx, x, cy, s, c.iconColor));
    add(`${prefix}Bars`, sim.baseOrder + 1, numW + shapeW, (x, cy, s) => {
      let px = x;
      if (c.showSimNumber) {
        ctx.save();
        ctx.fillStyle = c.iconColor;
        ctx.font = sysFont(6.4 * s);
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(String(sim.n), px, cy + 0.4 * s);
        ctx.restore();
        px += numW * (s / gs);
      }
      drawSignalShape(ctx, px, cy, s, sim.bars, c.iconColor, c.signalShape, c);
    });
    add(`${prefix}Arrow`, sim.baseOrder + 2, 9 * gs, (x, cy, s) => drawDataArrows(ctx, x, cy, s, c.iconColor));
    add(`${prefix}Type`, sim.baseOrder + 3, typeW + callW, (x, cy, s) => {
      let px = x;
      if (c.callMark !== "none") {
        ctx.save();
        ctx.fillStyle = c.iconColor;
        ctx.font = sysFont(7.4 * s);
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(c.callMark, px, cy + 0.3 * s);
        ctx.restore();
        px += callW * (s / gs);
      }
      drawNetworkType(ctx, sim.network, px, cy, s, c.iconColor);
    });
  }

  add("signal6", 40, signalShapeWidth(ctx, 6, gs, c), (x, cy, s) => drawSignalShape(ctx, x, cy, s, c.sim1Bars, c.iconColor, 6, c));
  add("signal7", 41, signalShapeWidth(ctx, 7, gs, c), (x, cy, s) => drawSignalShape(ctx, x, cy, s, c.sim1Bars, c.iconColor, 7, c));
  add("signal8", 42, signalShapeWidth(ctx, 8, gs, c), (x, cy, s) => drawSignalShape(ctx, x, cy, s, c.sim1Bars, c.iconColor, 8, c));

  add("wifiArrow1", wifiOrder, 9 * gs, (x, cy, s) => drawWifiArrows(ctx, x, cy, s, c.iconColor));
  add("wifi", wifiOrder + 1, 20 * gs, (x, cy, s) => drawWifi(ctx, x, cy, s, c.iconColor, c.wifiStrength, c.wifiStyle));

  const extras = ["powersave", "batt11", "batt12", "chargeMark1", "batt13", "batt14", "batt15", "batt16"];
  extras.forEach((id, i) => add(id, 50 + i, extraBatteryWidth(id, gs), (x, cy, s) => drawExtraBattery(ctx, id, x, cy, s, c)));

  const bType = c.batteryType;
  const bodyW = batteryBodyWidth(bType, gs);
  const vertical = bType === 8 || bType === 9;
  const numOutside = c.batteryNumber && c.batteryNumberLayout !== "inside";
  const numW = numOutside ? textWidth(ctx, `${Math.round(c.battery)}%`, `600 ${7 * gs}px system-ui, sans-serif`) + c.batteryGap * gs : 0;
  add("battery", 60, bodyW + numW, (x, cy, s) => {
    const bw = batteryBodyWidth(bType, s);
    const nw = numOutside ? textWidth(ctx, `${Math.round(c.battery)}%`, `600 ${7 * s}px system-ui, sans-serif`) + c.batteryGap * s : 0;
    const leftNum = c.batteryNumberLayout === "left";
    const bx = leftNum ? x + nw : x;
    if (numOutside) drawBatteryNumber(ctx, leftNum ? x : x + bw + c.batteryGap * s, cy, s, c, true);
    drawBatteryBody(ctx, bType, bx, cy, s, c);
    if (c.batteryNumber && c.batteryNumberLayout === "inside" && bType !== 1 && bType !== 10 && !vertical) {
      ctx.save();
      ctx.fillStyle = batteryInnerColor(c) === "#34c759" || c.iconColor === "#ffffff" ? "#111318" : "#ffffff";
      if (c.battery > 45 && batteryInnerColor(c) !== c.iconColor) ctx.fillStyle = "#111318";
      ctx.font = `700 ${6.2 * s}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(Math.round(c.battery)), bx + bw / 2 - 1 * s, cy + 0.3 * s);
      ctx.restore();
    }
  });

  return els.sort((a, b) => a.order - b.order);
}

function drawTop(ctx, img, w, h, c, customImages) {
  const th = h * c.topHeight / 100;
  const metrics = getDeviceMetrics(c.deviceType);
  const scale = Math.max(0.62, w / 390) * metrics.top.textScale;
  coverRegion(ctx, img, 0, 0, w, th, c.topStyle, c.topColor, c.topOpacity);

  // Draw time + glyphs on a transparent layer so punch() leaves real holes
  // that reveal the background instead of black pixels on an opaque canvas.
  const pw = ctx.canvas.width;
  const ph = ctx.canvas.height;
  const layer = document.createElement("canvas");
  layer.width = pw;
  layer.height = ph;
  const g = layer.getContext("2d");
  g.scale(pw / w, ph / h);

  const cy = th / 2 + metrics.top.centerOffset * scale;
  const gap = metrics.top.groupGap * scale;
  const margin = metrics.top.sideMargin * scale;

  const weight = Math.max(100, Math.min(900, c.timeWeight));
  const timeFont = `${weight} ${18 * scale * (c.timeSize / 100)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  const parts = [c.time || "00:00"];
  if (c.showSuffix && c.timeSuffix) parts.push(c.timeSuffix);
  if (c.showCarrier && c.carrier) parts.push(c.carrier);
  const tGap = c.timeGap * scale;
  const widths = parts.map((p) => textWidth(g, p, timeFont));
  const totalW = widths.reduce((a, b) => a + b, 0) + tGap * (parts.length - 1);

  g.fillStyle = c.iconColor;
  g.font = timeFont;
  g.textBaseline = "middle";
  let tx;
  if (c.timePosition === "center") tx = w / 2 - totalW / 2;
  else if (c.timePosition === "right") tx = w * (1 - c.timeX / 100) - totalW;
  else tx = w * c.timeX / 100;
  g.textAlign = "left";
  let px = tx;
  parts.forEach((p, i) => {
    g.fillText(p, px, cy + c.timeOffsetY * scale);
    px += widths[i] + tGap;
  });

  const els = buildTopElements(g, w, c, customImages);
  const lefts = els.filter((e) => e.side === "left");
  const rights = els.filter((e) => e.side !== "left");
  const pairGap = (a, b) => {
    if (!a || !b) return gap;
    const ids = `${a.id}|${b.id}`;
    if (ids === "wifi|wifiArrow1" || ids === "wifiArrow1|wifi") return c.wifiGap * scale;
    return gap;
  };
  let lx = margin;
  if (c.timePosition === "left") lx = tx + totalW + gap;
  lefts.forEach((e, i) => {
    e.draw(lx, cy);
    lx += e.width + pairGap(e, lefts[i + 1]);
  });
  let rx = w - margin;
  const rev = [...rights].reverse();
  rev.forEach((e, i) => {
    rx -= e.width;
    e.draw(rx, cy);
    rx -= pairGap(e, rev[i + 1]);
  });

  ctx.drawImage(layer, 0, 0);
}

const NAV_PATH_DATA = {
  home: ["M12 3.5 4.2 9.3v9.5a1.8 1.8 0 0 0 1.8 1.8h12a1.8 1.8 0 0 0 1.8-1.8V9.3z", "M9.2 20.6v-7.4h5.6v7.4"],
  search: ["M18.2 10.8a7.2 7.2 0 1 1-14.4 0 7.2 7.2 0 0 1 14.4 0z", "M20.8 20.8l-4.5-4.5"],
  plus: ["M12 5v14", "M5 12h14"],
  user: ["M20.5 20.8v-1.4a4.3 4.3 0 0 0-4.3-4.3H7.8a4.3 4.3 0 0 0-4.3 4.3v1.4", "M16.3 7.4a4.3 4.3 0 1 1-8.6 0 4.3 4.3 0 0 1 8.6 0z"],
  chat: ["M20.6 11.5a8.3 8.3 0 0 1-8.3 8.3 8.5 8.5 0 0 1-3.5-.8L4 20.6l1.6-4.8a8.3 8.3 0 1 1 15-4.3z"],
  phone: ["M20.4 15.8v3a1.8 1.8 0 0 1-2 1.8 18.8 18.8 0 0 1-8.4-3 18.4 18.4 0 0 1-5.8-5.8 18.8 18.8 0 0 1-3-8.4 1.8 1.8 0 0 1 1.8-2h3a1.8 1.8 0 0 1 1.8 1.6c.1.9.3 1.8.7 2.6a1.8 1.8 0 0 1-.4 1.9L7 8.8a15.1 15.1 0 0 0 5.7 5.7l1.3-1.3a1.8 1.8 0 0 1 1.9-.4c.8.4 1.7.6 2.6.7a1.8 1.8 0 0 1 1.9 2.3z"],
  camera: ["M20.8 19.8H3.2a2 2 0 0 1-2-2V8.4a2 2 0 0 1 2-2h3.5l1.6-2.7h5.8l1.6 2.7h3.5a2 2 0 0 1 2 2v9.4a2 2 0 0 1-2 2z", "M16 13.1a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"],
  heart: ["M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0 0-7.8z"],
};

const NAV_RENDER_METRICS = {
  original: { stroke: 1.7, scale: 1, cap: "round", join: "round" },
  ios: { stroke: 1.65, scale: 0.96, cap: "round", join: "round" },
  pixel: { stroke: 1.55, scale: 0.98, cap: "round", join: "round" },
  harmony: { stroke: 1.85, scale: 1.02, cap: "round", join: "round" },
  hyperos: { stroke: 1.75, scale: 1.02, cap: "round", join: "round" },
  origin: { stroke: 1.7, scale: 1, cap: "round", join: "round" },
  oneui: { stroke: 1.8, scale: 1.03, cap: "round", join: "round" },
};

const NAV_KEY_METRICS = {
  android: { stroke: 1.65, back: 5.5, home: 5.8, recent: 5.5 },
  threeLeft: { stroke: 1.7, back: 5.5, home: 6, recent: 5.5 },
  threeRight: { stroke: 1.7, back: 5.5, home: 6, recent: 5.5 },
  samsung: { stroke: 1.55, back: 5.2, home: 5.8, recent: 5.4 },
  vivo: { stroke: 1.65, back: 5.4, home: 6, recent: 5.4 },
  xiaomi: { stroke: 1.8, back: 5.7, home: 5.8, recent: 5.2 },
  huawei: { stroke: 1.85, back: 5.8, home: 5.8, recent: 5.5 },
};

let navPathCache = null;

function drawNavIcon(ctx, type, x, y, size, color, deviceType = "original") {
  if (!navPathCache) {
    navPathCache = Object.fromEntries(
      Object.entries(NAV_PATH_DATA).map(([key, arr]) => [key, arr.map((d) => new Path2D(d))])
    );
  }
  const paths = navPathCache[type] || navPathCache.home;
  const metrics = NAV_RENDER_METRICS[deviceType] || NAV_RENDER_METRICS.original;
  const g = size / 24 * metrics.scale;
  ctx.save();
  ctx.translate(x - 12 * g, y - 12 * g);
  ctx.scale(g, g);
  ctx.strokeStyle = color;
  ctx.lineWidth = metrics.stroke;
  ctx.lineCap = metrics.cap;
  ctx.lineJoin = metrics.join;
  for (const path of paths) ctx.stroke(path);
  ctx.restore();
}

function drawThreeKeys(ctx, style, w, cy, scale, color) {
  const metrics = NAV_KEY_METRICS[style] || NAV_KEY_METRICS.android;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = metrics.stroke * scale;
  const back = (x, dir) => {
    ctx.beginPath();
    ctx.moveTo(x + metrics.back * scale * dir, cy - metrics.back * scale);
    ctx.lineTo(x - metrics.back * scale * dir, cy);
    ctx.lineTo(x + metrics.back * scale * dir, cy + metrics.back * scale);
    if (style === "android") {
      ctx.closePath();
      ctx.fill();
    } else {
      if (style === "huawei") ctx.closePath();
      ctx.stroke();
    }
  };
  const recent = (x) => {
    if (style === "samsung") {
      ctx.beginPath();
      ctx.moveTo(x - 3 * scale, cy - 4.5 * scale);
      ctx.lineTo(x - 3 * scale, cy + 4.5 * scale);
      ctx.moveTo(x, cy - 4.5 * scale);
      ctx.lineTo(x, cy + 4.5 * scale);
      ctx.moveTo(x + 3 * scale, cy - 4.5 * scale);
      ctx.lineTo(x + 3 * scale, cy + 4.5 * scale);
      ctx.stroke();
    } else if (style === "xiaomi") {
      roundedRect(ctx, x - metrics.recent * scale, cy - metrics.recent * scale, metrics.recent * 2 * scale, metrics.recent * 2 * scale, 1.5 * scale);
      ctx.stroke();
    } else if (style === "huawei") {
      roundedRect(ctx, x - metrics.recent * scale, cy - metrics.recent * scale, metrics.recent * 2 * scale, metrics.recent * 2 * scale, 1.8 * scale);
      ctx.stroke();
    } else {
      ctx.strokeRect(x - metrics.recent * scale, cy - metrics.recent * scale, metrics.recent * 2 * scale, metrics.recent * 2 * scale);
    }
  };
  const home = (x) => {
    ctx.beginPath();
    ctx.arc(x, cy, metrics.home * scale, 0, Math.PI * 2);
    ctx.stroke();
  };
  if (style === "threeRight") {
    recent(w * .27);
    home(w * .5);
    back(w * .73, -1);
  } else {
    back(w * .27, 1);
    home(w * .5);
    recent(w * .73);
  }
}

function drawBrandNavigation(ctx, style, w, y, bh, scale, color) {
  const cy = y + bh * .5;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = (NAV_KEY_METRICS[style]?.stroke || 1.7) * scale;
  if (style === "vivo") {
    const left = w * .27;
    [-4, 0, 4].forEach((offset) => {
      ctx.beginPath();
      ctx.moveTo(left - 5 * scale, cy + offset * scale);
      ctx.lineTo(left + 5 * scale, cy + offset * scale);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.arc(w * .5, cy, 6.2 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * .73 + 4 * scale, cy - 7 * scale);
    ctx.lineTo(w * .73 - 4 * scale, cy);
    ctx.lineTo(w * .73 + 4 * scale, cy + 7 * scale);
    ctx.stroke();
  } else {
    drawThreeKeys(ctx, style, w, cy, scale, color);
  }
}

function drawBottom(ctx, img, w, h, c) {
  const bh = h * c.bottomHeight / 100;
  const y = h - bh;
  const styleDevice = {
    samsung: "oneui",
    vivo: "origin",
    xiaomi: "hyperos",
    huawei: "harmony",
  }[c.bottomStyle];
  const navDeviceType = c.deviceType !== "original" ? c.deviceType : (styleDevice || "original");
  const metrics = getDeviceMetrics(navDeviceType);
  const scale = Math.max(0.62, w / 390);
  coverRegion(ctx, img, 0, y, w, bh, c.bottomCover, c.bottomColor, c.bottomOpacity);
  const color = c.bottomIconColor;
  const navScale = Math.max(0.6, Math.min(1.6, (c.navIconScale || 100) / 100)) * metrics.bottom.iconScale;
  if (c.bottomStyle === "gesture" || c.bottomStyle === "gestureThin") {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.92;
    const barH = c.bottomStyle === "gestureThin" ? Math.max(1.6 * scale, bh * 0.04) : Math.max(3 * scale, bh * 0.085);
    roundedRect(ctx, w * 0.34, y + bh * metrics.bottom.y, w * 0.32, barH, 999);
    ctx.fill();
    ctx.globalAlpha = 1;
  } else if (["android", "threeLeft", "threeRight", "samsung", "vivo", "xiaomi", "huawei"].includes(c.bottomStyle)) {
    if (c.bottomStyle === "android") drawThreeKeys(ctx, "android", w, y + bh / 2, scale, color);
    else drawBrandNavigation(ctx, c.bottomStyle, w, y, bh, scale, color);
  } else {
    const isDock = c.bottomStyle === "dock";
    if (isDock) {
      ctx.fillStyle = c.bottomIconColor === "#ffffff" ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.10)";
      roundedRect(ctx, w * .045, y + bh * .10, w * .91, bh * .78, Math.min(22 * scale, bh * .24));
      ctx.fill();
    }
    const count = Math.max(3, Math.min(5, c.navCount));
    const left = isDock ? w * .13 : w * .1;
    const right = isDock ? w * .87 : w * .9;
    const cy = y + bh * .49;
    for (let i = 0; i < count; i += 1) {
      const x = count === 1 ? w / 2 : left + (right - left) * i / (count - 1);
      drawNavIcon(ctx, c.navIcons[i], x, cy, Math.min(25 * scale, bh * .38) * navScale, color, navDeviceType);
    }
  }
}

function renderCanvas(canvas, img, config, strokes = [], customImages = {}, originalOnly = false) {
  if (!canvas || !img) return;
  const outputWidth = img.naturalWidth;
  const outputHeight = img.naturalHeight;
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const outputCtx = canvas.getContext("2d", { alpha: false });
  outputCtx.imageSmoothingEnabled = true;
  outputCtx.imageSmoothingQuality = "high";

  // Render small system glyphs larger than the final image, then downsample.
  // This preserves 1:1 export dimensions while producing cleaner curves.
  const maxDimension = Math.max(outputWidth, outputHeight);
  const oversample = Math.min(2, Math.max(1, 2000 / maxDimension));
  const working = document.createElement("canvas");
  working.width = Math.round(outputWidth * oversample);
  working.height = Math.round(outputHeight * oversample);
  const ctx = working.getContext("2d", { alpha: false });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.scale(oversample, oversample);
  ctx.drawImage(img, 0, 0, outputWidth, outputHeight);
  if (!originalOnly) {
    drawEraseStrokes(ctx, strokes, outputWidth, outputHeight, config);
    drawTop(ctx, img, outputWidth, outputHeight, config, customImages);
    drawBottom(ctx, img, outputWidth, outputHeight, config);
  }
  outputCtx.drawImage(working, 0, 0, working.width, working.height, 0, 0, outputWidth, outputHeight);
}

function Range({ label, value, min, max, step = 1, suffix = "", onChange }) {
  const fill = `${((value - min) / (max - min)) * 100}%`;
  return (
    <label className="range-row">
      <span>{label}<b>{value}{suffix}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} style={{ "--fill": fill }} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={Array.isArray(o) ? o[0] : o} value={Array.isArray(o) ? o[0] : o}>{Array.isArray(o) ? o[1] : o}</option>)}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function SideToggle({ value, onChange }) {
  return (
    <div className="side-toggle">
      <button type="button" className={value === "left" ? "active" : ""} onClick={() => onChange("left")}>左侧</button>
      <button type="button" className={value === "right" ? "active" : ""} onClick={() => onChange("right")}>右侧</button>
    </div>
  );
}

function ItemCard({ badge, title, item, onPatch, onReset, children }) {
  return (
    <div className={`item-card ${item.on ? "on" : ""}`}>
      <div className="item-head">
        <span className="item-badge">{badge}</span>
        <strong>{title}</strong>
        {item.on && <button type="button" className="item-reset" onClick={onReset}>重置</button>}
        <label className="mini-switch">
          <input type="checkbox" checked={item.on} onChange={(e) => onPatch({ on: e.target.checked })} />
        </label>
      </div>
      {item.on && (
        <div className="item-body">
          <div className="item-row"><span>显示位置</span><SideToggle value={item.side} onChange={(v) => onPatch({ side: v })} /></div>
          <Range label="大小" value={item.size} min={60} max={160} step={5} suffix="%" onChange={(v) => onPatch({ size: v })} />
          <Range label="左右位置" value={item.dx} min={-40} max={40} suffix="px" onChange={(v) => onPatch({ dx: v })} />
          <Range label="上下位置" value={item.dy} min={-20} max={20} suffix="px" onChange={(v) => onPatch({ dy: v })} />
          {children}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children, em }) {
  return <div className="section-title"><span>{children}</span><em>{em}</em></div>;
}

export default function Home() {
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const customIconRef = useRef(null);
  const drawingRef = useRef(false);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [eraseStrokes, setEraseStrokes] = useState([]);
  const [eraseMode, setEraseMode] = useState("off");
  const [customIcons, setCustomIcons] = useState([]);
  const [section, setSection] = useState("upload");
  const [dragging, setDragging] = useState(false);
  const [originalOnly, setOriginalOnly] = useState(false);
  const [presets, setPresets] = useState([]);
  const [presetName, setPresetName] = useState("");

  useEffect(() => { setPresets(loadPresets()); }, []);

  const patch = useCallback((key, value) => setConfig((c) => ({ ...c, [key]: value })), []);
  const patchItem = useCallback((id, changes) => setConfig((c) => ({
    ...c,
    items: { ...c.items, [id]: { ...(c.items[id] || DEFAULT_ITEMS[id] || OFF_ITEM), ...changes } },
  })), []);
  const resetItem = useCallback((id) => setConfig((c) => ({
    ...c,
    items: { ...c.items, [id]: { ...(DEFAULT_ITEMS[id] || OFF_ITEM) } },
  })), []);
  const sizeText = useMemo(() => image ? `${image.naturalWidth} × ${image.naturalHeight}px` : "等待上传", [image]);
  const customImages = useMemo(() => {
    const map = { list: customIcons.map((ci, i) => ({ ...ci, slot: i + 1 })) };
    if (customIcons[0]) map.custom = customIcons[0].img;
    return map;
  }, [customIcons]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => renderCanvas(canvasRef.current, image, config, eraseStrokes, customImages, originalOnly));
    return () => cancelAnimationFrame(raf);
  }, [image, config, eraseStrokes, customImages, originalOnly]);

  const openFile = useCallback((file) => {
    const fileName = file?.name || "";
    const fileType = file?.type || "";
    const isImage = fileType.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(fileName);
    if (!file || !isImage) {
      window.alert("请选择 PNG、JPG、JPEG 或 WebP 图片。");
      return;
    }

    const url = URL.createObjectURL(file);
    const next = new Image();
    next.onload = () => {
      setImage((prev) => {
        if (prev?.src?.startsWith("blob:")) URL.revokeObjectURL(prev.src);
        return next;
      });
      setFileName(fileName.replace(/\.[^.]+$/, ""));
      setEraseStrokes([]);
      setEraseMode("off");
    };
    next.onerror = () => {
      URL.revokeObjectURL(url);
      window.alert("图片读取失败，请换一张 PNG、JPG、JPEG 或 WebP 图片重试。");
    };
    next.src = url;
  }, []);

  const download = useCallback((type = "png") => {
    if (!canvasRef.current || !image) return;
    renderCanvas(canvasRef.current, image, config, eraseStrokes, customImages, false);
    const mime = type === "jpg" ? "image/jpeg" : "image/png";
    const link = document.createElement("a");
    link.download = `${fileName || "screenshot"}-edited.${type}`;
    link.href = canvasRef.current.toDataURL(mime, type === "jpg" ? 0.95 : undefined);
    link.click();
  }, [config, customImages, eraseStrokes, fileName, image]);

  const applyDevice = (value) => {
    setConfig((c) => ({ ...c, deviceType: value, ...(DEVICE_PATCH[value] || {}) }));
  };

  const setBottomPreset = (value) => {
    const heights = { gesture: 6.2, gestureThin: 5.2, threeLeft: 6.5, threeRight: 6.5, samsung: 6.5, android: 6.5, vivo: 6.8, xiaomi: 6.8, huawei: 6.8, dock: 12.5, minimal: 8 };
    setConfig((c) => ({ ...c, bottomStyle: value, bottomHeight: heights[value] || c.bottomHeight }));
  };

  const toggleNotice = (value) => {
    setConfig((c) => {
      const current = c.notificationIcons || [];
      if (current.includes(value)) return { ...c, notificationIcons: current.filter((x) => x !== value) };
      if (current.length >= 5) return c;
      return { ...c, notificationIcons: [...current, value] };
    });
  };

  const addCustomIcons = (files) => {
    const list = Array.from(files || []).filter((f) => f.type.startsWith("image/"));
    setConfig((c) => {
      const next = { ...c, items: { ...c.items } };
      const room = 5 - customIcons.length;
      list.slice(0, room).forEach((_, i) => {
        const slot = customIcons.length + i + 1;
        next.items[`custom${slot}`] = { ...(next.items[`custom${slot}`] || OFF_ITEM), on: true };
      });
      return next;
    });
    list.slice(0, 5 - customIcons.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const icon = new Image();
        icon.onload = () => setCustomIcons((prev) => prev.length >= 5 ? prev : [...prev, { id: `${Date.now()}-${file.name}`, name: file.name.replace(/\.[^.]+$/, ""), img: icon }]);
        icon.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCustomIcon = (index) => {
    setCustomIcons((prev) => prev.filter((_, i) => i !== index));
    setConfig((c) => {
      const icons = { ...c.items };
      for (let i = 1; i <= 5; i += 1) icons[`custom${i}`] = { ...(icons[`custom${i + 1}`] || OFF_ITEM) };
      icons.custom5 = { ...OFF_ITEM };
      return { ...c, items: icons };
    });
  };

  const savePreset = () => {
    const name = presetName.trim() || `方案 ${presets.length + 1}`;
    const entry = { id: String(Date.now()), name, savedAt: new Date().toLocaleString("zh-CN", { hour12: false }).slice(0, 16), config: JSON.parse(JSON.stringify(config)) };
    const next = [...presets, entry].slice(-12);
    setPresets(next);
    localStorage.setItem(PRESET_KEY, JSON.stringify(next));
    setPresetName("");
  };

  const applyPreset = (p) => {
    setConfig((c) => ({
      ...DEFAULT_CONFIG,
      ...p.config,
      items: { ...DEFAULT_CONFIG.items, ...p.config.items },
      notificationIcons: p.config.notificationIcons || c.notificationIcons,
    }));
  };

  const deletePreset = (id) => {
    const next = presets.filter((p) => p.id !== id);
    setPresets(next);
    localStorage.setItem(PRESET_KEY, JSON.stringify(next));
  };

  const canvasPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width / rect.width,
      y: (event.clientY - rect.top) * canvas.height / rect.height,
    };
  };

  const sampleOriginalColor = (point) => {
    const sampler = document.createElement("canvas");
    sampler.width = 1;
    sampler.height = 1;
    const ctx = sampler.getContext("2d");
    ctx.drawImage(image, Math.max(0, Math.min(image.naturalWidth - 1, point.x)), Math.max(0, Math.min(image.naturalHeight - 1, point.y)), 1, 1, 0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  };

  const handleCanvasDown = (event) => {
    if (!image || section !== "erase" || eraseMode === "off") return;
    const point = canvasPoint(event);
    if (point.y > image.naturalHeight * config.topHeight / 100) return;
    event.preventDefault();
    if (eraseMode === "picker") {
      patch("eraseColor", sampleOriginalColor(point));
      setEraseMode("brush");
      return;
    }
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drawingRef.current = true;
    setEraseStrokes((strokes) => [...strokes, { color: config.eraseColor, size: config.eraseSize, points: [point] }]);
  };

  const handleCanvasMove = (event) => {
    if (!drawingRef.current || eraseMode !== "brush") return;
    const point = canvasPoint(event);
    point.y = Math.min(point.y, image.naturalHeight * config.topHeight / 100);
    setEraseStrokes((strokes) => strokes.map((stroke, i) => i === strokes.length - 1 ? { ...stroke, points: [...stroke.points, point] } : stroke));
  };

  const handleCanvasUp = () => {
    drawingRef.current = false;
  };

  const resetAll = () => {
    setConfig(JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
    setEraseStrokes([]);
    setEraseMode("off");
    setCustomIcons([]);
  };

  const item = (id) => getItem(config, id);
  const wifiStyleName = WIFI_STYLES.find((s) => s[0] === config.wifiStyle)?.[1] || "WiFi 1";
  const otherOn = ["headphone1", "vibrate1", "nfc1", "eyecare1", "alarm1", "alarm2", "alarm3", "alarm4", "alarm5", "bluetooth1", "bluetooth2", "bluetooth3", "bluetooth4", "mute1", "mute2", "speaker1", "gauge1", "nosim1", "speedIcon1", "speedIcon2", "speedIcon3", "speedIcon4", "dualsim1", "dualsim2", "dualsim3"].filter((id) => item(id).on).length;

  const simCard = (n) => {
    const network = n === 1 ? config.sim1Network : config.sim2Network;
    const bars = n === 1 ? config.sim1Bars : config.sim2Bars;
    return (
      <div className="sim-card">
        <span className="sim-badge">SIM {n}</span>
        <SelectField label="网络制式" value={network} options={NETWORK_OPTIONS} onChange={(v) => patch(n === 1 ? "sim1Network" : "sim2Network", v)} />
        <Range label="信号强度" value={bars} min={0} max={4} onChange={(v) => patch(n === 1 ? "sim1Bars" : "sim2Bars", v)} />
        <Toggle label={`SIM ${n} 显示 ? 问号`} checked={item(`sim${n}Question`).on} onChange={(v) => patchItem(`sim${n}Question`, { on: v })} />
      </div>
    );
  };

  return (
    <main className="app-shell">
      <header className="top-header">
        <div className="brand-mark"><IconLogo size={22} /></div>
        <div className="brand-copy"><h1>截图界面修改工具</h1><p>消除原图 · 状态栏 · 底部导航栏</p></div>
        <div className="privacy-pill"><span /> 图片仅在当前浏览器处理</div>
      </header>

      <section className="workspace">
        <nav className="rail">
          <span className="rail-title">编辑流程</span>
          {NAV_GROUPS.map((group) => (
            <div className="rail-group" key={group.id}>
              <span className="rail-group-title">{group.label}</span>
              {group.items.map(([id, label, number]) => (
                <button key={id} className={section === id ? "active" : ""} aria-current={section === id ? "page" : undefined} onClick={() => setSection(id)}>
                  <i>{number}</i>{label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <aside className="control-panel">
          <div className="upload-row">
            <div>
              <span className="eyebrow">01 · 上传截图</span>
              <strong>{fileName || "尚未选择图片"}</strong>
              <small>原图自适应 · {image ? sizeText : "等待上传"}</small>
            </div>
            <button type="button" className="secondary" onClick={() => fileRef.current?.click()}>{image ? "更换" : "上传"}</button>
            <input ref={fileRef} hidden type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" onClick={(e) => { e.currentTarget.value = ""; }} onChange={(e) => openFile(e.target.files?.[0])} />
          </div>

          <div className="device-row">
            <span className="device-badge">02</span>
            <div>
              <strong>设备类型（可选）</strong>
              <select value={config.deviceType} onChange={(e) => applyDevice(e.target.value)}>
                {DEVICE_PRESETS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <em>保留原图尺寸、比例、边角和全部画面</em>
            </div>
          </div>

          <div className="controls-scroll">
            {section === "upload" && <>
              <SectionTitle em="IMAGE">上传原图</SectionTitle>
              <button type="button" className="drop-card" onClick={() => fileRef.current?.click()}>
                <span className="drop-icon"><IconUpload size={20} /></span>
                <strong>选择截图文件</strong>
                <small>保留原始像素尺寸与完整画面，仅在预览区等比例缩小显示</small>
              </button>
            </>}

            {section === "device" && <>
              <SectionTitle em="DEVICE">设备样式</SectionTitle>
              <div className="device-grid">
                {DEVICE_PRESETS.map(([v, l, d]) => (
                  <button key={v} className={config.deviceType === v ? "selected" : ""} onClick={() => applyDevice(v)}>
                    <strong>{l}</strong><small>{d}</small>
                  </button>
                ))}
              </div>
              <p className="note-line">选择设备样式会一次性套用该品牌的信号、WiFi、电池与底部导航组合，之后仍可在各分区单独调整。</p>
            </>}

            {section === "erase" && <>
              <SectionTitle em="ERASER">原图消除工具</SectionTitle>
              <div className="erase-card">
                <div className="tool-buttons">
                  <button disabled={!image} className={eraseMode === "brush" ? "active" : ""} onClick={() => setEraseMode("brush")}>消除笔</button>
                  <button disabled={!image} className={eraseMode === "picker" ? "active" : ""} onClick={() => setEraseMode("picker")}>从原图取色</button>
                  <button className={eraseMode === "off" ? "active" : ""} onClick={() => setEraseMode("off")}>关闭</button>
                </div>
                <Range label="可消除区域高度" value={config.topHeight} min={3.5} max={12} step={0.1} suffix="%" onChange={(v) => patch("topHeight", v)} />
                <label className="color-field"><span>覆盖颜色</span><input type="color" value={config.eraseColor} onChange={(e) => patch("eraseColor", e.target.value)} /></label>
                <Range label="笔刷大小" value={config.eraseSize} min={6} max={70} suffix="px" onChange={(v) => patch("eraseSize", v)} />
                <div className="erase-actions">
                  <button disabled={!eraseStrokes.length} onClick={() => setEraseStrokes((s) => s.slice(0, -1))}>撤销上一笔</button>
                  <button disabled={!eraseStrokes.length} onClick={() => setEraseStrokes([])}>清空全部</button>
                </div>
                <p>消除笔只处理原始截图，不会擦除后来添加的状态栏图标。</p>
              </div>
            </>}

            {section === "topbg" && <>
              <SectionTitle em="TOP">区域与背景</SectionTitle>
              <Range label="覆盖高度" value={config.topHeight} min={3.5} max={12} step={0.1} suffix="%" onChange={(v) => patch("topHeight", v)} />
              <SelectField label="背景处理" value={config.topStyle} options={[["dark", "深色遮盖"], ["light", "浅色遮盖"], ["blur", "原图模糊"], ["custom", "自定义颜色"], ["manual", "保留原图，手动消除"]]} onChange={(v) => patch("topStyle", v)} />
              {config.topStyle === "custom" && <label className="color-field"><span>背景颜色</span><input type="color" value={config.topColor} onChange={(e) => patch("topColor", e.target.value)} /></label>}
              {config.topStyle !== "manual" && <Range label="背景强度" value={config.topOpacity} min={20} max={100} suffix="%" onChange={(v) => patch("topOpacity", v)} />}
            </>}

            {section === "time" && <>
              <SectionTitle em="TIME">时间</SectionTitle>
              <div className="field-pair">
                <label className="field"><span>显示时间</span><input value={config.time} maxLength={8} onChange={(e) => patch("time", e.target.value)} /></label>
                <SelectField label="时间位置" value={config.timePosition} options={[["left", "左侧"], ["center", "居中"], ["right", "右侧"]]} onChange={(v) => patch("timePosition", v)} />
              </div>
              {config.timePosition !== "center" && <Range label="边缘距离" value={config.timeX} min={2} max={25} suffix="%" onChange={(v) => patch("timeX", v)} />}
              <Range label="时间字体粗细" value={config.timeWeight} min={100} max={900} step={50} onChange={(v) => patch("timeWeight", v)} />
              <div className="field-pair">
                <Range label="时间字体大小" value={config.timeSize} min={60} max={160} step={5} suffix="%" onChange={(v) => patch("timeSize", v)} />
                <Range label="时间上下位置" value={config.timeOffsetY} min={-20} max={20} suffix="px" onChange={(v) => patch("timeOffsetY", v)} />
              </div>
              <Range label="时间、后缀、运营商间距" value={config.timeGap} min={0} max={12} step={0.5} suffix="px" onChange={(v) => patch("timeGap", v)} />
              <div className="field-pair">
                <label className="field"><span>12 小时后缀（手动输入）</span><input value={config.timeSuffix} placeholder="例如 p.m. / PM" maxLength={6} onChange={(e) => patch("timeSuffix", e.target.value)} /></label>
                <label className="field"><span>运营商名称</span><input value={config.carrier} placeholder="例如 China Mobile" maxLength={16} onChange={(e) => patch("carrier", e.target.value)} /></label>
              </div>
              <Toggle label="AM 时间后缀 · 自定义大小写" checked={config.showSuffix} onChange={(v) => patch("showSuffix", v)} />
              <Toggle label="运营商 · 自定义名称" checked={config.showCarrier} onChange={(v) => patch("showCarrier", v)} />
            </>}

            {section === "signal" && <>
              <SectionTitle em="SIGNAL">信号</SectionTitle>
              <div className="field-pair">
                <SelectField label="系统图标区域" value={config.iconSide} options={[["left", "左侧"], ["right", "右侧"]]} onChange={(v) => setConfig((c) => {
                  const items = { ...c.items };
                  for (const id of new Set([...Object.keys(items), ...Object.keys(DEFAULT_ITEMS)])) {
                    if (["notices"].includes(id)) continue;
                    items[id] = { ...(items[id] || DEFAULT_ITEMS[id] || OFF_ITEM), side: v };
                  }
                  return { ...c, iconSide: v, items };
                })} />
                <Range label="整体基础大小" value={config.iconScale} min={60} max={160} step={5} suffix="%" onChange={(v) => patch("iconScale", v)} />
              </div>
              <SelectField label="系统图标颜色" value={config.iconColor} options={[["#ffffff", "白色"], ["#000000", "黑色"]]} onChange={(v) => patch("iconColor", v)} />
              <div className="field-pair">
                <SelectField label="SIM 卡数量" value={config.simCount} options={[[1, "单卡"], [2, "双卡"]]} onChange={(v) => patch("simCount", Number(v))} />
                <SelectField label="信号图形" value={config.signalShape} options={SIGNAL_SHAPES} onChange={(v) => patch("signalShape", Number(v))} />
              </div>
              <SelectField label="Wi-Fi / SIM 排列" value={config.wifiSimOrder} options={[["wifiFirst", "Wi-Fi 在 SIM 前"], ["simFirst", "Wi-Fi 在 SIM 后"]]} onChange={(v) => patch("wifiSimOrder", v)} />
              <Range label="信号元素间距" value={config.signalBarGap} min={1} max={6} step={0.1} suffix="px" onChange={(v) => patch("signalBarGap", v)} />
              <div className="field-pair">
                <Range label="信号线条间距" value={config.signalLineGap} min={0.5} max={4} step={0.1} suffix="px" onChange={(v) => patch("signalLineGap", v)} />
                <Range label="信号线条粗细" value={config.signalLineWidth} min={1.5} max={6} step={0.1} suffix="px" onChange={(v) => patch("signalLineWidth", v)} />
              </div>
              <SelectField label="信号线条端点" value={config.signalCap} options={[["round", "圆角"], ["square", "直角"]]} onChange={(v) => patch("signalCap", v)} />
              <p className="note-line">信号图形已按示例图还原：10 种阶梯柱样式，点亮格数随 SIM 信号强度联动。</p>
              {simCard(1)}
              {config.simCount === 2 && simCard(2)}
              <div className="field-pair">
                <SelectField label="通话标志" value={config.callMark} options={[["none", "不显示"], ["VoLTE", "VoLTE"], ["HD", "HD"], ["Vo", "Vo"]]} onChange={(v) => patch("callMark", v)} />
                <label className="field"><span>网速 1 · 自定义文字</span><input value={config.speed1Text} placeholder="如 82.0 KB/S" maxLength={14} onChange={(e) => patch("speed1Text", e.target.value)} /></label>
              </div>
              <div className="field-pair">
                <label className="field"><span>网速 2 · 第一行</span><input value={config.speed2Line1} maxLength={10} onChange={(e) => patch("speed2Line1", e.target.value)} /></label>
                <label className="field"><span>网速 2 · 第二行</span><input value={config.speed2Line2} maxLength={10} onChange={(e) => patch("speed2Line2", e.target.value)} /></label>
              </div>
              <Toggle label="SIM 1 / 2 编号" checked={config.showSimNumber} onChange={(v) => patch("showSimNumber", v)} />
              <div className="item-list">
                <ItemCard badge={config.sim1Network === "隐藏" ? "5G" : config.sim1Network} title="SIM 1 · 网络制式" item={item("sim1Type")} onPatch={(p) => patchItem("sim1Type", p)} onReset={() => resetItem("sim1Type")} />
                <ItemCard badge="⇅" title="SIM 1 · 上下行箭头" item={item("sim1Arrow")} onPatch={(p) => patchItem("sim1Arrow", p)} onReset={() => resetItem("sim1Arrow")} />
                <ItemCard badge="▮" title="SIM 1 · 信号图形" item={item("sim1Bars")} onPatch={(p) => patchItem("sim1Bars", p)} onReset={() => resetItem("sim1Bars")} />
                <ItemCard badge="?" title="SIM 1 · 问号" item={item("sim1Question")} onPatch={(p) => patchItem("sim1Question", p)} onReset={() => resetItem("sim1Question")} />
                {config.simCount === 2 && <>
                  <ItemCard badge={config.sim2Network === "隐藏" ? "4G" : config.sim2Network} title="SIM 2 · 网络制式" item={item("sim2Type")} onPatch={(p) => patchItem("sim2Type", p)} onReset={() => resetItem("sim2Type")} />
                  <ItemCard badge="⇅" title="SIM 2 · 上下行箭头" item={item("sim2Arrow")} onPatch={(p) => patchItem("sim2Arrow", p)} onReset={() => resetItem("sim2Arrow")} />
                  <ItemCard badge="▮" title="SIM 2 · 信号图形" item={item("sim2Bars")} onPatch={(p) => patchItem("sim2Bars", p)} onReset={() => resetItem("sim2Bars")} />
                  <ItemCard badge="?" title="SIM 2 · 问号" item={item("sim2Question")} onPatch={(p) => patchItem("sim2Question", p)} onReset={() => resetItem("sim2Question")} />
                </>}
                <ItemCard badge="K/s" title="网速 1 · 自定义文字" item={item("speed1")} onPatch={(p) => patchItem("speed1", p)} onReset={() => resetItem("speed1")} />
                <ItemCard badge="HD" title="网络标志 1 · VoLTE / HD" item={item("mark1")} onPatch={(p) => patchItem("mark1", p)} onReset={() => resetItem("mark1")} />
                <ItemCard badge="KB/s" title={`网速 2 · ${config.speed2Line1 || "4.81"} ${config.speed2Line2 || "KB/s"} 双行`} item={item("speed2")} onPatch={(p) => patchItem("speed2", p)} onReset={() => resetItem("speed2")} />
                <ItemCard badge="▮" title="信号 6 · 四格宽柱" item={item("signal6")} onPatch={(p) => patchItem("signal6", p)} onReset={() => resetItem("signal6")} />
                <ItemCard badge="▮" title="信号 7 · 四格大柱" item={item("signal7")} onPatch={(p) => patchItem("signal7", p)} onReset={() => resetItem("signal7")} />
                <ItemCard badge="Vo" title="网络标志 2 · Vo / LTE 叠放" item={item("mark2")} onPatch={(p) => patchItem("mark2", p)} onReset={() => resetItem("mark2")} />
                <ItemCard badge="HD" title="网络标志 5 · HD 双卡 1/2" item={item("mark5")} onPatch={(p) => patchItem("mark5", p)} onReset={() => resetItem("mark5")} />
                <ItemCard badge="5G" title="网络标志 3 · 5G 文字" item={item("mark3")} onPatch={(p) => patchItem("mark3", p)} onReset={() => resetItem("mark3")} />
                <ItemCard badge="▮" title="信号 8 · 七格粗柱" item={item("signal8")} onPatch={(p) => patchItem("signal8", p)} onReset={() => resetItem("signal8")} />
                <ItemCard badge="4G" title="网络标志 4 · 4G 文字" item={item("mark4")} onPatch={(p) => patchItem("mark4", p)} onReset={() => resetItem("mark4")} />
              </div>
            </>}

            {section === "wifi" && <>
              <SectionTitle em="WI-FI">WiFi</SectionTitle>
              <SelectField label="WiFi 样式" value={config.wifiStyle} options={WIFI_STYLES} onChange={(v) => patch("wifiStyle", Number(v))} />
              <Range label="WiFi 信号强度（3 级）" value={config.wifiStrength} min={0} max={3} onChange={(v) => patch("wifiStrength", v)} />
              <Range label="WiFi 元素间距" value={config.wifiGap} min={1} max={6} step={0.1} suffix="px" onChange={(v) => patch("wifiGap", v)} />
              <div className="item-list">
                <ItemCard badge="◜" title={`WiFi · ${wifiStyleName}`} item={item("wifi")} onPatch={(p) => patchItem("wifi", p)} onReset={() => resetItem("wifi")} />
                <ItemCard badge="⇅" title="WiFi 箭头 1 · 独立上下行" item={item("wifiArrow1")} onPatch={(p) => patchItem("wifiArrow1", p)} onReset={() => resetItem("wifiArrow1")} />
              </div>
            </>}

            {section === "battery" && <>
              <SectionTitle em="BATTERY">电池</SectionTitle>
              <span className="field-label">电池类型与形状</span>
              <div className="battery-grid">
                {BATTERY_TYPES.map(([v, l, d]) => (
                  <button key={v} className={config.batteryType === v ? "selected" : ""} onClick={() => patch("batteryType", v)}>
                    <BatteryPreview type={v} />
                    <span><strong>{l}</strong><small>{d}</small></span>
                  </button>
                ))}
              </div>
              <p className="note-line">电池 11-16 是你提供的固定参考款，可在本页下方独立打开和混排。</p>
              <Range label="剩余电量" value={config.battery} min={1} max={100} suffix="%" onChange={(v) => patch("battery", v)} />
              <Range label="电池元素间距" value={config.batteryGap} min={1} max={6} step={0.1} suffix="px" onChange={(v) => patch("batteryGap", v)} />
              <div className="toggle-grid">
                <Toggle label="显示电量数字" checked={config.batteryNumber} onChange={(v) => patch("batteryNumber", v)} />
                <Toggle label="显示充电标志" checked={config.batteryCharging} onChange={(v) => patch("batteryCharging", v)} />
              </div>
              <SelectField label="电量数字排列" value={config.batteryNumberLayout} options={[["right", "电池在左，数字在右"], ["left", "数字在左，电池在右"], ["inside", "数字在电池内部"]]} onChange={(v) => patch("batteryNumberLayout", v)} />
              <SelectField label="电池内部颜色" value={config.batteryInnerColor} options={[["auto", "自动（低电量红色 / 中低电量黄色）"], ["green", "绿色"], ["icon", "跟随图标颜色"]]} onChange={(v) => patch("batteryInnerColor", v)} />
              <div className="item-list">
                <ItemCard badge="电" title={`电池 · 电池 ${config.batteryType}`} item={item("battery")} onPatch={(p) => patchItem("battery", p)} onReset={() => resetItem("battery")} />
                <ItemCard badge="叶" title="省电 1 · 叶片" item={item("powersave")} onPatch={(p) => patchItem("powersave", p)} onReset={() => resetItem("powersave")} />
                <ItemCard badge="51" title="电池 11 · 绿色 51 框内" item={item("batt11")} onPatch={(p) => patchItem("batt11", p)} onReset={() => resetItem("batt11")} />
                <ItemCard badge="30" title="电池 12 · 绿色 30 框内" item={item("batt12")} onPatch={(p) => patchItem("batt12", p)} onReset={() => resetItem("batt12")} />
                <ItemCard badge="闪" title="充电标志 1 · 外置闪电" item={item("chargeMark1")} onPatch={(p) => patchItem("chargeMark1", p)} onReset={() => resetItem("chargeMark1")} />
                <ItemCard badge="低" title="电池 13 · 红色低电量" item={item("batt13")} onPatch={(p) => patchItem("batt13", p)} onReset={() => resetItem("batt13")} />
                <ItemCard badge="75" title="电池 14 · 数字 75 胶囊" item={item("batt14")} onPatch={(p) => patchItem("batt14", p)} onReset={() => resetItem("batt14")} />
                <ItemCard badge="竖" title="电池 15 · 竖向实心" item={item("batt15")} onPatch={(p) => patchItem("batt15", p)} onReset={() => resetItem("batt15")} />
                <ItemCard badge="充" title="电池 16 · 竖向充电" item={item("batt16")} onPatch={(p) => patchItem("batt16", p)} onReset={() => resetItem("batt16")} />
              </div>
            </>}

            {section === "other" && <>
              <SectionTitle em="OTHER">其他系统图标</SectionTitle>
              <p className="note-line">这里只保留不属于时间、信号、WiFi 和电池的图标。关闭时仅显示名称与开关。</p>
              <Range label="其他图标默认间距" value={config.otherGap} min={1} max={6} step={0.1} suffix="px" onChange={(v) => patch("otherGap", v)} />
              <div className="item-list">
                <ItemCard badge="耳" title="耳机 1 · 标准" item={item("headphone1")} onPatch={(p) => patchItem("headphone1", p)} onReset={() => resetItem("headphone1")} />
                <ItemCard badge="振" title="振动 1 · 手机波纹" item={item("vibrate1")} onPatch={(p) => patchItem("vibrate1", p)} onReset={() => resetItem("vibrate1")} />
                <ItemCard badge="N" title="NFC 1 · 方框斜杠" item={item("nfc1")} onPatch={(p) => patchItem("nfc1", p)} onReset={() => resetItem("nfc1")} />
                <ItemCard badge="眼" title="护眼 1 · 实心掏空瞳孔" item={item("eyecare1")} onPatch={(p) => patchItem("eyecare1", p)} onReset={() => resetItem("eyecare1")} />
                <ItemCard badge="钟" title="闹钟 1 · 实心掏空指针" item={item("alarm1")} onPatch={(p) => patchItem("alarm1", p)} onReset={() => resetItem("alarm1")} />
                <ItemCard badge="钟" title="闹钟 2 · 实心短针" item={item("alarm2")} onPatch={(p) => patchItem("alarm2", p)} onReset={() => resetItem("alarm2")} />
                <ItemCard badge="钟" title="闹钟 3 · 空心指针" item={item("alarm3")} onPatch={(p) => patchItem("alarm3", p)} onReset={() => resetItem("alarm3")} />
                <ItemCard badge="钟" title="闹钟 4 · 实心单耳" item={item("alarm4")} onPatch={(p) => patchItem("alarm4", p)} onReset={() => resetItem("alarm4")} />
                <ItemCard badge="钟" title="闹钟 5 · 实心斜针" item={item("alarm5")} onPatch={(p) => patchItem("alarm5", p)} onReset={() => resetItem("alarm5")} />
                <ItemCard badge="蓝" title="蓝牙 1 · 标准" item={item("bluetooth1")} onPatch={(p) => patchItem("bluetooth1", p)} onReset={() => resetItem("bluetooth1")} />
                <ItemCard badge="蓝" title="蓝牙 2 · 带波纹" item={item("bluetooth2")} onPatch={(p) => patchItem("bluetooth2", p)} onReset={() => resetItem("bluetooth2")} />
                <ItemCard badge="蓝" title="蓝牙 3 · 细线" item={item("bluetooth3")} onPatch={(p) => patchItem("bluetooth3", p)} onReset={() => resetItem("bluetooth3")} />
                <ItemCard badge="蓝" title="蓝牙 4 · 带信号条" item={item("bluetooth4")} onPatch={(p) => patchItem("bluetooth4", p)} onReset={() => resetItem("bluetooth4")} />
                <ItemCard badge="静" title="静音 1 · 铃铛斜杠" item={item("mute1")} onPatch={(p) => patchItem("mute1", p)} onReset={() => resetItem("mute1")} />
                <ItemCard badge="静" title="静音 2 · 铃铛双杠" item={item("mute2")} onPatch={(p) => patchItem("mute2", p)} onReset={() => resetItem("mute2")} />
                <ItemCard badge="喇" title="静音 3 · 喇叭斜杠" item={item("speaker1")} onPatch={(p) => patchItem("speaker1", p)} onReset={() => resetItem("speaker1")} />
                <ItemCard badge="表" title="性能 1 · 仪表指针" item={item("gauge1")} onPatch={(p) => patchItem("gauge1", p)} onReset={() => resetItem("gauge1")} />
                <ItemCard badge="卡" title="无 SIM · 卡托感叹号" item={item("nosim1")} onPatch={(p) => patchItem("nosim1", p)} onReset={() => resetItem("nosim1")} />
                <ItemCard badge="速" title="网速 1 · 上/下箭头" item={item("speedIcon1")} onPatch={(p) => patchItem("speedIcon1", p)} onReset={() => resetItem("speedIcon1")} />
                <ItemCard badge="速" title="网速 2 · 紧凑箭头" item={item("speedIcon2")} onPatch={(p) => patchItem("speedIcon2", p)} onReset={() => resetItem("speedIcon2")} />
                <ItemCard badge="速" title="网速 3 · 带底线" item={item("speedIcon3")} onPatch={(p) => patchItem("speedIcon3", p)} onReset={() => resetItem("speedIcon3")} />
                <ItemCard badge="速" title="网速 4 · 带圆点" item={item("speedIcon4")} onPatch={(p) => patchItem("speedIcon4", p)} onReset={() => resetItem("speedIcon4")} />
                <ItemCard badge="卡" title="双卡 1 · SIM 带缺角" item={item("dualsim1")} onPatch={(p) => patchItem("dualsim1", p)} onReset={() => resetItem("dualsim1")} />
                <ItemCard badge="卡" title="双卡 2 · SIM 双线" item={item("dualsim2")} onPatch={(p) => patchItem("dualsim2", p)} onReset={() => resetItem("dualsim2")} />
                <ItemCard badge="卡" title="双卡 3 · 叠加双卡" item={item("dualsim3")} onPatch={(p) => patchItem("dualsim3", p)} onReset={() => resetItem("dualsim3")} />
              </div>
            </>}

            {section === "custom" && <>
              <SectionTitle em="最多 5 个">自定义通知图标</SectionTitle>
              <div className="item-list">
                {customIcons.map((ci, i) => (
                  <ItemCard key={ci.id} badge={<img src={ci.img.src} alt="" />} title={`自定义 ${i + 1} · ${ci.name}`} item={item(`custom${i + 1}`)} onPatch={(p) => patchItem(`custom${i + 1}`, p)} onReset={() => resetItem(`custom${i + 1}`)}>
                    <button className="upload-custom" onClick={() => removeCustomIcon(i)}>移除该图标</button>
                  </ItemCard>
                ))}
              </div>
              {customIcons.length < 5 && (
                <button className="add-custom" onClick={() => customIconRef.current?.click()}>+ 添加自定义图标</button>
              )}
              <input ref={customIconRef} hidden type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(e) => { addCustomIcons(e.target.files); e.target.value = ""; }} />
              <p className="note-line">支持一次选择多张图片。每个自定义图标都可以单独开关、调整大小和位置。</p>
              <SectionTitle em="内置">通知图标</SectionTitle>
              <ItemCard badge="✉" title="通知图标 · 内置品牌" item={item("notices")} onPatch={(p) => patchItem("notices", p)} onReset={() => resetItem("notices")}>
                <div className="notice-grid">
                  {NOTICE_OPTIONS.map(([value, label]) => {
                    const Glyph = NOTICE_ICONS[value];
                    return <button key={value} className={config.notificationIcons.includes(value) ? "selected" : ""} onClick={() => toggleNotice(value)}><span><Glyph size={13} /></span>{label}</button>;
                  })}
                </div>
              </ItemCard>
            </>}

            {section === "bottom" && <>
              <SectionTitle em="BOTTOM">导航栏样式</SectionTitle>
              <div className="style-grid">
                {[["gesture", "手势粗条"], ["gestureThin", "手势细线"], ["threeLeft", "三键 · 返回左"], ["threeRight", "三键 · 返回右"], ["samsung", "Samsung 三键"], ["vivo", "vivo OriginOS"], ["xiaomi", "小米 HyperOS"], ["huawei", "华为 HarmonyOS"], ["dock", "图标 Dock"], ["minimal", "简洁图标"]].map(([v, l]) => (
                  <button key={v} className={config.bottomStyle === v ? "selected" : ""} onClick={() => setBottomPreset(v)}><NavPreview variant={v} />{l}</button>
                ))}
              </div>
              <Range label="覆盖高度" value={config.bottomHeight} min={3} max={20} step={0.1} suffix="%" onChange={(v) => patch("bottomHeight", v)} />
              <Range label="导航图标大小" value={config.navIconScale} min={60} max={160} step={5} suffix="%" onChange={(v) => patch("navIconScale", v)} />
              <SelectField label="背景处理" value={config.bottomCover} options={[["dark", "深色遮盖"], ["light", "浅色遮盖"], ["blur", "原图模糊"], ["custom", "自定义颜色"]]} onChange={(v) => patch("bottomCover", v)} />
              {config.bottomCover === "custom" && <label className="color-field"><span>背景颜色</span><input type="color" value={config.bottomColor} onChange={(e) => patch("bottomColor", e.target.value)} /></label>}
              <Range label="背景强度" value={config.bottomOpacity} min={20} max={100} suffix="%" onChange={(v) => patch("bottomOpacity", v)} />
              <label className="color-field"><span>图标颜色</span><input type="color" value={config.bottomIconColor} onChange={(e) => patch("bottomIconColor", e.target.value)} /></label>
              {(config.bottomStyle === "dock" || config.bottomStyle === "minimal") && <>
                <SectionTitle em="ICONS">图标设置</SectionTitle>
                <Range label="图标数量" value={config.navCount} min={3} max={5} onChange={(v) => patch("navCount", v)} />
                <div className="icon-selects">
                  {Array.from({ length: config.navCount }).map((_, i) => (
                    <div className="icon-slot" key={i}>
                      <span>图标 {i + 1}</span>
                      <div className="icon-slot-buttons">
                        {ICON_OPTIONS.map(([value]) => {
                          const Glyph = NAV_ICONS[value];
                          return <button key={value} className={config.navIcons[i] === value ? "selected" : ""} title={ICON_OPTIONS.find((o) => o[0] === value)[1]} onClick={() => patch("navIcons", config.navIcons.map((x, j) => j === i ? value : x))}><Glyph size={15} /></button>;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>}
            </>}

            {section === "presets" && <>
              <SectionTitle em="最多 12 个">保存与应用方案</SectionTitle>
              <div className="preset-card">
                <label className="field"><span>方案名称</span><input value={presetName} placeholder="例如：双卡白色状态栏" maxLength={20} onChange={(e) => setPresetName(e.target.value)} /></label>
                <button className="primary preset-save" onClick={savePreset}>保存当前方案</button>
                <p>保存设备类型、状态栏、系统图标、自定义图标和底部导航。图片与消除笔痕迹不会写入方案。</p>
              </div>
              <div className="preset-list">
                {presets.length === 0 && <p className="note-line">还没有保存的方案。调整好参数后在这里命名保存，下次一键套用。</p>}
                {presets.map((p) => (
                  <div className="preset-row" key={p.id}>
                    <div><strong>{p.name}</strong><small>{p.savedAt}</small></div>
                    <div className="preset-actions">
                      <button className="secondary" onClick={() => applyPreset(p)}>应用方案</button>
                      <button className="danger" onClick={() => deletePreset(p.id)}>删除</button>
                    </div>
                  </div>
                ))}
              </div>
            </>}
          </div>

          <div className="panel-actions">
            <button className="ghost" onClick={resetAll}>恢复默认</button>
            <button className="primary" disabled={!image} onClick={() => download("png")}>导出 PNG</button>
            <button className="more" disabled={!image} title="导出 JPG" onClick={() => download("jpg")}>JPG</button>
          </div>
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <div><span className="status-dot" />实时预览 <small>原图自适应 · {image ? sizeText : "等待上传"}</small></div>
            <button disabled={!image} onPointerDown={() => setOriginalOnly(true)} onPointerUp={() => setOriginalOnly(false)} onPointerLeave={() => setOriginalOnly(false)}>按住查看原图</button>
          </div>
          <div className={`canvas-stage ${dragging ? "dragging" : ""}`} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); openFile(e.dataTransfer.files?.[0]); }}>
            {!image && <button className="drop-zone" onClick={() => fileRef.current?.click()}>
              <span className="upload-icon"><IconUpload size={26} /></span>
              <strong>上传手机截图</strong>
              <small>点击选择，或将 PNG / JPG 拖到这里</small>
              <em>保持原图尺寸与完整内容 · 图片不会上传到服务器</em>
            </button>}
            <div className={`canvas-wrap ${image ? "visible" : ""}`}>
              <canvas ref={canvasRef} className={eraseMode !== "off" && section === "erase" ? "editing" : ""} onPointerDown={handleCanvasDown} onPointerMove={handleCanvasMove} onPointerUp={handleCanvasUp} onPointerCancel={handleCanvasUp} />
              {image && !originalOnly && <>
                <div className={`guide top ${!["bottom", "upload", "device", "presets"].includes(section) ? "active" : ""}`} style={{ height: `${config.topHeight}%` }}><span>顶部编辑区</span></div>
                <div className={`guide bottom ${section === "bottom" ? "active" : ""}`} style={{ height: `${config.bottomHeight}%` }}><span>底部编辑区</span></div>
              </>}
            </div>
          </div>
          <div className="preview-foot"><span>导出时不会包含虚线编辑框</span><span>原始像素 1:1 保留</span></div>
        </section>
      </section>
    </main>
  );
}
