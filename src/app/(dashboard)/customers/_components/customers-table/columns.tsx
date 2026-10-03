import Link from "next/link";
import { ZoomIn, PenSquare, Trash2, ShoppingBag } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";

import { SheetTooltip } from "@/components/shared/table/TableActionTooltip";
import CustomerFormSheet from "../form/CustomerFormSheet";
import { Customer } from "@/services/customers/types";
import { SkeletonColumn } from "@/types/skeleton";
import { TooltipWrapper } from "@/components/shared/table/TableActionTooltip";

import { editCustomer } from "@/actions/customers/editCustomer";
import { HasPermission } from "@/hooks/use-authorization";

const handleDemoDelete = () => {
  toast.error("Sorry, this feature is not allowed in demo mode", {
    position: "top-center",
  });
};

export const getColumns = ({
  hasPermission,
}: {
  hasPermission: HasPermission;
}) => {
  const columns: ColumnDef<Customer>[] = [
    {
      header: "Customer",
      cell: ({ row }) => {
        const initials = row.original.name
          ? row.original.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
          : "CU";

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <Typography className="font-semibold text-sm truncate text-foreground">
                {row.original.name}
              </Typography>
              <Typography className="text-xs text-muted-foreground truncate">
                {row.original.email}
              </Typography>
            </div>
          </div>
        );
      },
    },
    {
      header: "Phone",
      id: "phone",
      cell: ({ row }) => (
        <Typography className="text-xs text-muted-foreground font-mono">
          {row.original.phone || "—"}
        </Typography>
      ),
    },
    {
      header: "Joined",
      cell: ({ row }) => (
        <Typography className="text-xs text-muted-foreground whitespace-nowrap">
          {row.original.created_at ? format(new Date(row.original.created_at), "MMM dd, yyyy") : "—"}
        </Typography>
      ),
    },
    {
      header: () => <span className="block text-center">Orders</span>,
      id: "total_orders",
      cell: ({ row }) => {
        const count = row.original.total_orders ?? 0;
        return (
          <div className="flex justify-center">
            <Badge variant={count > 0 ? "processing" : "secondary"} className="gap-1 font-mono text-xs">
              <ShoppingBag className="size-3" />
              {count} {count === 1 ? "order" : "orders"}
            </Badge>
          </div>
        );
      },
    },
    {
      header: () => <span className="block text-right">Total Spent</span>,
      id: "total_spent",
      cell: ({ row }) => {
        const spent = row.original.total_spent ?? 0;
        return (
          <Typography className="block text-right font-semibold text-sm text-foreground font-mono">
            ${spent.toFixed(2)}
          </Typography>
        );
      },
    },
    {
      header: () => <span className="block text-center">Status</span>,
      id: "status",
      cell: ({ row }) => {
        const isActive = row.original.is_active ?? true;
        return (
          <div className="flex justify-center">
            <Badge variant={isActive ? "success" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
    },
    {
      header: () => <span className="block text-center">Actions</span>,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-1">
            <TooltipWrapper content="View Customer Orders">
              <Button
                size="icon"
                asChild
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Link href={`/customer-orders/${row.original.id}`}>
                  <ZoomIn className="size-4" />
                </Link>
              </Button>
            </TooltipWrapper>

            {hasPermission("customers", "canEdit") && (
              <CustomerFormSheet
                key={row.original.id}
                title="Update Customer"
                description="Update necessary customer information here"
                submitButtonText="Update Customer"
                actionVerb="updated"
                initialData={{
                  name: row.original.name,
                  email: row.original.email,
                  phone: row.original.phone ?? "",
                }}
                action={(formData) => editCustomer(row.original.id, formData)}
              >
                <SheetTooltip content="Edit Customer">
                  <PenSquare className="size-4" />
                </SheetTooltip>
              </CustomerFormSheet>
            )}

            {hasPermission("customers", "canDelete") && (
              <TooltipWrapper content="Delete Customer">
                <Button
                  onClick={handleDemoDelete}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </Button>
              </TooltipWrapper>
            )}
          </div>
        );
      },
    },
  ];

  return columns;
};

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "id",
    cell: <Skeleton className="w-10 h-8" />,
  },
  {
    header: "joining date",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "name",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "email",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "phone",
    cell: <Skeleton className="w-20 h-10" />,
  },
  {
    header: "actions",
    cell: <Skeleton className="w-24 h-8" />,
  },
];
