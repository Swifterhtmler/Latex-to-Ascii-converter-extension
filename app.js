function latexToAscii(latex) {
    let i = 0; // Character index
    let output = ""; // ASCII output
    
    function next() {
      return latex[i++];
    }
    
    function peek() {
      return latex[i] || ""; // Look ahead without advancing
    }
    
    function peekAhead(n = 1) {
      return latex[i + n - 1] || ""; // Look n characters ahead
    }
    
    function consumeWhitespace() {
      while (/\s/.test(peek())) next();
    }
    
    function parseToken() {
      consumeWhitespace();
      
      if (i >= latex.length) return "";
      
      let token = next();
      
      // Handle LaTeX commands
      if (token === "\\") {
        let command = "";
        while (/[a-zA-Z]/.test(peek())) command += next();
        return handleCommand(command);
      }
      
      // Handle subscripts and superscripts directly
      if (token === "_" || token === "^") {
        let script = token;
        consumeWhitespace();
        
        if (peek() === "{") {
          next(); // Skip opening brace
          let content = parseExpression();
          return script === "_" ? `_${content}` : `^${content}`;
        } else {
          // Single character scripts without braces
          return script + next();
        }
      }
      
      // Handle grouping
      if (token === "{") {
        let content = parseExpression();
        return content; // Return grouped content without braces
      }
      
      // Skip closing braces at the top level
      if (token === "}") {
        return "";
      }
      
      // Preserve spaces in the output
      if (token === " ") {
        return " ";
      }
      
      // Replace comma with period for decimal numbers
      if (token === "," && /\d$/.test(output) && /\d/.test(peek())) {
        return ".";
      }
      
      return token; // Return normal characters
    }
    
    function handleCommand(command) {
      consumeWhitespace();
      
      // Handle unit combinations (e.g., \mathrm{kJ}, \text{eV})
      if (command === "mathrm" || command === "text" || command === "textrm" || command === "mbox") {
        if (peek() === "{") {
          next(); // Skip opening brace
          let unitText = "";
          while (peek() !== "}" && i < latex.length) {
            unitText += next();
          }
          if (peek() === "}") next(); // Skip closing brace
          
          // Process common unit combinations
          if (unitText === "eV") return "eV";
          if (unitText === "keV") return "keV";
          if (unitText === "MeV") return "MeV";
          if (unitText === "GeV") return "GeV";
          if (unitText === "TeV") return "TeV";
          
          // Process SI unit combinations
          if (unitText === "kJ") return "kJ";
          if (unitText === "MJ") return "MJ";
          if (unitText === "GJ") return "GJ";
          if (unitText === "mJ") return "mJ";
          if (unitText === "μJ") return "μJ";
          
          if (unitText === "kW") return "kW";
          if (unitText === "MW") return "MW";
          if (unitText === "GW") return "GW";
          if (unitText === "mW") return "mW";
          if (unitText === "μW") return "μW";
          
          if (unitText === "kV") return "kV";
          if (unitText === "MV") return "MV";
          if (unitText === "GV") return "GV";
          if (unitText === "mV") return "mV";
          if (unitText === "μV") return "μV";
          
          if (unitText === "kHz") return "kHz";
          if (unitText === "MHz") return "MHz";
          if (unitText === "GHz") return "GHz";
          if (unitText === "mHz") return "mHz";
          
          if (unitText === "kPa") return "kPa";
          if (unitText === "MPa") return "MPa";
          if (unitText === "GPa") return "GPa";
          
          if (unitText === "kΩ") return "kΩ";
          if (unitText === "MΩ") return "MΩ";
          if (unitText === "GΩ") return "GΩ";
          if (unitText === "mΩ") return "mΩ";
          if (unitText === "μΩ") return "μΩ";
          
          if (unitText === "kA") return "kA";
          if (unitText === "MA") return "MA";
          if (unitText === "GA") return "GA";
          if (unitText === "mA") return "mA";
          if (unitText === "μA") return "μA";
          
          if (unitText === "kmol") return "kmol";
          if (unitText === "mmol") return "mmol";
          if (unitText === "μmol") return "μmol";
          
          // Process other common units
          if (unitText === "°C") return "°C";
          if (unitText === "K") return "K";
          if (unitText === "°F") return "°F";
          
          // Handle time units
          if (unitText === "s") return "s";
          if (unitText === "min") return "min";
          if (unitText === "hr") return "hr";
          if (unitText === "ms") return "ms";
          if (unitText === "μs") return "μs";
          if (unitText === "ns") return "ns";
          
          // Handle length units
          if (unitText === "m") return "m";
          if (unitText === "km") return "km";
          if (unitText === "cm") return "cm";
          if (unitText === "mm") return "mm";
          if (unitText === "μm") return "μm";
          if (unitText === "nm") return "nm";
          if (unitText === "pm") return "pm";
          if (unitText === "fm") return "fm";
          if (unitText === "Å") return "Å";
          
          // Handle mass units
          if (unitText === "g") return "g";
          if (unitText === "kg") return "kg";
          if (unitText === "mg") return "mg";
          if (unitText === "μg") return "μg";
          if (unitText === "ng") return "ng";
          if (unitText === "pg") return "pg";
          if (unitText === "Da") return "Da";
          if (unitText === "u") return "u";
          
          // Handle angle units
          if (unitText === "rad") return "rad";
          if (unitText === "mrad") return "mrad";
          if (unitText === "μrad") return "μrad";
          if (unitText === "deg") return "°";
          
          // Handle derived units
          if (unitText === "N·m") return "N·m";
          if (unitText === "J/mol") return "J/mol";
          if (unitText === "J/(mol·K)") return "J/(mol·K)";
          if (unitText === "m/s") return "m/s";
          if (unitText === "m/s²") return "m/s²";
          if (unitText === "mol/L") return "mol/L";
          if (unitText === "mol/m³") return "mol/m³";
          if (unitText === "kg/m³") return "kg/m³";
          if (unitText === "g/cm³") return "g/cm³";
          if (unitText === "g/mL") return "g/mL";
          if (unitText === "g/L") return "g/L";
          
          // Return the original unit text if no special handling
          return unitText;
        }
        return command;
      }
      
      switch (command) {
        case "frac":
          return parseFraction();
        case "sqrt":
          return parseSqrt();
        case "int":
        case "iint":
        case "iiint":
          return parseIntegral(command);
        case "sum":
        case "prod":
          return parseSumProd(command);
        case "left":
          return parseDelimiter();
        case "right":
          return parseDelimiter();
        case "lim":
          return parseLim();
        case "to":
          return "→";
        case "infty":
          return "∞";
        
        // Greek letters
        case "alpha": return "α";
        case "beta": return "β";
        case "gamma": return "γ";
        case "delta": return "δ";
        case "epsilon": return "ε";
        case "zeta": return "ζ";
        case "eta": return "η";
        case "theta": return "θ";
        case "iota": return "ι";
        case "kappa": return "κ";
        case "lambda": return "λ";
        case "mu": return "μ";
        case "nu": return "ν";
        case "xi": return "ξ";
        case "pi": return "π";
        case "rho": return "ρ";
        case "sigma": return "σ";
        case "tau": return "τ";
        case "upsilon": return "υ";
        case "phi": return "φ";
        case "chi": return "χ";
        case "psi": return "ψ";
        case "omega": return "ω";
        
        // Uppercase Greek letters
        case "Gamma": return "Γ";
        case "Delta": return "Δ";
        case "Theta": return "Θ";
        case "Lambda": return "Λ";
        case "Xi": return "Ξ";
        case "Pi": return "Π";
        case "Sigma": return "Σ";
        case "Phi": return "Φ";
        case "Psi": return "Ψ";
        case "Omega": return "Ω";
        
        // Operators and symbols
        case "cdot": return "·";
        case "times": return "×";
        case "div": return "÷";
        case "pm": return "±";
        case "mp": return "∓";
        case "leq": return "≤";
        case "geq": return "≥";
        case "neq": return "≠";
        case "approx": return "≈";
        case "partial": return "∂";
        case "nabla": return "∇";
        case "ldots": return "...";
        case "cdots": return "···";
        case "vdots": return "⋮";
        case "ddots": return "⋱";
        case "therefore": return "∴";
        case "because": return "∵";
        case "in": return "∈";
        case "notin": return "∉";
        case "subset": return "⊂";
        case "subseteq": return "⊆";
        case "cap": return "∩";
        case "cup": return "∪";
        case "emptyset": return "∅";
        case "exists": return "∃";
        case "forall": return "∀";
        case "sin": return "sin";
        case "cos": return "cos";
        case "tan": return "tan";
        
        // SI Units
        case "joule": case "J": return "J";
        case "watt": case "W": return "W";
        case "newton": case "N": return "N";
        case "ampere": case "A": return "A";
        case "volt": case "V": return "V";
        case "ohm": return "Ω";
        case "farad": case "F": return "F";
        case "henry": case "H": return "H";
        case "hertz": case "Hz": return "Hz";
        case "coulomb": case "C": return "C";
        case "tesla": case "T": return "T";
        case "weber": case "Wb": return "Wb";
        case "lumen": case "lm": return "lm";
        case "lux": case "lx": return "lx";
        case "becquerel": case "Bq": return "Bq";
        case "gray": case "Gy": return "Gy";
        case "sievert": case "Sv": return "Sv";
        case "katal": case "kat": return "kat";
        
        // Non-SI units
        case "electronvolt": case "eV": return "eV";
        case "pascal": case "Pa": return "Pa";
        case "bar": return "bar";
        case "atm": return "atm";
        case "cal": return "cal";
        case "kcal": return "kcal";
        case "mol": return "mol";
        case "mmHg": return "mmHg";
        
        // Prefixes for units
        case "giga": case "G": return "G";
        case "mega": case "M": return "M";
        case "kilo": case "k": return "k";
        case "hecto": case "h": return "h";
        case "deca": case "da": return "da";
        case "deci": case "d": return "d";
        case "centi": case "c": return "c";
        case "milli": case "m": return "m";
        case "micro": case "μ": return "μ";
        case "nano": case "n": return "n";
        case "pico": case "p": return "p";
        case "femto": case "f": return "f";
        case "atto": case "a": return "a";
        
        // Space commands - improved space handling
        case " ": return " ";
        case ",": return " ";
        case ";": return "  ";
        case "quad": return "    ";
        case "qquad": return "        ";
        case "!": return ""; // negative thin space - remove in ASCII
        case ":": return " "; // medium space
        case "thinspace": return " ";
        case "medspace": return "  ";
        case "thickspace": return "   ";
        case "enspace": return "  ";
        case "emspace": return "    ";
        
        // Function names
        case "sin": case "cos": case "tan":
        case "csc": case "sec": case "cot":
        case "arcsin": case "arccos": case "arctan":
        case "sinh": case "cosh": case "tanh":
        case "log": case "ln": case "exp":
        case "det": case "dim": case "ker":
        case "deg": case "arg": case "max": case "min":
          return command;
          
        case "e": // Handle Euler's number, but consider context
          return "e";
          
        default:
          return command; // Keep unknown commands as plain text
      }
    }
    
    function parseFraction() {
      consumeWhitespace();
      
      if (peek() !== "{") return "frac"; // Ensure opening brace
      
      next(); // Skip opening brace
      let numerator = parseExpression();
      
      consumeWhitespace();
      
      if (peek() !== "{") return `${numerator}/`; // Handle malformed input
      
      next(); // Skip opening brace
      let denominator = parseExpression();
      
      // Replace commas with periods in decimal numbers
      numerator = numerator.replace(/(\d),(\d)/g, "$1.$2");
      denominator = denominator.replace(/(\d),(\d)/g, "$1.$2");
      
      // Handle special case for decimal fractions with comma notation
      if (numerator.includes("{,}") || denominator.includes("{,}")) {
        // Clean up the numerator and denominator
        numerator = numerator.replace(/\{,\}/g, ".").replace(/\\\s+/g, " ");
        denominator = denominator.replace(/\{,\}/g, ".").replace(/\\\s+/g, " ");
        
        return `(${numerator})/(${denominator})`;
      }
      
      return `(${numerator})/(${denominator})`;
    }
    
    function parseSqrt() {
      consumeWhitespace();
      
      // Check for optional argument (root index)
      let rootIndex = "";
      if (peek() === "[") {
        next(); // Skip opening bracket
        while (peek() !== "]" && i < latex.length) {
          rootIndex += next();
        }
        if (peek() === "]") next(); // Skip closing bracket
      }
      
      // Parse the expression under the radical
      consumeWhitespace();
      if (peek() !== "{") return "sqrt"; // Ensure opening brace
      
      next(); // Skip opening brace
      let expression = parseExpression();
      
      if (rootIndex) {
        return `${expression}^(1/${rootIndex})`;
      } else {
        return `sqrt(${expression})`;
      }
    }
    
    function parseIntegral(command) {
      let symbol = command === "iint" ? "∬" : (command === "iiint" ? "∭" : "∫");
      
      let lowerBound = "", upperBound = "";
      
      consumeWhitespace();
      
      // Parse lower bound
      if (peek() === "_") {
        next(); // Skip "_"
        consumeWhitespace();
        
        if (peek() === "{") {
          next(); // Skip opening brace
          lowerBound = parseExpression();
        } else {
          // Single character lower bound
          lowerBound = next();
        }
      }
      
      consumeWhitespace();
      
      // Parse upper bound
      if (peek() === "^") {
        next(); // Skip "^"
        consumeWhitespace();
        
        if (peek() === "{") {
          next(); // Skip opening brace
          upperBound = parseExpression();
        } else {
          // Single character upper bound
          upperBound = next();
        }
      }
      
      // Determine whether to parse dx separately or as part of the integral expression
      let dx = "";
      let expr = "";
      
      // Parse the main expression - we'll handle dx manually
      while (i < latex.length && peek() !== "\\") {
        expr += parseToken();
      }
      
      if (expr.trim()) {
        return `${symbol}${lowerBound ? `_${lowerBound}` : ""}${upperBound ? `^${upperBound}` : ""} ${expr.trim()} ${dx}`;
      } else {
        return `${symbol}${lowerBound ? `_${lowerBound}` : ""}${upperBound ? `^${upperBound}` : ""}`;
      }
    }
    
    function parseSumProd(command) {
      let symbol = command === "sum" ? "Σ" : "Π";
      
      let lowerBound = "", upperBound = "";
      
      consumeWhitespace();
      
      // Parse lower bound
      if (peek() === "_") {
        next(); // Skip "_"
        consumeWhitespace();
        
        if (peek() === "{") {
          next(); // Skip opening brace
          lowerBound = parseExpression();
        } else {
          // Single character lower bound
          lowerBound = next();
        }
      }
      
      consumeWhitespace();
      
      // Parse upper bound
      if (peek() === "^") {
        next(); // Skip "^"
        consumeWhitespace();
        
        if (peek() === "{") {
          next(); // Skip opening brace
          upperBound = parseExpression();
        } else {
          // Single character upper bound
          upperBound = next();
        }
      }
      
      return `${symbol}${lowerBound ? `_${lowerBound}` : ""}${upperBound ? `^${upperBound}` : ""}`;
    }
    
    function parseDelimiter() {
      // Skip the actual delimiter character
      consumeWhitespace();
      let delim = next();
      
      // Map LaTeX delimiters to ASCII
      switch (delim) {
        case "(": return "(";
        case ")": return ")";
        case "[": return "[";
        case "]": return "]";
        case "\\{": return "{";
        case "\\}": return "}";
        case "|": return "|";
        case "\\|": return "||";
        case ".": return ""; // \left. and \right. are invisible delimiters
        default: return delim;
      }
    }
    
    function parseLim() {
      // Parse limit expression
      let output = "lim";
      
      consumeWhitespace();
      
      // Parse subscript (as in \lim_{x \to 0})
      if (peek() === "_") {
        next(); // Skip "_"
        consumeWhitespace();
        
        if (peek() === "{") {
          next(); // Skip opening brace
          output += `_${parseExpression()}`;
        } else {
          // Single character subscript
          output += `_${next()}`;
        }
      }
      
      return output;
    }
    
    function parseExpression() {
      let expr = "";
      let braceCount = 1; // Track nested braces
      
      while (i < latex.length) {
        let char = peek();
        
        if (char === "{") {
          braceCount++;
          next(); // Consume character
          expr += parseToken();
        } else if (char === "}") {
          braceCount--;
          next(); // Consume closing brace
          if (braceCount === 0) break; // Stop at matching closing brace
          else expr += "}"; // Keep nested closing braces
        } else if (char === "\\") {
          // Handle LaTeX commands within expressions
          next(); // Consume backslash
          let command = "";
          while (/[a-zA-Z]/.test(peek())) command += next();
          expr += handleCommand(command);
        } else if (char === " ") {
          // Preserve spaces in expressions
          expr += next();
        } else if (char === "," && /\d$/.test(expr) && /\d/.test(peekAhead(2))) {
          // Replace comma with period for decimal numbers
          next(); // Consume comma
          expr += ".";
        } else {
          expr += next();
        }
      }
      return expr.trim();
    }
    
    // Special handling for the \frac command with comma notation
    function handleFracWithComma(input) {
      // Check if the input matches the pattern \frac{X{,}Y}{Z{,}W}
      const fracPattern = /\\frac\{(\d+)\{,\}(\d+)[ \\]*(\w+)\}\{(\d+)\{,\}(\d+)[ \\]*(\w+)\}/;
      const match = input.match(fracPattern);
      
      if (match) {
        const [, num1, num2, unit1, den1, den2, unit2] = match;
        return `(${num1}.${num2} ${unit1})/(${den1}.${den2} ${unit2})`;
      }
      
      // Check for decimal numbers with comma
      const decimalPattern = /\\frac\{(\d+)\{,\}(\d+)\}\{(\d+)\}/;
      const decimalMatch = input.match(decimalPattern);
      
      if (decimalMatch) {
        const [, int, decimal, denominator] = decimalMatch;
        return `(${int}.${decimal})/(${denominator})`;
      }
      
      // Check for units with backslash
      const unitPattern = /\\frac\{(\d+(?:\.\d+)?)\s*\\(\w+)\}\{(\d+(?:\.\d+)?)\s*\\(\w+)\}/;
      const unitMatch = input.match(unitPattern);
      
      if (unitMatch) {
        const [, num, unit1, den, unit2] = unitMatch;
        return `(${num} ${unit1})/(${den} ${unit2})`;
      }
      
      return null; // Not a match, continue with regular parsing
    }
    
    // Check for special patterns first
    const specialResult = handleFracWithComma(latex);
    if (specialResult) return specialResult;
    
    // Fix common issues with units in fractions
    latex = latex.replace(/\\frac\{(\d+(?:\.\d+)?)\s*\\(\w+)\}\{(\d+(?:\.\d+)?)\s*\\(\w+)\}/g, 
      (match, num, unit1, den, unit2) => `\\frac{${num}\\mathrm{${unit1}}}{${den}\\mathrm{${unit2}}}`);
    
    // Fix decimal numbers with backslash W or N
    latex = latex.replace(/\\frac\{(\d+(?:\.\d+)?)\s*\\W\}\{(\d+(?:\.\d+)?)\s*\\N\}/g,
      (match, num, den) => `\\frac{${num}\\mathrm{W}}{${den}\\mathrm{N}}`);
    
    // Replace all comma decimal separators with periods in the input
    latex = latex.replace(/(\d),(\d)/g, "$1.$2");
    
    // Process input character-by-character
    while (i < latex.length) {
      output += parseToken();
    }
    
    // Final pass to replace any remaining decimal commas
    output = output.replace(/(\d),(\d)/g, "$1.$2");
    
    return output.trim();
  }
  



