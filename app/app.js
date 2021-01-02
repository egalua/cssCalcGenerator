/**
 * Класс обыкновенный дробей
 * @param {Number} num - числитель дроби
 * @param {Number} denom - знаменатель дроби
 * 
 * @returns {OrdinaryFractions} - обыкновенная дробь
 */
class OrdinaryFractions{
    constructor(num, denom=1){

        if(isNaN(+num)){
            throw(new Error('Введенный числитель не является числом'));
        }
        if(isNaN(+denom)){
            throw(new Error('Введенный знаменатель не является числом'));
        }
        if(+denom == 0){
            throw(new Error('Знаменатель должен быть отличен от нуля'));
        }
        
        this.numerator = +num;

        if((+denom) < 0){
            this.numerator = -this.numerator;
        } 
        this.denominator = Math.abs(+denom);

        if(!Number.isInteger(this.numerator) || !Number.isInteger(this.denominator)){
            throw(new Error('Числитель и знаменатель должны быть целыми числами'));
        }

        this.reduce(); // сокращение дроби
    }
    /**
     * Сложение обыкновенных дробей
     * складывает текущую дробь со своим аргументом
     * @param {OrdinaryFractions} frac - дробь-слагаемое
     * @returns {OrdinaryFractions} возвращает this
     */
    add(frac){ // this += frac  
        let num, lcm;

        if(Number.isInteger(+frac)){
            num = this.denominator * frac + this.numerator;
            lcm = this.denominator;
        } else if(frac instanceof OrdinaryFractions){
            // lcm - это НОК
            lcm = frac.denominator * this.denominator / this._getGCF(frac.denominator, this.denominator);
            num = (lcm/this.denominator)*this.numerator + (lcm/frac.denominator)*frac.numerator;
        } else {
            throw(new Error('Аргументом функции должно быть целое число или дробь'));
        }
        
        this.numerator = num;
        this.denominator = lcm;
        
        return this.reduce();
    }
    /**
     * Вычитает из текущей дроби дробь-аргумент
     * @param {OrdinaryFractions} frac дробь-вычитаемое
     * @returns {OrdinaryFractions} возвращает this
     */ 
    sub(frac){ // this -= frac
        let num, lcm;

        if(Number.isInteger(frac)){
            num = frac*this.denominator - this.numerator;
            lcm = this.denominator;
        } else if(frac instanceof OrdinaryFractions){
            lcm = frac.denominator * this.denominator / this._getGCF(frac.denominator, this.denominator);
            num = (lcm/this.denominator)*this.numerator - (lcm/frac.denominator)*frac.numerator;
        } else {
            throw(new Error('Аргументом функции должно быть целое число или дробь'));
        }

        this.numerator = num;
        this.denominator = lcm;

        this.reduce();

        return this;
    }
    /**
     * Умножает текущую дробь на свой аргумент
     * @param {OrdinaryFractions} frac правильная дробь - множитель
     * @returns {OrdinaryFractions} возвращает this
     */
    mul(frac){ // this *= frac
        let num = 1, denom = 1;
        if(Number.isInteger(frac)){
            num = frac * this.numerator;
            denom = this.denominator;
            
        } else if(frac instanceof OrdinaryFractions) {
            num = this.numerator * frac.numerator;
            denom = this.denominator * frac.denominator;
        } else {
            throw(new Error('Аргументом функции должно быть целое число или дробь'));
        }
        
        this.numerator = num;
        this.denominator = denom;

        return this.reduce();
    }
    /**
     * Делит текущую дробь на свой аргумент
     * @param {OrdinaryFractions} frac дробь - делитель
     * @returns {OrdinaryFractions} возвращает this
     */
    div(frac){ // this /= frac
        if(Number.isInteger(frac)){
            if(frac == 0) throw(new Error('Попытка деления на ноль'));
            
            return this.mul(new OrdinaryFractions(1,frac));
        }
        
        if(frac instanceof OrdinaryFractions){
            if(frac.numerator == 0) throw(new Error("Попытка деления на ноль"));
            let inv = new OrdinaryFractions(frac.denominator, frac.numerator);
    
            return this.mul(inv);
        }
        
        throw(new Error('Аргументом функции должно быть целое число или дробь'));
        
    }
    /**
     * Переворачивает дробь
     * @returns {OrdinaryFractions} возвращает this (обратная дробь)
     */
    revers(){ // this = 1/this
        if(this.numerator == 0){
            throw(new Error('Не существунт обратной дроби так как числитель равен нулю'));
        }

        let num = this.numerator;
        this.numerator = this.denominator;
        this.denominator = num;

        return this.reduce();
    }
    /**
     * Сравнивает текущую дробь со своим аргументом на равентво
     * @param {OrdinaryFractions} frac дробь для сравнения
     * @returns {Boolean} результат сравнения на равенство
     */
    isEqual(frac){ // this == frac
        let save = {num: this.numerator, denom: this.denominator};

        try{
            if(Number.isInteger(frac)){
                let res = (this.sub(new OrdinaryFractions(frac))).numerator == 0;
                
                this.numerator = save.num;
                this.denominator = save.denom;
                
                return res;
            }
            let res = this.sub(frac).numerator == 0;
            this.numerator = save.num;
            this.denominator = save.denom;
            
            return res;

        } catch(e) {
            throw(new Error('Операция сравнения не может быть выполнена так как произошла ошибка: '+ e.message));
        }
        
    }
    /**
     * "Строго больше"
     * Сравнивает текущую дробь со своим аргументом
     * @param {OrdinaryFractions} frac дробь для сравнения
     * @returns {Boolean} если текущая дробь строго больше аргумента, то возвращает true
     */
    isGreaterThan(frac){ // this>frac
        try{
            let save = {num: this.numerator, denom: this.denominator};
            let res = this.sub(frac).numerator > 0;
            
            this.numerator = save.num;
            this.denominator = save.denom;

            return res;

        } catch(e) {
            throw(new Error('Операция сравнения не может быть выполнена так как произошла ошибка: '+ e.message));
        }
    }
    /**
     * "Строго меньше"
     * Сравнивает текущую дробь со своим аргументом
     * @param {OrdinaryFractions} frac дробь для сравнения
     * @returns {Boolean} если текущая дробь строго меньше аргумента, то возвращает true
     */
    isLessThan(frac){ // this<frac
        try{
            let num = this.numerator;
            let denom = this.denominator;
            let res = this.sub(frac).numerator < 0;
            
            this.numerator = num;
            this.denominator = denom;

            return res;

        } catch(e) {
            throw(new Error('Операция сравнения не может быть выполнена так как произошла ошибка: '+ e.message));
        }
    }
    /**
     * "Больше или равно"
     * Сравнивает текущую дробь со своим аргументом
     * @param {OrdinaryFractions} frac  дробь для сравнения
     * @returns {Boolean} если текущая дробь больше или равна аргументу, то возвращает true
     */
    isMoreOrEqual(frac){ // this >= frac
        try{
            let save = {num: this.numerator, denom: this.denominator};
            let res = this.sub(frac).numerator >= 0;
            
            this.numerator = save.num;
            this.denominator = save.denom;            
            
            return res;

        } catch(e) {
            throw(new Error('Операция сравнения не может быть выполнена так как произошла ошибка: '+ e.message));
        }
    }
    /**
     * "Меньше или равно"
     * Сравнивает текущую дробь со своим аргументом
     * @param {OrdinaryFractions} frac дробь для сравнения
     * @returns {Boolean} если текущая дробь меньше или равна аргументу, то возвращает true
     */
    isLessOrEqual(frac){ // this <= frac
        try{
            let save = {num: this.numerator, denom: this.denominator};
            let res = this.sub(frac).numerator <= 0;
            
            this.numerator = save.num;
            this.denominator = save.denom;

            return res;

        } catch(e) {
            throw(new Error('Операция сравнения не может быть выполнена так как произошла ошибка: '+ e.message));
        }
    }
    /**
     * Сокращает текущую дробь
     * @returns {OrdinaryFractions} возвращает this
     */
    reduce(){ // сокращение дроби
        // НОД
        let gcf = this._getGCF(this.numerator, this.denominator);
        this.numerator /= gcf;
        this.denominator /= gcf;
        
        if(this.denominator < 0){
            this.numerator = - this.numerator;
        }
        
        this.denominator = Math.abs(this.denominator);

        if(this.numerator == 0){
            this.numerator = Math.abs(this.numerator);
        }
        
        return this;
    }
    /**
     * Получение модуля дроби
     * @returns {OrdinaryFractions} возвращает клон дроби взятый по модулю
     */
    getAbs(){
        return new OrdinaryFractions(Math.abs(this.numerator), this.denominator);
    }
    /**
     * Получение клона дроби
     * @returns {OrdinaryFractions} возвращает клон дроби
     */
    getClone(){
        return (new OrdinaryFractions(1)).mul(this);
    }
    /**
     * Получить наибольший общий делитель
     * @param {Number} a 
     * @param {Number} b 
     * @returns {Number} НОД
     */
    _getGCF(a, b){ // НОД
        a = Math.abs(a);
        b = Math.abs(b);

        while(a!=0 && b!=0){
            a>b ? a%=b: b%=a;
        }
        return a+b;
    }
    toString(){
        return this.numerator + '/' + this.denominator;
    }
    valueOf(){
        return this.numerator + '/' + this.denominator;
    }
}


