import type { ColumnDef, ColumnFiltersState, VisibilityState } from "@tanstack/react-table";

import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

const colHeader = {
	title: "نام",
	is_public: "نوع",
	questions_count: "تعداد سوالات",
};

export function QuestionBankTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 8,
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onRowSelectionChange: setRowSelection,
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		state: {
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
		},
	});
	const rows = table.getRowModel().rows;
	const emptyRowCount = pagination.pageSize - rows.length;

	return (
		<div className="text-base! space-y-4">
			<div className="w-full flex items-center justify-between">
				<div className="flex items-center">
					<InputGroup>
						<InputGroupAddon>
							<SearchIcon className="size-4.5" />
						</InputGroupAddon>
						<InputGroupInput
							className="max-w-sm"
							onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
							placeholder="جستجوی در بانک ها"
							value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
						/>
					</InputGroup>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button className="ml-auto" variant="outline">
							ستون ها
							<ChevronDownIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuGroup>
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									if (!(column.id in colHeader)) return null;
									return (
										<DropdownMenuCheckboxItem
											checked={column.getIsVisible()}
											className="capitalize"
											key={column.id}
											onCheckedChange={(value) => column.toggleVisibility(!!value)}
										>
											{colHeader[column.id]}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody style={{ height: pagination.pageSize * 49 }}>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									className="h-12.25!"
									data-state={row.getIsSelected() && "selected"}
									key={row.id}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell className="h-24 text-center" colSpan={columns.length}>
									نتیجه ای یافت نشد
								</TableCell>
							</TableRow>
						)}
						{Array.from({ length: emptyRowCount }).map((_, i) => (
							<TableRow className="border-transparent opacity-0 h-12.25!" key={`empty-${i}`}>
								{table.getAllColumns().map((col) => (
									<TableCell key={col.id} />
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className="w-full flex justify-between items-center">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} ردیف از{" "}
					{table.getFilteredRowModel().rows.length} ردیف انتخاب شده است
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<Button
						disabled={!table.getCanPreviousPage()}
						onClick={() => table.previousPage()}
						size="sm"
						variant="outline"
					>
						قبلی
					</Button>
					<Button
						disabled={!table.getCanNextPage()}
						onClick={() => table.nextPage()}
						size="sm"
						variant="outline"
					>
						بعدی
					</Button>
				</div>
			</div>
		</div>
	);
}
