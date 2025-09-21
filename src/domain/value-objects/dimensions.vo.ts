export class Dimensions {
  constructor(
    public readonly height: number,
    public readonly width: number,
    public readonly length: number,
  ) {
    this.validateDimensions();
  }

  private validateDimensions(): void {
    if (this.height <= 0 || this.width <= 0 || this.length <= 0) {
      throw new Error('All dimensions must be positive numbers');
    }

    if (!Number.isFinite(this.height) || !Number.isFinite(this.width) || !Number.isFinite(this.length)) {
      throw new Error('All dimensions must be finite numbers');
    }
  }

  /**
   * Calculate the volume of the dimensions
   */
  getVolume(): number {
    return this.height * this.width * this.length;
  }

  /**
   * Check if this dimensions can fit inside another dimensions
   * considering all possible rotations
   */
  canFitInside(container: Dimensions): boolean {
    const thisDims = this.getAllRotations();
    
    return thisDims.some(rotation => 
      rotation.height <= container.height &&
      rotation.width <= container.width &&
      rotation.length <= container.length
    );
  }

  /**
   * Get all possible rotations of these dimensions
   */
  getAllRotations(): Dimensions[] {
    const { height, width, length } = this;
    
    return [
      new Dimensions(height, width, length),   // Original
      new Dimensions(height, length, width),   // Rotate around height
      new Dimensions(width, height, length),   // Rotate around length
      new Dimensions(width, length, height),   // Rotate around width
      new Dimensions(length, height, width),   // Rotate around width (different)
      new Dimensions(length, width, height),   // Rotate around height (different)
    ].filter((dims, index, array) => 
      // Remove duplicates (for cases where dimensions are equal)
      array.findIndex(d => 
        d.height === dims.height && 
        d.width === dims.width && 
        d.length === dims.length
      ) === index
    );
  }

  /**
   * Get the best rotation that fits inside a container
   */
  getBestFitRotation(container: Dimensions): Dimensions | null {
    const rotations = this.getAllRotations();
    
    const validRotations = rotations.filter(rotation =>
      rotation.height <= container.height &&
      rotation.width <= container.width &&
      rotation.length <= container.length
    );

    if (validRotations.length === 0) {
      return null;
    }

    // Return the rotation that maximizes volume utilization
    return validRotations.reduce((best, current) => {
      const bestUtilization = best.getVolume() / container.getVolume();
      const currentUtilization = current.getVolume() / container.getVolume();
      
      return currentUtilization > bestUtilization ? current : best;
    });
  }

  /**
   * Check if dimensions are equal
   */
  equals(other: Dimensions): boolean {
    return this.height === other.height && 
           this.width === other.width && 
           this.length === other.length;
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this.height} x ${this.width} x ${this.length}`;
  }

  /**
   * Create from object
   */
  static fromObject(obj: { height: number; width: number; length: number }): Dimensions {
    return new Dimensions(obj.height, obj.width, obj.length);
  }
}
