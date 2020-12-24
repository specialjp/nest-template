import { AuthCredentialsDto } from 'src/auth/dto/auth-credential.dto';
import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User>{

  async signUp(credential: AuthCredentialsDto) {
    const { username, password } = credential

    const user = new User()
    user.username = username
    user.salt = await bcrypt.genSalt()
    user.password = await UserRepository.hashPassword(password, user.salt)

    try {
      await user.save()
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('username already exists')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async validateUsernameAndPassword(credential: AuthCredentialsDto) {
    const { username, password } = credential
    const user = await this.findOne({ username })
    if (user && user.validatePassword(password)) {
      return username
    } else {
      return null
    }
  }

  private static async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

}

