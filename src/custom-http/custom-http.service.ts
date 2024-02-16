import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class CustomHttpService {
  private readonly PAYSTACK_BASE_URL: string =
    this.configService.getOrThrow('PAYSTACK_BASE_URL');
  private readonly PAYSTACK_SECRET_KEY: string = this.configService.getOrThrow(
    'PAYSTACK_SECRET_KEY',
  );
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async paystackHttpService<ResponseT, RequestT = null>(
    method: 'post' | 'get',
    route: string,
    payload?: RequestT,
  ): Promise<ResponseT> {
    const CONFIG = {
      baseURL: this.PAYSTACK_BASE_URL,
      headers: {
        Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const call = this.httpService[method](
      route,
      method === 'get' ? CONFIG : payload,
      method === 'get' ? undefined : CONFIG,
    )
      .pipe(
        map((result) => {
          if (!result.data) {
            return result;
          }

          return result.data;
        }),
      )
      .pipe(
        catchError(async (error: AxiosError<Error>) => {
          const responseMessage =
            error?.response?.data?.message ??
            error?.response?.statusText ??
            error.message ??
            'Temporary server error, please try again later';
          const responseStatue = error?.response?.status ?? 500;
          throw new HttpException(responseMessage, responseStatue, {
            cause: new Error(
              responseMessage ?? 'Temporary error, please try again later',
            ),
          });
        }),
      );

    const client = lastValueFrom(call);
    return await client;
  }
}
