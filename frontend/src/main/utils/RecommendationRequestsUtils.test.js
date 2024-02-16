import { onDeleteSuccess, cellToAxiosParamsDelete } from './RecommendationRequestsUtils';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => {
  return {
    toast: jest.fn(),
  };
});

describe('RecommendationRequestsUtils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onDeleteSuccess', () => {
    it('should log the message to the console and display a toast', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const message = 'Delete successful';

      onDeleteSuccess(message);

      expect(consoleSpy).toHaveBeenCalledWith(message);
      expect(toast).toHaveBeenCalledWith(message);
    });
  });

  describe('cellToAxiosParamsDelete', () => {
    it('should return axios parameters for a DELETE request', () => {
      const cell = { row: { values: { id: '123' } } };
      const result = cellToAxiosParamsDelete(cell);

      expect(result).toEqual({
        url: '/api/recommendationrequests',
        method: 'DELETE',
        params: {
          id: '123',
        },
      });
    });
  });
});