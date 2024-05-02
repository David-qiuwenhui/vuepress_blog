---
title: Clean Code 案例
author: qiuwenhui
date: "2024-05"
---

# Clean Code 案例

## 一、使用过多的if/else Using Too Many Ifs
> 来源：https://dreith.com/blog/theres-such-a-thing-as-using-too-many-ifs/

结论：（1）使用`Lookup Table`将值表示为数据，简化逻辑；
（2）将比较逻辑的多个实例转换为数据。代码更具表现力；它将逻辑显示为操作。代码更具可测试性；逻辑被减少了。而且我们的比较更容易维护；它们被合并为纯数据。

### 案例一

我们将从用户输入中获取颜色，并需要将它们转换为一些预设的颜色代码来匹配，以便我们可以更改背景颜色。因此，我们将检查颜色名称字符串，并在匹配时设置颜色代码。

坏味道写法一：`if/else` 背负着大量重复逻辑比较 `colorName` 和重复赋值 `colorCode` 。

```js
const setBackgroundColor = (colorName) => {
    let colorCode = "";
    if (colorName === "blue") {
        colorCode = "#2196F3";
    } else if (colorName === "green") {
        colorCode = "#4CAF50";
    } else if (colorName === "orange") {
        colorCode = "#FF9800";
    } else if (colorName === "pink") {
        colorCode = "#E91E63";
    } else {
        colorCode = "#F44336";
    }
    document.body.style.backgroundColor = colorCode;
};
```

坏味道写法二：`switch`带有大量我们可以不需要的样板文件和重复代码

```js
const setBackgroundColor = (colorName) => {
    let colorCode = "";
    switch (colorName) {
        case "blue":
            colorCode = "#2196F3";
            break;
        case "green":
            colorCode = "#4CAF50";
            break;
        case "orange":
            colorCode = "#FF9800";
            break;
        case "pink":
            colorCode = "#E91E63";
            break;
        default:
            colorCode = "#f44336";
    }
    document.body.style.backgroundColor = colorCode;
};
```

#### 优化写法

方式：`Lookup Table` 查找表
目标：需要将十六进制颜色代码分配给颜色名称
做法：创建一个将颜色名称作为键、将颜色代码作为值的对象。然后可以使用 `object[key]` 通过颜色名称查找颜色代码。
我们需要一个默认值，因此如果没有找到键，则返回默认值的短三元数将在创建对象的默认部分时执行此操作。

> 优点：（1）代码量减少；（2）符合开闭原则，易于维护和拓展；（3）易于阅读

```js
const colorCodes = {
    blue: "#2196F3",
    green: "#4CAF50",
    orange: "#FF9800",
    pink: "#E91E63",
    default: "#F44336",
};

const setBackgroundColor = (colorName) => {
    document.body.style.backgroundColor = colorCodes[colorName]
        ? colorCodes[colorName]
        : colorCodes["default"];
};
```

### 案例二

我们需要将成绩百分比转换为对应的字母成绩。

坏味道写法一：`if/else` 从上到下检查成绩是否高于或等于匹配字母成绩所需的成绩

> 一遍又一遍地重复相同的逻辑运算。

```js
const getLetterGrade = (gradeAsPercent) => {
    if (gradeAsPercent >= 90) {
        return "A";
    } else if (gradeAsPercent >= 80) {
        return "B";
    } else if (gradeAsPercent >= 70) {
        return "C";
    } else if (gradeAsPercent >= 60) {
        return "D";
    } else {
        return "F";
    }
};
```

#### 优化写法

方式：将数据提取到一个数组中（以保留顺序）并将每个等级的可能性表示为一个对象。现在我们只需对对象进行一次 `>=` 比较，并找到数组中第一个匹配的对象。

```js
const gradeChart = [
    { minpercent: 90, letter: "A" },
    { minpercent: 80, letter: "B" },
    { minpercent: 70, letter: "C" },
    { minpercent: 60, letter: "D" },
    { minpercent: 0, letter: "F" },
];

const getLetterGrade = (gradeAsPercent) => {
    const grade = gradeChart.find(
        (grade) => gradeAsPercent >= grade.minpercent
    );

    return grade.letter;
};
```
