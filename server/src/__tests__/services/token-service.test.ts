import { signToken } from '../../services/token-service';

describe('token-service', () => {
  describe('signToken', () => {
    const mockUserId = '123';
    const mockEmail = 'test@example.com';
    const mockSecret = 'my_secret';

    beforeAll(() => {
      process.env.JWT_SECRET = mockSecret;
    });

    afterAll(() => {
      delete process.env.JWT_SECRET;
    });

    it('returns a JWT token when provided with valid inputs', () => {
      const token = signToken(mockUserId, mockEmail);
      expect(token).toBeDefined();

      // Verify the token is a string with 3 dot-separated parts
      const tokenParts = token!.split('.');
      expect(tokenParts.length).toBe(3);
      expect(typeof tokenParts[0]).toBe('string');
      expect(typeof tokenParts[1]).toBe('string');
      expect(typeof tokenParts[2]).toBe('string');
    });

    it('returns undefined when the JWT secret is not defined', () => {
      delete process.env.JWT_SECRET;
      const token = signToken(mockUserId, mockEmail);
      expect(token).toBeUndefined();
    });

    it('returns the same result for the same input', () => {
      const token1 = signToken(mockUserId, mockEmail);
      const token2 = signToken(mockUserId, mockEmail);
      expect(token1).toEqual(token2);
    })
  });
});