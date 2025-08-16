/**
 * Person entity representing an individual's core identity information
 */
export interface Person {
  /** Unique identifier for the person */
  personId: number;
  
  /** Person's first name */
  firstName: string;
  
  /** Person's middle name (optional) */
  middleName?: string;
  
  /** Person's last name */
  lastName: string;
  
  /** Person's second last name (optional) */
  secondLastName?: string;
  
  /** Type of identity document */
  identityType: 'DNI' | 'PASSPORT' | 'CC' | 'NIE' | 'OTHER';
  
  /** Identity document number (unique) */
  identityNumber: string;
  
  /** Person's email address (optional, unique) */
  email?: string;
  
  /** Person's phone number (optional) */
  phone?: string;
  
  /** Person's birth date (optional) */
  birthDate?: Date;
  
  /** Timestamp when the person record was created */
  createdAt: Date;
  
  /** Timestamp when the person record was last updated */
  updatedAt: Date;
}

/**
 * Helper function to get person's full name
 */
export function getPersonFullName(person: Person): string {
  const parts = [
    person.firstName,
    person.middleName,
    person.lastName,
    person.secondLastName
  ].filter(Boolean);
  
  return parts.join(' ');
}

/**
 * Helper function to get person's display name (first + last name)
 */
export function getPersonDisplayName(person: Person): string {
  return `${person.firstName} ${person.lastName}`;
}