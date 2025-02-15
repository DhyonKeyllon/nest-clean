import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const CatSchema = extendApi(
  z.object({
    id: z.string().uuid(),
    name: z.string().nonempty(),
    age: z.number().int().positive(),
    breed: z.string().nonempty(),
  }),
  {
    title: 'Cat',
    description: 'A cat',
  },
);

export class CatDto extends createZodDto(CatSchema) {}
