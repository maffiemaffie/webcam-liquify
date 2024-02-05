import { ForEachTransformer } from "./for-each.js";

class Contrast extends ForEachTransformer {
  constructor({intensity}) {
    super();

    this.intensity = Math.max(0, Math.floor(intensity));

    this.coefficients = this.generateCoeffients(this.intensity);
  }

  generateCoeffients(intensity) {
    const coefficients = [];

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

    for (let i = 0; i <= intensity; i++) {
      coefficients.push(combination(-this.intensity - 1, i) * combination(2 * this.intensity + 1, this.intensity - i));
    }

    return coefficients;
  }

  contrastFunction(value) {
    const scaledDown = value / 256;

    const power = (base, exponent) => {
      if (exponent === 1) return base;
      return base * power(base, exponent - 1);
    }

    const coefficientPolynomial = (coefficients, xn) => {
      if (coefficients.length === 0) return 0;
      return coefficients.shift() * xn * scaledDown + coefficientPolynomial(coefficients, xn * scaledDown);
    }

    const contrasted = coefficientPolynomial([...this.coefficients], power(scaledDown, this.intensity));

    const rescaled = contrasted * 256;

    return rescaled;
  }

  pixelTransform(frame, x, y, color) {
    return {
      red: this.contrastFunction(color.red),
      green: this.contrastFunction(color.green),
      blue: this.contrastFunction(color.blue),
      alpha: this.contrastFunction(color.alpha),
    };
  }
}

class FastContrast extends ForEachTransformer {
  constructor({intensity}) {
    super();
    this.intensity = intensity
  }

  contrastFunction(value) {
    const centered = value - 128;
    const contrasted = centered * this.intensity;
    return Math.max(Math.min(255, contrasted + 128), 0);
  }

  pixelTransform(frame, x, y, color) {
    return {
      red: this.contrastFunction(color.red),
      green: this.contrastFunction(color.green),
      blue: this.contrastFunction(color.blue),
      alpha: this.contrastFunction(color.alpha),
    };
  }
}

class LuminanceContrast extends ForEachTransformer {
  constructor({intensity}) {
    super();
    this.intensity = intensity
  }

  contrastFunction({red, green, blue, alpha = 255}) {
    const clamp = (value) => Math.max(Math.min(255, value), 0);

    const centeredAlpha = alpha - 128;
    const contrastedAlpha = centeredAlpha * this.intensity;
    const decenteredAlpha = contrastedAlpha + 128;
    
    const luminance = (red + green + blue) / 3;
    if (luminance === 0) return {
      red,
      green,
      blue,
      alpha: clamp(decenteredAlpha),
    };
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
    return this.contrastFunction(color);
  }
}

export {
  Contrast,
  FastContrast,
  LuminanceContrast,
};