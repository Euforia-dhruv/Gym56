import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export interface DashboardCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DashboardCard({
  title,
  action,
  children,
  className,
}: DashboardCardProps) {
  return (
    <Card variant="solid" className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
