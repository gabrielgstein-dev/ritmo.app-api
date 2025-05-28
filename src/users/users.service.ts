import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;


    const userExists = await this.usersRepository.findOne({ where: { email } });
    if (userExists) {
      throw new ConflictException('Email já está em uso');
    }


    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);


    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);


    delete user.password;
    
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    

    return users.map(user => {
      const { password, ...result } = user;
      return result as User;
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      relations: ['companies'] 
    });
    
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    

    delete user.password;
    
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    

    const updatedUser = { ...user, ...updateUserDto };
    await this.usersRepository.save(updatedUser);
    

    delete updatedUser.password;
    
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
  }
}
