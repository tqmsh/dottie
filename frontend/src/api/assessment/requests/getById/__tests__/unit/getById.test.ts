import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getById } from '../../Request';
import { apiClient } from '../../../../../core/apiClient';

// Mock the apiClient
vi.mock('../../../../../core/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('getById request', () => {
  const mockAssessment = {
    id: '123',
    date: '2023-04-15',
    pattern: 'Regular',
    age: '25',
    cycleLength: '28',
    periodDuration: '5',
    flowHeaviness: 'Medium',
    painLevel: 'Low',
    symptoms: {
      physical: ['Cramps', 'Bloating'],
      emotional: ['Mood swings'],
    },
    recommendations: [
      {
        title: 'Exercise',
        description: 'Regular exercise can help reduce period pain',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch assessment by id successfully', async () => {
    // Arrange
    const mockResponse = { data: mockAssessment };
    (apiClient.get as any).mockResolvedValueOnce(mockResponse);
    
    // Act
    const result = await getById('123');
    
    // Assert
    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/api/assessment/123');
    expect(result).toEqual(mockAssessment);
  });

  it('should throw an error when the request fails', async () => {
    // Arrange
    const mockError = new Error('Network error');
    (apiClient.get as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    await expect(getById('123')).rejects.toThrow('Network error');
    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/api/assessment/123');
  });

  it('should propagate the original error', async () => {
    // Arrange
    const mockError = new Error('API error');
    (apiClient.get as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    try {
      await getById('123');
      // Force test to fail if no error is thrown
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
}); 