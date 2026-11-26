export class UserEntity {
  id: number;
  name: string;
  email: string;
  role: 'VIEWER' | 'OWNER';
  isActive: boolean;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}
