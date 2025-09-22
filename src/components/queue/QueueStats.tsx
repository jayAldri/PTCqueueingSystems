import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QueueTransaction } from '@/types';
import { Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface QueueStatsProps {
  transactions: QueueTransaction[];
  serviceType?: string;
}

export const QueueStats = ({ transactions, serviceType }: QueueStatsProps) => {
  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const processingCount = transactions.filter(t => t.status === 'processing').length;
  const completedCount = transactions.filter(t => t.status === 'completed').length;
  const totalCount = transactions.length;

  const averageWaitTime = transactions
    .filter(t => t.completedAt)
    .reduce((acc, t) => {
      const waitTime = (t.completedAt!.getTime() - t.dateTime.getTime()) / (1000 * 60); // minutes
      return acc + waitTime;
    }, 0) / (completedCount || 1);

  const stats = [
    {
      title: "Total Queue",
      value: totalCount,
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Pending",
      value: pendingCount,
      icon: AlertCircle,
      color: "text-status-pending"
    },
    {
      title: "Processing",
      value: processingCount,
      icon: Clock,
      color: "text-status-processing"
    },
    {
      title: "Completed",
      value: completedCount,
      icon: CheckCircle,
      color: "text-status-completed"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
      
      {completedCount > 0 && (
        <Card className="shadow-soft md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Wait Time
            </CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {Math.round(averageWaitTime)} minutes
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};