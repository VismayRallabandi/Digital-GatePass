import { Injectable, HttpException, Inject } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { WWApplication } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationEventProducerService } from 'src/events/producers/applications/application-producer.service';
import { ApplicationEventTypes } from 'src/common/enums/application-event.enums';
import { ApplicationEventInterface } from './interfaces/application-event.interface';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(WWApplication)
    private readonly applicationRepository: Repository<WWApplication>,
    //private readonly _kafka: ProducerService
    private readonly producer: ApplicationEventProducerService
  ) {}
  async create(createApplicationDto: CreateApplicationDto) {
    const userData =
      await this.applicationRepository.create(createApplicationDto);
    return this.applicationRepository.save(userData);
  }

  async findAll() {
    this.producer.publishEvent({
      key : ApplicationEventTypes.Created,
      value: {
        name: 'test',
        description: 'test'
      }
    });
    return await this.applicationRepository.find();
  }

  async findOne(id: number) {
    const applicationData = await this.applicationRepository.findOneBy({ id });
    if (!applicationData) {
      throw new HttpException('User Not Found', 404);
    }
    return applicationData;
  }

  async processEvent(event : ApplicationEventInterface) {
    console.log(event.key,event.value);
  }
}
