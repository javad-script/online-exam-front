import colors from "tailwindcss/colors";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartPieDonutText } from "../components/chart-pie-donut-text";

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
export default function MainPage() {
	return (
		<div className="grid grid-cols-8 grid-rows-3 gap-4">
			<Card className="col-span-2">
				<CardContent>
					<CardHeader>آزمون ها</CardHeader>
					<ChartPieDonutText config={examsChartConfig} data={examsChartData} label="آزمون" />
				</CardContent>
			</Card>
			<Card className="col-span-2 col-start-3">
				<CardContent>
					<CardHeader>سوالات بانک</CardHeader>
					<ChartPieDonutText
						config={questionBankChartConfig}
						data={questionBankChartData}
						label="سوال"
					/>
				</CardContent>
			</Card>
			<Card className="col-span-2 col-start-5">
				<CardContent>
					<CardHeader>در انتظار تصحیح</CardHeader>
					<ChartPieDonutText
						config={ungradedExamsChartConfig}
						data={ungradedExamsChartData}
						label="تصحیح نشده"
					/>
				</CardContent>
			</Card>
			<Card className="col-span-2 col-start-7">
				<CardContent>
					<CardHeader>گزارش ها</CardHeader>
					<ChartPieDonutText
						config={proctoringChartConfig}
						data={proctoringChartData}
						label="گزارش تقلب"
					/>
				</CardContent>
			</Card>
			<Card className="col-span-5 row-span-2 row-start-2">5</Card>
			<Card className="col-span-3 row-span-2 col-start-6 row-start-2">6</Card>
		</div>
	);
}
