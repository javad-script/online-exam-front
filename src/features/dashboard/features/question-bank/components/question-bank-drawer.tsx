"use client";

import { useMediaQuery } from "@reactuses/core";
import { PlusIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import QuestionBankForm from "./question-bank-form";

export default function QuestionBankDrawer() {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<Dialog onOpenChange={setOpen} open={open}>
				<DialogTrigger
					render={
						<Button>
							<PlusIcon /> ساخت بانک جدید
						</Button>
					}
				/>
				<DialogContent className="sm:max-w-106.25">
					<DialogHeader>
						<DialogTitle className="text-lg">بانک جدید</DialogTitle>
						<DialogDescription>
							یک بانک سوال برای دسته‌بندی و مدیریت سوال‌هایت بساز.
						</DialogDescription>
					</DialogHeader>
					<QuestionBankForm callback={() => setOpen(false)} />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer onOpenChange={setOpen} open={open}>
			<DrawerTrigger asChild>
				<Button variant="outline">Edit Profile</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Edit profile</DrawerTitle>
					<DrawerDescription>
						Make changes to your profile here. Click save when you&apos;re done.
					</DrawerDescription>
				</DrawerHeader>
				<QuestionBankForm callback={() => setOpen(false)} className="px-4" />
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
