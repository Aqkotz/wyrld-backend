export type ScopeNames = 'ADMIN' | 'USER' | 'UNVERIFIED';

interface IScope {
  name: ScopeNames,
  subscopes: Set<ScopeNames>
}

const AdminScope: IScope = {
  name: 'ADMIN',
  subscopes: new Set<ScopeNames>(['USER', 'UNVERIFIED']),
};

const UserScope: IScope = {
  name: 'USER',
  subscopes: new Set([]),
};

const UnverifiedScope: IScope = {
  name: 'UNVERIFIED',
  subscopes: new Set([]),
};

export const SCOPES: Record<ScopeNames, IScope> = {
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
export const isSubScope = (s1: ScopeNames, s2: ScopeNames) => {
  if (s1 == s2) { return true; }
  if (!SCOPES[s1].subscopes.size) { return false; }

  return Array.from(SCOPES[s1].subscopes.values()).some(s => isSubScope(s, s2));
};