import { UserRole } from '@prisma/client';

interface IScope {
  name: UserRole,
  subscopes: Set<UserRole>
}

const AdminScope: IScope = {
  name: UserRole.ADMIN,
  subscopes: new Set<UserRole>([UserRole.USER, UserRole.UNVERIFIED]),
};

const UserScope: IScope = {
  name: UserRole.USER,
  subscopes: new Set([]),
};

const UnverifiedScope: IScope = {
  name: UserRole.UNVERIFIED,
  subscopes: new Set([]),
};

export const SCOPES: Record<UserRole, IScope> = {
  ADMIN: AdminScope,
  USER: UserScope,
  UNVERIFIED: UnverifiedScope,
};

/**
 * A function that checks if s2 is a subscope of s1
 * @param s1 scope that is potentially the parent scope
 * @param s2 scope that is potentially the subscope
 * @returns whether s2 is a subscope of s1
 */
export const isSubScope = (s1: UserRole, s2: UserRole) => {
  if (s1 == s2) { return true; }
  if (!SCOPES[s1].subscopes.size) { return false; }

  return Array.from(SCOPES[s1].subscopes.values()).some(s => isSubScope(s, s2));
};