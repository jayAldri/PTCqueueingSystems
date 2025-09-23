import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QueueCard } from '@/components/queue/QueueCard';
import { getCurrentUser } from '@/lib/auth';
import { Student, ServiceType, QueueTransaction } from '@/types';
import { Plus, FileText, DollarSign, Settings, Clock, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const StudentDashboard = () => {
  const currentUser = getCurrentUser();
  const [selectedService, setSelectedService] = useState<ServiceType>('registrar');
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [studentTransactions, setStudentTransactions] = useState<QueueTransaction[]>([]);

  // Generate time slots (9:00 AM – 4:00 PM, every 30 mins)
  const timeSlots = Array.from({ length: (16 - 9) * 2 + 1 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    const value = `${hour.toString().padStart(2, "0")}:${minutes}`;
    const ampm = hour < 12 ? "AM" : "PM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return { value, label: `${hour12}:${minutes} ${ampm}` };
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("studentTransactions");
    if (saved) {
      const parsed: QueueTransaction[] = JSON.parse(saved).map((t: any) => ({
        ...t,
        dateTime: new Date(t.dateTime),
        completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
      }));
      setStudentTransactions(parsed);
    }
  }, []);

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("studentTransactions", JSON.stringify(studentTransactions));
  }, [studentTransactions]);

  const handleRequestQueue = () => {
    if (!selectedTime) {
      toast({
        title: "Pick a Time",
        description: "Please select your preferred time before requesting a queue number.",
        variant: "destructive",
      });
      return;
    }

    const queueNumber = `${selectedService.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 999) + 1}`;

    const newTransaction: QueueTransaction = {
      id: Date.now().toString(),
      studentId: currentUser?.id || "unknown",
      student: {
        id: currentUser?.id || "unknown",
        fullName: currentUser?.fullName || "Unknown Student",
        email: currentUser?.email || "unknown@ptc.edu.ph",
        course: currentUser?.course || "Unknown",
        yearLevel: currentUser?.yearLevel || "Unknown",
        contactNumber: currentUser?.contactNumber || "Unknown",
      },
      queueNumber,
      serviceType: selectedService,
      status: "pending",
      dateTime: new Date(),
      preferredTime: selectedTime,
    };

    setStudentTransactions(prev => [...prev, newTransaction]);

    toast({
      title: "Queue Number Generated",
      description: `Your queue number is ${queueNumber} at ${selectedTime}. Please arrive on time.`,
    });
  };

  const serviceOptions = [
    {
      value: 'registrar' as ServiceType,
      label: 'Registrar Office',
      description: 'Enrollment, grades, transcripts',
      icon: FileText,
      color: 'text-primary'
    },
    {
      value: 'cashier' as ServiceType,
      label: 'Cashier Office',
      description: 'Payments, receipts, billing',
      icon: DollarSign,
      color: 'text-secondary'
    },
    {
      value: 'admin' as ServiceType,
      label: 'Admin Office',
      description: 'General inquiries, documents',
      icon: Settings,
      color: 'text-accent'
    }
  ];

  const pendingTransactions = studentTransactions.filter(t => t.status === 'pending');
  const recentTransactions = studentTransactions.slice(-5);

  return (
    <Layout title="Student Portal">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="gradient-hero rounded-xl p-6 text-white shadow-strong">
          <h1 className="text-2xl font-bold mb-2">
            Welcome, {currentUser?.fullName}!
          </h1>
          <p className="text-white/90">
            Request a queue number for the service you need
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-status-pending/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-status-pending" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingTransactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-status-completed/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-status-completed" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{studentTransactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {studentTransactions.filter(t => t.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request New Queue */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Request Queue Number
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {serviceOptions.map((service) => (
                <Card 
                  key={service.value}
                  className={`cursor-pointer transition-smooth border-2 ${
                    selectedService === service.value 
                      ? 'border-primary shadow-medium' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedService(service.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <service.icon className={`h-5 w-5 ${service.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{service.label}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Time Picker */}
            <div className="w-full md:w-1/3">
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select Preferred Time</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            <Button 
              onClick={handleRequestQueue}
              className="w-full gradient-primary"
              size="lg"
            >
              Request Queue Number
            </Button>
          </CardContent>
        </Card>

        {/* Current Queue Status */}
        {pendingTransactions.length > 0 && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Your Current Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingTransactions.map((transaction) => (
                  <QueueCard 
                    key={transaction.id} 
                    transaction={transaction}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentTransactions.map((transaction) => (
                  <QueueCard 
                    key={transaction.id} 
                    transaction={transaction}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentDashboard;