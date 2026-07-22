export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 items-center justify-center p-6 md:p-10">
      {children}
    </div>
  )
}
