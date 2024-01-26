import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
  Patch,
  Req,
  Delete,
  Get,
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

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'update' })
  async updateAddress(@Req() request: any, @Body() updateDto: AddAddressDto) {
    await this.addAddressUseCasesProxy
      .getInstance()
      .updateAddress(updateDto, request.user.id);
    return 'Update successful';
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'delete' })
  async deleteAddress(@Req() request: any) {
    await this.addAddressUseCasesProxy
      .getInstance()
      .deleteAddress(request.user.id);
    return 'Delete successful';
  }

  @Get('get')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get' })
  async getAddress(@Req() request: any) {
    const address = await this.addAddressUseCasesProxy
      .getInstance()
      .getAllAddresses(request.user.accountType);
    return address;
  }
}
