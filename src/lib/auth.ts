import { User, UserRole } from '@/types';
import { mockStudents, mockStaff } from './mockData';

// Combine students and staff into one user array
export const mockUsers: User[] = [
  // Students
  ...mockStudents.map(student => ({
    id: student.id,
    fullName: student.fullName,
    role: 'student' as UserRole,
    email: student.email,
    password: student.password 
  })),
  // Staff
  ...mockStaff.map(staff => ({
    id: staff.id,
    fullName: staff.fullName,
    role: staff.role,
    email: `${staff.username}@paterostechnologicalcollege.edu.ph`, // just for consistency
    username: staff.username,
    serviceType: staff.serviceType,
    password: staff.password 
  }))
];

export const getCurrentUser = (): User | null => {
  const storedUser = localStorage.getItem('currentUser');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const login = async (identifier: string, password: string): Promise<User | null> => {
  // normalize input for case-insensitive check
  const lowerIdentifier = identifier.toLowerCase();

  // allow login by email OR username
  const user = mockUsers.find(u =>
    (u.email && u.email.toLowerCase() === lowerIdentifier) ||
    (u.username && u.username.toLowerCase() === lowerIdentifier)
  );

  // accept only password123 for testing
  if (user && password === "password123") {
    localStorage.setItem("currentUser", JSON.stringify(user));
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