//   // Example Usage
//   console.log("Example 1: F(x) = 4x^6 - 5e^2 · (3x)/(e) · ∫_0^1 x^2 dx");
//   console.log(latexToAscii("F\\left(x\\right) = 4x^6 - 5e^2 \\cdot \\frac{3x}{e} \\cdot \\int_{0}^{1} x^2 dx"));
  
//   console.log("\nExample 2: Sum formula");
//   console.log(latexToAscii("\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}"));
  
//   console.log("\nExample 3: Greek letters");
//   console.log(latexToAscii("\\alpha + \\beta = \\gamma^2"));
  
//   console.log("\nExample 4: Square root");
//   console.log(latexToAscii("\\sqrt{a^2 + b^2} = c"));
  
//   console.log("\nExample 5: Limit");
//   console.log(latexToAscii("\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1"));
  
//   console.log("\nExample 6: Fraction with comma notation");
//   console.log(latexToAscii("\\frac{10{,}0\\ W}{395{,}465\\ N}"));
  
//   console.log("\nExample 7: Fraction with decimal and units");
//   console.log(latexToAscii("\\frac{48,88\\W}{356\\N}"));
  
//   // Additional test cases for comma to period conversion
//   console.log("\nExample 8: Decimal with comma");
//   console.log(latexToAscii("3,14159"));
  
