import { ILogger } from 'src/domain/logger/logger.interface';
import { addAddressUseCases } from '../addAddress.usecases';
import { EntityValidator } from 'src/usecases/utils/checkExistense.usecases';
import { AddressRepository } from 'src/domain/repositories/address.repository.interface';
import { AddressModel } from '../../../domain/model/addressModel';

describe('addAddressUseCases', () => {
  let useCases: addAddressUseCases;
  let logger: ILogger;
  let checkExistenceUseCase: EntityValidator;
  let addressRepository: jest.Mocked<AddressRepository>;

  beforeEach(() => {
    // Create mock instances of dependencies
    logger = jest.fn() as any;
    addressRepository = {
      createAddress: jest.fn(),
      updateAddress: jest.fn(),
      deleteAddress: jest.fn(),
      findByAccountId: jest.fn(),
      getAllAddresses: jest.fn(),
      findByProperty: jest.fn(),
      getAddresses: jest.fn(),
    } as jest.Mocked<AddressRepository>;
    checkExistenceUseCase = {
      existence: jest.fn(),
    } as any;

    // Create an instance of the class under test
    useCases = new addAddressUseCases(
      logger,
      addressRepository,
      checkExistenceUseCase,
    );
  });

  it('should create an address', async () => {
    // Arrange
    const data = new AddressModel();
    data.address = '123 Main St';
    const accountId = '1';

    // Act
    const result = await useCases.execute(data, accountId);

    // Assert
    expect(checkExistenceUseCase.existence).toHaveBeenCalledWith(
      accountId,
      true,
    );
    expect(addressRepository.createAddress).toHaveBeenCalledWith(data);
    expect(result).toBe(data);
  });

  // Add more tests for the other methods in the same way
  it('should update an address', async () => {
    // Arrange
    const data = new AddressModel();
    data.address = '123 Main St';
    const accountId = '1';

    // Act
    const result = await useCases.updateAddress(data, accountId);

    // Assert
    expect(checkExistenceUseCase.existence).toHaveBeenCalledWith(
      accountId,
      false,
    );
    expect(addressRepository.updateAddress).toHaveBeenCalledWith(
      data,
      +accountId,
    );
    expect(result).toBe(data);
  });

  it('should delete an address', async () => {
    // Arrange
    const accountId = '1';
    const existingAddressAccount = new AddressModel();
    existingAddressAccount.id = +accountId;

    addressRepository.findByAccountId.mockResolvedValue(existingAddressAccount);

    // Act
    const result = await useCases.deleteAddress(accountId);

    // Assert
    expect(checkExistenceUseCase.existence).toHaveBeenCalledWith(
      accountId,
      false,
    );
    expect(addressRepository.findByAccountId).toHaveBeenCalledWith(+accountId);
    expect(addressRepository.deleteAddress).toHaveBeenCalledWith(
      +existingAddressAccount.id,
    );
    expect(result).toBe(existingAddressAccount);
  });

  it('should get all addresses for admin', async () => {
    // Arrange
    const accountType = 'admin';
    const addresses = [new AddressModel(), new AddressModel()];

    addressRepository.getAllAddresses.mockResolvedValue(addresses);

    // Act
    const result = await useCases.getAllAddresses(accountType);

    // Assert
    expect(addressRepository.getAllAddresses).toHaveBeenCalled();
    expect(result).toBe(addresses);
  });

  it('should throw an error when getting all addresses for non-admin', async () => {
    // Arrange
    const accountType = 'user';

    // Act and Assert
    await expect(useCases.getAllAddresses(accountType)).rejects.toThrow(
      'Permission denied',
    );
  });
});
