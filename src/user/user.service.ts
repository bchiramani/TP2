import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
  
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const newUser = await this.userRepository.preload({ id, ...updateUserDto });
    if (newUser) {
      return await this.userRepository.save(newUser);
    } else {
      throw new NotFoundException(`The user N ${id} doesn't exist `);
    }
  }


}
