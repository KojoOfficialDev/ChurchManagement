import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__auth')({
  component: AuthRoute,
})

function AuthRoute() {
  return (
    <div className="min-h-screen py-8 flex bg-[#f8f8f8]">
      <Outlet />

      <div className="flex-1 bg-[#4a1fb8] rounded-l-3xl p-12 flex flex-col justify-start items-start relative overflow-hidden">
        <div className="relative z-10 mb-8">
          <h2 className="text-white text-5xl font-bold mb-3">ParishDesk</h2>
          <p className="text-white/90 text-xl">Church management simplified</p>
        </div>

        {/* Church Image */}
        <div className="relative z-10 w-full flex-1 flex items-center justify-center">
          <img
            src="/image-1.webp"
            alt="Modern church building"
            className="w-full h-auto max-h-[500px] object-cover rounded-2xl object-top"
          />
        </div>
      </div>
    </div>
  )
}
