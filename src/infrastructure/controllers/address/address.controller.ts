import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { AddressPresenter } from './address.presenter';
import { addAddressUseCases } from 'src/usecases/address/addAddress.usecases';
import { AddAddressDto } from './address.dto';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';

@Controller('address')
@ApiTags('address')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiExtraModels(AddressPresenter)
export class AddressController {
  constructor(
    @Inject(UsecasesProxyModule.POST_ADDRESS_USECASES_PROXY)
    private readonly addAddressUseCasesProxy: UseCaseProxy<addAddressUseCases>,
  ) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: AddAddressDto })
  @ApiOperation({ description: 'add address info' })
  @ApiResponse({ type: AddressPresenter })
  async addAddress(
    @Body() addaddressDto: AddAddressDto,
    @Request() request: any,
  ) {
    const addressCreated = await this.addAddressUseCasesProxy
      .getInstance()
      .execute(addaddressDto, request.user.id);
    return new AddressPresenter(addressCreated);
  }
}
