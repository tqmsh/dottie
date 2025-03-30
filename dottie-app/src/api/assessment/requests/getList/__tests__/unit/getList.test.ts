import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getList } from '../../Request';
import { apiClient } from '../../../../../core/apiClient';

// Mock the apiClient
vi.mock('../../../../../core/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('getList request', () => {
  const mockAssessments = [
    {
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
    },
    {
      id: '456',
      date: '2023-05-20',
      pattern: 'Irregular',
      age: '30',
      cycleLength: '32',
      periodDuration: '4',
      flowHeaviness: 'Light',
      painLevel: 'Medium',
      symptoms: {
        physical: ['Headache'],
        emotional: ['Irritability'],
      },
      recommendations: [
        {
          title: 'Hydration',
          description: 'Drinking plenty of water can help with headaches',
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch list of assessments successfully', async () => {
    // Arrange
    const mockResponse = { data: mockAssessments };
    (apiClient.get as any).mockResolvedValueOnce(mockResponse);
    
    // Act
    const result = await getList();
    
    // Assert
    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/api/assessment');
    expect(result).toEqual(mockAssessments);
    expect(result.length).toBe(2);
  });

  it('should throw an error when the request fails', async () => {
    // Arrange
    const mockError = new Error('Network error');
    (apiClient.get as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    await expect(getList()).rejects.toThrow('Network error');
    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/api/assessment');
  });

  it('should propagate the original error', async () => {
    // Arrange
    const mockError = new Error('API error');
    (apiClient.get as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    try {
      await getList();
      // Force test to fail if no error is thrown
      expect(true).toBe(false); 
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
}); 