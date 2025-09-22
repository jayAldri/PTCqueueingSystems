export type UserRole = 'student' | 'registrar' | 'cashier' | 'admin';

export type ServiceType = 'registrar' | 'cashier' | 'admin';

export type TransactionStatus = 'pending' | 'processing' | 'completed';

export interface Student {
  id: string;
  fullName: string;
  course: string;
  yearLevel: string;
  email: string;
  contactNumber: string;
}

export interface QueueTransaction {
  id: string;
  studentId: string;
  student?: Student;
  queueNumber: string;
  serviceType: ServiceType;
  status: TransactionStatus;
  dateTime: Date;
  completedAt?: Date;
  notes?: string;
}

export interface Staff {
  id: string;
  fullName: string;
  role: UserRole;
  username: string;
  serviceType?: ServiceType;
}

export interface Report {
  id: string;
  generatedBy: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  serviceType?: ServiceType;
  totalTransactions: number;
  averageWaitTime: number;
  completedTransactions: number;
  pendingTransactions: number;
}

export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  email: string;
  serviceType?: ServiceType;
}