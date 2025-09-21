import { calculateAge, hasLegalAge } from './age-calculator.util';

describe('AgeCalculator', () => {
  const fixedDate = new Date(2023, 9, 15);

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(fixedDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('calculateAge', () => {
    it('should calculate age correctly when birthday has already passed in current year', () => {
      // Birth date: May 10, 2000 (birthday already passed this year)
      const birthdate = new Date(2000, 4, 10);
      expect(calculateAge(birthdate)).toBe(23);

      // Testing with ISO string
      expect(calculateAge('2000-05-10')).toBe(23);
    });

    it('should calculate age correctly when birthday has not yet passed in current year', () => {
      // Birth date: December 25, 2000 (birthday has not passed this year)
      const birthdate = new Date(2000, 11, 25);
      expect(calculateAge(birthdate)).toBe(22);

      // Testing with ISO string
      expect(calculateAge('2000-12-25')).toBe(22);
    });

    it('should calculate age correctly when birthday is today', () => {
      // Birth date: October 15, 2000 (birthday is today)
      const birthdate = new Date(2000, 9, 15);
      expect(calculateAge(birthdate)).toBe(23);
    });
  });

  describe('hasLegalAge', () => {
    it('should return true for people 18 years or older', () => {
      // Exactly 18 years old (October 15, 2005)
      expect(hasLegalAge(new Date(2005, 9, 15))).toBe(true);

      // Older than 18 years (born in 2000 and 1990)
      expect(hasLegalAge(new Date(2000, 9, 15))).toBe(true);
      expect(hasLegalAge('1990-10-15')).toBe(true);
    });

    it('should return false for people under 18 years old', () => {
      // Underage (born on October 16, 2005 - one day before turning 18)
      expect(hasLegalAge(new Date(2005, 9, 16))).toBe(false);

      // Underage (born in 2010)
      expect(hasLegalAge('2010-01-01')).toBe(false);
    });
  });
});
