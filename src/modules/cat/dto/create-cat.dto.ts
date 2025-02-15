import { createZodDto } from '@anatine/zod-nestjs';

import { CatSchema } from '../entities/cat.entity';

export class CreateCatDto extends createZodDto(
  CatSchema.omit({
    id: true,
  }),
) {}
