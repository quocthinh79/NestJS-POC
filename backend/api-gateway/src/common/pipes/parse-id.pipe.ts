import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform {
  transform(value: string) {
    const id = Number(value);
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid ID parameter');
    }
    return id;
  }
}
