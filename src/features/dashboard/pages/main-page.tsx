import {
	ArrowLeftIcon,
	BookOpenIcon,
	ChartPieIcon,
	ChevronLeftIcon,
	ClipboardCheckIcon,
	ClockIcon,
	FileTextIcon,
	PlusIcon,
	ShieldAlertIcon,
	Users2Icon,
} from "lucide-react";
import { Link } from "react-router";
import colors from "tailwindcss/colors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPieDonutText } from "../components/chart-pie-donut-text";
import { GradingTable } from "../components/exams-list";

const ungradedExamsChartData = [
	{ key: "تشریحی", value: 275, fill: "var(--color-a)" },
	{ key: "گزینه ای", value: 200, fill: "var(--color-b)" },
	{ key: "ویدیویی", value: 287, fill: "var(--color-c)" },
	{ key: "صوتی", value: 173, fill: "var(--color-d)" },
	{ key: "ترتیبی", value: 190, fill: "var(--color-e)" },
];
const ungradedExamsChartConfig = {
	total: {
		label: "عدد",
	},
	a: {
		label: "a",
		color: colors.violet[300],
	},
	b: {
		label: "b",
		color: colors.violet[400],
	},
	c: {
		label: "c",
		color: colors.violet[500],
	},
	d: {
		label: "d",
		color: colors.violet[600],
	},
	e: {
		label: "e",
		color: colors.violet[700],
	},
};
const examsChartData = [
	{ key: "تشریحی", value: 275, fill: "var(--color-a)" },
	{ key: "گزینه ای", value: 200, fill: "var(--color-b)" },
	{ key: "ویدیویی", value: 287, fill: "var(--color-c)" },
	{ key: "صوتی", value: 173, fill: "var(--color-d)" },
	{ key: "ترتیبی", value: 190, fill: "var(--color-e)" },
];
const examsChartConfig = {
	total: {
		label: "عدد",
	},
	a: {
		label: "a",
		color: colors.blue[300],
	},
	b: {
		label: "b",
		color: colors.blue[400],
	},
	c: {
		label: "c",
		color: colors.blue[500],
	},
	d: {
		label: "d",
		color: colors.blue[600],
	},
	e: {
		label: "e",
		color: colors.blue[700],
	},
};
const questionBankChartData = [
	{ key: "تشریحی", value: 275, fill: "var(--color-a)" },
	{ key: "گزینه ای", value: 200, fill: "var(--color-b)" },
	{ key: "ویدیویی", value: 287, fill: "var(--color-c)" },
	{ key: "صوتی", value: 173, fill: "var(--color-d)" },
	{ key: "ترتیبی", value: 190, fill: "var(--color-e)" },
];
const questionBankChartConfig = {
	total: {
		label: "عدد",
	},
	a: {
		label: "a",
		color: colors.teal[300],
	},
	b: {
		label: "b",
		color: colors.teal[400],
	},
	c: {
		label: "c",
		color: colors.teal[500],
	},
	d: {
		label: "d",
		color: colors.teal[600],
	},
	e: {
		label: "e",
		color: colors.teal[700],
	},
};
const proctoringChartData = [
	{ key: "تشریحی", value: 275, fill: "var(--color-a)" },
	{ key: "گزینه ای", value: 200, fill: "var(--color-b)" },
	{ key: "ویدیویی", value: 287, fill: "var(--color-c)" },
	{ key: "صوتی", value: 173, fill: "var(--color-d)" },
	{ key: "ترتیبی", value: 190, fill: "var(--color-e)" },
];
const proctoringChartConfig = {
	total: {
		label: "عدد",
	},
	a: {
		label: "a",
		color: colors.rose[300],
	},
	b: {
		label: "b",
		color: colors.rose[400],
	},
	c: {
		label: "c",
		color: colors.rose[500],
	},
	d: {
		label: "d",
		color: colors.rose[600],
	},
	e: {
		label: "e",
		color: colors.rose[700],
	},
};

