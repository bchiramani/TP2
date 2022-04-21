import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';
import { Skill } from './entities/skill.entity';

@Injectable()
export class CvService {
  constructor(
    private readonly cvrepository: Repository<Cv>,
    private readonly skillRepository: Repository<Skill>,
  ) {}
  async create(createCvDto: CreateCvDto) {
    const skills: Skill[] = await Promise.all(
      createCvDto.designation.map((item) =>
        this.preloadDesignationByName(item),
      ),
    );
    const cv: Cv = await this.cvrepository.create({
      ...createCvDto,
      skills,
    });
    return this.cvrepository.save(cv);
  }
  async preloadDesignationByName(designation: string): Promise<Skill> {
    const skill = await this.skillRepository.findOne(designation);
    return skill ? skill : this.skillRepository.create({ designation, cv: [] });
  }

  remove(id: number) {
    return this.cvrepository.delete({ id });
  }

  async findOne(id: string) {
    return await this.cvrepository.findOne(id);
  }

  findAll() {
    return this.cvrepository.find();
  }

  async update(id: number, updateCvDto: UpdateCvDto) {
    const skills: Skill[] =
      updateCvDto.designation &&
      (await Promise.all(
        updateCvDto.designation.map((item) =>
          this.preloadDesignationByName(item),
        ),
      ));

    const user: User =
      updateCvDto.idUser &&
      (await this.userRepository.findOne(+updateCvDto.idUser));
    const cv: Cv = await this.cvrepository.preload({
      id,
      ...updateCvDto,
      user,
      skills,
    });
    if (cv) {
      return this.cvrepository.save(cv);
    } else {
      throw new NotFoundException(`The CV N ${id} doesn't exist `);
    }
  }
}
