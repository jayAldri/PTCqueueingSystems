import { Student, QueueTransaction, Staff, ServiceType, TransactionStatus } from '@/types';

export const mockStudents: Student[] = [
  {
    id: '1',
    fullName: 'Jay Aldrin O Rabi',
    course: 'BSIT',
    yearLevel: '3rd Year',
    email: 'JayAldrin.Rabi@paterostechnologicalcollege.edu.ph',
    contactNumber: '+639123456789',
    section: "BSIT-3G",
    role: "student",
    username: "JayAldrin.Rabi",
    password: "password123"
  },
  {
    id: '2',
    fullName: 'Maria Isabel Cruz',
    course: 'BSCS',
    yearLevel: '2nd Year',
    email: 'Maria.Cruz@paterostechnologicalcollege.edu.ph',
    contactNumber: '+639987654321',
    section: "BSIT-2G",
    role: "student",
    username: "Maria.Cruz",
    password: "password123"
  },
  {
    id: '3',
    fullName: 'Roberto Dela Cruz',
    course: 'BSECE',
    yearLevel: '4th Year',
    email: 'Roberto.DelaCruz@paterostechnologicalcollege.edu.phh',
    contactNumber: '+639456123789',
    section: "BSIT-4G",
    role: "student",
    username: "Roberto.DelaCruz",
    password: "password123"
  }
];

export const mockStaff: Staff[] = [
  {
    id: 'staff1',
    fullName: 'Mrs. Elena Rodriguez',
    role: 'registrar',
    username: 'e.rodriguez',
    serviceType: 'registrar',
    password: "password123"
  },
  {
    id: 'staff2',
    fullName: 'Mr. Carlos Mendoza',
    role: 'cashier',
    username: 'c.mendoza',
    serviceType: 'cashier',
    password: "password123"
  },
  {
    id: 'staff3',
    fullName: 'Dr. Patricia Santos',
    role: 'admin',
    username: 'p.santos',
    password: "password123"
  }
];

const generateQueueNumber = (serviceType: ServiceType): string => {
  const prefix = serviceType.substring(0, 3).toUpperCase();
  const number = Math.floor(Math.random() * 999) + 1;
  return `${prefix}-${number.toString().padStart(3, '0')}`;
};

export const generateMockTransactions = (): QueueTransaction[] => {
  const transactions: QueueTransaction[] = [];
  const now = new Date();
  
  // Generate today's transactions
  for (let i = 0; i < 15; i++) {
    const serviceTypes: ServiceType[] = ['registrar', 'cashier', 'admin'];
    const statuses: TransactionStatus[] = ['pending', 'processing', 'completed'];
    
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const student = mockStudents[Math.floor(Math.random() * mockStudents.length)];
    
    const dateTime = new Date(now.getTime() - Math.random() * 8 * 60 * 60 * 1000); // Random time within last 8 hours
    
    transactions.push({
      id: `trans_${i + 1}`,
      studentId: student.id,
      student,
      queueNumber: generateQueueNumber(serviceType),
      serviceType,
      status,
      dateTime,
      completedAt: status === 'completed' ? new Date(dateTime.getTime() + Math.random() * 30 * 60 * 1000) : undefined,
      notes: status === 'completed' ? 'Transaction completed successfully' : undefined
    });
  }
  
  return transactions.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
};

export const mockTransactions = generateMockTransactions();

/** Helper: cancel transaction by id */
export const cancelTransaction = (id: string): QueueTransaction | null => {
  const transaction = mockTransactions.find(t => t.id === id);
  if (transaction && (transaction.status === 'pending' || transaction.status === 'processing')) {
    transaction.status = 'cancelled';
    transaction.notes = 'Transaction cancelled by student';
    return transaction;
  }
  return null;
};

export const getServiceQueue = (serviceType: ServiceType) => {
  return mockTransactions.filter(t => t.serviceType === serviceType);
};

export const getPendingQueue = (serviceType: ServiceType) => {
  return mockTransactions
    .filter(t => t.serviceType === serviceType && t.status === 'pending')
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
};

export const getProcessingQueue = (serviceType: ServiceType) => {
  return mockTransactions.filter(t => t.serviceType === serviceType && t.status === 'processing');
};

export const getCompletedQueue = (serviceType: ServiceType) => {
  return mockTransactions.filter(t => t.serviceType === serviceType && t.status === 'completed');
};