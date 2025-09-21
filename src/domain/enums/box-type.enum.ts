import { Dimensions } from '../value-objects/dimensions.vo';

export enum BoxType {
  CAIXA_1 = 'Caixa 1',
  CAIXA_2 = 'Caixa 2',
  CAIXA_3 = 'Caixa 3',
}

export class BoxTypeHelper {
  private static _boxDimensions: Record<BoxType, Dimensions> | null = null;

  private static initializeDimensions(): Record<BoxType, Dimensions> {
    if (!this._boxDimensions) {
      this._boxDimensions = {
        [BoxType.CAIXA_1]: new Dimensions(30, 40, 80),
        [BoxType.CAIXA_2]: new Dimensions(50, 50, 40),
        [BoxType.CAIXA_3]: new Dimensions(50, 80, 60),
      };
    }
    return this._boxDimensions;
  }

  /**
   * Get dimensions for a specific box type
   */
  static getDimensions(boxType: BoxType): Dimensions {
    const dimensions = this.initializeDimensions();
    return dimensions[boxType];
  }

  /**
   * Get all available box types
   */
  static getAllBoxTypes(): BoxType[] {
    return Object.values(BoxType);
  }

  /**
   * Get all box types with their dimensions
   */
  static getAllBoxTypesWithDimensions(): Array<{
    type: BoxType;
    dimensions: Dimensions;
  }> {
    const dimensions = this.initializeDimensions();
    return this.getAllBoxTypes().map((type) => ({
      type,
      dimensions: dimensions[type],
    }));
  }

  /**
   * Find the best box type for given dimensions
   */
  static findBestBoxType(productDimensions: Dimensions): BoxType | null {
    const availableBoxes = this.getAllBoxTypesWithDimensions()
      .filter((box) => productDimensions.canFitInside(box.dimensions))
      .sort((a, b) => a.dimensions.getVolume() - b.dimensions.getVolume()); // Sort by volume (smallest first)

    return availableBoxes.length > 0 ? availableBoxes[0].type : null;
  }

  /**
   * Find all box types that can fit the given dimensions
   */
  static findCompatibleBoxTypes(productDimensions: Dimensions): BoxType[] {
    return this.getAllBoxTypesWithDimensions()
      .filter((box) => productDimensions.canFitInside(box.dimensions))
      .sort((a, b) => a.dimensions.getVolume() - b.dimensions.getVolume())
      .map((box) => box.type);
  }

  /**
   * Check if a box type exists
   */
  static isValidBoxType(boxType: string): boxType is BoxType {
    return Object.values(BoxType).includes(boxType as BoxType);
  }

  /**
   * Get box type from string
   */
  static fromString(boxType: string): BoxType | null {
    return this.isValidBoxType(boxType) ? boxType : null;
  }
}
