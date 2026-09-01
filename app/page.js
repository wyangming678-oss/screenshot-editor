"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_CONFIG = {
  topHeight: 5.2,
  topStyle: "dark",
  topColor: "#0b0d12",
  topOpacity: 72,
  iconColor: "#ffffff",
  time: "16:01",
  timePosition: "left",
  timeX: 7,
  network: "5G",
  signalBars: 4,
  wifi: true,
  wifiStrength: 3,
  battery: 87,
  batteryNumber: false,
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
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.55 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (type === "custom" && customImage) {
    ctx.save();
    roundedRect(ctx, x - 7 * scale, cy - 7 * scale, 14 * scale, 14 * scale, 2.5 * scale);
    ctx.clip();
    ctx.drawImage(customImage, x - 7 * scale, cy - 7 * scale, 14 * scale, 14 * scale);
    ctx.restore();
  } else if (type === "plane") {
    ctx.save();
    ctx.translate(x, cy);
    ctx.rotate(-0.12);
    ctx.beginPath();
    ctx.moveTo(-7 * scale, -1 * scale);
    ctx.lineTo(-1.5 * scale, -1 * scale);
    ctx.lineTo(2.5 * scale, -7 * scale);
    ctx.lineTo(4.4 * scale, -7 * scale);
    ctx.lineTo(2.5 * scale, -1 * scale);
    ctx.lineTo(7 * scale, 0.2 * scale);
    ctx.lineTo(7 * scale, 1.8 * scale);
    ctx.lineTo(2.2 * scale, 2 * scale);
    ctx.lineTo(-0.2 * scale, 6 * scale);
    ctx.lineTo(-1.9 * scale, 6 * scale);
    ctx.lineTo(-0.9 * scale, 1.8 * scale);
    ctx.lineTo(-6.6 * scale, 1.2 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (type === "bell") {
    ctx.beginPath();
    ctx.arc(x, cy - 1.3 * scale, 4.1 * scale, Math.PI, 0);
    ctx.lineTo(x + 4.1 * scale, cy + 3.2 * scale);
    ctx.lineTo(x - 4.1 * scale, cy + 3.2 * scale);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, cy + 4 * scale, 1.2 * scale, 0, Math.PI);
    ctx.stroke();
  } else if (type === "location") {
    ctx.beginPath();
    ctx.arc(x, cy - 1.8 * scale, 4.5 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 2.6 * scale, cy + 1.6 * scale);
    ctx.lineTo(x, cy + 6.2 * scale);
    ctx.lineTo(x + 2.6 * scale, cy + 1.6 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, cy - 1.8 * scale, 1.3 * scale, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "telegram") {
    ctx.beginPath();
    ctx.arc(x, cy, 6.7 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 4.5 * scale, cy - .5 * scale);
    ctx.lineTo(x + 5 * scale, cy - 4 * scale);
    ctx.lineTo(x + 1.8 * scale, cy + 5 * scale);
    ctx.lineTo(x - .6 * scale, cy + 1.2 * scale);
    ctx.closePath();
    ctx.fill();
  } else if (type === "amazon") {
    ctx.font = `700 ${11 * scale}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("a", x, cy - 1.4 * scale);
    ctx.beginPath();
    ctx.arc(x, cy + 1.3 * scale, 5.1 * scale, .2 * Math.PI, .8 * Math.PI);
    ctx.stroke();
  } else if (type === "tiktok") {
    ctx.lineWidth = 2.1 * scale;
    ctx.beginPath();
    ctx.moveTo(x + 1.8 * scale, cy - 6 * scale);
    ctx.lineTo(x + 1.8 * scale, cy + 2.8 * scale);
    ctx.arc(x - 1.5 * scale, cy + 3 * scale, 3.3 * scale, 0, Math.PI * 2);
    ctx.moveTo(x + 1.8 * scale, cy - 5.5 * scale);
    ctx.quadraticCurveTo(x + 3.4 * scale, cy - 1.5 * scale, x + 6 * scale, cy - 1.4 * scale);
    ctx.stroke();
  } else if (type === "sms") {
    roundedRect(ctx, x - 6.5 * scale, cy - 5.2 * scale, 13 * scale, 9.5 * scale, 3 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 2.5 * scale, cy + 4 * scale);
    ctx.lineTo(x - 4.4 * scale, cy + 7 * scale);
    ctx.lineTo(x + .5 * scale, cy + 4.2 * scale);
    ctx.stroke();
  } else if (type === "uber") {
    roundedRect(ctx, x - 6.5 * scale, cy - 6.5 * scale, 13 * scale, 13 * scale, 2.5 * scale);
    ctx.stroke();
    ctx.font = `700 ${8.5 * scale}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("U", x, cy + .3 * scale);
  } else if (type === "facebook") {
    ctx.font = `800 ${16 * scale}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("f", x + .8 * scale, cy + 1.5 * scale);
  } else if (type === "instagram") {
    roundedRect(ctx, x - 6.2 * scale, cy - 6.2 * scale, 12.4 * scale, 12.4 * scale, 3.5 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, cy, 3.1 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 3.8 * scale, cy - 3.8 * scale, .9 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEraseStrokes(ctx, strokes, w, h, c) {
  if (!strokes.length) return;
  const scale = Math.max(.62, w / 390);
  ctx.save();
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

function drawTop(ctx, img, w, h, c, strokes, customNoticeImage) {
  const th = h * c.topHeight / 100;
  const scale = Math.max(0.62, w / 390);
  coverRegion(ctx, img, 0, 0, w, th, c.topStyle, c.topColor, c.topOpacity);
  if (c.topStyle === "manual") drawEraseStrokes(ctx, strokes, w, h, c);
  const cy = th / 2 + 0.5 * scale;
  ctx.fillStyle = c.iconColor;
  ctx.font = `600 ${15 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
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

  let x = w - 8 * scale;
  x -= 24.5 * scale;
  drawBattery(ctx, x, cy, scale, c.battery, c.iconColor, c.batteryNumber);
  x -= 8.5 * scale;
  if (c.network !== "隐藏") {
    ctx.font = `650 ${9.5 * scale}px system-ui, sans-serif`;
    ctx.textAlign = "right";
    ctx.fillStyle = c.iconColor;
    ctx.fillText(c.network, x, cy + 0.2 * scale);
    x -= (c.network.length * 6.2 + 4) * scale;
  }
  if (c.wifi) {
    x -= 7 * scale;
    drawWifi(ctx, x, cy, scale, c.iconColor, c.wifiStrength);
    x -= 11 * scale;
  }
  x -= 13 * scale;
  drawSignal(ctx, x, cy, scale, c.signalBars, c.iconColor);
  const notices = (c.notificationIcons || []).slice(0, 5);
  for (const notice of notices) {
    x -= 15 * scale;
    drawNotice(ctx, notice, x, cy, scale, c.iconColor, customNoticeImage);
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
    drawTop(ctx, img, canvas.width, canvas.height, config, strokes, customNoticeImage);
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

  useEffect(() => renderCanvas(canvasRef.current, image, config, eraseStrokes, customNoticeImage, originalOnly), [image, config, eraseStrokes, customNoticeImage, originalOnly]);

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
        <div className="brand-mark">SE</div>
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
                  <button disabled={!image} className={eraseMode === "brush" ? "active" : ""} onClick={() => { patch("topStyle", "manual"); setEraseMode("brush"); }}>消除笔</button>
                  <button disabled={!image} className={eraseMode === "picker" ? "active" : ""} onClick={() => { patch("topStyle", "manual"); setEraseMode("picker"); }}>从图片取色</button>
                  <button className={eraseMode === "off" ? "active" : ""} onClick={() => setEraseMode("off")}>关闭</button>
                </div>
                <label className="color-field"><span>消除颜色</span><input type="color" value={config.eraseColor} onChange={(e) => patch("eraseColor", e.target.value)} /></label>
                <Range label="笔刷大小" value={config.eraseSize} min={6} max={70} suffix="px" onChange={(v) => patch("eraseSize", v)} />
                <div className="erase-actions">
                  <button disabled={!eraseStrokes.length} onClick={() => setEraseStrokes((s) => s.slice(0, -1))}>撤销上一笔</button>
                  <button disabled={!eraseStrokes.length} onClick={() => setEraseStrokes([])}>清空消除</button>
                </div>
                {eraseMode !== "off" && <p>{eraseMode === "picker" ? "请点击截图顶部，吸取原图颜色" : "请在截图顶部按住并拖动进行消除"}</p>}
              </div>

              <div className="section-title"><span>时间</span><em>TIME</em></div>
              <div className="field-pair">
                <label className="field"><span>显示时间</span><input value={config.time} maxLength={8} onChange={(e) => patch("time", e.target.value)} /></label>
                <SelectField label="时间位置" value={config.timePosition} options={[["left","左侧"],["center","居中"],["right","右侧"]]} onChange={(v) => patch("timePosition", v)} />
              </div>
              {config.timePosition !== "center" && <Range label="边缘距离" value={config.timeX} min={2} max={25} suffix="%" onChange={(v) => patch("timeX", v)} />}

              <div className="section-title"><span>状态图标</span><em>STATUS</em></div>
              <SelectField label="网络类型" value={config.network} options={["5G","4G","LTE","隐藏"]} onChange={(v) => patch("network", v)} />
              <Range label="信号强度" value={config.signalBars} min={0} max={4} onChange={(v) => patch("signalBars", v)} />
              {config.wifi && <Range label="Wi-Fi 强度" value={config.wifiStrength} min={0} max={3} onChange={(v) => patch("wifiStrength", v)} />}
              <Range label="剩余电量" value={config.battery} min={1} max={100} suffix="%" onChange={(v) => patch("battery", v)} />
              <div className="toggle-grid">
                <Toggle label="显示 Wi-Fi" checked={config.wifi} onChange={(v) => patch("wifi", v)} />
                <Toggle label="电池内数字" checked={config.batteryNumber} onChange={(v) => patch("batteryNumber", v)} />
              </div>
              <label className="color-field"><span>图标颜色</span><input type="color" value={config.iconColor} onChange={(e) => patch("iconColor", e.target.value)} /></label>

              <div className="section-title"><span>通知图标</span><em>最多 5 个</em></div>
              <div className="notice-grid">
                {NOTICE_OPTIONS.map(([value, label]) => <button key={value} className={config.notificationIcons.includes(value) ? "selected" : ""} onClick={() => toggleNotice(value)}><span>{label.slice(0, 1)}</span>{label}</button>)}
                <button className={config.notificationIcons.includes("custom") ? "selected" : ""} onClick={() => customNoticeImage ? toggleNotice("custom") : customIconRef.current?.click()}><span>＋</span>{customNoticeImage ? "自定义" : "上传图标"}</button>
              </div>
              {customNoticeImage && <button className="upload-custom" onClick={() => customIconRef.current?.click()}>更换自定义图标</button>}
              <input ref={customIconRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => loadCustomNotice(e.target.files?.[0])} />
            </> : <>
              <div className="section-title"><span>导航栏样式</span><em>BOTTOM</em></div>
              <div className="style-grid">
                {[["gesture","手势横条"],["android","安卓三键"],["vivo","vivo OriginOS"],["xiaomi","小米 HyperOS"],["huawei","华为 HarmonyOS"],["dock","图标 Dock"],["minimal","简洁图标"]].map(([v,l]) => <button key={v} className={config.bottomStyle === v ? "selected" : ""} onClick={() => setBottomPreset(v)}><span className={`style-preview ${v}`} />{l}</button>)}
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
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <div><span className="status-dot" />实时预览 <small>{sizeText}</small></div>
            <button disabled={!image} onPointerDown={() => setOriginalOnly(true)} onPointerUp={() => setOriginalOnly(false)} onPointerLeave={() => setOriginalOnly(false)}>按住查看原图</button>
          </div>
          <div className={`canvas-stage ${dragging ? "dragging" : ""}`} onDragOver={(e) => {e.preventDefault(); setDragging(true)}} onDragLeave={() => setDragging(false)} onDrop={(e) => {e.preventDefault(); setDragging(false); openFile(e.dataTransfer.files?.[0])}}>
            {!image && <button className="drop-zone" onClick={() => fileRef.current?.click()}>
              <span className="upload-icon">↥</span>
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
