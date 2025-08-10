export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>; // 直接渲染子组件，或添加特定于认证的布局结构
}
