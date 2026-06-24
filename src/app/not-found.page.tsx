import { Link } from "react-router";

export default function NotFoundPage() {
	return (
		<div className="flex flex-col items-center justify-center text-sm max-md:px-4 h-svh">
			<h1 className="text-8xl md:text-9xl font-bold text-indigo-500">404</h1>
			<div className="h-1 w-16 rounded bg-indigo-500 my-5 md:my-7"></div>
			<p className="text-2xl md:text-3xl font-bold text-gray-800">صفحه پیدا نشد.</p>
			<p className="text-sm md:text-base mt-4 text-gray-500 max-w-md text-center">
				صفحه‌ای که به دنبال آن هستید ممکن است حذف شده باشد، نام آن تغییر کرده باشد یا به طور موقت در
				دسترس نباشد.
			</p>
			<div className="flex items-center gap-4 mt-6">
				<Link
					className="border border-gray-300 px-7 py-2.5 text-gray-800 rounded-md active:scale-95 transition-all"
					to="/"
				>
					بازگشت به صفحه اصلی
				</Link>
			</div>
		</div>
	);
}
