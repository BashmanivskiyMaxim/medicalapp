import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { addMessageUseCases } from 'src/usecases/message/addMessage.usecases';
import { MessagePresenter } from './message.presenter';
import { AddMessageDto } from './message.dto';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';

@Controller('message')
@ApiTags('message')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiExtraModels(MessagePresenter)
export class MessageController {
  constructor(
    @Inject(UsecasesProxyModule.POST_MESSAGE_USECASES_PROXY)
    private readonly addMessageUseCasesProxy: UseCaseProxy<addMessageUseCases>,
  ) {}

  @Post('add')
  @ApiResponse({ type: MessagePresenter })
  @ApiOperation({ description: 'create message' })
  @UseGuards(JwtAuthGuard)
  async addMessage(
    @Body() addmessageDto: AddMessageDto,
    @Request() request: any,
  ) {
    const messageCreated = await this.addMessageUseCasesProxy
      .getInstance()
      .execute(addmessageDto, request.user);
    return new MessagePresenter(messageCreated);
  }

  @Get('get')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get messages' })
  async getMessages(@Request() request: any) {
    const messages = await this.addMessageUseCasesProxy
      .getInstance()
      .getMessages(request.user);
    return messages;
  }
}