//   console.log("\nExample 9: Complex expression with commas");
//   console.log(latexToAscii("f(x) = 1,5x^2 + 2,75x + 3,0"));
  
//   console.log("\nExample 10: Nested fractions with commas");
//   console.log(latexToAscii("\\frac{\\frac{1,5}{2,3}}{\\frac{4,5}{6,7}}"));


// let textBox = document.getElementById("latex").textContent;

// textBox.addEventListener("keypress", function(event) {
//     if (event.key === "Enter") {
//         event.preventDefault();
//         let latex = textBox.value;
//         let ascii = latexToAscii(latex);
//   navigator.clipboard.writeText(ascii.toString()).then(function () {
//     window.alert("Copied to clipboard");
//     }).catch(function (error) {
//         console.error('Clipboard write failed:', error);
//     });
//     // document.getElementById("ascii").textContent = ascii;
//     }
   
// });


// Replace the problematic code at the end of your file with this:

// Get the text input element
// const textBox = document.getElementById("latex");
// let status = document.getElementById("statusis");


// // Add event listener for Enter key
// textBox.addEventListener("keypress", function(event) {
//     if (event.key === "Enter") {
//         event.preventDefault();
        
//         // Get the LaTeX input
//         const latex = textBox.value;
        
//         // Convert to ASCII
//         const ascii = latexToAscii(latex);
        
