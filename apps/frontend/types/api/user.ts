export type UserRole = 'ADMIN' | 'USER';

export interface CreateUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
}

export interface BackendUser {
  readonly id: string;
  readonly email: string;
  readonly isAdmin?: boolean;
  readonly canCreateCart?: boolean;
  readonly canOrderProducts?: boolean;
  readonly firstname: string | null;
  readonly secondname: string | null;
  readonly lastname: string | null;
  readonly role?: UserRole;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PaginatedUsersResponse {
  readonly data: BackendUser[];
  readonly total: number;
}

export interface GetUsersResponse {
  readonly users: BackendUser[];
}
