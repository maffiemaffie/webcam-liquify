import { ForEachTransformer } from "./for-each.js";

/**
 * Transformer that increases contrast without clipping.
 * Slower at higher intensities.
 */
class Contrast extends ForEachTransformer {
  constructor({intensity}) {
    super();

    this.intensity = Math.max(0, Math.floor(intensity)); // only works with nonzero integer intensity

    this.coefficients = this.#generateCoeffients(this.intensity);
  }

  /**
   * Generates the coefficients for a smoothstep function of the desired order.
   * @param {number} intensity Intensity of the function
   * @returns The coefficients for the polynomial.
   */
  #generateCoeffients(intensity) {
    const coefficients = [];

    /**
     * Performs a mathematical combination.
     * @param {number} n The total number of options.
     * @param {number} k The number of options are chosen.
     * @returns The mathematical combination.
     */
    const combination = (n, k) => {
      if (k === 0) return 1;

      const combNumerator = (n, end) => {
        if (n === end) return n;
        return n * combNumerator(n - 1, end);
      }

      const combDenominator = (k) => {
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

  /**
   * Increases the contrast of a value.
   * @param {number} value The value whose contrast will be increased.
   * @returns The value with increased contrast.
   */
  #contrastFunction(value) {
    // scale to 0-1
    const scaledDown = value / 256;

    // quick recursive function for integer exponents.
    const power = (base, exponent) => {
      if (exponent === 1) return base;
      return base * power(base, exponent - 1);
    }

    // evaluates the polynomial at x = value.
    // https://en.wikipedia.org/wiki/Smoothstep
    const coefficientPolynomial = (coefficients, xn) => {
      if (coefficients.length === 0) return 0;
      return coefficients.shift() * xn * scaledDown + coefficientPolynomial(coefficients, xn * scaledDown);
    }

    const contrasted = coefficientPolynomial([...this.coefficients], power(scaledDown, this.intensity));

    // scale up to 0-255
    const rescaled = contrasted * 256;

    return rescaled;
  }

  pixelTransform(frame, x, y, color) {
    return {
      red: this.#contrastFunction(color.red),
      green: this.#contrastFunction(color.green),
      blue: this.#contrastFunction(color.blue),
      alpha: this.#contrastFunction(color.alpha),
    };
  }
}

/**
 * Transformer that increases contrast with clipping.
 * Much faster.
 */
class FastContrast extends ForEachTransformer {
  constructor({intensity}) {
    super();
    this.intensity = intensity
  }

  /**
   * Increases the contrast of a value.
   * @param {number} value The value whose contrast will be increased.
   * @returns The value with increased contrast.
   */
  #contrastFunction(value) {
    const centered = value - 128;
    const contrasted = centered * this.intensity;
    return Math.max(Math.min(255, contrasted + 128), 0); // clamp to 0-255
  }

  pixelTransform(frame, x, y, color) {
    return {
      red: this.#contrastFunction(color.red),
      green: this.#contrastFunction(color.green),
      blue: this.#contrastFunction(color.blue),
      alpha: this.#contrastFunction(color.alpha),
    };
  }
}

/**
 * Transformer that increases contrast by increasing the average luminance contrast.
 */
class LuminanceContrast extends ForEachTransformer {
  constructor({intensity}) {
    super();
    this.intensity = intensity
  }

  /**
   * Increases the contrast of a value.
   * @param {number} value The value whose contrast will be increased.
   * @returns The value with increased contrast.
   */
  #contrastFunction({red, green, blue, alpha = 255}) {
    // clamp a value to 0-255
    const clamp = (value) => Math.max(Math.min(255, value), 0);

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

  pixelTransform(frame, x, y, color) {
    return this.#contrastFunction(color);
  }
}

export {
  Contrast,
  FastContrast,
  LuminanceContrast,
};