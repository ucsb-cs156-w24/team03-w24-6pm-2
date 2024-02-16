import { onDeleteSuccess, cellToAxiosParamsDelete } from 'main/utils/ucsbDiningCommonsMenuItemsUtils';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => {
  return {
    toast: jest.fn(),
  };
});

describe('UCSBDiningCommonsMenuItemsUtils', () => {
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
      const cell = { row: { values: { id: '1' } } };
      const result = cellToAxiosParamsDelete(cell);

      expect(result).toEqual({
        url: '/api/ucsbdiningcommonsmenuitems',
        method: 'DELETE',
        params: {
          id: '1',
        },
      });
    });
  });
});