export default function DashboardPage() {
	return (
		<div className="space-y-4" dir="rtl">
			<div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
				<StatDonutCard
					accentClass="text-blue-500"
					config={examsChartConfig}
					data={examsChartData}
					href="/exams"
					icon={<FileTextIcon className="size-4 text-blue-500" />}
					label="آزمون"
					title="آزمون‌ها"
				/>

				<StatDonutCard
					accentClass="text-violet-500"
					config={questionBankChartConfig}
					data={questionBankChartData}
					href="/question-bank"
					icon={<BookOpenIcon className="size-4 text-violet-500" />}
					label="سوال"
					title="بانک سوالات"
				/>

				<StatDonutCard
					accentClass="text-amber-500"
					config={ungradedExamsChartConfig}
					data={ungradedExamsChartData}
					href="/grading"
					icon={<ClipboardCheckIcon className="size-4 text-amber-500" />}
					label="تصحیح نشده"
					title="در انتظار تصحیح"
					urgency
				/>

				<StatDonutCard
					accentClass="text-rose-500"
					config={proctoringChartConfig}
					data={proctoringChartData}
					href="/proctoring"
					icon={<ShieldAlertIcon className="size-4 text-rose-500" />}
					label="گزارش تقلب"
					title="گزارش‌های تقلب"
					urgency
				/>
			</div>

			<div className="grid grid-cols-1 gap-3 xl:grid-cols-8">
				<Card className="xl:col-span-6">
					<CardHeader className="flex flex-row items-center justify-between pb-3">
						<CardTitle className="text-base flex items-center gap-2">
							<ClipboardCheckIcon className="size-4 text-amber-500" />
							در انتظار تصحیح
						</CardTitle>
						<Button className="text-xs text-muted-foreground gap-1" size="sm" variant="ghost">
							<Link className="flex items-center gap-2" to="/grading">
								مشاهده همه
								<ChevronLeftIcon className="size-3.5" />
							</Link>
						</Button>
					</CardHeader>
					<CardContent className="pt-0">
						<GradingTable />
					</CardContent>
				</Card>

				<div className="xl:col-span-2 flex flex-col gap-3">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-base">دسترسی سریع</CardTitle>
						</CardHeader>
						<CardContent className="pt-0 space-y-1">
							<QuickLink
								href="/question-bank"
								icon={<PlusIcon className="size-4" />}
								label="مدیریت بانک سوالات"
							/>
							<QuickLink
								href="#"
								icon={<Users2Icon className="size-4" />}
								label="مدیریت شرکت‌کنندگان"
							/>
							<QuickLink href="#" icon={<ChartPieIcon className="size-4" />} label="مشاهده نتایج" />
						</CardContent>
					</Card>

					<Card className="flex-1">
						<CardHeader className="pb-2">
							<CardTitle className="text-base flex items-center gap-2">
								<ClockIcon className="size-4 text-muted-foreground" />
								آزمون‌های پیش رو
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<UpcomingExamList />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

type TChartData = { key: string; value: number; fill: string }[];

function StatDonutCard({
	title,
	icon,
	config,
	data,
	label,
	href,
	urgency = false,
}: {
	title: string;
	icon: React.ReactNode;
	accentClass?: string;
	config: Record<string, unknown>;
	data: TChartData;
	label: string;
	href: string;
	urgency?: boolean;
}) {
	return (
		<Card className={urgency ? "border-amber-100 dark:border-amber-900/30" : ""}>
			<CardHeader className="pb-1 flex flex-row items-center justify-between">
				<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
					{icon}
					{title}
				</CardTitle>
				<Button className="size-6 text-muted-foreground" size="icon" variant="ghost">
					<Link to={href}>
						<ArrowLeftIcon className="size-3.5" />
					</Link>
				</Button>
			</CardHeader>
			<CardContent className="pb-3">
				<ChartPieDonutText config={config} data={data} label={label} />
			</CardContent>
		</Card>
	);
}

function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
	return (
		<Button
			className="w-full justify-start gap-2.5 text-sm h-10 px-2 text-foreground/80 hover:text-foreground"
			variant="ghost"
		>
			<Link className="flex gap-2 items-center" to={href}>
				<span className="text-muted-foreground">{icon}</span>
				{label}
			</Link>
		</Button>
	);
}

const upcomingExams = [
	{
		id: 1,
		title: "ریاضی ۳ — گروه الف",
		date: "۱۴۰۲/۱۰/۲۳",
		status: "فعال",
		variant: "default" as const,
	},
	{
		id: 2,
		title: "فیزیک پایه — فصل ۴",
		date: "۱۴۰۲/۱۰/۲۸",
		status: "برنامه‌ریزی شده",
		variant: "secondary" as const,
	},
	{
		id: 3,
		title: "شیمی آلی — پایان‌ترم",
		date: "۱۴۰۲/۱۱/۰۲",
		status: "پیش‌نویس",
		variant: "outline" as const,
	},
];

function UpcomingExamList() {
	return (
		<div className="divide-y divide-border/60">
			{upcomingExams.map((exam) => (
				<div className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0" key={exam.id}>
					<div className="flex items-start justify-between gap-2">
						<Link
							className="text-sm leading-snug hover:underline underline-offset-2 line-clamp-1"
							to="/exams"
						>
							{exam.title}
						</Link>
						<Badge className="text-[11px] shrink-0" variant={exam.variant}>
							{exam.status}
						</Badge>
					</div>
					<span className="text-xs text-muted-foreground">{exam.date}</span>
				</div>
			))}
		</div>
	);
}
