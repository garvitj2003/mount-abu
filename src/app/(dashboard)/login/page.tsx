import Image from "next/image";

export default function LoginPage() {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden font-onest`}>
      {/* Background with Animation */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full animate-slow-zoom">
          <Image
            src="/dashboard/images/hero-bg/4.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Left Side: Text Content */}
          <div className="space-y-6 text-white max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.5rem] tracking-tight">
              Mount Abu Nagar Parishad Digital Governance System
            </h1>
            <p className="text-lg text-gray-200 sm:text-xl leading-relaxed opacity-90">
              A unified digital platform to process construction and renovation
              applications, manage material tokens, and resolve civic complaints
              efficiently—ensuring transparency, accountability, and streamlined
              municipal governance.
            </p>
          </div>

          {/* Right Side: Login Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-[20px] bg-white p-8 shadow-2xl">
              {/* Tabs */}
              <div className="mb-8 flex rounded-lg bg-gray-50 p-1">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-50 py-3 text-sm font-semibold text-[#0C83FF] shadow-sm transition-all"
                >
                  <Image
                    src="/dashboard/icons/citizen.svg"
                    alt="Citizen"
                    width={20}
                    height={20}
                  />
                  Citizen Login
                </button>
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-transparent py-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-all"
                >
                   <Image
                    src="/dashboard/icons/authority.svg"
                    alt="Authority"
                    width={20}
                    height={20}
                    className="opacity-60"
                  />
                  Authority Login
                </button>
              </div>

              {/* Login Form */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Login</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter Your Contact number to login
                  </p>
                </div>

                <div className="relative">
                  <div className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-3 focus-within:border-[#0C83FF] focus-within:ring-1 focus-within:ring-[#0C83FF]">
                    <div className="flex items-center gap-2 pr-3 border-r border-gray-300">
                      <Image
                        src="/dashboard/icons/flag.svg"
                        alt="Flag"
                        width={24}
                        height={16}
                        className="object-contain rounded-[2px]"
                      />
                      <span className="text-gray-700 font-medium">+91</span>
                      {/* Dropdown arrow could go here if needed, but not in spec */}
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                        <path d="M1 1L5 5L9 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="tel"
                      className="w-full border-none bg-transparent p-0 pl-3 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="flex w-full justify-center rounded-lg bg-[#0C83FF] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C83FF] transition-colors"
                >
                  Get OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
