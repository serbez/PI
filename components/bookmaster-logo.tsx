export function BookmasterLogo() {
  return (
    <div className="flex items-center gap-3 p-6">
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Stylized book pages */}
        <path d="M30 20 L45 10 L45 60 L30 70 Z" fill="#D4E5A3" stroke="#2C3E1F" strokeWidth="1.5" />
        <path d="M45 10 L60 15 L60 65 L45 60 Z" fill="#A8C973" stroke="#2C3E1F" strokeWidth="1.5" />
        <path d="M60 15 L75 20 L75 70 L60 65 Z" fill="#7FA84F" stroke="#2C3E1F" strokeWidth="1.5" />
        <path d="M75 20 L85 30 L85 75 L75 70 Z" fill="#2C3E1F" />
      </svg>
      <div className="flex flex-col">
        <div className="text-lg font-bold tracking-tight">
          BOOKMASTER<sup className="text-xs">™</sup>
        </div>
        <div className="text-3xl font-bold tracking-tight">3000</div>
      </div>
    </div>
  )
}
