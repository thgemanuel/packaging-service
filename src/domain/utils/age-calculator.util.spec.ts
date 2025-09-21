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
      const birthdate = new Date(2000, 4, 10);
      expect(calculateAge(birthdate)).toBe(23);

      expect(calculateAge('2000-05-10')).toBe(23);
    });

    it('should calculate age correctly when birthday has not yet passed in current year', () => {
      const birthdate = new Date(2000, 11, 25);
      expect(calculateAge(birthdate)).toBe(22);

      expect(calculateAge('2000-12-25')).toBe(22);
    });

    it('should calculate age correctly when birthday is today', () => {
      const birthdate = new Date(2000, 9, 15);
      expect(calculateAge(birthdate)).toBe(23);
    });
  });

  describe('hasLegalAge', () => {
    it('should return true for people 18 years or older', () => {
      expect(hasLegalAge(new Date(2005, 9, 15))).toBe(true);

      expect(hasLegalAge(new Date(2000, 9, 15))).toBe(true);
      expect(hasLegalAge('1990-10-15')).toBe(true);
    });

    it('should return false for people under 18 years old', () => {
      expect(hasLegalAge(new Date(2005, 9, 16))).toBe(false);

      expect(hasLegalAge('2010-01-01')).toBe(false);
    });
  });
});
