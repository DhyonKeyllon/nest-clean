import { Injectable } from '@nestjs/common';

import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class CatService {
  create(createCatDto: CreateCatDto) {
    const { name, age, breed } = createCatDto;

    try {
      return {
        data: {
          name,
          age,
          breed,
        },
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  findAll() {
    return `This action returns all cat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cat`;
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    return {
      data: {
        id,
        ...updateCatDto,
      },
    };
  }

  remove(id: number) {
    return `This action removes a #${id} cat`;
  }
}
