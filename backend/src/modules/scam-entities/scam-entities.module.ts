import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScamEntitiesController } from './scam-entities.controller';
import { ScamEntitiesService } from './scam-entities.service';
import { ScamEntity, ScamEntitySchema } from './schemas/scam-entity.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ScamEntity.name, schema: ScamEntitySchema },
        ]),
    ],
    controllers: [ScamEntitiesController],
    providers: [ScamEntitiesService],
    exports: [ScamEntitiesService],
})
export class ScamEntitiesModule { }