// вычисление по формуле F(vw) = 100vw * (v0 - v1) / (vpW0 - vpW1) + [v1* (vpW0 - vpW1) - vpW1*(v0 - v1)] /(vpW0 - vpW1)
// Model
class CalcModel{
    /**
     * Создает модель для создания формулы зависимости размера от ширины экрана
     * @param {OrdinaryFractions} v0 начальное значение размера при ширине экрана vpW0
     * @param {OrdinaryFractions} v1 конечное значение размера при ширине экрана vpW1
     * @param {OrdinaryFractions} vpW0 начальное значение ширины экрана
     * @param {OrdinaryFractions} vpW1 конечное значение ширины экрана
     */
    constructor(v0, v1, vpW0, vpW1){
        // формула в текстовом виде
        this.formula = "F(vw) = 100vw * (v0 - v1) / (vpW0 - vpW1) + [v1* (vpW0 - vpW1) - vpW1*(v0 - v1)] /(vpW0 - vpW1)"
        // значение v0
        this.startVal = (v0 === undefined) ? new OrdinaryFractions(1, 1): v0;
        // значение v1
        this.endVal =  (v1 === undefined) ? new OrdinaryFractions(1, 1): v1;
        // значение vpW0
        this.startVpWidth = (vpW0 === undefined) ? new OrdinaryFractions(1, 1): vpW0;
        // значение vpW1
        this.endVpWidth = (vpW1 === undefined) ? new OrdinaryFractions(1, 1): vpW1;
        // контроллер, выводит результаты расчетов пользователю
        this.controller = new CalcController();

    }
    //--- start метод ---
    /**
     * Запускает модель, выполняет расчеты, передаёт управление контроллеру
     * @param {OrdinaryFractions} v0 начальное значение размера
     * @param {OrdinaryFractions} v1 конечное значение размера
     * @param {OrdinaryFractions} vpW0 начальное значение ширины экрана
     * @param {OrdinaryFractions} vpW1 конечное значение ширины экрана
     */
    start(v0, v1, vpW0, vpW1){
        this.startVal = v0;
        this.endVal = v1;
        this.startVpWidth = vpW0;
        this.endVpWidth = vpW1;

        const result = this.calc();

        this.controller.start(result);
    }

