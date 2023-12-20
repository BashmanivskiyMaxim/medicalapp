import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { AddressPresenter } from './address.presenter';
import { addAddressUseCases } from 'src/usecases/address/addAddress.usecases';
import { AddAddressDto } from './address.dto';

@Controller('address')
@ApiTags('address')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiExtraModels(AddressPresenter)
export class AddressController {
  constructor(
    @Inject(UsecasesProxyModule.POST_ADDRESS_USECASES_PROXY)
    private readonly addAddressUseCasesProxy: UseCaseProxy<addAddressUseCases>,
  ) {}

  @Post('address')
  @ApiResponse({ type: AddressPresenter })
  async addappointment(@Body() addaddressDto: AddAddressDto) {
    const addressCreated = await this.addAddressUseCasesProxy
      .getInstance()
      .execute(addaddressDto);
    return new AddressPresenter(addressCreated);
  }
}