//         // Copy directly to clipboard
//         navigator.clipboard.writeText(ascii)
//             .then(function() {
//                if (event.key === "Enter") {
//                status.textContent = "Kopioitu";
//                } else {
//                status.style.display = "none";   
//                }
//             })
//             .catch(function(error) {
//                 console.error('Clipboard write failed:', error);
//                 alert("Failed to copy to clipboard. Result: " + ascii);
//             });
//     }
// });
// Get the text input element
const textBox = document.getElementById("latex");
const status = document.getElementById("statusis");

// Set up initial styles for the status element
if (status) {
    // Set initial styles
    status.style.opacity = "0";
    status.style.transition = "opacity 0.5s ease-in-out";
    status.style.display = "block"; // Keep it in the layout but invisible
}

// Add event listener for Enter key
textBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        
        // Get the LaTeX input
        const latex = textBox.value;
        
        // Convert to ASCII
        const ascii = latexToAscii(latex);
        
        // Copy directly to clipboard
        navigator.clipboard.writeText(ascii)
            .then(function() {
                if (status) {
                    // Show with animation
                    status.textContent = "Kopioitu";
                    status.style.opacity = "1"; // Fade in
                    
                    // Fade out after 2 seconds
                    setTimeout(() => {
                        status.style.opacity = "0"; // Fade out
                    }, 2000);
                }
            })
            .catch(function(error) {
                console.error('Clipboard write failed:', error);
                if (status) {
                    status.textContent = "Kopiointi ei onnistunut";
                    status.style.opacity = "1"; // Fade in
                    
                    // Fade out after 2 seconds
                    setTimeout(() => {
                        status.style.opacity = "0"; // Fade out
                    }, 2000);
                } else {
                    alert("Failed to copy to clipboard. Result: " + ascii);
                }
            });
    }
});