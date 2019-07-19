/* global describe, it: true */
const expect = require('chai').expect,
      transform = require('../lib/entropy.js').transform,
      validate = require('../lib/entropy.js').validate,
      sigma = require('../lib/entropy.js').sigma,
      h = require('../lib/entropy.js').h,
      roundFractional = require('../lib/entropy.js').roundFractional;

describe('transform 函数测试套件', function() {
  it('命令行参数正确，逗号分隔概率值', function(){
    var arg = ['node', 'app', '0.4,0.6'];
    var result = transform(arg);

    expect(result.isOK).to.be.ok;
    expect(result.p.length).to.be.equal(2);
  });

  it('命令行参数正确，空格分隔概率值', function(){
    var arg = ['node', 'app', '0.4', '0.6'];
    var result = transform(arg);

    expect(result.isOK).to.be.ok;
    expect(result.p.length).to.be.equal(2);
  });

  it('命令行参数错误，概率和小于 1', function(){
    var arg = ['node', 'app', '0.3', '0.6'];
    var result = transform(arg);

    expect(result.isOK).not.to.be.ok;
  });

  it('命令行参数错误，概率和大于 1', function(){
    var arg = ['node', 'app', '0.7', '0.6'];
    var result = transform(arg);

    expect(result.isOK).not.to.be.ok;
  });

  it('命令行参数错误，概率不是数字', function(){
    var arg = ['node', 'app', 'a', '0.6'];
    var result = transform(arg);

    expect(result.isOK).not.to.be.ok;
  });

  it('命令行参数错误，概率小于 0', function(){
    var arg = ['node', 'app', '-3', '0.6'];
    var result = transform(arg);

    expect(result.isOK).not.to.be.ok;
  });

  it('命令行参数错误，概率大于 1', function(){
    var arg = ['node', 'app', '3', '0.6'];
    var result = transform(arg);

    expect(result.isOK).not.to.be.ok;
  });

  it('命令行参数错误，同时使用逗号和空格分隔概率值', function(){
    var arg = ['node', 'app', '0.4,', '0.6'];
    var result = transform(arg);

    expect(result.isOK).not.to.be.ok;
  });

  it('命令行参数错误，概率数据少于两个', function(){
    var arg = ['node', 'app', '0.4'];
    var result = transform(arg);

    expect(result.isOK).not.to.be.ok;
  });
});

describe('validate 函数测试套件', function() {
  it('概率值合法', function() {
    var result = validate(0.3);
    expect(result.isOK).to.be.ok;
  });

  it('概率值合法，是特殊值 0', function() {
    var result = validate(0);
    expect(result.isOK).to.be.ok;
  });

  it('概率值合法，是特殊值 1', function() {
    var result = validate(1);
    expect(result.isOK).to.be.ok;
  });
  it('概率值非法，不是数字', function(){
    var result = validate('abc');
    expect(result.isOK).not.to.be.ok;
  });
  
  it('概率值非法，小于 0', function(){
    var result = validate(-3);
    expect(result.isOK).not.to.be.ok;
  });
  
  it('概率值非法，大于 1', function(){
    var result = validate(3);
    expect(result.isOK).not.to.be.ok;
  });
});

describe('sigma 函数测试套件', function() {
  it('概率空间封闭', function(){
    var p = [0.7, 0.2, 0.1];
    expect(sigma(p)).to.be.equal(1);
  });

  it('概率空间不封闭，小于 1', function(){
    var p = [0.337, 0.1];
    expect(sigma(p) < 1).to.be.ok;
    expect(sigma(p)).to.be.equal(0.44);
  });

  it('概率空间不封闭，大于 1', function(){
    var p = [0.8, 0.2, 0.333];
    expect(sigma(p) > 1).to.be.ok;
    expect(sigma(p)).to.be.equal(1.33);
  });
});

describe('h 函数测试套件', function() {
  it('信源等概率分布', function(){
    var p = [0.25, 0.25, 0.25, 0.25];
    expect(h(p)).to.be.equal(2);
  });

  it('信源不等概率分布', function(){
    var p = [0.1, 0.2, 0.3, 0.4];
    expect(h(p)).to.be.equal(1.8464393446710154);
  });
});

describe('roundFractional 函数测试套件', function() {
  it('保留小数点后 0 位，五入', function() {
    expect(roundFractional(3.62, 0)).to.be.equal(4);
  });

  it('保留小数点后 1 位，四舍', function() {
    expect(roundFractional(3.32, 1)).to.be.equal(3.3);
  });

  it('保留小数点后 2 位，五入', function() {
    expect(roundFractional(3.335, 2)).to.be.equal(3.34);
  });

  it('保留小数点后 3 位，四舍', function() {
    expect(roundFractional(20.4484, 3)).to.be.equal(20.448);
  });

  it('保留小数点后 4 位，五入', function() {
    expect(roundFractional(100.00001, 4)).to.be.equal(100);
  });
});
