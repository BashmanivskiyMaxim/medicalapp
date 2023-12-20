import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { addMessageUseCases } from 'src/usecases/message/addMessage.usecases';
import { MessagePresenter } from './message.presenter';
import { AddMessageDto } from './message.dto';

@Controller('message')
@ApiTags('message')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiExtraModels(MessagePresenter)
export class MessageController {
  constructor(
    @Inject(UsecasesProxyModule.POST_MESSAGE_USECASES_PROXY)
    private readonly addMessageUseCasesProxy: UseCaseProxy<addMessageUseCases>,
  ) {}

  @Post('message')
  @ApiResponse({ type: MessagePresenter })
  async addschedule(@Body() addmessageDto: AddMessageDto) {
    const messageCreated = await this.addMessageUseCasesProxy
      .getInstance()
      .execute(addmessageDto);
    return new MessagePresenter(messageCreated);
  }
}
