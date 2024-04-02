export const getSuccessfulDeletionMessage = (id: string): string => `User with id: ${id} was successfully deleted`;

export type CompareCallback = (err: Error | null, isMatch?: boolean) => void;

export const PORT = process.env.PORT || 9090;

export const BYPASS_CODE = 'AAAAAA';

export const HASH_ROUNDS = 10;
