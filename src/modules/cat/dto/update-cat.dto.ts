import { createZodDto } from '@anatine/zod-nestjs';

import { CatSchema } from '../entities/cat.entity';

export class UpdateCatDto extends createZodDto(
  CatSchema.omit({
    id: true,
  }).partial(),
) {}
