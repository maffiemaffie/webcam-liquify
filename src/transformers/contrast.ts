import { ForEachTransformer } from "./for-each.js";

/**
 * Transformer that increases the contrast of a frame.
 */
abstract class ContrastTransformer extends ForEachTransformer {
  /**
   * The intensity of the contrast.
   */
  intensity: number;

  constructor({intensity}: {intensity: number}) {
    super();

    this.intensity = intensity;
  }

  pixelTransform(frame: ImageData, x: number, y: number, color: RGBAColor) {
    return this.contrastFunction(color);
  }

  /**
   * Defines a function to use for increasing contrast.
   * @param color The color whose contrast will be increased.
   * @returns The color with increased contrast.
   */
  abstract contrastFunction(color: RGBAColor): RGBAColor;
}

/**
 * Transformer that increases contrast without clipping.
 * Slower at higher intensities.
 */
class SafeContrast extends ContrastTransformer {
  /**
   * The intensity of the contrast (integer > 0)
   */
  intensity: number;
  
  /**
   * The coefficients of the polynomial used to generate the contrast function.
   */
  #coefficients: number[];
  
  constructor({intensity}: {intensity: number}) {
    super({intensity: Math.max(0, Math.floor(intensity))}); // only works with nonzero integer intensity

    this.#coefficients = this.#generateCoeffients(this.intensity);
  }

  /**
   * Generates the coefficients for a smoothstep function of the desired order.
   * @param intensity Intensity of the function
   * @returns The coefficients for the polynomial.
   */
  #generateCoeffients(intensity: number): number[] {
    const coefficients: number[] = [];

    /**
     * Performs a mathematical combination.
     * @param n The total number of options.
     * @param k The number of options are chosen.
     * @returns The mathematical combination.
     */
    const combination = (n: number, k: number): number => {
      if (k === 0) return 1;

      const combNumerator = (n: number, end: number) => {
        if (n === end) return n;
        return n * combNumerator(n - 1, end);
      }

      const combDenominator = (k: number) => {
        if (k === 1) return k;
        return k * combDenominator(k - 1);
      }

      return combNumerator(n, n - k + 1) / combDenominator(k);
    }

    // calculates each of the coefficients
    // https://en.wikipedia.org/wiki/Smoothstep
    for (let i = 0; i <= intensity; i++) {
      coefficients.push(combination(-this.intensity - 1, i) * combination(2 * this.intensity + 1, this.intensity - i));
    }

    return coefficients;
  }

  contrastFunction(color: RGBAColor): RGBAColor {
    const newColor: RGBAColor = { red: 0, green: 0, blue: 0, alpha: 0 };
    
    for (const [key, value] of Object.entries(color)) {
      // scale to 0-1
      const scaledDown = value / 256;

      /**
       * Raises a number to an integer power.
       * @param base The number being exponentiated.
       * @param exponent The integer power to raise the base to.
       * @returns The result.
       */
      const power = (base: number, exponent: number) => {
        if (exponent === 1) return base;
        return base * power(base, exponent - 1);
      }

      /**
       * Evaluates the contrast polynomial for a given value.
       * @see {@link https://en.wikipedia.org/wiki/Smoothstep}
       * @param coefficients The coefficients of the contrast polynomial.
       * @param xn The value raised to the nth power.
       * @returns The result of the polynomial.
       */
      const coefficientPolynomial = (coefficients: number[], xn: number) => {
        if (coefficients.length === 0) return 0;
        return coefficients.shift()! * xn * scaledDown + coefficientPolynomial(coefficients, xn * scaledDown);
      }

      const contrasted = coefficientPolynomial([...this.#coefficients], power(scaledDown, this.intensity));

      // scale up to 0-255
      const rescaled = contrasted * 256;

      newColor[key] = rescaled;
    }
    return newColor;
  }
}

/**
 * Transformer that increases contrast with clipping.
 * Much faster.
 */
class FastContrast extends ContrastTransformer {
  constructor({intensity}) {
    super({intensity});
  }

  contrastFunction(color: RGBAColor): RGBAColor {
    const newColor: RGBAColor = { red: 0, green: 0, blue: 0, alpha: 0 };

    for (const [key, value] of Object.entries(color)) {
      const centered = value - 128;
      const contrasted = centered * this.intensity;
      const clamped = Math.max(Math.min(255, contrasted + 128), 0); // clamp to 0-255

      newColor[key] = clamped;
    }

    return newColor;
  }
}

/**
 * Transformer that increases contrast by increasing the average luminance contrast.
 */
class LuminanceContrast extends ContrastTransformer {
  constructor({intensity}) {
    super({intensity});
  }

  contrastFunction({red, green, blue, alpha}: RGBAColor) {
    // clamp a value to 0-255
    const clamp = (value: number) => Math.max(Math.min(255, value), 0);

    // compute and contrast alpha
    const centeredAlpha = alpha - 128;
    const contrastedAlpha = centeredAlpha * this.intensity;
    const decenteredAlpha = contrastedAlpha + 128;
    
    // compute luminance
    const luminance = (red + green + blue) / 3;
    // return the color if it's full black.
    if (luminance === 0) return {
      red,
      green,
      blue,
      alpha: clamp(decenteredAlpha),
    };
    // otherwise compute the contrasted color
    const centered = luminance - 128;
    const contrasted = centered * this.intensity;
    const decentered = contrasted + 128;
    const scalar = decentered / luminance;

    return {
      red: clamp(red * scalar),
      green: clamp(green * scalar),
      blue: clamp(blue * scalar),
      alpha: clamp(decenteredAlpha),
    };
  }
}

export {
  SafeContrast,
  FastContrast,
  LuminanceContrast,
};