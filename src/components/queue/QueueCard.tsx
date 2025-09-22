import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QueueTransaction } from '@/types';
import { Clock, User, FileText, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface QueueCardProps {
  transaction: QueueTransaction;
  showActions?: boolean;
  onUpdateStatus?: (id: string, status: 'processing' | 'completed') => void;
}

export const QueueCard = ({ transaction, showActions = false, onUpdateStatus }: QueueCardProps) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'status-pending',
      processing: 'status-processing',
      completed: 'status-completed'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'status-pending'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'registrar':
        return <FileText className="h-4 w-4" />;
      case 'cashier':
        return <User className="h-4 w-4" />;
      case 'admin':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <Card className="shadow-soft hover:shadow-medium transition-smooth">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-primary">
            {transaction.queueNumber}
          </CardTitle>
          {getStatusBadge(transaction.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">{transaction.student?.fullName}</p>
            <p className="text-sm text-muted-foreground">
              {transaction.student?.course} - {transaction.student?.yearLevel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getServiceIcon(transaction.serviceType)}
          <span className="text-sm capitalize font-medium text-secondary">
            {transaction.serviceType} Office
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Requested: {format(transaction.dateTime, 'MMM dd, yyyy HH:mm')}</span>
        </div>

        {transaction.completedAt && (
          <div className="flex items-center gap-2 text-sm text-status-completed">
            <CheckCircle className="h-4 w-4" />
            <span>Completed: {format(transaction.completedAt, 'MMM dd, yyyy HH:mm')}</span>
          </div>
        )}

        {showActions && transaction.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onUpdateStatus?.(transaction.id, 'processing')}
            >
              Start Processing
            </Button>
          </div>
        )}

        {showActions && transaction.status === 'processing' && (
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1"
              onClick={() => onUpdateStatus?.(transaction.id, 'completed')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};