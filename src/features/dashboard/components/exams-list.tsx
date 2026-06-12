import { EyeIcon, MoreHorizontalIcon, PenLineIcon } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type Priority = "urgent" | "normal" | "low";

interface GradingItem {
	id: string;
	examTitle: string;
	course: string;
	pendingCount: number;
	totalCount: number;
	type: "descriptive" | "voice";
	submittedAt: string;
	priority: Priority;
}

const gradingItems: GradingItem[] = [
	{
		id: "1",
		examTitle: "آزمون جامع شیمی",
		course: "شیمی آلی",
		pendingCount: 32,
		totalCount: 40,
		type: "descriptive",
		submittedAt: "۴ روز پیش",
		priority: "urgent",
	},
	{
		id: "2",
		examTitle: "پایان‌ترم زیست‌شناسی",
		course: "زیست عمومی",
		pendingCount: 45,
		totalCount: 50,
		type: "descriptive",
		submittedAt: "۵ روز پیش",
		priority: "urgent",
	},
	{
		id: "3",
		examTitle: "میان‌ترم فیزیک پایه",
		course: "فیزیک ۱",
		pendingCount: 18,
		totalCount: 35,
		type: "descriptive",
		submittedAt: "۲ ساعت پیش",
		priority: "normal",
	},
	{
		id: "4",
		examTitle: "کوییز ریاضی عمومی",
		course: "ریاضی ۱",
		pendingCount: 7,
		totalCount: 30,
		type: "voice",
		submittedAt: "دیروز",
		priority: "low",
	},
	{
		id: "5",
		examTitle: "آزمون برنامه‌نویسی",
		course: "مبانی کامپیوتر",
		pendingCount: 12,
		totalCount: 28,
		type: "voice",
		submittedAt: "۳ روز پیش",
		priority: "normal",
	},
];

const priorityConfig: Record<Priority, { label: string; className: string }> = {
	urgent: {
		label: "فوری",
		className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400",
	},
	normal: {
		label: "معمولی",
		className:
			"bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400",
	},
	low: {
		label: "عادی",
		className:
			"bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400",
	},
};

const typeLabels: Record<GradingItem["type"], string> = {
	descriptive: "تشریحی",
	voice: "صوتی",
};

function ProgressBar({ value, max }: { value: number; max: number }) {
	const pct = Math.round(((max - value) / max) * 100);
	return (
		<div className="flex items-center gap-2">
			<div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
				<div
					className="h-full rounded-full bg-primary/60 transition-all"
					style={{ width: `${pct}%` }}
				/>
			</div>
			<span className="text-xs text-muted-foreground tabular-nums">
				{value}/{max}
			</span>
		</div>
	);
}

export function GradingTable() {
	return (
		<div dir="rtl">
			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead className="text-right font-medium">آزمون</TableHead>
						<TableHead className="text-right font-medium hidden sm:table-cell">نوع</TableHead>
						<TableHead className="text-right font-medium hidden md:table-cell">باقی‌مانده</TableHead>
						<TableHead className="text-right font-medium hidden lg:table-cell">ارسال شده</TableHead>
						<TableHead className="text-right font-medium">اولویت</TableHead>
						<TableHead className="w-20" />
					</TableRow>
				</TableHeader>
				<TableBody>
					{gradingItems.map((item) => {
						const priority = priorityConfig[item.priority];
						return (
							<TableRow className="group" key={item.id}>
								<TableCell>
									<div className="flex flex-col gap-0.5">
										<span className="font-medium text-sm leading-snug">{item.examTitle}</span>
										<span className="text-xs text-muted-foreground">{item.course}</span>
									</div>
								</TableCell>

								<TableCell className="hidden sm:table-cell">
									<Badge className="text-xs font-normal" variant="outline">
										{typeLabels[item.type]}
									</Badge>
								</TableCell>

								<TableCell className="hidden md:table-cell">
									<ProgressBar max={item.totalCount} value={item.pendingCount} />
								</TableCell>

								<TableCell className="hidden lg:table-cell">
									<span className="text-sm text-muted-foreground">{item.submittedAt}</span>
								</TableCell>

								<TableCell>
									<Badge className={`text-xs font-medium ${priority.className}`} variant="outline">
										{priority.label}
									</Badge>
								</TableCell>

								<TableCell>
									<div className="flex items-center justify-end gap-1">
										<Button
											className="h-7 px-2.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
											size="sm"
										>
											<Link className=" flex items-center gap-2" to={`/grading/${item.id}`}>
												<PenLineIcon className="size-3 ml-1" />
												تصحیح
											</Link>
										</Button>

										<DropdownMenu>
											<DropdownMenuTrigger>
												<Button
													className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
													size="icon"
													variant="ghost"
												>
													<MoreHorizontalIcon className="size-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-36">
												<DropdownMenuItem>
													<Link className="flex items-center gap-2" to={`/exams/${item.id}`}>
														<EyeIcon className="size-3.5" />
														مشاهده آزمون
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Link className="flex items-center gap-2" to={`/grading/${item.id}`}>
														<PenLineIcon className="size-3.5" />
														شروع تصحیح
													</Link>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
