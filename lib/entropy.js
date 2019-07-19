/**
 * 将用户命令行参数输入的概率值字符串转换成数值数组
 *
 * @param arg 命令行参数，字符串数组
 * @returns   对象包含三个字段，isOK   数据校验是否合法
 *                              reason 数据非法的原因
 *                              p[]    概率数值数组
 */
function transform(arg) {
  var result = {
    isOK: false,    // 数据是否合法，合法为 true，非法为 false
    reason: '',     // 数据非法的原因
    p: []           // 转换后的概率数值数组
  };

  if(arg.length === 3) { // 逗号分隔的命令行参数
    result.p = arg[2].split(',');
  } else {  // 空格分隔的命令行参数
    for(var i=2; i<arg.length; i++)  result.p.push(arg[i]);
  }

  if(result.p.length < 2) { 
    result.reason = '命令行参数错误：概率数据少于两个！\n';
    result.isOK = false;
    return result;
  }

  for(i=0; i<result.p.length; i++) {
    var msg = validate(result.p[i]);
    if(!msg.isOK) {
      result.reason = msg.reason;
      return result;
    }
  }

  if(sigma(result.p) > 1) {
    result.reason = '概率空间不封闭，概率和大于 1！';
    return result; 
  }


  if(sigma(result.p) < 1) {
    result.reason = '概率空间不封闭，概率和小于 1！';
    return result;
  }

  result.isOK = true;
  for(i=0; i<result.p.length; i++)   result.p[i] = Number(result.p[i]);

  return result;
}

/**
 * 验证概率值 pi 是否合法
 *
 * @param pi 被验证的概率值
 * @returns  对象包含两个字段，isOK   概率 pi 是否合法
 *                             reason 数据非法的原因
 */
function validate(pi) {
  var result = {
    isOK: false,
    reason: ''
  };

  if(isNaN(Number(pi))) {
    result.reason = '请输入数字！';
    return result; 
  } 

  if(Number(pi) < 0) {
    result.reason = '请输入大于 0 的数！'; 
    return result; 
  }

  if(Number(pi) > 1) {
    result.reason = '请输入小于 1 的数！'; 
    return result; 
  }

  result.isOK = true;
  return result;
}

/**
 * 计算概率和
 *
 * @param p 概率数组
 * @returns 概率和
 */
function sigma(p) {
  return p.reduce((total, pi) => {
    return roundFractional(total + Number(pi), 2);
  }, 0);
}

/**
 * 计算信源熵
 *
 * h(p) = -p1*log2(p1) - p2*log2(p2) - ... - pn*log2(pn)
 * 
 * 0 <= pi <= 1 and p1 + p2 + ... + pn = 1
 *
 * @param p 概率分布数组
 * @returns 返回信源熵
 */
function h(p) {
  return p.reduce((total, pi) => {
    return total - pi * Math.log2(pi);
  }, 0);
}

/**
 * 小数点后面保留第 n 位
 *
 * @param x 做近似处理的数
 * @param n 小数点后第 n 位
 * @returns 近似处理后的数 
 */
function roundFractional(x, n) {
  return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
}

module.exports.h = h;
module.exports.sigma = sigma;
module.exports.validate = validate;
module.exports.transform = transform;
module.exports.roundFractional = roundFractional;
