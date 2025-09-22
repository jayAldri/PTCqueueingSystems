import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { QueueCard } from '@/components/queue/QueueCard';
import { QueueStats } from '@/components/queue/QueueStats';
import { getCurrentUser } from '@/lib/auth';
import { getServiceQueue, getPendingQueue, getProcessingQueue, getCompletedQueue } from '@/lib/mockData';
import { ServiceType } from '@/types';
import { Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StaffDashboardProps {
  serviceType: ServiceType;
}

const StaffDashboard = ({ serviceType }: StaffDashboardProps) => {
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState('pending');
  
  const allTransactions = getServiceQueue(serviceType);
  const pendingTransactions = getPendingQueue(serviceType);
  const processingTransactions = getProcessingQueue(serviceType);
  const completedTransactions = getCompletedQueue(serviceType);

  const handleUpdateStatus = (transactionId: string, newStatus: 'processing' | 'completed') => {
    // Mock status update
    toast({
      title: "Status Updated",
      description: `Transaction ${transactionId} has been marked as ${newStatus}`,
    });
  };

  const getServiceTitle = (service: ServiceType) => {
    switch (service) {
      case 'registrar':
        return 'Registrar Office Dashboard';
      case 'cashier':
        return 'Cashier Office Dashboard';
      case 'admin':
        return 'Admin Office Dashboard';
      default:
        return 'Staff Dashboard';
    }
  };

  return (
    <Layout title={getServiceTitle(serviceType)}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="gradient-primary rounded-xl p-6 text-white shadow-strong">
          <h1 className="text-2xl font-bold mb-2">
            Welcome, {currentUser?.fullName}!
          </h1>
          <p className="text-white/90 capitalize">
            {serviceType} Office Queue Management
          </p>
        </div>

        {/* Queue Statistics */}
        <QueueStats transactions={allTransactions} serviceType={serviceType} />

        {/* Queue Management Tabs */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Queue Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Pending ({pendingTransactions.length})
                </TabsTrigger>
                <TabsTrigger value="processing" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Processing ({processingTransactions.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Completed ({completedTransactions.length})
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  All ({allTransactions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Pending Queue</h3>
                  <p className="text-sm text-muted-foreground">
                    Next in line: {pendingTransactions[0]?.queueNumber || 'None'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingTransactions.map((transaction) => (
                    <QueueCard 
                      key={transaction.id} 
                      transaction={transaction}
                      showActions={true}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                  {pendingTransactions.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No pending transactions</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="processing" className="space-y-4">
                <h3 className="text-lg font-semibold">Currently Processing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processingTransactions.map((transaction) => (
                    <QueueCard 
                      key={transaction.id} 
                      transaction={transaction}
                      showActions={true}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                  {processingTransactions.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No transactions being processed</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                <h3 className="text-lg font-semibold">Completed Today</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedTransactions.map((transaction) => (
                    <QueueCard 
                      key={transaction.id} 
                      transaction={transaction}
                    />
                  ))}
                  {completedTransactions.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No completed transactions today</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                <h3 className="text-lg font-semibold">All Transactions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allTransactions.map((transaction) => (
                    <QueueCard 
                      key={transaction.id} 
                      transaction={transaction}
                      showActions={transaction.status !== 'completed'}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StaffDashboard;