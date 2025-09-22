import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QueueStats } from '@/components/queue/QueueStats';
import { getCurrentUser } from '@/lib/auth';
import { mockTransactions, getServiceQueue } from '@/lib/mockData';
import { ServiceType } from '@/types';
import { 
  BarChart3, 
  Users, 
  Clock, 
  TrendingUp, 
  Download,
  Calendar,
  FileText,
  DollarSign,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const currentUser = getCurrentUser();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedService, setSelectedService] = useState<ServiceType | 'all'>('all');

  // Get transactions based on filters
  const getFilteredTransactions = () => {
    let transactions = mockTransactions;
    
    if (selectedService !== 'all') {
      transactions = getServiceQueue(selectedService);
    }
    
    // Filter by period (mock - in real app would filter by actual date ranges)
    return transactions;
  };

  const filteredTransactions = getFilteredTransactions();
  
  // Calculate metrics
  const totalTransactions = filteredTransactions.length;
  const completedToday = filteredTransactions.filter(t => t.status === 'completed').length;
  const pendingCount = filteredTransactions.filter(t => t.status === 'pending').length;
  const processingCount = filteredTransactions.filter(t => t.status === 'processing').length;

  const averageWaitTime = filteredTransactions
    .filter(t => t.completedAt)
    .reduce((acc, t) => {
      const waitTime = (t.completedAt!.getTime() - t.dateTime.getTime()) / (1000 * 60);
      return acc + waitTime;
    }, 0) / (completedToday || 1);

  const serviceBreakdown = [
    {
      service: 'registrar',
      label: 'Registrar Office',
      icon: FileText,
      transactions: getServiceQueue('registrar'),
      color: 'text-primary'
    },
    {
      service: 'cashier',
      label: 'Cashier Office', 
      icon: DollarSign,
      transactions: getServiceQueue('cashier'),
      color: 'text-secondary'
    },
    {
      service: 'admin',
      label: 'Admin Office',
      icon: Settings,
      transactions: getServiceQueue('admin'),
      color: 'text-accent'
    }
  ];

  const generateReport = () => {
    // Mock report generation
    console.log('Generating report for:', selectedPeriod, selectedService);
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="gradient-hero rounded-xl p-6 text-white shadow-strong">
          <h1 className="text-2xl font-bold mb-2">
            Welcome, {currentUser?.fullName}!
          </h1>
          <p className="text-white/90">
            Complete overview of the PTC Queue Management System
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{totalTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-status-completed/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-status-completed" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold">{completedToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-status-pending/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-status-pending" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Currently Pending</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Wait Time</p>
                  <p className="text-2xl font-bold">{Math.round(averageWaitTime)}m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {serviceBreakdown.map((service) => (
            <Card key={service.service} className="shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <service.icon className={`h-5 w-5 ${service.color}`} />
                  {service.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QueueStats transactions={service.transactions} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reports Section */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Reports & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="detailed">Detailed Stats</TabsTrigger>
                <TabsTrigger value="generate">Generate Report</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <QueueStats transactions={filteredTransactions} />
              </TabsContent>

              <TabsContent value="detailed" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Service Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {serviceBreakdown.map((service) => (
                          <div key={service.service} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <service.icon className={`h-4 w-4 ${service.color}`} />
                              <span>{service.label}</span>
                            </div>
                            <span className="font-semibold">{service.transactions.length}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Completion Rate</span>
                          <span className="font-semibold">
                            {Math.round((completedToday / totalTransactions) * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing Rate</span>
                          <span className="font-semibold">
                            {Math.round((processingCount / totalTransactions) * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Wait</span>
                          <span className="font-semibold">{Math.round(averageWaitTime)} min</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="generate" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Period</label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Service Type</label>
                    <Select value={selectedService} onValueChange={(value) => setSelectedService(value as ServiceType | 'all')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="registrar">Registrar Office</SelectItem>
                        <SelectItem value="cashier">Cashier Office</SelectItem>
                        <SelectItem value="admin">Admin Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={generateReport} className="gradient-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;