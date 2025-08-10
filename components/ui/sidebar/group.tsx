'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='sidebar-group'
			data-sidebar='group'
			className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
			{...props}
		/>
	);
}

export function SidebarGroupLabel({
	className,
	asChild = false,
	...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : 'div';

	return (
		<Comp
			data-slot='sidebar-group-label'
			data-sidebar='group-label'
			className={cn(
				'text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
				'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
				className
			)}
			{...props}
		/>
	);
}

export function SidebarGroupAction({
	className,
	asChild = false,
	...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			data-slot='sidebar-group-action'
			data-sidebar='group-action'
			className={cn(
				'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
				// Increases the hit area of the button on mobile.
				'after:absolute after:-inset-2 md:after:hidden',
				'group-data-[collapsible=icon]:hidden',
				className
			)}
			{...props}
		/>
	);
}

export function SidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='sidebar-group-content'
			data-sidebar='group-content'
			className={cn('w-full text-sm', className)}
			{...props}
		/>
	);
}
