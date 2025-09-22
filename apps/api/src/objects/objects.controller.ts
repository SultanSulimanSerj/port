import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectsService } from './objects.service';

@ApiTags('objects')
@Controller('objects')
export class ObjectsController {
  constructor(private objectsService: ObjectsService) {}

  // Will be implemented in Phase 2
}