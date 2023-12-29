let priority = new Map();
priority.set('(', 0);
priority.set('+', 1);
priority.set('-', 1);
priority.set('*', 2);
priority.set('/', 2);
priority.set('^', 3);

function getLast(arr) {
  return arr[arr.length - 1];
}
function operate(token, a, b) {
  if (token == '+') {
    return parseFloat(a) + parseFloat(b);
  }
  else if (token == '-') {
    return parseFloat(a) - parseFloat(b);
  }
  else if (token == '*') {
    return parseFloat(a) * parseFloat(b);
  }
  else if (token == '/') {
    return parseFloat(a) / parseFloat(b);
  }
  else if (token == '^') {
    return parseFloat(a) ** parseFloat(b);
  }
  else return 0;
}
export const isOperand = (str) => {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
export const isOperator = (str) => {
  if (typeof str != "string") return false;
  return str === '+' || str === '-' || str === '*' || str === '/' ||
    str === '%' || str === '^';
}
export const tokenizeExpression = (expression) => {
  const regex = /([a-zA-Z]+|[0-9]+|\S)/g;
  const tokens = [];
  let match;
  while ((match = regex.exec(expression)) !== null) {
    tokens.push(match[0]);
  }
  return tokens;
}

export const evaluatePostfix = (postArr) => {
  let stack = [];
  let infix = [];

  for (let token of postArr) {
    if (isOperand(token)) {
      stack.push(token);
    }
    else if (isOperator(token)) {
      let b = stack.pop();
      let a = stack.pop();
      let res = operate(token, a, b);

      let expresion = `( ${a} ${token} ${b} ) = ${res}`
      infix.push(expresion);

      stack.push(res);
    }
  }
  return {
    resultado: stack[0],
    pasos: infix
  }
}
export const infixToPostfixArray = (expressionArr) => {
  let stack = [];
  let postfixArr = [];
  for (let token of expressionArr) {
    if (isOperand(token)) {
      postfixArr.push(token);
    }
    else if (token === '(') {
      stack.push(token);
    }
    else if (token === ')') {
      while (getLast(stack) != '(') {
        let e = stack.pop();
        postfixArr.push(e);
      }
      stack.pop();
    }
    else if (isOperator(token)) {
      while ((stack.length > 0) && (priority.get(getLast(stack)) >= priority.get(token))) {
        let last = stack.pop();
        postfixArr.push(last);
      }
      stack.push(token);
    }
  }
  while (stack.length > 0) {
    let last = stack.pop();
    postfixArr.push(last);
  }
  return postfixArr;
}


// let expression = "3*(2^1+2)-6^2/(9*4)";
// console.log(expression);
// let tokArr = tokenizeExpression(expression);
// let tokArr = tokenize("2 + 2 + 3")

// let expresion = ' ( 2 + 4 * ( 1 - 3 ) / 3 ) ';
// console.log(expresion);
// let tokArr = tokenize(expresion);
// let tokArr = tokenize('( 2 + 2 ) / ( 4 - 2 ) ')
// let postArr = infixToPostfixArray(tokArr);
// console.log(evaluatePostfix(postArr));