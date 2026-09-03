"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_ICON_ADJUSTMENTS = {
  headphones: { scale: 100, x: 0, y: 0 },
  vibrate: { scale: 100, x: 0, y: 0 },
  nfc: { scale: 100, x: 0, y: 0 },
  alarm: { scale: 100, x: 0, y: 0 },
  bluetooth: { scale: 100, x: 0, y: 0 },
  silent: { scale: 100, x: 0, y: 0 },
  dataSpeed: { scale: 100, x: 0, y: 0 },
  voiceIndicator: { scale: 100, x: 0, y: 0 },
  wifi: { scale: 100, x: 0, y: 0 },
  wifiArrows: { scale: 100, x: 0, y: 0 },
  sim1Network: { scale: 100, x: 0, y: 0 },
  sim1Arrows: { scale: 100, x: 0, y: 0 },
  sim1Signal: { scale: 100, x: 0, y: 0 },
  sim2Network: { scale: 100, x: 0, y: 0 },
  sim2Arrows: { scale: 100, x: 0, y: 0 },
  sim2Signal: { scale: 100, x: 0, y: 0 },
  batteryIcon: { scale: 100, x: 0, y: 0 },
  batteryPercent: { scale: 100, x: 0, y: 0 },
  powerSave: { scale: 100, x: 0, y: 0 },
};

const DEFAULT_CONFIG = {
  topHeight: 5.2,
  topStyle: "dark",
  topColor: "#0b0d12",
  topOpacity: 72,
  iconColor: "#ffffff",
  iconScale: 100,
  iconGap: 3.2,
  iconPosition: "right",
  iconAdjustments: DEFAULT_ICON_ADJUSTMENTS,
  time: "16:01",
  timePosition: "left",
  timeX: 7,
  network: "5G",
  networkStyle: "standard",
  signalBars: 4,
  simMode: "single",
  sim1Network: "5G",
  sim1Signal: 4,
  sim2Network: "5G",
  sim2Signal: 3,
  showSim1Network: true,
  showSim1Signal: true,
  showSim1Arrows: true,
  showSim2Network: true,
  showSim2Signal: true,
  showSim2Arrows: true,
  showSimNumbers: false,
  signalStyle: "bars",
  voiceIndicator: "none",
  alarm: false,
  dataSpeed: "",
  showDataSpeed: true,
  nfc: false,
  bluetooth: false,
  silent: false,
  vibrate: false,
  headphones: false,
  networkArrows: true,
  wifi: true,
  wifiStrength: 3,
  wifiStyle: "android",
  wifiArrows: true,
  connectivityOrder: "wifi-first",
  battery: 87,
  showBatteryIcon: true,
  batteryNumber: true,
  batteryStyle: "inside",
  powerSave: false,
  notificationIcons: [],
  eraseColor: "#111317",
  eraseSize: 24,
  bottomHeight: 6.2,
  bottomStyle: "gesture",
  bottomCover: "dark",
  bottomColor: "#101319",
  bottomOpacity: 64,
  bottomIconColor: "#ffffff",
  bottomIconScale: 100,
  navCount: 4,
  navIcons: ["home", "search", "plus", "user", "chat"],
};

const ICON_OPTIONS = [
  ["home", "首页"], ["search", "搜索"], ["plus", "添加"], ["user", "我的"],
  ["chat", "消息"], ["phone", "电话"], ["camera", "相机"], ["heart", "收藏"],
];

const PHONE_MODEL_GROUPS = [
  {
    brand: "Google Pixel",
    models: [
      { id: "pixel-10-pro-xl", name: "Google Pixel 10 Pro XL", width: 1344, height: 2992 },
      { id: "pixel-10-pro", name: "Google Pixel 10 Pro", width: 1280, height: 2856 },
      { id: "pixel-10", name: "Google Pixel 10", width: 1080, height: 2424 },
      { id: "pixel-10a", name: "Google Pixel 10a", width: 1080, height: 2424 },
      { id: "pixel-9-pro-xl", name: "Google Pixel 9 Pro XL", width: 1344, height: 2992 },
      { id: "pixel-9-pro", name: "Google Pixel 9 Pro", width: 1280, height: 2856 },
      { id: "pixel-9", name: "Google Pixel 9", width: 1080, height: 2424 },
      { id: "pixel-9a", name: "Google Pixel 9a", width: 1080, height: 2424 },
      { id: "pixel-8a", name: "Google Pixel 8a", width: 1080, height: 2400 },
    ],
  },
  {
    brand: "Samsung Galaxy",
    models: [
      { id: "samsung-s25-ultra", name: "Samsung Galaxy S25 Ultra", width: 1440, height: 3120 },
      { id: "samsung-s25-plus", name: "Samsung Galaxy S25+", width: 1440, height: 3120 },
      { id: "samsung-s25", name: "Samsung Galaxy S25", width: 1080, height: 2340 },
      { id: "samsung-s25-fe", name: "Samsung Galaxy S25 FE", width: 1080, height: 2340 },
      { id: "samsung-a56", name: "Samsung Galaxy A56 5G", width: 1080, height: 2340 },
      { id: "samsung-a36", name: "Samsung Galaxy A36 5G", width: 1080, height: 2340 },
      { id: "samsung-a26", name: "Samsung Galaxy A26 5G", width: 1080, height: 2340 },
      { id: "samsung-a16", name: "Samsung Galaxy A16", width: 1080, height: 2340 },
      { id: "samsung-s24-ultra", name: "Samsung Galaxy S24 Ultra", width: 1440, height: 3120 },
      { id: "samsung-s24-plus", name: "Samsung Galaxy S24+", width: 1440, height: 3120 },
      { id: "samsung-s24", name: "Samsung Galaxy S24", width: 1080, height: 2340 },
    ],
  },
  {
    brand: "Motorola",
    models: [
      { id: "motorola-edge-60-pro", name: "Motorola Edge 60 Pro", width: 1220, height: 2712 },
      { id: "motorola-edge-60-fusion", name: "Motorola Edge 60 Fusion", width: 1220, height: 2712 },
      { id: "motorola-edge-50-pro", name: "Motorola Edge 50 Pro", width: 1220, height: 2712 },
      { id: "motorola-edge-50-fusion", name: "Motorola Edge 50 Fusion", width: 1080, height: 2400 },
      { id: "motorola-moto-g85", name: "Motorola Moto G85 5G", width: 1080, height: 2400 },
      { id: "motorola-moto-g75", name: "Motorola Moto G75 5G", width: 1080, height: 2388 },
      { id: "motorola-moto-g55", name: "Motorola Moto G55 5G", width: 1080, height: 2400 },
      { id: "motorola-moto-g35", name: "Motorola Moto G35 5G", width: 1080, height: 2400 },
    ],
  },
  {
    brand: "Xiaomi / Redmi / POCO",
    models: [
      { id: "redmi-note-14-pro-plus-5g", name: "Redmi Note 14 Pro+ 5G", width: 1220, height: 2712 },
      { id: "redmi-note-14-pro-5g", name: "Redmi Note 14 Pro 5G", width: 1220, height: 2712 },
      { id: "redmi-note-14-5g", name: "Redmi Note 14 5G", width: 1080, height: 2400 },
      { id: "redmi-note-14", name: "Redmi Note 14", width: 1080, height: 2400 },
      { id: "redmi-14c", name: "Redmi 14C", width: 720, height: 1640 },
      { id: "redmi-note-13-pro-plus-5g", name: "Redmi Note 13 Pro+ 5G", width: 1220, height: 2712 },
      { id: "redmi-note-13-pro-5g", name: "Redmi Note 13 Pro 5G", width: 1220, height: 2712 },
      { id: "redmi-note-13-5g", name: "Redmi Note 13 5G", width: 1080, height: 2400 },
      { id: "xiaomi-14t-pro", name: "Xiaomi 14T Pro", width: 1220, height: 2712 },
      { id: "xiaomi-14t", name: "Xiaomi 14T", width: 1220, height: 2712 },
      { id: "poco-x7-pro", name: "POCO X7 Pro 5G", width: 1220, height: 2712 },
      { id: "poco-x7", name: "POCO X7 5G", width: 1220, height: 2712 },
    ],
  },
  {
    brand: "参考截图比例",
    models: [
      { id: "reference-01", name: "参考截图 01", width: 930, height: 2048 },
      { id: "reference-02", name: "参考截图 02", width: 951, height: 2048 },
      { id: "reference-03", name: "参考截图 03", width: 917, height: 2048 },
      { id: "reference-04", name: "参考截图 04", width: 930, height: 2048 },
      { id: "reference-05", name: "参考截图 05", width: 985, height: 2048 },
      { id: "reference-06", name: "参考截图 06", width: 929, height: 2048 },
      { id: "reference-07", name: "参考截图 07", width: 931, height: 2048 },
      { id: "reference-08", name: "参考截图 08", width: 931, height: 2048 },
      { id: "reference-09", name: "参考截图 09", width: 931, height: 2048 },
      { id: "reference-10", name: "参考截图 10", width: 837, height: 2048 },
      { id: "reference-11", name: "参考截图 11", width: 576, height: 1280 },
    ],
  },
];

const NETWORK_OPTIONS = ["5G+", "5G", "4G+", "4G", "LTE", "H+", "3G", "E"];

const PANEL_NAV_ITEMS = [
  { id: "model", number: "01", label: "手机型号" },
  { id: "upload", number: "02", label: "上传截图" },
  { id: "erase-tool", number: "03", label: "消除笔", tab: "erase" },
  { id: "top-area", number: "04", label: "状态栏背景", tab: "top" },
  { id: "top-time", number: "05", label: "时间", tab: "top" },
  { id: "top-status", number: "06", label: "网络信号", tab: "top" },
  { id: "top-system", number: "07", label: "Wi-Fi / 电池", tab: "top" },
  { id: "top-components", number: "08", label: "单个图标", tab: "top" },
  { id: "top-custom", number: "09", label: "自定义图标", tab: "top" },
  { id: "bottom-style", number: "10", label: "底部导航", tab: "bottom" },
];

