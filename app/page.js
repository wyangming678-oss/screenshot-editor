"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconCustomAdd, IconLogo, IconUpload, NOTICE_ICONS, NAV_ICONS, NavPreview } from "./icons.js";

const DEFAULT_CONFIG = {
  topHeight: 5.2,
  topStyle: "dark",
  topColor: "#0b0d12",
  topOpacity: 72,
  iconColor: "#ffffff",
  iconScale: 100,
  time: "16:01",
  timePosition: "left",
  timeX: 7,
  network: "5G",
  signalBars: 4,
  signalSide: "right",
  wifi: true,
  wifiStrength: 3,
  wifiStyle: 1,
  wifiSide: "right",
  battery: 87,
  batteryNumber: false,
  batteryStyle: 1,
  batterySide: "right",
  batteryCharging: false,
  batteryFill: "auto",
  noticeSide: "left",
  notificationIcons: ["plane"],
  eraseColor: "#111317",
  eraseSize: 24,
  bottomHeight: 6.2,
  bottomStyle: "gesture",
  bottomCover: "dark",
  bottomColor: "#101319",
  bottomOpacity: 64,
  bottomIconColor: "#ffffff",
  navCount: 4,
  navIcons: ["home", "search", "plus", "user", "chat"],
};

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

function wifiSectorPath(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, Math.PI * 1.25, Math.PI * 1.75);
  ctx.closePath();
}

