export class UserEntity {
  id: number;
  name: string;
  email: string;
  role: 'VIEWER' | 'OWNER';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
