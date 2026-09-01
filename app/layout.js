import "./globals.css";

export const metadata = {
  title: "截图界面修改工具",
  description: "在浏览器本地修改手机截图的状态栏与底部导航栏",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
