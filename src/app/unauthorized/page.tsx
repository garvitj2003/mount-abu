import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          You do not have permission to view this page.
        </p>
        <Link href="/authority">
          <span className="mt-6 inline-block rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Back to Dashboard
          </span>
        </Link>
      </div>
    </div>
  );
}
