import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/user/user.repository";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {

  }

  async signUp(credential: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(credential)
  }

  async signIn(credential: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUsernameAndPassword(credential)

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = {
      username
    }

    const accessToken = this.jwtService.sign(payload)
    return { accessToken }
  }
}