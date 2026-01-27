import { usePage } from "@inertiajs/react";

export function usePermission() {
    const { auth }: any = usePage().props;

    const permissions: string[] = auth?.permissions ?? [];

    const can = (permission: string) => permissions.includes(permission);

    return { can, permissions };
}
