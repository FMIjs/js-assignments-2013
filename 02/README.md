#Задача 2
##Snooper

Реализирайте `Object.snoop`, който да позволява да "слухтите" за опити за достъп до определени полета на даден обект.

Функцията трябва да приема обект, име на поле(property) като стринг и функция. При всеки опит за задаване на нова стойност на даденото поле на обекта подадената функция трябва да се извиква с аргумент новата стойност, която се опитваме да зададем. Ако функцията върне `true`(или нещо, което е truthy) зададената стойност да се записва наистина. Съответно ако върне `false`(нещо, което е falsy):

```javascript
    > var pesho = {name: 'Pesho', age: 23};
    > Object.snoop(pesho, 'age', function (value) { return value < 20; });
    > pesho.age
    23
    > pesho.age = 18;
    > pesho.age
    18
    > pesho.age = 25;
    pesho.age
    18
```

`Object.snoop` трябва да работи както със съществуващи, така и с нови полета за подадения обект:

```javascript
    > var pesho = {name: 'Pesho', age: 23};
    > Object.snoop(pesho, 'faculty_number', function (value) { 
        console.log('Setting faculty number for Pesho to ' + value);
        return /^\d{4,}$/.test(value);
    });

    > pesho.faculty_number
    undefined
    > pesho.faculty_number = '666';
    Setting faculty number for Pesho to 666
    > pesho.faculty_number
    undefined

    > pesho.faculty_number = '0666';
    Setting faculty number for Pesho to 0666
    > pesho.faculty_number
    '0666'
```

**NB!** `Object.snoop` трябва да променя *само подадения обект*, не прототипа му и не конструктора му.

Извикванията на `Object.snoop` трябва да могат да се "наслагват", позволявайки налагането на няколко независими ограничения върху полетата на обекта.

```javascript
    > var pesho = {name: 'Pesho', age: 23};
    > Object.snoop(pesho, 'age', function (value) { return value < 20; });
    > pesho.age = 25;
    > pesho.age
    23
    > pesho.age = 13;
    > pesho.age
    13
    > Object.snoop(pesho, 'age', function (value) { return value > 15; });
    > pesho.age = 14
    > pesho.age
    13
    > pesho.age = 17
    pesho.age
    17
```

Ако `Object.snoop` бъде извикано за accessor descriptor, то присвояването и дстъпването на стойност трябва да става чрез оригиналните get и set на този дескриптор.

Ако извикваме `Object.snoop` за дескриптор, който вече е дефиниран трябва да се запазва `enumerable` флага.
