import { User, UserRole } from '@/types';
import { mockStudents, mockStaff } from './mockData';

// Mock authentication - In real app, this would connect to Supabase
export const mockUsers: User[] = [
  // Students
  ...mockStudents.map(student => ({
    id: student.id,
    fullName: student.fullName,
    role: 'student' as UserRole,
    email: student.email
  })),
  // Staff
  ...mockStaff.map(staff => ({
    id: staff.id,
    fullName: staff.fullName,
    role: staff.role,
    email: `${staff.username}@paterostechnologicalcollege.edu.ph`,
    serviceType: staff.serviceType
  }))
];

export const getCurrentUser = (): User | null => {
  const storedUser = localStorage.getItem('currentUser');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const login = async (email: string, password: string): Promise<User | null> => {
  if (!email.endsWith('@paterostechnologicalcollege.edu.ph')){
    return null;
  }

  // Mock login - find user by email
  const user = mockUsers.find(u => u.email === email);
  if (user && password === 'password123') { // Mock password
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const isAuthorized = (user: User, serviceType?: string): boolean => {
  if (user.role === 'admin') return true;
  if (user.role === 'student') return false;
  return user.serviceType === serviceType;
};