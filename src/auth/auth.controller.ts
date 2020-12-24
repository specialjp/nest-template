import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {

  }

  @Post('signup')
  signUp(@Body() credential: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(credential)
  }

  @Post('signin')
  signIn(@Body() credential: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(credential)
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test() {
    return 'Hello NestJS'
  }

}



