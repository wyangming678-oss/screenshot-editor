function Svg({ size = 18, children, fill = "none", ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const IconLogo = (p) => (
  <Svg {...p}>
    <rect x="4" y="2.5" width="16" height="19" rx="3.5" />
    <path d="M8 6.5h8" />
    <circle cx="9.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
    <path d="M19 15.5l-4-4-7 7" />
  </Svg>
);

export const IconUpload = (p) => (
  <Svg {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </Svg>
);

export const IconPlane = (p) => (
  <Svg {...p}>
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </Svg>
);

export const IconBell = (p) => (
  <Svg {...p}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

export const IconPin = (p) => (
  <Svg {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);

export const IconTelegram = (p) => (
  <Svg fill="currentColor" stroke="none" {...p}>
    <path d="M21.9 4.3 18.9 19c-.2 1-.8 1.2-1.6.8l-4.4-3.3-2.1 2.1c-.2.2-.4.4-.9.4l.4-4.6 8.3-7.5c.4-.3-.1-.5-.6-.2L7.5 13.4l-4.4-1.4c-1-.3-1-1 .2-1.4l17-6.6c.8-.3 1.5.2 1.2 1.5z" />
  </Svg>
);

export const IconAmazon = (p) => (
  <Svg {...p}>
    <path d="M4.4 16.6c2.5 1.9 5.7 3 9.2 3 2.8 0 5.5-.8 7.8-2.2" />
    <path d="M18.4 14.8l3.3.7-.7 3.3" />
  </Svg>
);

export const IconTiktok = (p) => (
  <Svg {...p}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </Svg>
);

export const IconSms = (p) => (
  <Svg {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

export const IconUber = (p) => (
  <Svg {...p}>
    <path d="M7 3v10a5 5 0 0 0 10 0V3" />
  </Svg>
);

export const IconFacebook = (p) => (
  <Svg fill="currentColor" stroke="none" {...p}>
    <path d="M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07C0 18.06 4.39 23.02 10.13 23.9v-8.38H7.08v-3.47h3.05V9.43c0-3 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07z" />
  </Svg>
);

export const IconInstagram = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
    <circle cx="12" cy="12" r="4.3" />
    <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconCustomAdd = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </Svg>
);

export const IconHome = (p) => (
  <Svg {...p}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </Svg>
);

export const IconSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7.5" />
    <line x1="21" y1="21" x2="16.4" y2="16.4" />
  </Svg>
);

export const IconPlus = (p) => (
  <Svg {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);

export const IconUser = (p) => (
  <Svg {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Svg>
);

export const IconChat = (p) => (
  <Svg {...p}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </Svg>
);

export const IconPhone = (p) => (
  <Svg {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </Svg>
);

export const IconCamera = (p) => (
  <Svg {...p}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </Svg>
);

export const IconHeart = (p) => (
  <Svg {...p}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0 0-7.8z" />
  </Svg>
);

export const NOTICE_ICONS = {
  plane: IconPlane,
  bell: IconBell,
  location: IconPin,
  telegram: IconTelegram,
  amazon: IconAmazon,
  tiktok: IconTiktok,
  sms: IconSms,
  uber: IconUber,
  facebook: IconFacebook,
  instagram: IconInstagram,
};

export const NAV_ICONS = {
  home: IconHome,
  search: IconSearch,
  plus: IconPlus,
  user: IconUser,
  chat: IconChat,
  phone: IconPhone,
  camera: IconCamera,
  heart: IconHeart,
};

export function NavPreview({ variant }) {
  const stroke = { stroke: "#fff", strokeWidth: 1.6, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg className="style-preview" viewBox="0 0 42 25" aria-hidden="true">
      <rect width="42" height="25" rx="6" fill="#1d2624" />
      {variant === "gesture" && <rect x="13" y="19" width="16" height="2.6" rx="1.3" fill="#fff" />}
      {variant === "gestureThin" && <rect x="13" y="19.6" width="16" height="1.2" rx="0.6" fill="#fff" />}
      {variant === "threeLeft" && (
        <>
          <path d="M12.5 8.8 7.8 12.5l4.7 3.7" {...stroke} />
          <circle cx="21" cy="12.5" r="3.8" {...stroke} />
          <rect x="30.2" y="8.7" width="7.6" height="7.6" rx="1" {...stroke} />
        </>
      )}
      {variant === "threeRight" && (
        <>
          <rect x="4.2" y="8.7" width="7.6" height="7.6" rx="1" {...stroke} />
          <circle cx="21" cy="12.5" r="3.8" {...stroke} />
          <path d="M29.8 8.8 34.5 12.5l-4.7 3.7" {...stroke} />
        </>
      )}
      {variant === "samsung" && (
        <>
          <path d="M12.5 8.8 7.8 12.5l4.7 3.7" {...stroke} />
          <circle cx="21" cy="12.5" r="3.8" {...stroke} />
          <path d="M34 8.7v7.6" {...stroke} />
        </>
      )}
      {variant === "android" && (
        <>
          <path d="M12.5 8.8 7.8 12.5l4.7 3.7" {...stroke} />
          <circle cx="21" cy="12.5" r="3.8" {...stroke} />
          <rect x="30.2" y="8.7" width="7.6" height="7.6" rx="1" {...stroke} />
        </>
      )}
      {variant === "vivo" && (
        <>
          <path d="M6 9.5h8M6 12.5h8M6 15.5h8" {...stroke} strokeWidth="1.4" />
          <circle cx="21" cy="12.5" r="3.8" {...stroke} />
          <path d="M34.2 8.8 29.5 12.5l4.7 3.7" {...stroke} />
        </>
      )}
      {variant === "xiaomi" && (
        <>
          <rect x="6.8" y="8.7" width="7.6" height="7.6" rx="1.6" {...stroke} />
          <circle cx="21" cy="12.5" r="3.8" {...stroke} />
          <path d="M34.2 8.8 29.5 12.5l4.7 3.7" {...stroke} />
        </>
      )}
      {variant === "huawei" && (
        <>
          <path d="M12.3 8.8 7.6 12.5l4.7 3.7" {...stroke} />
          <circle cx="21" cy="12.5" r="3.8" {...stroke} />
          <rect x="30.2" y="8.7" width="7.6" height="7.6" rx="2.2" {...stroke} />
        </>
      )}
      {(variant === "dock" || variant === "minimal") && (
        <>
          {variant === "dock" && <rect x="3" y="3" width="36" height="19" rx="5.5" fill="rgba(255,255,255,.18)" />}
          <circle cx="10.5" cy="12.5" r="1.7" fill="#fff" />
          <circle cx="17.5" cy="12.5" r="1.7" fill="#fff" />
          <circle cx="24.5" cy="12.5" r="1.7" fill="#fff" />
          <circle cx="31.5" cy="12.5" r="1.7" fill="#fff" />
        </>
      )}
    </svg>
  );
}

export function BatteryPreview({ type }) {
  const o = { stroke: "#fff", strokeWidth: 1.1, fill: "none" };
  const num = (x, y, size = 5.4, anchor = "middle") => (
    <text x={x} y={y} fill="#fff" fontSize={size} fontWeight="700" textAnchor={anchor} fontFamily="system-ui, sans-serif">87</text>
  );
  const hBody = (extra) => (
    <>
      <rect x="4" y="8" width="22" height="10" rx="3" {...o} {...extra} />
      <rect x="27" y="11" width="1.8" height="4" rx="0.9" fill="#fff" />
    </>
  );
  const vBody = (
    <>
      <rect x="11" y="4" width="10" height="20" rx="3" {...o} />
      <rect x="14" y="2" width="4" height="1.6" rx="0.8" fill="#fff" />
    </>
  );
  return (
    <svg className="battery-preview" viewBox="0 0 46 28" aria-hidden="true">
      <rect width="46" height="28" rx="6" fill="#1d2624" />
      {type === 1 && (<>{hBody()}<circle cx="15" cy="13" r="4.4" fill="#fff" /><text x="15" y="15" fill="#1d2624" fontSize="5.4" fontWeight="700" textAnchor="middle" fontFamily="system-ui, sans-serif">87</text></>)}
      {type === 2 && (<>{hBody()}<rect x="5.6" y="9.6" width="15" height="6.8" rx="1.6" fill="#fff" /></>)}
      {type === 3 && (<>{hBody()}<rect x="5.6" y="9.6" width="12" height="6.8" rx="1.6" fill="#fff" />{num(36, 15.4, 6, "start")}</>)}
      {type === 4 && (<>{hBody()}<rect x="5.6" y="9.6" width="17" height="6.8" rx="1.6" fill="#fff" />{num(14.5, 15.2, 4.6)}</>)}
      {type === 5 && (<><rect x="4" y="8" width="22" height="10" rx="3" fill="#fff" /><rect x="27" y="11" width="1.8" height="4" rx="0.9" fill="#fff" />{num(36, 15.4, 6, "start")}</>)}
      {type === 6 && (<>{hBody({ strokeWidth: 0.8 })}<rect x="5.6" y="9.6" width="14" height="6.8" rx="3" fill="#fff" /></>)}
      {type === 7 && (<><rect x="7" y="9" width="18" height="8.4" rx="2.4" {...o} /><rect x="25.8" y="11.4" width="1.6" height="3.6" rx="0.8" fill="#fff" />{num(16, 15.2, 4.8)}</>)}
      {type === 8 && (<>{vBody}<rect x="12.6" y="12" width="6.8" height="10.4" rx="1.6" fill="#fff" />{num(30, 16, 6, "start")}</>)}
      {type === 9 && (<><rect x="13" y="4" width="6.4" height="20" rx="3" {...o} /><rect x="14.8" y="2" width="2.8" height="1.6" rx="0.8" fill="#fff" /><rect x="14.2" y="13" width="4" height="9.4" rx="1.6" fill="#fff" />{num(28, 16, 6, "start")}</>)}
      {type === 10 && (<>{hBody()}<rect x="7" y="9.4" width="12" height="7.2" rx="2" fill="#fff" /><text x="13" y="14.9" fill="#1d2624" fontSize="4.8" fontWeight="700" textAnchor="middle" fontFamily="system-ui, sans-serif">87</text></>)}
    </svg>
  );
}
