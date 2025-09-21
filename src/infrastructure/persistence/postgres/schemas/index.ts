import { ProductTypeORM } from './product.schema';
import { BoxTypeORM } from './box.schema';
import { OrderTypeORM } from './order.schema';
import { OrderProductTypeORM } from './order-product.schema';
import { PackagingResultTypeORM } from './packaging-result.schema';
import { DepartmentSchema } from './department.schema';
import { TitleSchema } from './title.schema';
import { ProfessorSchema } from './professor.schema';
import { BuildingSchema } from './building.schema';
import { RoomSchema } from './room.schema';
import { SubjectSchema } from './subject.schema';
import { SubjectPrerequisiteSchema } from './subject-prerequisite.schema';
import { ClassSchema } from './class.schema';
import { ClassScheduleSchema } from './class-schedule.schema';

export const schemas = [
  ProductTypeORM,
  BoxTypeORM,
  OrderTypeORM,
  OrderProductTypeORM,
  PackagingResultTypeORM,
  DepartmentSchema,
  TitleSchema,
  ProfessorSchema,
  BuildingSchema,
  RoomSchema,
  SubjectSchema,
  SubjectPrerequisiteSchema,
  ClassSchema,
  ClassScheduleSchema,
];

export {
  ProductTypeORM,
  BoxTypeORM,
  OrderTypeORM,
  OrderProductTypeORM,
  PackagingResultTypeORM,
  DepartmentSchema,
  TitleSchema,
  ProfessorSchema,
  BuildingSchema,
  RoomSchema,
  SubjectSchema,
  SubjectPrerequisiteSchema,
  ClassSchema,
  ClassScheduleSchema,
};
