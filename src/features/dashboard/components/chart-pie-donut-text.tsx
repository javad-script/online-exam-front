import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import { CardContent } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

type TChartData = { key: string; value: number; fill: string }[];

export function ChartPieDonutText({
	label,
	data,
	config,
}: {
	label: string;
	data: TChartData;
	config: ChartConfig;
}) {
	const total = useMemo(() => {
		return data.reduce((acc, curr) => acc + curr.value, 0);
	}, [data.reduce]);

	return (
		<CardContent className="flex-1 pb-0">
			<ChartContainer className="mx-auto aspect-square max-h-62.5" config={config}>
				<PieChart>
					<ChartTooltip
						content={<ChartTooltipContent className="text-sm" hideLabel />}
						cursor={false}
					/>
					<Pie data={data} dataKey="value" innerRadius={60} nameKey="key" strokeWidth={5}>
						<Label
							content={({ viewBox }) => {
								if (viewBox && "cx" in viewBox && "cy" in viewBox) {
									return (
										<text
											dominantBaseline="middle"
											textAnchor="middle"
											x={viewBox.cx}
											y={viewBox.cy}
										>
											<tspan
												className="fill-foreground text-3xl font-bold"
												x={viewBox.cx}
												y={viewBox.cy}
											>
												{total.toLocaleString()}
											</tspan>
											<tspan
												className="fill-muted-foreground"
												x={viewBox.cx}
												y={(viewBox.cy || 0) + 24}
											>
												{label}
											</tspan>
										</text>
									);
								}
							}}
						/>
					</Pie>
				</PieChart>
			</ChartContainer>
		</CardContent>
	);
}
