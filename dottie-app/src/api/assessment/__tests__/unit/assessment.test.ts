import { vi, describe, it, expect, beforeEach } from 'vitest';
import { assessmentApi } from '../../../assessment';
import apiClient from '../../../core/apiClient';

// Mock the API client
vi.mock('../../../core/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Assessment API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('list', () => {
    it('should fetch all assessments for the authenticated user', async () => {
      const mockData = [{ id: '1', date: '2023-01-01' }];
      (apiClient.get as any).mockResolvedValueOnce({ data: mockData });
      
      const result = await assessmentApi.list();
      
      expect(apiClient.get).toHaveBeenCalledWith('/api/assessment/list');
      expect(result).toEqual(mockData);
    });
  });

  describe('getById', () => {
    it('should fetch an assessment by ID', async () => {
      const mockData = { id: '1', date: '2023-01-01' };
      (apiClient.get as any).mockResolvedValueOnce({ data: mockData });
      
      const result = await assessmentApi.getById('1');
      
      expect(apiClient.get).toHaveBeenCalledWith('/api/assessment/1');
      expect(result).toEqual(mockData);
    });
  });

  describe('sendAssessment', () => {
    it('should send assessment data to the server', async () => {
      const mockInput = { date: '2023-01-01' };
      const mockResponse = { id: '1', ...mockInput };
      (apiClient.post as any).mockResolvedValueOnce({ data: mockResponse });
      
      const result = await assessmentApi.sendAssessment(mockInput as any);
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/assessment/send', mockInput);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should update an assessment', async () => {
      const mockId = '1';
      const mockInput = { date: '2023-01-01' };
      const mockResponse = { id: mockId, ...mockInput };
      (apiClient.put as any).mockResolvedValueOnce({ data: mockResponse });
      
      const result = await assessmentApi.update(mockId, mockInput);
      
      expect(apiClient.put).toHaveBeenCalledWith(`/api/assessment/${mockId}`, mockInput);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete an assessment', async () => {
      const mockId = '1';
      (apiClient.delete as any).mockResolvedValueOnce({});
      
      await assessmentApi.delete(mockId);
      
      expect(apiClient.delete).toHaveBeenCalledWith(`/api/assessment/${mockId}`);
    });
  });
}); 