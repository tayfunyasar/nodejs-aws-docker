import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController(true)
export class HomeController {

  @Get()
  swagger(@Res() res) {
    return res.status(HttpStatus.MOVED_PERMANENTLY).redirect('/swagger');
  }
}
