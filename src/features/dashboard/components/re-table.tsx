import type { ColumnDef, ColumnFiltersState, VisibilityState } from "@tanstack/react-table";

import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
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

type TableProps<TData, TValue> = DataTableProps<TData, TValue> & {
	colHeaders: Record<string, string>;
	emptyMessage?: ReactNode;
	config?: {
		pagination: boolean;
		select: boolean;
		visibility: boolean;
		search: { enabled: boolean; placeholder: string; column: string };
	};
};

export function ReTable<TData, TValue>({
	columns,
	emptyMessage,
	data,
	colHeaders,
	config = {
		pagination: true,
		select: false,
		visibility: true,
		search: { enabled: true, placeholder: "", column: "" },
	},
}: TableProps<TData, TValue>) {
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
				{config.search.enabled && (
					<div className="flex items-center">
						<InputGroup>
							<InputGroupAddon>
								<SearchIcon className="size-4.5" />
							</InputGroupAddon>
							<InputGroupInput
								className="max-w-sm"
								onChange={(event) =>
									table.getColumn(config.search.column)?.setFilterValue(event.target.value)
								}
								placeholder={config.search.placeholder}
								value={(table.getColumn(config.search.column)?.getFilterValue() as string) ?? ""}
							/>
						</InputGroup>
					</div>
				)}
				{config.select && (
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
										if (!(column.id in colHeaders)) return null;
										return (
											<DropdownMenuCheckboxItem
												checked={column.getIsVisible()}
												className="capitalize"
												key={column.id}
												onCheckedChange={(value) => column.toggleVisibility(!!value)}
											>
												{colHeaders[column.id]}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
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
									// onClick={()=> navi}
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
							<TableRow className="">
								<TableCell className=" text-center " colSpan={columns.length}>
									{emptyMessage}
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
				{config.select && (
					<div className="flex-1 text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length} ردیف از{" "}
						{table.getFilteredRowModel().rows.length} ردیف انتخاب شده است
					</div>
				)}
				{config.pagination && (
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
				)}
			</div>
		</div>
	);
}
