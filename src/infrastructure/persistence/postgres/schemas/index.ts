import { ProductTypeORM } from './product.schema';
import { BoxTypeORM } from './box.schema';
import { OrderTypeORM } from './order.schema';
import { OrderProductTypeORM } from './order-product.schema';
import { PackagingResultTypeORM } from './packaging-result.schema';

export const schemas = [
  ProductTypeORM,
  BoxTypeORM,
  OrderTypeORM,
  OrderProductTypeORM,
  PackagingResultTypeORM,
];

export {
  ProductTypeORM,
  BoxTypeORM,
  OrderTypeORM,
  OrderProductTypeORM,
  PackagingResultTypeORM,
};