    // --- set методы ---
    /**
     * Устанавливает начальное значение для начальной ширины экрана
     * @param {OrdinaryFractions} v0 начальное значение размера при начальной ширине экрана
     */
    setStartVal(v0){
        this.startVal = v0;
    }
    /**
     * Устанавливает конечное значение для конечной ширины экрана
     * @param {OrdinaryFractions} v1 конечное значение размера при конечное ширине экрана
     */
    setEndVal(v1){
        this.endVal = v1;
    }
    /**
     * Устанавливает начальное значенте ширины экрана
     * @param {OrdinaryFractions} vpW0 начальное значение ширины экрана
     */
    setStartVpWidth(vpW0){
        this.startVpWidth = vpW0;
    }
    /**
     * Устанавливает конечное значение ширины экрана
     * @param {OrdinaryFractions} vpW1 конечное значение ширины экрана
     */
    setEndVpWidth(vpW1){
        this.endVpWidth = vpW1;
    }

    // --- calc методы ---

    /**
     * Возвращает конечную формулу, пригодную для вставки в css
     * @returns строка вида "calc( формула )"
     */
    calc(){
        const px = this.calcPxPart();
        const vw = this.calcVwPart();

        return 'calc(' + vw + px + ')';
    }
    /**
     * Возвращает "px" часть формулы
     * @returns строка вида " + (___px / ___)"
     */
    calcPxPart(){
        //  [v1* (vpW0 - vpW1) - vpW1*(v0 - v1)] /(vpW0 - vpW1)
        const v0 = this.startVal.getClone();
        const v1 = this.endVal.getClone();
        const vpW0 = this.startVpWidth.getClone();
        const vpW1 = this.endVpWidth.getClone();

        const dW = vpW0.getClone().sub(vpW1);
        const dv = v0.getClone().sub(v1);

        v1.mul(dW);
        vpW1.mul(dv);
        v1.sub(vpW1);
        v1.div(dW);
        
        if(v1.numerator >=0 ){
            return ' + (' + v1.numerator + 'px' + ' / ' + v1.denominator + ')';
        }
            return ' - (' + v1.getAbs().numerator + 'px' + ' / ' + v1.denominator + ')';
    }
    /**
     * Возвращает vw часть формулы
     * @returns строка вида "100vw * (__ / __)"
     */
    calcVwPart(){
        const v0 = this.startVal.getClone();
        const v1 = this.endVal.getClone();
        const vpW0 = this.startVpWidth.getClone();
        const vpW1 = this.endVpWidth.getClone();
        // 100vw * (v0 - v1) / (vpW0 - vpW1)

        v0.sub(v1);
        vpW0.sub(vpW1);
        v0.div(vpW0);

        if(v0.denominator < 0){
            return '100vw * ( 0 - ' + v0.getAbs().numerator + ' / ' + v0.denominator +  ')';
        }
        return '100vw * ( ' + v0.numerator + ' / ' + v0.denominator + ')';

    }

}
// обработчики кнопок, проверка введенных данных, преобразование к нужному для Model формату
// View
class CalcView{
    constructor(cssBoxId){
        this.cssClasses = {
            inputs: 'input__val',
            startVal: 'input__val-v0',
            endVal: 'input__val-v1',
            startVpW: 'input__val-vpW0',
            endVpW: 'input__val-vpW1',
            result: 'output__val',
            calcButton: 'output__key',
            copyButton: 'output__copy-btn',
            clearButton: "output__clear-btn"
        };
        // модель, формирует выражения calc()
        this.model = new CalcModel();
        this.box = document.querySelector('#' + cssBoxId);

        this.setHandlers();

    }
    // --- parse методы ---
    /**
     * Преобразует строку ввода в обыкновенную дробь
     * @param {String} str строка ввода, которую нужно преобразовать в обыкновенную дробь
     * @returns дробь OrdinaryFractions или null
     */
    parseFraction(str){
        let inputComponents = str.split('/');
        let nominator = parseInt(inputComponents[0]);
        let denominator = parseInt( (inputComponents[1] === undefined ? 1: inputComponents[1]) );

        if(isNaN(nominator) || isNaN(denominator) || (denominator == 0)){
            return null
        }
        
        return new OrdinaryFractions(nominator, denominator);
    }
    // --- get методы ---
    /**
     * Возвращает начальное значение размеров, взятое из формы ввода или null
     * @returns дробь OrdinaryFractions или null
     */
    getStartValue(){
        const field = this.box.querySelector('.' + this.cssClasses.startVal);
        // исходная строка
        let inputText = field.innerHTML;
     
        return this.parseFraction(inputText);
    }
    /**
     * Возвращает конечное значение размеров, взятое из формы ввода или null
     * @returns дробь OrdinaryFractions или null
     */
    getEndValue(){
        const field = this.box.querySelector('.' + this.cssClasses.endVal);
        // исходная строка
        let inputText = field.innerHTML;

        return this.parseFraction(inputText);
    }
    /**
     * Возвращает начальное значение ширины экрана, взятое из формы ввода или null
     * @returns дробь OrdinaryFractions или null
     */
    getStartVpW(){
        const field = this.box.querySelector('.' + this.cssClasses.startVpW);
        // исходная строка
        let inputText = field.innerHTML;

        return this.parseFraction(inputText);
    }
    getEndVpW(){
        const field = this.box.querySelector('.' + this.cssClasses.endVpW);
        // исходная строка
        let inputText = field.innerHTML;

        return this.parseFraction(inputText);
    }
    // --- handlers ---
    setHandlers(){
        const calcHandler = this.calcHandler.bind(this);
        const copyHandler = this.copyHandler.bind(this);
        const clearHandler = this.clearHandler.bind(this);

        this.box.addEventListener('click', calcHandler);
        this.box.addEventListener('keydown', calcHandler);

        this.box.addEventListener('click', copyHandler);
        this.box.addEventListener('keydown', copyHandler);

        this.box.addEventListener('click', clearHandler);
        this.box.addEventListener('keydown', clearHandler);
    }
    /**
     * Обработчик клика по кнопке calc
     * @param {Event} ev объект события
     */
    calcHandler(ev){
        let target = ev.target;
        target = target.closest('.' + this.cssClasses.calcButton);

        if(target !== null){
            const v0 = this.getStartValue();
            const v1 = this.getEndValue();
            const vpW0 = this.getStartVpW();
            const vpW1 = this.getEndVpW();

            if( v0!==null && v1!==null && vpW0!==null && vpW1!==null){
                this.model.start(v0, v1, vpW0, vpW1);
            }
        }
    }
    /**
     * Копирует результат в буффер обмена
     * @param {Event} ev объект события
     */
    copyHandler(ev){
        let target = ev.target;
        target = target.closest('.' + this.cssClasses.copyButton);

        if(target !== null){
            const result = this.box.querySelector('.' + this.cssClasses.result);
            window.navigator.clipboard.writeText(result.innerHTML);
        }
    }
    /**
     * Очищает поля формы ввода
     * @param {Event} ev объект события
     */
    clearHandler(ev){
        let target = ev.target;
        target = target.closest('.' + this.cssClasses.clearButton);
        
        

        if(target !== null){
            const inputBloks = this.box.querySelectorAll('.' + this.cssClasses.inputs); 
            const output = this.box.querySelector('.' + this.cssClasses.result);
            for(let i = 0; i < inputBloks.length; i++){
                inputBloks[i].innerHTML = '';
            }
            output.innerHTML = '';
        }
    }

}

// вывод результатов
// Controller
class CalcController{
    constructor(boxId = 'calc'){
        this.cssClasses = {
            output: 'output__val'
        };
        this.box = document.querySelector('#' + boxId);
        this.output = this.box.querySelector('.' + this.cssClasses.output);
    }
    /**
     * Выводит результат пользователю
     * @param {String} res строка с результатом работы модели
     */
    start(res){
        this.output.innerHTML = res;
    }
}



const calc = new CalcView('calc');