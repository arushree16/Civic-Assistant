import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Send, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    Reported: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-200",
      icon: AlertCircle
    },
    Forwarded: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: Send
    },
    "In Progress": {
      bg: "bg-orange-100",
      text: "text-orange-700",
      border: "border-orange-200",
      icon: Clock
    },
    Resolved: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
      icon: CheckCircle2
    }
  };

  const style = styles[status as keyof typeof styles] || styles.Reported;
  const Icon = style.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shadow-sm",
      style.bg,
      style.text,
      style.border,
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </div>
  );
}
