import { Body, Controller, Headers, Post, Query, Req } from '@nestjs/common';
import { PaymentsService } from '../payments/payments.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('mercadopago')
  mercadopago(
    @Body() body: any,
    @Headers() headers: Record<string, string | string[] | undefined>,
    @Query() query: Record<string, string | string[] | undefined>,
    @Req() req: any
  ) {
    const mergedHeaders: Record<string, string | string[] | undefined> = {
      ...(headers ?? {}),
      ...(req?.headers ?? {})
    };

    const mergedQuery: Record<string, string | string[] | undefined> = {
      ...(query ?? {}),
      ...(req?.query ?? {})
    };

    return this.paymentsService.processMercadoPagoWebhook(body, mergedHeaders, mergedQuery);
  }
}