const PHONE_MODELS = PHONE_MODEL_GROUPS.flatMap((group) =>
  group.models.map((model) => ({ ...model, brand: group.brand })),
);

function phoneRatio(model) {
  return `${(model.height / model.width * 9).toFixed(2)}:9`;
}

function phoneSpec(model) {
  return `真实屏幕 ${model.width} × ${model.height}px · ${phoneRatio(model)}`;
}

function fitImageToPhone(source, model) {
  const canvas = document.createElement("canvas");
  canvas.width = model.width;
  canvas.height = model.height;
  const ctx = canvas.getContext("2d", { alpha: false });
  const targetRatio = model.width / model.height;
  const sourceRatio = source.naturalWidth / source.naturalHeight;
  let baseWidth = source.naturalWidth;
  let baseHeight = source.naturalHeight;
  if (sourceRatio > targetRatio) {
    baseWidth = source.naturalHeight * targetRatio;
  } else if (sourceRatio < targetRatio) {
    baseHeight = source.naturalWidth / targetRatio;
  }
  const sx = Math.max(0, (source.naturalWidth - baseWidth) / 2);
  const sy = Math.max(0, (source.naturalHeight - baseHeight) / 2);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, sx, sy, baseWidth, baseHeight, 0, 0, model.width, model.height);
  return canvas.toDataURL("image/png");
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

