export type UserRole = 'student' | 'registrar' | 'cashier' | 'admin';

export type ServiceType = 'registrar' | 'cashier' | 'admin';

export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Student {
  id: string;
  fullName: string;
  course: string;
  yearLevel: string;
  section: string;
  email: string;
  contactNumber: string;
  role: "student";
  password: string;
}

//Student extends User
export interface Student extends User {
  role: 'student';
  course: string;
  yearLevel: string;
  section: string;
  contactNumber: string;
}

export interface QueueTransaction {
  id: string;
  studentId: string;
  student?: User | Student;
  queueNumber: string;
  serviceType: ServiceType;
  status: TransactionStatus;
  dateTime: Date;
  preferredTime?: string;
  completedAt?: Date;
  notes?: string;
}

export interface Staff {
  id: string;
  fullName: string;
  role: UserRole;
  username: string;
  serviceType?: ServiceType;
  password: string;
}

export interface Staf extends User {
  role: "registrar" | "cashier" | "admin";
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
  username?: string;
  password: string;
  course?: string;
  yearLevel?: string;
  contactNumber?: string;
}