function drawWifi(ctx, x, cy, scale, color, strength, style) {
  const s = scale;
  const cx = x + 7.5 * s;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  if (style === 2) {
    const apexY = cy + 5.5 * s;
    ctx.globalAlpha = 0.25;
    wifiSectorPath(ctx, cx, apexY, 8 * s);
    ctx.fill();
    ctx.globalAlpha = strength > 0 ? 1 : 0.25;
    const frac = [0, 0.42, 0.72, 1][Math.max(0, Math.min(3, strength))];
    if (frac > 0) {
      wifiSectorPath(ctx, cx, apexY, 8 * s * frac);
      ctx.fill();
    }
  } else if (style === 3) {
    ctx.globalAlpha = strength > 0 ? 1 : 0.25;
    ctx.beginPath();
    ctx.moveTo(cx - 7 * s, cy - 4.5 * s);
    ctx.lineTo(cx + 7 * s, cy - 4.5 * s);
    ctx.lineTo(cx, cy + 5.5 * s);
    ctx.closePath();
    ctx.fill();
  } else if (style === 4) {
    ctx.globalAlpha = strength > 0 ? 1 : 0.25;
    wifiSectorPath(ctx, cx, cy + 5.5 * s, 8 * s);
    ctx.moveTo(cx + 2.2 * s, cy + 5.5 * s);
    ctx.arc(cx, cy + 5.5 * s, 2.2 * s, 0, Math.PI * 2);
    ctx.fill("evenodd");
  } else if (style === 5) {
    const dim = "#c4c8cb";
    ctx.lineWidth = 2.6 * s;
    [[7, 3], [4.6, 2]].forEach(([r, level]) => {
      ctx.strokeStyle = strength >= level ? color : dim;
      ctx.beginPath();
      ctx.arc(cx, cy + 3.6 * s, r * s, Math.PI * 1.22, Math.PI * 1.78);
      ctx.stroke();
    });
    ctx.fillStyle = strength > 0 ? color : dim;
    ctx.beginPath();
    ctx.arc(cx, cy + 5.2 * s, 1.6 * s, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.lineWidth = 1.55 * s;
    [[7, 3], [4.8, 2], [2.4, 1]].forEach(([r, level]) => {
      ctx.globalAlpha = strength >= level ? 1 : 0.22;
      ctx.beginPath();
      ctx.arc(cx, cy + 3.4 * s, r * s, Math.PI * 1.22, Math.PI * 1.78);
      ctx.stroke();
    });
    ctx.globalAlpha = strength > 0 ? 1 : 0.22;
    ctx.beginPath();
    ctx.arc(cx, cy + 5 * s, 1.25 * s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
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

function drawBattery(ctx, x, cy, scale, value, color, showNumber, style, charging, fillColor) {
  const w = 22 * scale;
  const h = 10.5 * scale;
  const green = "#34c759";
  const gray = "#c4c8cb";
  const clamped = Math.max(0, Math.min(100, value));
  const chargeColor = clamped <= 20 && !charging ? "#ff4d58" : (charging || fillColor === "green" ? green : color);
  const inner = Math.max(1.5, (w - 3.2 * scale) * clamped / 100);
  if (style === 2) {
    ctx.strokeStyle = "#d3d3d3";
    ctx.lineWidth = 1.1 * scale;
    roundedRect(ctx, x, cy - h / 2, w, h, 3.2 * scale);
    ctx.stroke();
    ctx.fillStyle = "#d3d3d3";
    roundedRect(ctx, x + w + 1.3 * scale, cy - 2.2 * scale, 1.7 * scale, 4.4 * scale, 0.85 * scale);
    ctx.fill();
    ctx.fillStyle = chargeColor;
    roundedRect(ctx, x + 1.6 * scale, cy - h / 2 + 1.6 * scale, inner, h - 3.2 * scale, 1.35 * scale);
    ctx.fill();
  } else if (style === 3) {
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = color;
    roundedRect(ctx, x, cy - h / 2, w, h, 3.2 * scale);
    ctx.fill();
    roundedRect(ctx, x + w + 1.3 * scale, cy - 2.2 * scale, 1.7 * scale, 4.4 * scale, 0.85 * scale);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = chargeColor;
    roundedRect(ctx, x + 1.2 * scale, cy - h / 2 + 1.2 * scale, inner + 0.8 * scale, h - 2.4 * scale, 2 * scale);
    ctx.fill();
  } else if (style === 4) {
    const chargeW = Math.max(2 * scale, w * clamped / 100);
    ctx.fillStyle = gray;
    roundedRect(ctx, x, cy - h / 2, w, h, 3.2 * scale);
    ctx.fill();
    roundedRect(ctx, x + w + 1.3 * scale, cy - 2.2 * scale, 1.7 * scale, 4.4 * scale, 0.85 * scale);
    ctx.fill();
    ctx.save();
    roundedRect(ctx, x, cy - h / 2, w, h, 3.2 * scale);
    ctx.clip();
    ctx.fillStyle = chargeColor;
    ctx.fillRect(x, cy - h / 2, chargeW, h);
    ctx.restore();
    ctx.fillStyle = chargeColor === "#ffffff" ? "#111318" : "#ffffff";
    ctx.font = `700 ${7.4 * scale}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(Math.round(clamped)), x + Math.max(chargeW / 2, 7 * scale), cy + 0.4 * scale);
    return;
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.1 * scale;
    ctx.globalAlpha = 0.55;
    roundedRect(ctx, x, cy - h / 2, w, h, 3.2 * scale);
    ctx.stroke();
    ctx.fillStyle = color;
    roundedRect(ctx, x + w + 1.3 * scale, cy - 2.2 * scale, 1.7 * scale, 4.4 * scale, 0.85 * scale);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = chargeColor;
    roundedRect(ctx, x + 1.6 * scale, cy - h / 2 + 1.6 * scale, inner, h - 3.2 * scale, 1.35 * scale);
    ctx.fill();
  }
  if (charging) drawBolt(ctx, x + w / 2, cy, scale, chargeColor === "#ffffff" ? "#111318" : (chargeColor === green ? "#111318" : "#ffffff"));
  if (showNumber && !charging) {
    ctx.fillStyle = clamped > 45 ? (color === "#ffffff" ? "#111318" : "#ffffff") : color;
    ctx.font = `600 ${6.7 * scale}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(value), x + w / 2, cy + 0.15 * scale);
  }
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

function itemSide(c, key) {
  if (key === "notices") return c.noticeSide || "left";
  return c[`${key}Side`] || "right";
}

function drawTop(ctx, img, w, h, c, customNoticeImage) {
  const th = h * c.topHeight / 100;
  const scale = Math.max(0.62, w / 390);
  const s = scale * Math.max(0.6, Math.min(1.6, (c.iconScale || 100) / 100));
  coverRegion(ctx, img, 0, 0, w, th, c.topStyle, c.topColor, c.topOpacity);
  const cy = th / 2 + 0.5 * scale;
  const gap = 6 * s;
  const margin = 8 * s;

  ctx.fillStyle = c.iconColor;
  ctx.font = `600 ${15 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textBaseline = "middle";
  const timeText = c.time || "00:00";
  const timeWidth = ctx.measureText(timeText).width;
  if (c.timePosition === "center") {
    ctx.textAlign = "center";
    ctx.fillText(timeText, w / 2, cy);
  } else if (c.timePosition === "right") {
    ctx.textAlign = "right";
    ctx.fillText(timeText, w * (1 - c.timeX / 100), cy);
  } else {
    ctx.textAlign = "left";
    ctx.fillText(timeText, w * c.timeX / 100, cy);
  }

  const notices = (c.notificationIcons || []).slice(0, 5);
  const widths = {
    notices: notices.length * 15 * s,
    wifi: c.wifi ? 15 * s : 0,
    signal: 17 * s + networkTypeWidth(c.network, s),
    battery: 24.5 * s,
  };
  const pos = {};
  let lx = margin;
  if (c.timePosition === "left") lx = w * c.timeX / 100 + timeWidth + gap;
  for (const key of ["notices", "wifi", "signal", "battery"]) {
    if (itemSide(c, key) !== "left" || !widths[key]) continue;
    pos[key] = lx;
    lx += widths[key] + gap;
  }
  let rx = w - margin;
  for (const key of ["battery", "signal", "wifi", "notices"]) {
    if (itemSide(c, key) !== "right" || !widths[key]) continue;
    rx -= widths[key];
    pos[key] = rx;
    rx -= gap;
  }

  if (pos.notices !== undefined) {
    let x = pos.notices;
    for (const notice of notices) {
      x += 7.5 * s;
      drawNotice(ctx, notice, x, cy, s, c.iconColor, customNoticeImage);
      x += 7.5 * s;
    }
  }
  if (c.wifi && pos.wifi !== undefined) drawWifi(ctx, pos.wifi, cy, s, c.iconColor, c.wifiStrength, c.wifiStyle);
  if (pos.signal !== undefined) {
    drawSignal(ctx, pos.signal, cy, s, c.signalBars, c.iconColor);
    drawNetworkType(ctx, c.network, pos.signal + 17 * s, cy, s, c.iconColor);
  }
  if (pos.battery !== undefined) drawBattery(ctx, pos.battery, cy, s, c.battery, c.iconColor, c.batteryNumber, c.batteryStyle, c.batteryCharging, c.batteryFill);
}

const NAV_PATH_DATA = {
  home: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  search: ["M18.5 11a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z", "M21 21l-4.65-4.65"],
  plus: ["M12 5v14", "M5 12h14"],
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"],
  chat: ["M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"],
  phone: ["M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"],
  camera: ["M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z", "M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"],
  heart: ["M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0 0-7.8z"],
};

let navPathCache = null;

function drawNavIcon(ctx, type, x, y, size, color) {
  if (!navPathCache) {
    navPathCache = Object.fromEntries(
      Object.entries(NAV_PATH_DATA).map(([key, arr]) => [key, arr.map((d) => new Path2D(d))])
    );
  }
  const paths = navPathCache[type] || navPathCache.home;
  const g = size / 24;
  ctx.save();
  ctx.translate(x - 12 * g, y - 12 * g);
  ctx.scale(g, g);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const path of paths) ctx.stroke(path);
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
  const scale = Math.max(0.62, w / 390);
  coverRegion(ctx, img, 0, y, w, bh, c.bottomCover, c.bottomColor, c.bottomOpacity);
  const color = c.bottomIconColor;
  if (c.bottomStyle === "gesture") {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.92;
    roundedRect(ctx, w * 0.34, y + bh * 0.72, w * 0.32, Math.max(3 * scale, bh * 0.085), 999);
    ctx.fill();
    ctx.globalAlpha = 1;
  } else if (["android", "vivo", "xiaomi", "huawei"].includes(c.bottomStyle)) {
    const cy = y + bh / 2;
    if (c.bottomStyle === "android") {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.8 * scale;
      ctx.beginPath(); ctx.moveTo(w*.27 + 5*scale, cy-6*scale); ctx.lineTo(w*.27-5*scale, cy); ctx.lineTo(w*.27+5*scale, cy+6*scale); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(w*.5, cy, 6*scale, 0, Math.PI*2); ctx.stroke();
      ctx.strokeRect(w*.73-5.5*scale, cy-5.5*scale, 11*scale, 11*scale);
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

function renderCanvas(canvas, img, config, strokes = [], customNoticeImage = null, originalOnly = false) {
  if (!canvas || !img) return;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0);
  if (!originalOnly) {
    drawEraseStrokes(ctx, strokes, canvas.width, canvas.height, config);
    drawTop(ctx, img, canvas.width, canvas.height, config, customNoticeImage);
    drawBottom(ctx, img, canvas.width, canvas.height, config);
  }
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
      <button type="button" className={value === "left" ? "active" : ""} onClick={() => onChange("left")}>左</button>
      <button type="button" className={value === "right" ? "active" : ""} onClick={() => onChange("right")}>右</button>
    </div>
  );
}

function SideRow({ label, value, onChange }) {
  return (
    <div className="side-row">
      <span>{label}</span>
      <SideToggle value={value} onChange={onChange} />
    </div>
  );
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
  const [customNoticeImage, setCustomNoticeImage] = useState(null);
  const [tab, setTab] = useState("top");
  const [dragging, setDragging] = useState(false);
  const [originalOnly, setOriginalOnly] = useState(false);

  const patch = useCallback((key, value) => setConfig((c) => ({ ...c, [key]: value })), []);
  const sizeText = useMemo(() => image ? `${image.naturalWidth} × ${image.naturalHeight}px` : "等待上传", [image]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => renderCanvas(canvasRef.current, image, config, eraseStrokes, customNoticeImage, originalOnly));
    return () => cancelAnimationFrame(raf);
  }, [image, config, eraseStrokes, customNoticeImage, originalOnly]);

  const openFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const next = new Image();
    next.onload = () => {
      setImage((prev) => {
        if (prev?.src?.startsWith("blob:")) URL.revokeObjectURL(prev.src);
        return next;
      });
      setFileName(file.name.replace(/\.[^.]+$/, ""));
      setEraseStrokes([]);
      setEraseMode("off");
    };
    next.src = url;
  }, []);

  const download = useCallback((type = "png") => {
    if (!canvasRef.current || !image) return;
    renderCanvas(canvasRef.current, image, config, eraseStrokes, customNoticeImage, false);
    const mime = type === "jpg" ? "image/jpeg" : "image/png";
    const link = document.createElement("a");
    link.download = `${fileName || "screenshot"}-edited.${type}`;
    link.href = canvasRef.current.toDataURL(mime, type === "jpg" ? 0.95 : undefined);
    link.click();
  }, [config, customNoticeImage, eraseStrokes, fileName, image]);

  const setBottomPreset = (value) => {
    const heights = { gesture: 6.2, android: 6.5, vivo: 6.8, xiaomi: 6.8, huawei: 6.8, dock: 12.5, minimal: 8 };
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

  const loadCustomNotice = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const icon = new Image();
      icon.onload = () => {
        setCustomNoticeImage(icon);
        setConfig((c) => ({
          ...c,
          notificationIcons: c.notificationIcons.includes("custom")
            ? c.notificationIcons
            : [...c.notificationIcons.slice(0, 4), "custom"],
        }));
      };
      icon.src = reader.result;
    };
    reader.readAsDataURL(file);
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
    if (!image || tab !== "top" || eraseMode === "off") return;
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
    setCustomNoticeImage(null);
  };

  return (
    <main className="app-shell">
      <header className="top-header">
        <div className="brand-mark"><IconLogo size={24} /></div>
        <div className="brand-copy"><h1>截图界面修改工具</h1><p>状态栏 · 底部导航栏 · 原图分辨率导出</p></div>
        <div className="privacy-pill"><span /> 图片仅在当前浏览器处理</div>
      </header>

      <section className="workspace">
        <aside className="control-panel">
          <div className="upload-row">
            <div><span className="eyebrow">当前截图</span><strong>{fileName || "尚未选择图片"}</strong><small>{sizeText}</small></div>
            <button className="secondary" onClick={() => fileRef.current?.click()}>{image ? "更换" : "上传"}</button>
            <input ref={fileRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => openFile(e.target.files?.[0])} />
          </div>

          <div className="tabs">
            <button className={tab === "top" ? "active" : ""} onClick={() => setTab("top")}><i>01</i>顶部状态栏</button>
            <button className={tab === "bottom" ? "active" : ""} onClick={() => setTab("bottom")}><i>02</i>底部导航栏</button>
          </div>

          <div className="controls-scroll">
            {tab === "top" ? <>
              <div className="section-title"><span>区域与背景</span><em>TOP</em></div>
              <Range label="覆盖高度" value={config.topHeight} min={3.5} max={12} step={0.1} suffix="%" onChange={(v) => patch("topHeight", v)} />
              <SelectField label="背景处理" value={config.topStyle} options={[["dark","深色遮盖"],["light","浅色遮盖"],["blur","原图模糊"],["custom","自定义颜色"],["manual","保留原图，手动消除"]]} onChange={(v) => patch("topStyle", v)} />
              {config.topStyle === "custom" && <label className="color-field"><span>背景颜色</span><input type="color" value={config.topColor} onChange={(e) => patch("topColor", e.target.value)} /></label>}
              {config.topStyle !== "manual" && <Range label="背景强度" value={config.topOpacity} min={20} max={100} suffix="%" onChange={(v) => patch("topOpacity", v)} />}

              <div className="section-title"><span>手动消除</span><em>ERASER</em></div>
              <div className="erase-card">
                <div className="tool-buttons">
                  <button disabled={!image} className={eraseMode === "brush" ? "active" : ""} onClick={() => setEraseMode("brush")}>消除笔</button>
                  <button disabled={!image} className={eraseMode === "picker" ? "active" : ""} onClick={() => setEraseMode("picker")}>从图片取色</button>
                  <button className={eraseMode === "off" ? "active" : ""} onClick={() => setEraseMode("off")}>关闭</button>
                </div>
                <label className="color-field"><span>消除颜色</span><input type="color" value={config.eraseColor} onChange={(e) => patch("eraseColor", e.target.value)} /></label>
                <Range label="笔刷大小" value={config.eraseSize} min={6} max={70} suffix="px" onChange={(v) => patch("eraseSize", v)} />
                <div className="erase-actions">
                  <button disabled={!eraseStrokes.length} onClick={() => setEraseStrokes((s) => s.slice(0, -1))}>撤销上一笔</button>
                  <button disabled={!eraseStrokes.length} onClick={() => setEraseStrokes([])}>清空消除</button>
                </div>
                {eraseMode !== "off" && <p>{eraseMode === "picker" ? "请点击截图顶部，吸取原图颜色" : "请在原图顶部按住并拖动，覆盖原有内容"}</p>}
              </div>

              <div className="section-title"><span>时间</span><em>TIME</em></div>
              <div className="field-pair">
                <label className="field"><span>显示时间</span><input value={config.time} maxLength={8} onChange={(e) => patch("time", e.target.value)} /></label>
                <SelectField label="时间位置" value={config.timePosition} options={[["left","左侧"],["center","居中"],["right","右侧"]]} onChange={(v) => patch("timePosition", v)} />
              </div>
              {config.timePosition !== "center" && <Range label="边缘距离" value={config.timeX} min={2} max={25} suffix="%" onChange={(v) => patch("timeX", v)} />}

              <div className="section-title"><span>状态图标</span><em>STATUS</em></div>
              <Range label="图标大小" value={config.iconScale} min={60} max={160} step={5} suffix="%" onChange={(v) => patch("iconScale", v)} />
              <SelectField label="系统图标颜色" value={config.iconColor} options={[["#ffffff","白色"],["#000000","黑色"]]} onChange={(v) => patch("iconColor", v)} />

              <div className="section-title"><span>信号</span><em>SIGNAL</em></div>
              <div className="field-pair">
                <SelectField label="网络类型" value={config.network} options={["5G","4G","LTE","隐藏"]} onChange={(v) => patch("network", v)} />
                <SideRow label="显示位置" value={config.signalSide} onChange={(v) => patch("signalSide", v)} />
              </div>
              <Range label="信号强度" value={config.signalBars} min={0} max={4} onChange={(v) => patch("signalBars", v)} />

              <div className="section-title"><span>Wi-Fi</span><em>WIFI</em></div>
              <div className="field-pair">
                <SelectField label="图标样式" value={config.wifiStyle} options={[[1,"Wifi 1 弧线"],[2,"Wifi 2 填充扇形"],[3,"Wifi 3 填充三角"],[4,"Wifi 4 安卓扇面"],[5,"Wifi 5 双色粗弧"]]} onChange={(v) => patch("wifiStyle", Number(v))} />
                <SideRow label="显示位置" value={config.wifiSide} onChange={(v) => patch("wifiSide", v)} />
              </div>
              <div className="toggle-grid">
                <Toggle label="显示 Wi-Fi" checked={config.wifi} onChange={(v) => patch("wifi", v)} />
              </div>
              {config.wifi && <Range label="Wi-Fi 强度" value={config.wifiStrength} min={0} max={3} onChange={(v) => patch("wifiStrength", v)} />}

              <div className="section-title"><span>电池</span><em>BATTERY</em></div>
              <div className="field-pair">
                <SelectField label="图标样式" value={config.batteryStyle} options={[[1,"电池 1 描边"],[2,"电池 2 灰边框"],[3,"电池 3 填充"],[4,"电池 4 数字填充"]]} onChange={(v) => patch("batteryStyle", Number(v))} />
                <SideRow label="显示位置" value={config.batterySide} onChange={(v) => patch("batterySide", v)} />
              </div>
              <div className="field-pair">
                <SelectField label="填充颜色" value={config.batteryFill} options={[["auto","跟随图标"],["green","绿色"]]} onChange={(v) => patch("batteryFill", v)} />
              </div>
              <Range label="剩余电量" value={config.battery} min={1} max={100} suffix="%" onChange={(v) => patch("battery", v)} />
              <div className="toggle-grid">
                <Toggle label="电池内数字" checked={config.batteryNumber} onChange={(v) => patch("batteryNumber", v)} />
                <Toggle label="充电闪电" checked={config.batteryCharging} onChange={(v) => patch("batteryCharging", v)} />
              </div>

              <div className="section-title"><span>通知图标</span><em>最多 5 个</em></div>
              <SideRow label="显示位置" value={config.noticeSide} onChange={(v) => patch("noticeSide", v)} />
              <div className="notice-grid">
                {NOTICE_OPTIONS.map(([value, label]) => {
                  const Glyph = NOTICE_ICONS[value];
                  return <button key={value} className={config.notificationIcons.includes(value) ? "selected" : ""} onClick={() => toggleNotice(value)}><span><Glyph size={13} /></span>{label}</button>;
                })}
                <button className={config.notificationIcons.includes("custom") ? "selected" : ""} onClick={() => customNoticeImage ? toggleNotice("custom") : customIconRef.current?.click()}><span><IconCustomAdd size={13} /></span>{customNoticeImage ? "自定义" : "上传图标"}</button>
              </div>
              {customNoticeImage && <button className="upload-custom" onClick={() => customIconRef.current?.click()}>更换自定义图标</button>}
              <input ref={customIconRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => loadCustomNotice(e.target.files?.[0])} />
            </> : <>
              <div className="section-title"><span>导航栏样式</span><em>BOTTOM</em></div>
              <div className="style-grid">
                {[["gesture","手势横条"],["android","安卓三键"],["vivo","vivo OriginOS"],["xiaomi","小米 HyperOS"],["huawei","华为 HarmonyOS"],["dock","图标 Dock"],["minimal","简洁图标"]].map(([v,l]) => <button key={v} className={config.bottomStyle === v ? "selected" : ""} onClick={() => setBottomPreset(v)}><NavPreview variant={v} />{l}</button>)}
              </div>
              <Range label="覆盖高度" value={config.bottomHeight} min={3} max={20} step={0.1} suffix="%" onChange={(v) => patch("bottomHeight", v)} />
              <SelectField label="背景处理" value={config.bottomCover} options={[["dark","深色遮盖"],["light","浅色遮盖"],["blur","原图模糊"],["custom","自定义颜色"]]} onChange={(v) => patch("bottomCover", v)} />
              {config.bottomCover === "custom" && <label className="color-field"><span>背景颜色</span><input type="color" value={config.bottomColor} onChange={(e) => patch("bottomColor", e.target.value)} /></label>}
              <Range label="背景强度" value={config.bottomOpacity} min={20} max={100} suffix="%" onChange={(v) => patch("bottomOpacity", v)} />
              <label className="color-field"><span>图标颜色</span><input type="color" value={config.bottomIconColor} onChange={(e) => patch("bottomIconColor", e.target.value)} /></label>

              {(config.bottomStyle === "dock" || config.bottomStyle === "minimal") && <>
                <div className="section-title"><span>图标设置</span><em>ICONS</em></div>
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
          </div>

          <div className="panel-actions">
            <button className="ghost" onClick={resetAll}>恢复默认</button>
            <button className="primary" disabled={!image} onClick={() => download("png")}>导出 PNG</button>
            <button className="more" disabled={!image} title="导出 JPG" onClick={() => download("jpg")}>JPG</button>
          </div>
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <div><span className="status-dot" />实时预览 <small>{sizeText}</small></div>
            <button disabled={!image} onPointerDown={() => setOriginalOnly(true)} onPointerUp={() => setOriginalOnly(false)} onPointerLeave={() => setOriginalOnly(false)}>按住查看原图</button>
          </div>
          <div className={`canvas-stage ${dragging ? "dragging" : ""}`} onDragOver={(e) => {e.preventDefault(); setDragging(true)}} onDragLeave={() => setDragging(false)} onDrop={(e) => {e.preventDefault(); setDragging(false); openFile(e.dataTransfer.files?.[0])}}>
            {!image && <button className="drop-zone" onClick={() => fileRef.current?.click()}>
              <span className="upload-icon"><IconUpload size={26} /></span>
              <strong>上传一张手机截图</strong>
              <small>点击选择，或将 PNG / JPG 拖到这里</small>
              <em>图片不会上传到服务器</em>
            </button>}
            <div className={`canvas-wrap ${image ? "visible" : ""}`}>
              <canvas ref={canvasRef} className={eraseMode !== "off" && tab === "top" ? "editing" : ""} onPointerDown={handleCanvasDown} onPointerMove={handleCanvasMove} onPointerUp={handleCanvasUp} onPointerCancel={handleCanvasUp} />
              {image && !originalOnly && <>
                <div className={`guide top ${tab === "top" ? "active" : ""}`} style={{height: `${config.topHeight}%`}}><span>顶部编辑区</span></div>
                <div className={`guide bottom ${tab === "bottom" ? "active" : ""}`} style={{height: `${config.bottomHeight}%`}}><span>底部编辑区</span></div>
              </>}
            </div>
          </div>
          <div className="preview-foot"><span>导出时不会包含虚线编辑框</span><span>原始像素 1:1 保留</span></div>
        </section>
      </section>
    </main>
  );
}