function drawSignal(ctx, x, cy, scale, bars, color) {
  ctx.fillStyle = color;
  const bw = 2.15 * scale;
  const gap = 1.35 * scale;
  for (let i = 0; i < 4; i += 1) {
    const bh = (3.3 + i * 2.25) * scale;
    ctx.globalAlpha = i < bars ? 1 : 0.28;
    roundedRect(ctx, x + i * (bw + gap), cy + 5 * scale - bh, bw, bh, 0.8 * scale);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawTrafficArrows(ctx, x, y, scale, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = .72;
  ctx.beginPath();
  ctx.moveTo(x, y + 2.2 * scale);
  ctx.lineTo(x + 2.1 * scale, y - 1.1 * scale);
  ctx.lineTo(x + 4.2 * scale, y + 2.2 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 5.2 * scale, y - 2.2 * scale);
  ctx.lineTo(x + 7.3 * scale, y + 1.1 * scale);
  ctx.lineTo(x + 9.4 * scale, y - 2.2 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function signalGraphicWidth(style, scale) {
  return (style === "triangle" ? 20 : style === "lines" ? 22 : style === "dots" ? 21 : 20) * scale;
}

function drawStatusSignal(ctx, x, cy, scale, level, color, style = "bars") {
  const strength = Math.max(0, Math.min(4, Number(level) || 0));
  const baseY = cy + 7.2 * scale;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (style === "triangle") {
    const width = 19 * scale;
    const height = 15 * scale;
    ctx.globalAlpha = .2;
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x + width, baseY - height);
    ctx.lineTo(x + width, baseY);
    ctx.closePath();
    ctx.fill();
    if (strength > 0) {
      const ratio = strength / 4;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(x, baseY);
      ctx.lineTo(x + width * ratio, baseY - height * ratio);
      ctx.lineTo(x + width * ratio, baseY);
      ctx.closePath();
      ctx.fill();
    }
  } else if (style === "lines") {
    ctx.lineWidth = 2.05 * scale;
    for (let i = 0; i < 5; i += 1) {
      const height = (3.5 + i * 2.8) * scale;
      ctx.globalAlpha = i < Math.ceil(strength * 1.25) ? 1 : .2;
      ctx.beginPath();
      ctx.moveTo(x + (1.4 + i * 4) * scale, baseY);
      ctx.lineTo(x + (1.4 + i * 4) * scale, baseY - height);
      ctx.stroke();
    }
  } else if (style === "dots") {
    for (let i = 0; i < 5; i += 1) {
      ctx.globalAlpha = i < Math.ceil(strength * 1.25) ? 1 : .2;
      ctx.beginPath();
      ctx.arc(x + (2 + i * 4) * scale, baseY - (2 + i * 2.7) * scale, 1.8 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    const rounded = style === "iphone";
    for (let i = 0; i < 4; i += 1) {
      const height = (4.2 + i * 3.6) * scale;
      ctx.globalAlpha = i < strength ? 1 : .2;
      roundedRect(ctx, x + i * 5 * scale, baseY - height, 3.4 * scale, height, rounded ? 1.5 * scale : .55 * scale);
      ctx.fill();
    }
  }
  ctx.restore();
}

function simClusterWidth(network, style, showNumber, scale) {
  if (network === "隐藏") return signalGraphicWidth(style, scale);
  const labelWidth = network.length >= 3 ? 15 : 12;
  return (labelWidth + 1) * scale + signalGraphicWidth(style, scale) + (showNumber ? 1.5 * scale : 0);
}

function drawSimCluster(ctx, x, cy, scale, network, level, color, style, simNumber, showArrows = true) {
  if (network === "隐藏") {
    drawStatusSignal(ctx, x, cy, scale, level, color, style);
    return;
  }
  const labelWidth = (network.length >= 3 ? 15 : 12) * scale;
  ctx.save();
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = `800 ${(network.length >= 3 ? 6.4 : 7.3) * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText(network, x + labelWidth / 2, cy - 4.9 * scale);
  if (simNumber) {
    ctx.font = `800 ${3.8 * scale}px system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(String(simNumber), x + labelWidth - 1.2 * scale, cy - 8.5 * scale);
  }
  ctx.restore();
  if (showArrows) drawTrafficArrows(ctx, x + (labelWidth - 9.4 * scale) / 2, cy + 4.8 * scale, scale * .72, color);
  drawStatusSignal(ctx, x + labelWidth + 1.2 * scale, cy, scale, level, color, style);
}

function simNetworkWidth(network, showNumber, scale) {
  if (network === "隐藏") return 0;
  return ((network.length >= 3 ? 15 : 12) + (showNumber ? 1.5 : 0)) * scale;
}

function drawSimNetwork(ctx, x, cy, scale, network, color, simNumber) {
  if (network === "隐藏") return;
  const labelWidth = (network.length >= 3 ? 15 : 12) * scale;
  ctx.save();
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = `800 ${(network.length >= 3 ? 6.4 : 7.3) * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText(network, x + labelWidth / 2, cy);
  if (simNumber) {
    ctx.font = `800 ${3.8 * scale}px system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(String(simNumber), x + labelWidth - 1.2 * scale, cy - 5.2 * scale);
  }
  ctx.restore();
}

function trafficArrowWidth(scale) {
  return 11 * scale;
}

function drawStandaloneTrafficArrows(ctx, x, cy, scale, color) {
  drawTrafficArrows(ctx, x, cy, scale, color);
}

function wifiGraphicWidth(style, scale) {
  return (style === "compact" ? 22 : style === "iphone" ? 25 : 30) * scale;
}

function drawStatusWifi(ctx, x, cy, scale, color, strength, style, showArrows = true) {
  const paths = {
    0: "M10.6 18.4 12 19.8l1.4-1.4a2 2 0 0 0-2.8 0Z",
    1: "M8.5 16.3 12 19.8l3.5-3.5a5 5 0 0 0-7 0Z",
    2: "M4.9 12.7 7 14.8a7.1 7.1 0 0 1 10 0l2.1-2.1a10 10 0 0 0-14.2 0Zm3.6 3.6 3.5 3.5 3.5-3.5a5 5 0 0 0-7 0Z",
    3: "M1 9l2 2a12.72 12.72 0 0 1 18 0l2-2A15.55 15.55 0 0 0 1 9Zm3.9 3.7L7 14.8a7.1 7.1 0 0 1 10 0l2.1-2.1a10 10 0 0 0-14.2 0Zm3.6 3.6 3.5 3.5 3.5-3.5a5 5 0 0 0-7 0Z",
  };
  const safeStrength = Math.max(0, Math.min(3, Number(strength) || 0));
  const compact = style === "compact";
  const iconSize = compact ? 20 : style === "iphone" ? 23 : 24;
  const iconScale = iconSize * scale / 24;
  const iconOffset = style === "wifi6" ? 3.2 * scale : 0;
  ctx.save();
  ctx.fillStyle = color;
  ctx.translate(x + iconOffset, cy - 12 * iconScale);
  ctx.scale(iconScale, iconScale);
  ctx.fill(new Path2D(paths[safeStrength]));
  ctx.restore();
  if (style === "wifi6") {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `850 ${4.7 * scale}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("6", x + 3.1 * scale, cy + 5.5 * scale);
    ctx.restore();
  } else if (style === "wifi-plus") {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.35 * scale;
    ctx.beginPath();
    ctx.moveTo(x + 25 * scale, cy - 7.2 * scale); ctx.lineTo(x + 25 * scale, cy - 2.2 * scale);
    ctx.moveTo(x + 22.5 * scale, cy - 4.7 * scale); ctx.lineTo(x + 27.5 * scale, cy - 4.7 * scale);
    ctx.stroke();
    ctx.restore();
  }
  if (showArrows && style !== "iphone") drawTrafficArrows(ctx, x + (compact ? 12 : 18.5) * scale, cy + 7.5 * scale, scale * .62, color);
}

function batteryGraphicWidth(style, showNumber, scale, powerSave = false) {
  if (style === "percent") return 34 * scale;
  if (style === "vertical") return (showNumber ? 48 : 15) * scale;
  if (style === "external") return (showNumber ? 59 : 36) * scale;
  if (powerSave && showNumber) return 59 * scale;
  return 38 * scale;
}

function drawBatteryLeaf(ctx, centerX, cy, scale, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.moveTo(centerX - 6 * scale, cy + 3.5 * scale);
  ctx.bezierCurveTo(centerX - 5 * scale, cy - 5.5 * scale, centerX + 6 * scale, cy - 6 * scale, centerX + 7 * scale, cy - 6 * scale);
  ctx.bezierCurveTo(centerX + 6 * scale, cy + 2.5 * scale, centerX, cy + 6 * scale, centerX - 6 * scale, cy + 3.5 * scale);
  ctx.fill();
  ctx.strokeStyle = color === "#ffffff" ? "#111318" : "#ffffff";
  ctx.beginPath();
  ctx.moveTo(centerX - 3.5 * scale, cy + 3 * scale); ctx.lineTo(centerX + 4.5 * scale, cy - 3.7 * scale);
  ctx.stroke();
  ctx.restore();
}

function drawStatusBattery(ctx, x, cy, scale, value, color, showNumber, style, powerSave) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  const chargeColor = safe <= 20 ? "#ef3948" : color;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.textBaseline = "middle";
  if (style === "percent") {
    ctx.font = `650 ${13.5 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(`${safe}%`, x, cy + .2 * scale);
    ctx.restore();
    return;
  }
  if (style === "vertical") {
    const bw = 10 * scale;
    const bh = 17 * scale;
    ctx.lineWidth = 1.35 * scale;
    roundedRect(ctx, x, cy - bh / 2, bw, bh, 1.35 * scale);
    ctx.stroke();
    roundedRect(ctx, x + 2.8 * scale, cy - bh / 2 - 2.5 * scale, 4.4 * scale, 2.3 * scale, .5 * scale);
    ctx.fill();
    const fillH = Math.max(1.3 * scale, (bh - 3.6 * scale) * safe / 100);
    ctx.fillStyle = chargeColor;
    roundedRect(ctx, x + 1.8 * scale, cy + bh / 2 - 1.8 * scale - fillH, bw - 3.6 * scale, fillH, .65 * scale);
    ctx.fill();
    if (showNumber) {
      ctx.fillStyle = color;
      ctx.font = `650 ${13.5 * scale}px system-ui, sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText(`${safe}%`, x + 15 * scale, cy + .2 * scale);
    }
    ctx.restore();
    return;
  }

  const bw = 32 * scale;
  const bh = 16 * scale;
  ctx.lineWidth = 1.45 * scale;
  roundedRect(ctx, x, cy - bh / 2, bw, bh, 3.8 * scale);
  ctx.stroke();
  roundedRect(ctx, x + bw + 1.3 * scale, cy - 3.2 * scale, 2.2 * scale, 6.4 * scale, .8 * scale);
  ctx.fill();

  if (powerSave) {
    drawBatteryLeaf(ctx, x + bw / 2, cy, scale, color);
  } else if (style === "inside" && showNumber) {
    ctx.fillStyle = color;
    ctx.font = `700 ${10.5 * scale}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(String(safe), x + bw / 2, cy + .4 * scale);
  } else {
    const fillW = Math.max(1.8 * scale, (bw - 4 * scale) * safe / 100);
    ctx.fillStyle = chargeColor;
    roundedRect(ctx, x + 2 * scale, cy - bh / 2 + 2 * scale, fillW, bh - 4 * scale, 2 * scale);
    ctx.fill();
  }

  if ((style === "external" && showNumber) || (powerSave && showNumber)) {
    ctx.fillStyle = color;
    ctx.font = `650 ${13.5 * scale}px system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(`${safe}%`, x + 39 * scale, cy + .3 * scale);
  }
  ctx.restore();
}

function drawStandaloneBattery(ctx, x, cy, scale, value, color, style) {
  const shellStyle = style === "percent" ? "solid" : style;
  drawStatusBattery(ctx, x, cy, scale, value, color, false, shellStyle, false);
}

function batteryShellWidth(style, scale) {
  return batteryGraphicWidth(style === "percent" ? "solid" : style, false, scale, false);
}

function batteryPercentWidth(scale) {
  return 35 * scale;
}

function drawBatteryPercent(ctx, x, cy, scale, value, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `650 ${13.5 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(`${Math.max(0, Math.min(100, Number(value) || 0))}%`, x, cy + .2 * scale);
  ctx.restore();
}

function systemIconWidth(type, scale) {
  return (type === "vibrate" ? 18 : type === "headphones" ? 19 : 17) * scale;
}

const SYSTEM_PATHS = {
  alarm: "M22 5.72 17.4 1.86l-.65.76 4.6 3.86.65-.76ZM7.24 2.62 6.6 1.86 2 5.71l.65.77 4.59-3.86ZM12 4a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm0 16a7 7 0 1 1 7-7 7 7 0 0 1-7 7Zm.5-12H11v6l4.75 2.85.75-1.23-4-2.37V8Z",
  bluetooth: "M17.71 7.71 12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71L13.41 12l4.3-4.29ZM13 5.83l1.88 1.88L13 9.59V5.83Zm1.88 10.46L13 18.17v-3.76l1.88 1.88Z",
  silent: "M4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73L19.73 21 21 19.73 12 10.73 4.27 3ZM12 4 9.91 6.09 12 8.18V4Zm4.5 8c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71 0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77Z",
  vibrate: "M0 15h2V9H0v6Zm3 2h2V7H3v10Zm19-8v6h2V9h-2Zm-3 8h2V7h-2v10ZM16.5 3h-9A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 16.5 3ZM16 19H8V5h8v14Z",
  headphones: "M12 1a9 9 0 0 0-9 9v7a3 3 0 0 0 3 3h3v-8H5v-2a7 7 0 0 1 14 0v2h-4v8h3a3 3 0 0 0 3-3v-7a9 9 0 0 0-9-9Z",
  nfc: "M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm1 3v14h14V5H5Zm2 2h3l4 6V7h3v10h-3l-4-6v6H7V7Z",
};

function drawSystemPath(ctx, path, x, cy, scale, color, width = 16) {
  const iconScale = width * scale / 24;
  ctx.save();
  ctx.translate(x, cy - 12 * iconScale);
  ctx.scale(iconScale, iconScale);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(path));
  ctx.restore();
}

function drawSmallSystemIcon(ctx, type, x, cy, scale, color) {
  const path = SYSTEM_PATHS[type] || SYSTEM_PATHS.nfc;
  const width = type === "headphones" ? 18 : type === "vibrate" ? 17 : 16;
  drawSystemPath(ctx, path, x, cy, scale, color, width);
}

function voiceIndicatorWidth(value, scale) {
  return value === "none" ? 0 : (value === "volte-stack" ? 20 : value === "volte" ? 31 : 25) * scale;
}

function drawVoiceIndicator(ctx, value, x, cy, scale, color) {
  if (value === "none") return;
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (value === "volte-stack") {
    ctx.font = `800 ${7.2 * scale}px system-ui, sans-serif`;
    ctx.fillText("Vo", x + 9 * scale, cy - 4.2 * scale);
    ctx.fillText("LTE", x + 9 * scale, cy + 4.1 * scale);
  } else if (value === "volte") {
    ctx.lineWidth = 1.15 * scale;
    roundedRect(ctx, x, cy - 7 * scale, 29 * scale, 14 * scale, 2.2 * scale);
    ctx.stroke();
    ctx.font = `800 ${7.1 * scale}px system-ui, sans-serif`;
    ctx.fillText("VoLTE", x + 14.5 * scale, cy + .2 * scale);
  } else {
    ctx.lineWidth = 1.15 * scale;
    roundedRect(ctx, x, cy - 7 * scale, 23 * scale, 14 * scale, 2.1 * scale);
    ctx.stroke();
    ctx.font = `850 ${8.4 * scale}px system-ui, sans-serif`;
    ctx.fillText("HD", x + 9.3 * scale, cy + .2 * scale);
    ctx.font = `800 ${4 * scale}px system-ui, sans-serif`;
    ctx.fillText("1", x + 19 * scale, cy - 3.3 * scale);
    ctx.fillText("2", x + 19 * scale, cy + 3.3 * scale);
  }
  ctx.restore();
}

function networkTypeWidth(type, scale) {
  if (type === "隐藏") return 0;
  return (type === "LTE" ? 17 : 14.5) * scale;
}

function drawNetworkType(ctx, type, x, cy, scale, color) {
  if (type === "隐藏") return;
  const width = networkTypeWidth(type, scale);
  const fontSize = type === "LTE" ? 8.1 : 8.9;
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `700 ${fontSize * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(type, x + width / 2, cy + 0.25 * scale);
  ctx.restore();
}

function drawDualArrowNetwork(ctx, type, x, cy, scale, bars, color) {
  const badgeWidth = type === "隐藏" ? 0 : (type === "LTE" ? 17 : 15) * scale;
  ctx.save();
  if (badgeWidth) {
    ctx.fillStyle = color;
    roundedRect(ctx, x, cy - 6.2 * scale, badgeWidth, 9.8 * scale, 1.4 * scale);
    ctx.fill();
    ctx.fillStyle = color === "#000000" ? "#ffffff" : "#111318";
    ctx.font = `750 ${(type === "LTE" ? 5.8 : 6.8) * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(type, x + badgeWidth / 2, cy - 1.4 * scale);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1 * scale;
    ctx.lineCap = "round";
    const arrowX = x + badgeWidth / 2;
    ctx.beginPath();
    ctx.moveTo(arrowX - 2.4 * scale, cy + 3.8 * scale);
    ctx.lineTo(arrowX - 2.4 * scale, cy + 6.2 * scale);
    ctx.moveTo(arrowX - 3.7 * scale, cy + 5.1 * scale);
    ctx.lineTo(arrowX - 2.4 * scale, cy + 6.4 * scale);
    ctx.lineTo(arrowX - 1.1 * scale, cy + 5.1 * scale);
    ctx.moveTo(arrowX + 2.4 * scale, cy + 6.2 * scale);
    ctx.lineTo(arrowX + 2.4 * scale, cy + 3.8 * scale);
    ctx.moveTo(arrowX + 1.1 * scale, cy + 5.1 * scale);
    ctx.lineTo(arrowX + 2.4 * scale, cy + 3.8 * scale);
    ctx.lineTo(arrowX + 3.7 * scale, cy + 5.1 * scale);
    ctx.stroke();
  }
  ctx.restore();

  let signalX = x + badgeWidth + (badgeWidth ? 4 : 0) * scale;
  drawSignal(ctx, signalX, cy, scale * 0.82, bars, color);
  signalX += 14 * scale;
  drawSignal(ctx, signalX, cy, scale * 0.82, Math.max(0, bars - 1), color);
}

function drawHdDualNetwork(ctx, type, x, cy, scale, bars, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 0.9 * scale;
  roundedRect(ctx, x, cy - 4.2 * scale, 11 * scale, 7.8 * scale, 1.2 * scale);
  ctx.stroke();
  ctx.font = `750 ${5.2 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("HD", x + 5.5 * scale, cy - 0.25 * scale);
  ctx.restore();

  const label = type === "隐藏" ? "" : type;
  for (let sim = 0; sim < 2; sim += 1) {
    const groupX = x + (14 + sim * 22) * scale;
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `750 ${(label === "LTE" ? 5.3 : 6.2) * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label, groupX, cy - 0.8 * scale);
    ctx.font = `700 ${4.2 * scale}px system-ui, sans-serif`;
    ctx.fillText(String(sim + 1), groupX + 7.7 * scale, cy + 4.2 * scale);
    ctx.restore();
    drawSignal(ctx, groupX + 10.5 * scale, cy, scale * 0.62, Math.max(0, bars - sim), color);
  }
}

function networkClusterWidth(style, type, scale) {
  if (style === "dual-arrow") return ((type === "隐藏" ? 0 : type === "LTE" ? 17 : 15) + (type === "隐藏" ? 0 : 4) + 28) * scale;
  if (style === "hd-dual") return 58 * scale;
  return 17 * scale + networkTypeWidth(type, scale);
}

function drawWifi(ctx, x, cy, scale, color, strength) {
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineWidth = 1.55 * scale;
  [[7, 3], [4.8, 2], [2.4, 1]].forEach(([r, level]) => {
    ctx.globalAlpha = strength >= level ? 1 : 0.22;
    ctx.beginPath();
    ctx.arc(x, cy + 3.4 * scale, r * scale, Math.PI * 1.22, Math.PI * 1.78);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.globalAlpha = strength > 0 ? 1 : 0.22;
  ctx.beginPath();
  ctx.arc(x, cy + 5 * scale, 1.25 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawBattery(ctx, x, cy, scale, value, color, showNumber) {
  const w = 22 * scale;
  const h = 10.5 * scale;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2 * scale;
  ctx.globalAlpha = 0.85;
  roundedRect(ctx, x, cy - h / 2, w, h, 2.5 * scale);
  ctx.stroke();
  ctx.fillStyle = color;
  roundedRect(ctx, x + w + 1.25 * scale, cy - 2.5 * scale, 1.9 * scale, 5 * scale, 0.7 * scale);
  ctx.fill();
  ctx.globalAlpha = 1;
  const inner = Math.max(1.5, (w - 3.2 * scale) * Math.max(0, Math.min(100, value)) / 100);
  ctx.fillStyle = value <= 20 ? "#ff4d58" : color;
  roundedRect(ctx, x + 1.6 * scale, cy - h / 2 + 1.6 * scale, inner, h - 3.2 * scale, 1.35 * scale);
  ctx.fill();
  if (showNumber) {
    ctx.fillStyle = value > 45 ? (color === "#ffffff" ? "#111318" : "#ffffff") : color;
    ctx.font = `600 ${6.7 * scale}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(value), x + w / 2, cy + 0.15 * scale);
  }
}

function drawNotice(ctx, type, x, cy, scale, color, customImage) {
  if (!type.startsWith("custom-") || !customImage) return;
  ctx.save();
  roundedRect(ctx, x - 7 * scale, cy - 7 * scale, 14 * scale, 14 * scale, 2.5 * scale);
  ctx.clip();
  ctx.drawImage(customImage, x - 7 * scale, cy - 7 * scale, 14 * scale, 14 * scale);
  ctx.restore();
}

function drawEraseStrokes(ctx, strokes, w, h, c) {
  if (!strokes.length) return;
  const scale = Math.max(.62, w / 390);
  ctx.save();
  ctx.globalAlpha = 1;
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

function drawTop(ctx, img, w, h, c, customNoticeImages) {
  const th = h * c.topHeight / 100;
  const scale = Math.max(.62, w / 390);
  const iconScale = scale * Math.max(.6, Math.min(1.6, (c.iconScale || 100) / 100));
  const gap = Math.max(0, Math.min(14, c.iconGap ?? 3.2)) * iconScale;
  coverRegion(ctx, img, 0, 0, w, th, c.topStyle, c.topColor, c.topOpacity);
  const cy = th / 2 + .5 * scale;

  ctx.save();
  ctx.fillStyle = c.iconColor;
  ctx.font = `650 ${14.5 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textBaseline = "middle";
  if (c.timePosition === "center") {
    ctx.textAlign = "center";
    ctx.fillText(c.time || "00:00", w / 2, cy);
  } else if (c.timePosition === "right") {
    ctx.textAlign = "right";
    ctx.fillText(c.time || "00:00", w * (1 - c.timeX / 100), cy);
  } else {
    ctx.textAlign = "left";
    ctx.fillText(c.time || "00:00", w * c.timeX / 100, cy);
  }
  ctx.restore();

  const notices = (c.notificationIcons || []).slice(0, 5);
  let noticeX = 7 * iconScale;
  if (c.timePosition === "left") {
    ctx.font = `650 ${14.5 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    noticeX = Math.max(noticeX, w * c.timeX / 100 + ctx.measureText(c.time || "00:00").width + 6 * iconScale);
  }
  for (const notice of notices) {
    const customItem = customNoticeImages.find((item) => item.id === notice);
    if (!customItem?.image) continue;
    const customAdjustment = customItem.adjustment || { scale: 100, x: 0, y: 0 };
    const customScale = iconScale * Math.max(.5, Math.min(2, (Number(customAdjustment.scale) || 100) / 100));
    const customWidth = 16 * customScale;
    drawNotice(
      ctx,
      notice,
      noticeX + customWidth / 2 + Math.max(-100, Math.min(100, Number(customAdjustment.x) || 0)) * scale,
      cy + Math.max(-30, Math.min(30, Number(customAdjustment.y) || 0)) * scale,
      customScale,
      c.iconColor,
      customItem.image,
    );
    noticeX += customWidth + 2 * iconScale;
  }

  const adjustmentFor = (key) => {
    const value = c.iconAdjustments?.[key] || DEFAULT_ICON_ADJUSTMENTS[key] || { scale: 100, x: 0, y: 0 };
    return {
      scale: Math.max(50, Math.min(200, Number(value.scale) || 100)) / 100,
      x: Math.max(-100, Math.min(100, Number(value.x) || 0)) * scale,
      y: Math.max(-30, Math.min(30, Number(value.y) || 0)) * scale,
    };
  };
  const items = [];
  const push = (key, widthForScale, drawAtScale) => {
    const adjustment = adjustmentFor(key);
    const itemScale = iconScale * adjustment.scale;
    items.push({
      width: widthForScale(itemScale),
      draw: (x) => drawAtScale(x + adjustment.x, cy + adjustment.y, itemScale),
    });
  };
  [c.headphones && "headphones", c.vibrate && "vibrate", c.nfc && "nfc", c.alarm && "alarm", c.bluetooth && "bluetooth", c.silent && "silent"].filter(Boolean).forEach((type) => {
    push(type, (itemScale) => systemIconWidth(type, itemScale), (x, itemCy, itemScale) => drawSmallSystemIcon(ctx, type, x, itemCy, itemScale, c.iconColor));
  });
  if (c.showDataSpeed !== false && c.dataSpeed?.trim()) {
    const speedAdjustment = adjustmentFor("dataSpeed");
    const speedScale = iconScale * speedAdjustment.scale;
    ctx.save();
    ctx.font = `750 ${8.3 * speedScale}px system-ui, sans-serif`;
    const speedWidth = Math.max(31 * speedScale, ctx.measureText(c.dataSpeed.trim()).width + 3 * speedScale);
    ctx.restore();
    items.push({ width: speedWidth, draw: (baseX) => {
      const x = baseX + speedAdjustment.x;
      const itemCy = cy + speedAdjustment.y;
      ctx.save();
      ctx.fillStyle = c.iconColor;
      ctx.font = `750 ${8.3 * speedScale}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const parts = c.dataSpeed.trim().split(/\s+/);
      if (parts.length > 1) {
        ctx.fillText(parts[0], x + speedWidth / 2, itemCy - 3 * speedScale);
        ctx.fillText(parts.slice(1).join(" "), x + speedWidth / 2, itemCy + 3.2 * speedScale);
      } else ctx.fillText(parts[0], x + speedWidth / 2, itemCy);
      ctx.restore();
    }});
  }
  if (c.voiceIndicator !== "none") {
    push("voiceIndicator", (itemScale) => voiceIndicatorWidth(c.voiceIndicator, itemScale), (x, itemCy, itemScale) => drawVoiceIndicator(ctx, c.voiceIndicator, x, itemCy, itemScale, c.iconColor));
  }

  const connectivityItems = [];
  const makeAdjustedItem = (key, widthForScale, drawAtScale) => {
    const adjustment = adjustmentFor(key);
    const itemScale = iconScale * adjustment.scale;
    return {
      key,
      width: widthForScale(itemScale),
      draw: (x) => drawAtScale(x + adjustment.x, cy + adjustment.y, itemScale),
    };
  };
  const wifiItems = [];
  if (c.wifi) {
    wifiItems.push(makeAdjustedItem(
      "wifi",
      (itemScale) => wifiGraphicWidth(c.wifiStyle, itemScale),
      (x, itemCy, itemScale) => drawStatusWifi(ctx, x, itemCy, itemScale, c.iconColor, c.wifiStrength, c.wifiStyle, false),
    ));
    if (c.wifiArrows) wifiItems.push(makeAdjustedItem(
      "wifiArrows",
      trafficArrowWidth,
      (x, itemCy, itemScale) => drawStandaloneTrafficArrows(ctx, x, itemCy, itemScale * .62, c.iconColor),
    ));
  }
  const addSimItems = (sim) => {
    const network = c[`sim${sim}Network`];
    const signal = c[`sim${sim}Signal`];
    if (c[`showSim${sim}Network`] !== false && network !== "隐藏") connectivityItems.push(makeAdjustedItem(
      `sim${sim}Network`,
      (itemScale) => simNetworkWidth(network, c.showSimNumbers, itemScale),
      (x, itemCy, itemScale) => drawSimNetwork(ctx, x, itemCy, itemScale, network, c.iconColor, c.showSimNumbers ? sim : null),
    ));
    if (c[`showSim${sim}Arrows`] !== false && network !== "隐藏") connectivityItems.push(makeAdjustedItem(
      `sim${sim}Arrows`,
      trafficArrowWidth,
      (x, itemCy, itemScale) => drawStandaloneTrafficArrows(ctx, x, itemCy, itemScale * .72, c.iconColor),
    ));
    if (c[`showSim${sim}Signal`] !== false) connectivityItems.push(makeAdjustedItem(
      `sim${sim}Signal`,
      (itemScale) => signalGraphicWidth(c.signalStyle, itemScale),
      (x, itemCy, itemScale) => drawStatusSignal(ctx, x, itemCy, itemScale, signal, c.iconColor, c.signalStyle),
    ));
  };
  addSimItems(1);
  if (c.simMode === "dual") addSimItems(2);
  if (c.connectivityOrder === "wifi-first") items.push(...wifiItems, ...connectivityItems);
  else items.push(...connectivityItems, ...wifiItems);

  const batteryItems = [];
  if (c.showBatteryIcon !== false) batteryItems.push(makeAdjustedItem(
    "batteryIcon",
    (itemScale) => batteryShellWidth(c.batteryStyle, itemScale),
    (x, itemCy, itemScale) => drawStandaloneBattery(ctx, x, itemCy, itemScale, c.battery, c.iconColor, c.batteryStyle),
  ));
  if (c.batteryNumber) batteryItems.push(makeAdjustedItem(
    "batteryPercent",
    batteryPercentWidth,
    (x, itemCy, itemScale) => drawBatteryPercent(ctx, x, itemCy, itemScale, c.battery, c.iconColor),
  ));
  if (c.powerSave) batteryItems.push(makeAdjustedItem(
    "powerSave",
    (itemScale) => 18 * itemScale,
    (x, itemCy, itemScale) => drawBatteryLeaf(ctx, x + 8.5 * itemScale, itemCy, itemScale, c.iconColor),
  ));
  const batteryWidth = batteryItems.reduce((sum, item) => sum + item.width, 0) + Math.max(0, batteryItems.length - 1) * gap;
  const totalWidth = items.reduce((sum, item) => sum + item.width, 0) + Math.max(0, items.length - 1) * gap;
  const batteryX = w - 7 * iconScale - batteryWidth;
  let batteryCursor = batteryX;
  for (const item of batteryItems) {
    item.draw(batteryCursor);
    batteryCursor += item.width + gap;
  }
  let cursor = c.iconPosition === "left" ? noticeX + 6 * iconScale : batteryX - (batteryItems.length ? gap : 0) - totalWidth;
  for (const item of items) {
    item.draw(cursor);
    cursor += item.width + gap;
  }
}

function drawNavIcon(ctx, type, x, y, size, color) {
  const s = size / 24;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.9 * s;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  if (type === "home") {
    ctx.moveTo(-8*s, -1*s); ctx.lineTo(0, -8*s); ctx.lineTo(8*s, -1*s); ctx.moveTo(-6*s, -2*s); ctx.lineTo(-6*s, 8*s); ctx.lineTo(6*s, 8*s); ctx.lineTo(6*s, -2*s);
  } else if (type === "search") {
    ctx.arc(-1.8*s, -1.8*s, 6*s, 0, Math.PI*2); ctx.moveTo(3*s, 3*s); ctx.lineTo(8*s, 8*s);
  } else if (type === "plus") {
    ctx.moveTo(-7*s, 0); ctx.lineTo(7*s, 0); ctx.moveTo(0, -7*s); ctx.lineTo(0, 7*s);
  } else if (type === "user") {
    ctx.arc(0, -4*s, 3.7*s, 0, Math.PI*2); ctx.moveTo(-7*s, 8*s); ctx.quadraticCurveTo(-6*s, 1*s, 0, 1*s); ctx.quadraticCurveTo(6*s, 1*s, 7*s, 8*s);
  } else if (type === "chat") {
    roundedRect(ctx, -8*s, -7*s, 16*s, 12*s, 4*s); ctx.moveTo(-4*s, 5*s); ctx.lineTo(-6*s, 9*s); ctx.lineTo(0, 5*s);
  } else if (type === "phone") {
    ctx.moveTo(-6*s, -8*s); ctx.quadraticCurveTo(-10*s, -4*s, -3*s, 3*s); ctx.quadraticCurveTo(4*s, 10*s, 8*s, 6*s); ctx.lineTo(4*s, 2*s); ctx.lineTo(1*s, 5*s); ctx.quadraticCurveTo(-2*s, 3*s, -5*s, 0); ctx.lineTo(-2*s, -3*s); ctx.closePath();
  } else if (type === "camera") {
    roundedRect(ctx, -9*s, -6*s, 18*s, 13*s, 3*s); ctx.moveTo(-4*s, -6*s); ctx.lineTo(-2*s, -9*s); ctx.lineTo(3*s, -9*s); ctx.lineTo(5*s, -6*s); ctx.moveTo(4*s, 0); ctx.arc(0, 0, 4*s, 0, Math.PI*2);
  } else {
    ctx.moveTo(0, 8*s); ctx.bezierCurveTo(-12*s, 1*s, -8*s, -7*s, -3*s, -7*s); ctx.bezierCurveTo(0, -7*s, 0, -4*s, 0, -3*s); ctx.bezierCurveTo(0, -4*s, 0, -7*s, 3*s, -7*s); ctx.bezierCurveTo(8*s, -7*s, 12*s, 1*s, 0, 8*s);
  }
  ctx.stroke();
  ctx.restore();
}

function drawBrandNavigation(ctx, style, w, y, bh, scale, color) {
  const cy = y + bh * .5;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 1.7 * scale;
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
  } else if (style === "xiaomi") {
    roundedRect(ctx, w * .27 - 5.5 * scale, cy - 5.5 * scale, 11 * scale, 11 * scale, 1.5 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w * .5, cy, 6 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * .73 + 5 * scale, cy - 6 * scale);
    ctx.lineTo(w * .73 - 5 * scale, cy);
    ctx.lineTo(w * .73 + 5 * scale, cy + 6 * scale);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(w * .27 + 5.5 * scale, cy - 6 * scale);
    ctx.lineTo(w * .27 - 5.5 * scale, cy);
    ctx.lineTo(w * .27 + 5.5 * scale, cy + 6 * scale);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w * .5, cy, 6 * scale, 0, Math.PI * 2);
    ctx.stroke();
    roundedRect(ctx, w * .73 - 5.5 * scale, cy - 5.5 * scale, 11 * scale, 11 * scale, 1.8 * scale);
    ctx.stroke();
  }
}

function drawBottom(ctx, img, w, h, c) {
  const bh = h * c.bottomHeight / 100;
  const y = h - bh;
  const scale = Math.max(0.62, w / 390) * Math.max(.65, Math.min(1.5, (c.bottomIconScale || 100) / 100));
  coverRegion(ctx, img, 0, y, w, bh, c.bottomCover, c.bottomColor, c.bottomOpacity);
  const color = c.bottomIconColor;
  if (c.bottomStyle === "gesture" || c.bottomStyle === "gesture-thin") {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.92;
    const thin = c.bottomStyle === "gesture-thin";
    const barWidth = thin ? w * .27 : w * .32;
    roundedRect(ctx, (w - barWidth) / 2, y + bh * (thin ? .82 : .72), barWidth, thin ? Math.max(1.4 * scale, bh * .035) : Math.max(3 * scale, bh * .085), 999);
    ctx.fill();
    ctx.globalAlpha = 1;
  } else if (["android", "android-reverse", "samsung", "vivo", "xiaomi", "huawei"].includes(c.bottomStyle)) {
    const cy = y + bh / 2;
    if (c.bottomStyle === "android" || c.bottomStyle === "android-reverse" || c.bottomStyle === "samsung") {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.8 * scale;
      const backX = c.bottomStyle === "android" ? w * .27 : w * .73;
      const recentX = c.bottomStyle === "android" ? w * .73 : w * .27;
      ctx.beginPath(); ctx.moveTo(backX + 5*scale, cy-6*scale); ctx.lineTo(backX-5*scale, cy); ctx.lineTo(backX+5*scale, cy+6*scale); if (c.bottomStyle !== "samsung") ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(w*.5, cy, 6*scale, 0, Math.PI*2); ctx.stroke();
      if (c.bottomStyle === "samsung") {
        [-3.2, 3.2].forEach((dx) => [-3.2, 3.2].forEach((dy) => { ctx.beginPath(); ctx.arc(recentX + dx*scale, cy + dy*scale, 1.15*scale, 0, Math.PI*2); ctx.fill(); }));
      } else {
        roundedRect(ctx, recentX-5.5*scale, cy-5.5*scale, 11*scale, 11*scale, 1.2*scale); ctx.stroke();
      }
    } else {
      drawBrandNavigation(ctx, c.bottomStyle, w, y, bh, scale, color);
    }
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
      drawNavIcon(ctx, c.navIcons[i], x, cy, Math.min(25 * scale, bh * .38), color);
    }
  }
}

function renderCanvas(canvas, img, config, strokes = [], customNoticeImages = [], originalOnly = false) {
  if (!canvas || !img) return;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0);
  if (!originalOnly) {
    drawEraseStrokes(ctx, strokes, canvas.width, canvas.height, config);
    drawTop(ctx, img, canvas.width, canvas.height, config, customNoticeImages);
    drawBottom(ctx, img, canvas.width, canvas.height, config);
  }
}

function Range({ label, value, min, max, step = 1, suffix = "", onChange }) {
  return (
    <label className="range-row">
      <span>{label}<b>{value}{suffix}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
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

function IconAdjustCard({ label, symbol, active = true, adjustment, onChange, onReset, onToggle, onRemove }) {
  return (
    <div className={`icon-adjust-card ${active ? "active" : "inactive"}`}>
      <div className="icon-adjust-head">
        <span className="icon-adjust-symbol" aria-hidden="true">{symbol}</span>
        <strong>{label}</strong>
        <label className="mini-switch" title={active ? "关闭图标" : "显示图标"}>
          <input type="checkbox" checked={active} onChange={(event) => onToggle(event.target.checked)} />
          <span />
        </label>
        <div className="icon-adjust-actions">
          <button onClick={onReset}>重置</button>
          {onRemove && <button className="remove" onClick={onRemove}>删除</button>}
        </div>
      </div>
      <Range label="大小" value={adjustment.scale} min={50} max={200} step={5} suffix="%" onChange={(v) => onChange("scale", v)} />
      <Range label="左右位置" value={adjustment.x} min={-100} max={100} step={1} suffix="px" onChange={(v) => onChange("x", v)} />
      <Range label="上下位置" value={adjustment.y} min={-30} max={30} step={1} suffix="px" onChange={(v) => onChange("y", v)} />
    </div>
  );
}

export default function Home() {
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const customIconRef = useRef(null);
  const controlsScrollRef = useRef(null);
  const modelRowRef = useRef(null);
  const uploadRowRef = useRef(null);
  const drawingRef = useRef(false);
  const fitRevisionRef = useRef(0);
  const customIdRef = useRef(0);
  const [image, setImage] = useState(null);
  const [sourceImage, setSourceImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [eraseStrokes, setEraseStrokes] = useState([]);
  const [eraseMode, setEraseMode] = useState("off");
  const [customNoticeImages, setCustomNoticeImages] = useState([]);
  const [tab, setTab] = useState("erase");
  const [dragging, setDragging] = useState(false);
  const [originalOnly, setOriginalOnly] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [activeSection, setActiveSection] = useState("model");

  const patch = useCallback((key, value) => setConfig((c) => ({ ...c, [key]: value })), []);
  const patchIconAdjustment = useCallback((key, property, value) => {
    setConfig((current) => ({
      ...current,
      iconAdjustments: {
        ...DEFAULT_ICON_ADJUSTMENTS,
        ...(current.iconAdjustments || {}),
        [key]: {
          ...DEFAULT_ICON_ADJUSTMENTS[key],
          ...(current.iconAdjustments?.[key] || {}),
          [property]: value,
        },
      },
    }));
  }, []);
  const resetIconAdjustment = useCallback((key) => {
    setConfig((current) => ({
      ...current,
      iconAdjustments: {
        ...DEFAULT_ICON_ADJUSTMENTS,
        ...(current.iconAdjustments || {}),
        [key]: { ...DEFAULT_ICON_ADJUSTMENTS[key] },
      },
    }));
  }, []);
  const phoneModel = useMemo(() => PHONE_MODELS.find((model) => model.id === selectedPhone) || null, [selectedPhone]);
  const sizeText = useMemo(() => {
    if (image && phoneModel) return `${phoneModel.name} · ${image.naturalWidth} × ${image.naturalHeight}px`;
    if (phoneModel) return `${phoneModel.name} · ${phoneSpec(phoneModel)}`;
    return "等待选择机型";
  }, [image, phoneModel]);

  useEffect(() => renderCanvas(canvasRef.current, image, config, eraseStrokes, customNoticeImages, originalOnly), [image, config, eraseStrokes, customNoticeImages, originalOnly]);

  const refitSource = useCallback((source, model) => {
    const revision = ++fitRevisionRef.current;
    const next = new Image();
    next.onload = () => {
      if (revision !== fitRevisionRef.current) return;
      setImage(next);
      setEraseStrokes([]);
      setEraseMode("off");
    };
    next.src = fitImageToPhone(source, model);
  }, []);

  useEffect(() => {
    if (sourceImage && phoneModel) refitSource(sourceImage, phoneModel);
  }, [phoneModel, refitSource, sourceImage]);

  const openFile = useCallback((file) => {
    if (!phoneModel || !file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    const source = new Image();
    source.onload = () => {
      setSourceImage(source);
      setFileName(file.name.replace(/\.[^.]+$/, ""));
      setTab("erase");
      setEraseStrokes([]);
      setEraseMode("off");
    };
    reader.onload = () => { source.src = reader.result; };
    reader.readAsDataURL(file);
  }, [phoneModel]);

  const changePhone = (value) => {
    setSelectedPhone(value);
    setEraseStrokes([]);
    setEraseMode("off");
    if (!value) setImage(null);
  };

  const download = useCallback((type = "png") => {
    if (!canvasRef.current || !image) return;
    renderCanvas(canvasRef.current, image, config, eraseStrokes, customNoticeImages, false);
    const mime = type === "jpg" ? "image/jpeg" : "image/png";
    const link = document.createElement("a");
    link.download = `${fileName || "screenshot"}-edited.${type}`;
    link.href = canvasRef.current.toDataURL(mime, type === "jpg" ? 0.95 : undefined);
    link.click();
  }, [config, customNoticeImages, eraseStrokes, fileName, image]);

  const setBottomPreset = (value) => {
    const heights = { gesture: 6.2, "gesture-thin": 4.2, android: 6.5, "android-reverse": 6.5, samsung: 6.5, vivo: 6.8, xiaomi: 6.8, huawei: 6.8, dock: 12.5, minimal: 8 };
    setConfig((c) => ({ ...c, bottomStyle: value, bottomHeight: heights[value] }));
  };

  const toggleNotice = (value) => {
    setConfig((c) => {
      const current = c.notificationIcons || [];
      if (current.includes(value)) return { ...c, notificationIcons: current.filter((x) => x !== value) };
      if (current.length >= 5) return c;
      return { ...c, notificationIcons: [...current, value] };
    });
  };

  const loadCustomNotices = (files) => {
    const candidates = Array.from(files || []).filter((file) => file.type.startsWith("image/"));
    const room = Math.max(0, Math.min(5 - customNoticeImages.length, 5 - (config.notificationIcons || []).length));
    const accepted = candidates.slice(0, room);
    if (!accepted.length) return;
    Promise.all(accepted.map((file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const icon = new Image();
        icon.onload = () => {
          customIdRef.current += 1;
          resolve({
            id: `custom-${Date.now()}-${customIdRef.current}`,
            image: icon,
            name: file.name,
            adjustment: { scale: 100, x: 0, y: 0 },
          });
        };
        icon.src = reader.result;
      };
      reader.readAsDataURL(file);
    }))).then((items) => {
      setCustomNoticeImages((current) => [...current, ...items].slice(0, 5));
      setConfig((current) => ({ ...current, notificationIcons: [...current.notificationIcons, ...items.map((item) => item.id)].slice(0, 5) }));
      if (customIconRef.current) customIconRef.current.value = "";
    });
  };

  const removeCustomNotice = (id) => {
    setCustomNoticeImages((items) => items.filter((item) => item.id !== id));
    setConfig((current) => ({ ...current, notificationIcons: current.notificationIcons.filter((value) => value !== id) }));
  };

  const patchCustomNoticeAdjustment = (id, property, value) => {
    setCustomNoticeImages((items) => items.map((item) => item.id === id
      ? { ...item, adjustment: { scale: 100, x: 0, y: 0, ...(item.adjustment || {}), [property]: value } }
      : item));
  };

  const resetCustomNoticeAdjustment = (id) => {
    setCustomNoticeImages((items) => items.map((item) => item.id === id
      ? { ...item, adjustment: { scale: 100, x: 0, y: 0 } }
      : item));
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
    if (!image || tab !== "erase" || eraseMode === "off") return;
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
    setConfig(DEFAULT_CONFIG);
    setEraseStrokes([]);
    setEraseMode("off");
    setCustomNoticeImages([]);
  };

  const openPanelSection = (item) => {
    setActiveSection(item.id);
    if (item.id === "model") {
      modelRowRef.current?.querySelector("select")?.focus();
      return;
    }
    if (item.id === "upload") {
      uploadRowRef.current?.querySelector("button")?.focus();
      return;
    }
    setTab(item.tab);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const scroller = controlsScrollRef.current;
      const target = scroller?.querySelector(`[data-section="${item.id}"]`);
      if (!scroller || !target) return;
      const top = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 8;
      scroller.scrollTo({ top, behavior: "smooth" });
    }));
  };

  const selectTab = (nextTab) => {
    const sectionId = nextTab === "erase" ? "erase-tool" : nextTab === "top" ? "top-area" : "bottom-style";
    openPanelSection(PANEL_NAV_ITEMS.find((item) => item.id === sectionId));
  };

  const syncActiveSection = () => {
    const scroller = controlsScrollRef.current;
    if (!scroller) return;
    const sections = [...scroller.querySelectorAll("[data-section]")];
    if (!sections.length) return;
    const scrollerTop = scroller.getBoundingClientRect().top;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= scrollerTop + 72) current = section;
    });
    setActiveSection(current.dataset.section);
  };

  return (
    <main className="app-shell">
      <header className="top-header">
        <div className="brand-mark">SE</div>
        <div className="brand-copy"><h1>截图界面修改工具</h1><p>消除原图 · 状态栏 · 底部导航栏</p></div>
        <div className="privacy-pill"><span /> 图片仅在当前浏览器处理</div>
      </header>

      <section className="workspace">
        <aside className="control-panel">
          <nav className="project-nav" aria-label="功能项目">
            <strong>功能项目</strong>
            <div className="project-nav-list">
              {PANEL_NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className={activeSection === item.id ? "active" : ""}
                  onClick={() => openPanelSection(item)}
                  title={item.label}
                >
                  <i>{item.number}</i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="control-main">
          <div ref={modelRowRef} className="model-row" onFocus={() => setActiveSection("model")}>
            <span className="step-badge">01</span>
            <label>
              <span>选择手机型号</span>
              <select value={selectedPhone} onChange={(e) => changePhone(e.target.value)}>
                <option value="">请先选择手机型号</option>
                {PHONE_MODEL_GROUPS.map((group) => (
                  <optgroup key={group.brand} label={group.brand}>
                    {group.models.map((model) => (
                      <option key={model.id} value={model.id}>{model.name} · {model.width}×{model.height}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            {phoneModel && <small>{phoneSpec(phoneModel)}</small>}
          </div>

          <div ref={uploadRowRef} className="upload-row" onFocus={() => setActiveSection("upload")}>
            <div><span className="eyebrow">02 · 上传截图</span><strong>{fileName || (phoneModel ? "尚未选择图片" : "请先完成机型选择")}</strong><small>{sizeText}</small></div>
            <div className="upload-actions">
              <button className="secondary" disabled={!phoneModel} onClick={() => fileRef.current?.click()}>{sourceImage ? "更换" : "上传"}</button>
            </div>
            <input ref={fileRef} hidden disabled={!phoneModel} type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { openFile(e.target.files?.[0]); e.target.value = ""; }} />
          </div>

          <div className="tabs">
            <button className={tab === "erase" ? "active" : ""} onClick={() => selectTab("erase")}><i>03</i>消除原图</button>
            <button className={tab === "top" ? "active" : ""} onClick={() => selectTab("top")}><i>04</i>顶部状态栏</button>
            <button className={tab === "bottom" ? "active" : ""} onClick={() => selectTab("bottom")}><i>05</i>底部导航栏</button>
          </div>

          <div ref={controlsScrollRef} className="controls-scroll" onScroll={syncActiveSection}>
            {tab === "erase" ? <>
              <div className="section-title" data-section="erase-tool"><span>原图消除工具</span><em>ERASER</em></div>
              <div className="erase-card standalone">
                <div className="tool-buttons">
                  <button disabled={!image} className={eraseMode === "brush" ? "active" : ""} onClick={() => { setEraseMode("brush"); patch("topStyle", "manual"); }}>消除笔</button>
                  <button disabled={!image} className={eraseMode === "picker" ? "active" : ""} onClick={() => { setEraseMode("picker"); patch("topStyle", "manual"); }}>从原图取色</button>
                  <button className={eraseMode === "off" ? "active" : ""} onClick={() => setEraseMode("off")}>关闭</button>
                </div>
                <Range label="可消除区域高度" value={config.topHeight} min={3.5} max={15} step={0.1} suffix="%" onChange={(v) => patch("topHeight", v)} />
                <label className="color-field"><span>覆盖颜色</span><input type="color" value={config.eraseColor} onChange={(e) => patch("eraseColor", e.target.value)} /></label>
                <Range label="笔刷大小" value={config.eraseSize} min={6} max={70} suffix="px" onChange={(v) => patch("eraseSize", v)} />
                <div className="erase-actions">
                  <button disabled={!eraseStrokes.length} onClick={() => setEraseStrokes((s) => s.slice(0, -1))}>撤销上一笔</button>
                  <button disabled={!eraseStrokes.length} onClick={() => setEraseStrokes([])}>清空全部</button>
                </div>
                <p>{eraseMode === "picker" ? "点击截图顶部吸取原图颜色，随后会自动切换为消除笔。" : eraseMode === "brush" ? "在原图顶部按住并拖动。消除内容会绘制在新状态栏的下层。" : "消除笔只处理原始截图，不会擦除后来添加的状态栏图标。"}</p>
              </div>
            </> : tab === "top" ? <>
              <div className="section-title" data-section="top-area"><span>区域与背景</span><em>TOP</em></div>
              <Range label="覆盖高度" value={config.topHeight} min={3.5} max={12} step={0.1} suffix="%" onChange={(v) => patch("topHeight", v)} />
              <SelectField label="背景处理" value={config.topStyle} options={[["dark","深色遮盖"],["light","浅色遮盖"],["blur","原图模糊"],["custom","自定义颜色"],["manual","保留原图，手动消除"]]} onChange={(v) => patch("topStyle", v)} />
              {config.topStyle === "custom" && <label className="color-field"><span>背景颜色</span><input type="color" value={config.topColor} onChange={(e) => patch("topColor", e.target.value)} /></label>}
              {config.topStyle !== "manual" && <Range label="背景强度" value={config.topOpacity} min={20} max={100} suffix="%" onChange={(v) => patch("topOpacity", v)} />}

              <div className="section-title" data-section="top-time"><span>时间</span><em>TIME</em></div>
              <div className="field-pair">
                <label className="field"><span>显示时间</span><input value={config.time} maxLength={8} onChange={(e) => patch("time", e.target.value)} /></label>
                <SelectField label="时间位置" value={config.timePosition} options={[["left","左侧"],["center","居中"],["right","右侧"]]} onChange={(v) => patch("timePosition", v)} />
              </div>
              {config.timePosition !== "center" && <Range label="边缘距离" value={config.timeX} min={2} max={25} suffix="%" onChange={(v) => patch("timeX", v)} />}

              <div className="section-title" data-section="top-status"><span>状态图标</span><em>STATUS</em></div>
              <div className="field-pair">
                <SelectField label="系统图标区域" value={config.iconPosition} options={[["right","右侧"],["left","左侧"]]} onChange={(v) => patch("iconPosition", v)} />
                <Range label="整体基础大小" value={config.iconScale} min={60} max={160} step={5} suffix="%" onChange={(v) => patch("iconScale", v)} />
              </div>
              <Range label="系统标志间距" value={config.iconGap} min={0} max={14} step={0.5} suffix="px" onChange={(v) => patch("iconGap", v)} />
              <div className="field-pair">
                <SelectField label="SIM 卡数量" value={config.simMode} options={[["single","单卡"],["dual","双卡"]]} onChange={(v) => patch("simMode", v)} />
                <SelectField label="信号图形" value={config.signalStyle} options={[["bars","粗柱信号"],["iphone","圆角信号柱"],["lines","五格细柱"],["triangle","三角信号"],["dots","圆点信号"]]} onChange={(v) => patch("signalStyle", v)} />
              </div>
              <SelectField label="Wi-Fi / SIM 排列" value={config.connectivityOrder} options={[["wifi-first","Wi-Fi 在 SIM 前"],["sim-first","SIM 在 Wi-Fi 前"]]} onChange={(v) => patch("connectivityOrder", v)} />
              <div className="sim-card">
                <strong>SIM 1</strong>
                <SelectField label="网络制式" value={config.sim1Network} options={[...NETWORK_OPTIONS, "隐藏"]} onChange={(v) => patch("sim1Network", v)} />
                <Range label="信号强度" value={config.sim1Signal} min={0} max={4} onChange={(v) => patch("sim1Signal", v)} />
              </div>
              {config.simMode === "dual" && <div className="sim-card">
                <strong>SIM 2</strong>
                <SelectField label="网络制式" value={config.sim2Network} options={[...NETWORK_OPTIONS, "隐藏"]} onChange={(v) => patch("sim2Network", v)} />
                <Range label="信号强度" value={config.sim2Signal} min={0} max={4} onChange={(v) => patch("sim2Signal", v)} />
              </div>}
              <div className="field-pair">
                <SelectField label="通话标志" value={config.voiceIndicator} options={[["none","不显示"],["volte-stack","Vo / LTE 叠放"],["volte","VoLTE 方框"],["hd","HD 方框"]]} onChange={(v) => patch("voiceIndicator", v)} />
                <label className="field"><span>实时网速文字</span><input value={config.dataSpeed} placeholder="如 82.0 KB/S" maxLength={16} onChange={(e) => setConfig((current) => ({ ...current, dataSpeed: e.target.value, showDataSpeed: true }))} /></label>
              </div>
              <div className="toggle-grid">
                <Toggle label="SIM 1 / 2 编号" checked={config.showSimNumbers} onChange={(v) => patch("showSimNumbers", v)} />
              </div>

              <div className="section-title" data-section="top-system"><span>Wi-Fi 与电池</span><em>SYSTEM</em></div>
              <div className="field-pair">
                <SelectField label="Wi-Fi 样式" value={config.wifiStyle} options={[["android","安卓标准＋箭头"],["wifi6","Wi-Fi 6"],["wifi-plus","Wi-Fi+"],["iphone","简洁无箭头"],["pixel","Pixel 粗线"],["compact","紧凑型"]]} onChange={(v) => patch("wifiStyle", v)} />
                <SelectField label="电池样式" value={config.batteryStyle} options={[["inside","横向数字电池"],["solid","横向实心电池"],["external","横向＋外部百分比"],["vertical","竖向＋外部百分比"],["percent","仅显示百分比"]]} onChange={(v) => patch("batteryStyle", v)} />
              </div>
              {config.wifi && <Range label="Wi-Fi 强度" value={config.wifiStrength} min={0} max={3} onChange={(v) => patch("wifiStrength", v)} />}
              <Range label="剩余电量" value={config.battery} min={1} max={100} suffix="%" onChange={(v) => patch("battery", v)} />
              <SelectField label="系统图标颜色" value={config.iconColor} options={[["#ffffff","白色"],["#000000","黑色"]]} onChange={(v) => patch("iconColor", v)} />

              <div className="section-title icon-adjust-title" data-section="top-components">
                <span>单个系统图标</span>
                <button onClick={() => patch("iconAdjustments", Object.fromEntries(Object.entries(DEFAULT_ICON_ADJUSTMENTS).map(([key, value]) => [key, { ...value }])))}>全部重置</button>
              </div>
              <p className="icon-adjust-help">网络制式、信号、上下行箭头、Wi-Fi、电池和电量数字均已拆开，可以分别开关、缩放和移动。</p>
              <div className="icon-adjust-list">
                {[
                  { key: "headphones", label: "耳机", symbol: "◉", active: config.headphones, toggle: (value) => patch("headphones", value) },
                  { key: "vibrate", label: "振动", symbol: "▯", active: config.vibrate, toggle: (value) => patch("vibrate", value) },
                  { key: "nfc", label: "NFC", symbol: "N", active: config.nfc, toggle: (value) => patch("nfc", value) },
                  { key: "alarm", label: "闹钟", symbol: "◷", active: config.alarm, toggle: (value) => patch("alarm", value) },
                  { key: "bluetooth", label: "蓝牙", symbol: "ᛒ", active: config.bluetooth, toggle: (value) => patch("bluetooth", value) },
                  { key: "silent", label: "静音", symbol: "◁", active: config.silent, toggle: (value) => patch("silent", value) },
                  { key: "dataSpeed", label: "实时网速", symbol: "K/s", active: config.showDataSpeed !== false && Boolean(config.dataSpeed?.trim()), toggle: (value) => setConfig((current) => ({ ...current, showDataSpeed: value, dataSpeed: value && !current.dataSpeed.trim() ? "0.00 KB/S" : current.dataSpeed })) },
                  { key: "voiceIndicator", label: "VoLTE / HD", symbol: "HD", active: config.voiceIndicator !== "none", toggle: (value) => patch("voiceIndicator", value ? "hd" : "none") },
                  { key: "wifi", label: "Wi-Fi", symbol: "◒", active: config.wifi, toggle: (value) => patch("wifi", value) },
                  { key: "wifiArrows", label: "Wi-Fi 上下行箭头", symbol: "↕", active: config.wifi && config.wifiArrows, toggle: (value) => setConfig((current) => ({ ...current, wifi: value ? true : current.wifi, wifiArrows: value })) },
                  { key: "sim1Network", label: "SIM 1 网络制式", symbol: config.sim1Network === "隐藏" ? "5G" : config.sim1Network, active: config.showSim1Network !== false && config.sim1Network !== "隐藏", toggle: (value) => setConfig((current) => ({ ...current, showSim1Network: value, sim1Network: value && current.sim1Network === "隐藏" ? "5G" : current.sim1Network })) },
                  { key: "sim1Arrows", label: "SIM 1 上下行箭头", symbol: "↕", active: config.showSim1Arrows !== false && config.sim1Network !== "隐藏", toggle: (value) => patch("showSim1Arrows", value) },
                  { key: "sim1Signal", label: "SIM 1 信号", symbol: "▥", active: config.showSim1Signal !== false, toggle: (value) => patch("showSim1Signal", value) },
                  { key: "sim2Network", label: "SIM 2 网络制式", symbol: config.sim2Network === "隐藏" ? "5G" : config.sim2Network, active: config.simMode === "dual" && config.showSim2Network !== false && config.sim2Network !== "隐藏", toggle: (value) => setConfig((current) => ({ ...current, simMode: value ? "dual" : current.simMode, showSim2Network: value, sim2Network: value && current.sim2Network === "隐藏" ? "5G" : current.sim2Network })) },
                  { key: "sim2Arrows", label: "SIM 2 上下行箭头", symbol: "↕", active: config.simMode === "dual" && config.showSim2Arrows !== false && config.sim2Network !== "隐藏", toggle: (value) => setConfig((current) => ({ ...current, simMode: value ? "dual" : current.simMode, showSim2Arrows: value })) },
                  { key: "sim2Signal", label: "SIM 2 信号", symbol: "▥", active: config.simMode === "dual" && config.showSim2Signal !== false, toggle: (value) => setConfig((current) => ({ ...current, simMode: value ? "dual" : current.simMode, showSim2Signal: value })) },
                  { key: "batteryIcon", label: "电池图形", symbol: "▰", active: config.showBatteryIcon !== false, toggle: (value) => patch("showBatteryIcon", value) },
                  { key: "batteryPercent", label: "电量数字", symbol: "%", active: config.batteryNumber, toggle: (value) => patch("batteryNumber", value) },
                  { key: "powerSave", label: "省电叶片", symbol: "◇", active: config.powerSave, toggle: (value) => patch("powerSave", value) },
                ].map(({ key, label, symbol, active, toggle }) => (
                  <IconAdjustCard
                    key={key}
                    label={label}
                    symbol={symbol}
                    active={active}
                    adjustment={config.iconAdjustments?.[key] || DEFAULT_ICON_ADJUSTMENTS[key]}
                    onChange={(property, value) => patchIconAdjustment(key, property, value)}
                    onReset={() => resetIconAdjustment(key)}
                    onToggle={toggle}
                  />
                ))}
              </div>

              <div className="section-title" data-section="top-custom"><span>自定义通知图标</span><em>最多 5 个</em></div>
              <button className="upload-custom custom-only" disabled={customNoticeImages.length >= 5} onClick={() => customIconRef.current?.click()}>＋ 添加自定义图标</button>
              {customNoticeImages.length > 0 && <div className="icon-adjust-list custom-notice-adjust-list">
                {customNoticeImages.map((item, index) => (
                  <IconAdjustCard
                    key={item.id}
                    label={item.name || `自定义图标 ${index + 1}`}
                    symbol={<img src={item.image.src} alt="" />}
                    active={config.notificationIcons.includes(item.id)}
                    adjustment={item.adjustment || { scale: 100, x: 0, y: 0 }}
                    onChange={(property, value) => patchCustomNoticeAdjustment(item.id, property, value)}
                    onReset={() => resetCustomNoticeAdjustment(item.id)}
                    onToggle={() => toggleNotice(item.id)}
                    onRemove={() => removeCustomNotice(item.id)}
                  />
                ))}
              </div>}
              <p className="custom-icon-help">支持一次选择多张图片。每个自定义图标都可以单独开关、调整大小和位置。</p>
              <input ref={customIconRef} hidden multiple type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => loadCustomNotices(e.target.files)} />
            </> : <>
              <div className="section-title" data-section="bottom-style"><span>导航栏样式</span><em>BOTTOM</em></div>
              <div className="style-grid">
                {[["gesture","手势短条"],["gesture-thin","手势细线"],["android","三键 · 返回左"],["android-reverse","三键 · 返回右"],["samsung","Samsung 三键"],["vivo","vivo OriginOS"],["xiaomi","小米 HyperOS"],["huawei","华为 HarmonyOS"],["dock","图标 Dock"],["minimal","简洁图标"]].map(([v,l]) => <button key={v} className={config.bottomStyle === v ? "selected" : ""} onClick={() => setBottomPreset(v)}><span className={`style-preview ${v}`} />{l}</button>)}
              </div>
              <Range label="覆盖高度" value={config.bottomHeight} min={3} max={20} step={0.1} suffix="%" onChange={(v) => patch("bottomHeight", v)} />
              <Range label="导航图标大小" value={config.bottomIconScale} min={65} max={150} step={5} suffix="%" onChange={(v) => patch("bottomIconScale", v)} />
              <SelectField label="背景处理" value={config.bottomCover} options={[["dark","深色遮盖"],["light","浅色遮盖"],["blur","原图模糊"],["custom","自定义颜色"]]} onChange={(v) => patch("bottomCover", v)} />
              {config.bottomCover === "custom" && <label className="color-field"><span>背景颜色</span><input type="color" value={config.bottomColor} onChange={(e) => patch("bottomColor", e.target.value)} /></label>}
              <Range label="背景强度" value={config.bottomOpacity} min={20} max={100} suffix="%" onChange={(v) => patch("bottomOpacity", v)} />
              <label className="color-field"><span>图标颜色</span><input type="color" value={config.bottomIconColor} onChange={(e) => patch("bottomIconColor", e.target.value)} /></label>

              {(config.bottomStyle === "dock" || config.bottomStyle === "minimal") && <>
                <div className="section-title"><span>图标设置</span><em>ICONS</em></div>
                <Range label="图标数量" value={config.navCount} min={3} max={5} onChange={(v) => patch("navCount", v)} />
                <div className="icon-selects">
                  {Array.from({ length: config.navCount }).map((_, i) => <SelectField key={i} label={`图标 ${i + 1}`} value={config.navIcons[i]} options={ICON_OPTIONS} onChange={(v) => patch("navIcons", config.navIcons.map((x,j) => j === i ? v : x))} />)}
                </div>
              </>}
            </>}
          </div>

          <div className="panel-actions">
            <button className="ghost" onClick={resetAll}>恢复默认</button>
            <button className="primary" disabled={!image} onClick={() => download("png")}>导出 PNG</button>
            <button className="more" disabled={!image} title="导出 JPG" onClick={() => download("jpg")}>JPG</button>
          </div>
          </div>
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <div><span className="status-dot" />实时预览 <small>{sizeText}</small></div>
            <button disabled={!image} onPointerDown={() => setOriginalOnly(true)} onPointerUp={() => setOriginalOnly(false)} onPointerLeave={() => setOriginalOnly(false)}>按住查看原图</button>
          </div>
          <div className={`canvas-stage ${dragging ? "dragging" : ""}`} onDragOver={(e) => {e.preventDefault(); if (phoneModel) setDragging(true)}} onDragLeave={() => setDragging(false)} onDrop={(e) => {e.preventDefault(); setDragging(false); if (phoneModel) openFile(e.dataTransfer.files?.[0])}}>
            {!image && <button className="drop-zone" disabled={!phoneModel} onClick={() => phoneModel && fileRef.current?.click()}>
              <span className="upload-icon">↥</span>
              <strong>{phoneModel ? `上传 ${phoneModel.name} 截图` : "请先选择手机型号"}</strong>
              <small>{phoneModel ? "点击选择，或将 PNG / JPG 拖到这里" : "选择后将自动固定对应的屏幕比例"}</small>
              <em>{phoneModel ? `${phoneSpec(phoneModel)} · 图片不会上传到服务器` : "步骤 01"}</em>
            </button>}
            <div className={`canvas-wrap ${image ? "visible" : ""}`}>
              <canvas ref={canvasRef} className={eraseMode !== "off" && tab === "erase" ? "editing" : ""} onPointerDown={handleCanvasDown} onPointerMove={handleCanvasMove} onPointerUp={handleCanvasUp} onPointerCancel={handleCanvasUp} />
              {image && !originalOnly && <>
                <div className={`guide top ${tab === "top" || tab === "erase" ? "active" : ""}`} style={{height: `${config.topHeight}%`}} />
                <div className={`guide bottom ${tab === "bottom" ? "active" : ""}`} style={{height: `${config.bottomHeight}%`}} />
              </>}
            </div>
          </div>
          <div className="preview-foot"><span>导出时不会包含虚线编辑框</span><span>{phoneModel ? `${phoneModel.name} · ${phoneModel.width}×${phoneModel.height}` : "请先选择手机型号"}</span></div>
        </section>
      </section>
    </main>
  );
}
