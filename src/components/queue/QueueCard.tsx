import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Student, QueueTransaction } from '@/types';
import { Clock, User, FileText, CheckCircle, XCircle, Ban } from 'lucide-react';
import { format } from 'date-fns';

interface QueueCardProps {
  transaction: QueueTransaction;
  showActions?: boolean;
  onUpdateStatus?: (id: string, status: 'processing' | 'completed' | 'cancelled') => void;
  allowCancel?: boolean; 
  onCancel?: (id: string) => void;
}

export const QueueCard = ({
  transaction,
  showActions = false,
  onUpdateStatus,
  allowCancel = false,
  onCancel,
}: QueueCardProps) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'status-pending',
      processing: 'status-processing',
      completed: 'status-completed',
      cancelled: 'bg-red-100 text-red-600',
    };

    return (
      <Badge className={variants[status] || 'status-pending'}>
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
    <Card
      className={`shadow-soft hover:shadow-medium transition-smooth ${
        transaction.status === 'cancelled' ? 'opacity-60' : ''
      }`}
    >
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
            {"course" in (transaction.student || {}) && (
              <p className="text-sm text-muted-foreground">
                {(transaction.student as Student).course} -{' '}
                {(transaction.student as Student).yearLevel}
              </p>
            )}
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

        {/* --- Staff Actions --- */}
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

        {/* --- Student Cancel Option --- */}
        {allowCancel && transaction.status === 'pending' && (
          <div className="pt-2">
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={() => onCancel?.(transaction.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
