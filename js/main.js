/**
 * Created by dmitriy on 14.04.15.
 */
$(function(){
    init();


    function Game(w, h, mines) {

        this.mines = [];
        this.size = {
            w: w,
            h: h
        };
        this.minesQuantity = mines;
        this.numbers = [];
        this.empty = [];
        this.clicked = {};

        this.tmpOpen = [];
    }
    Game.prototype = {
        start: function() {
            this.setField();
            this.setMines();
            this.setNumbers();
            this.addClickListener();
        },
        setField: function() {

            var table, tr, td, a, body,
                i = 0, j = 0, horFieldsQuantity = this.size.w, vertFieldsQuantity = this.size.h;
            this.table = $('<table oncontextmenu="return false;"></table>');
            body = $('body');

            for(j; j < vertFieldsQuantity; j++) {
                tr = $('<tr></tr>');
                i = 0;
                for(i; i < horFieldsQuantity; i++) {
                    a = $('<a class="btn"></a>');
                    td = $('<td class="empty"><a class="fld"></a><a class="flag">&para;</a></td>');
                    a.appendTo(td);
                    td.appendTo(tr);
                }
                tr.appendTo(this.table);
            }
            this.table.appendTo(body);
        },
        getRandom: function(size){
            return Math.floor(Math.random() * size);
        },

        //todo rm quantity
        checkUnique: function(element, arr){
            var i = 0, quantity = arr.length || 0;
            for(i; i < quantity; i++){
                if(arr[i] && element.x == arr[i].x && element.y == arr[i].y){
                    return false;
                }
            }
            return true;
        },
        setMines: function(){
            var mine = {};
            while(this.mines.length < this.minesQuantity){
                mine = {
                    x: this.getRandom(this.size.w),
                    y: this.getRandom(this.size.h)
                };
                if(this.checkUnique(mine, this.mines)){
                    this.mines.push(mine);
                }
            }
            this.setElements(this.mines);
        },
        setNumbers: function(){
            var i, j, vertFieldsQuantity = this.size.h, horFieldsQuantity = this.size.w,
                minesInSiblings, n = 1, nLength;
            for(i = 0; i < vertFieldsQuantity; i++){
                for(j = 0; j < horFieldsQuantity; j++){
                    // todo rename countSiblingsMines, refactor, rename minesQuantity
                    minesInSiblings = this.countSiblingsMines(i, j);

                    if(minesInSiblings && !this.isMine(j, i)){

                        if(!this.numbers[minesInSiblings]) {
                            this.numbers[minesInSiblings] = [];
                        }
                        this.numbers[minesInSiblings].push({
                            x: j,
                            y: i,
                            opened: false
                        });
                    } else if(!minesInSiblings && !this.isMine(j, i)) {
                        this.empty.push({
                            x: j,
                            y: i,
                            checked: false
                        });
                    }
                }
            }
            nLength = this.numbers.length;
            for(n; n < nLength; n++){
                this.setElements(this.numbers[n], n);
            }
        },
        countSiblingsMines: function(i, j) {
            var k, l, vertSiblingsQuantity, horSiblingsQuantity, mines = 0;

            k = (i == 0) ? i : (i - 1);
            l = (j == 0) ? j : (j - 1);
            vertSiblingsQuantity = ( i > this.size.h - 2 ) ? i : i + 1;
            horSiblingsQuantity = ( j > this.size.w - 2 ) ? j : j + 1;

            for(k; k <= vertSiblingsQuantity; k++){
                l = (j == 0) ? j : (j - 1);
                for(l; l <= horSiblingsQuantity; l++){
                    if(k == i && l == j){

                    } else if (this.isMine(l, k)){
                        mines++;
                    }
                }
            }
            return mines;
        },
        isMine: function(x, y) {
            var i = 0, minesQuantity = this.minesQuantity,
                flag = false;
            for(i; i < minesQuantity; i++){
                if(this.mines[i].x == x && this.mines[i].y == y) {
                    flag = true;
                }
            }
            return flag;
        },
        setElements: function(elements, number){
            var i = 0, elementsQuantity =  elements.length,
                x, y,
                row, td, position,
                item = number || "*",
                fClass = number ? ("n" + number) : "mine" ;
            for(i; i < elementsQuantity; i++){
                x = elements[i].x;
                y = elements[i].y;
                row = $('tr')[y];
                td = $(row).find('td');
                position = td[x];
                $(position).removeClass('empty').addClass(fClass).find('a.fld').text(item);
            }
        },
        addClickListener: function() {
            var that = this;

            // todo delegate events
            $('table').on('mouseup', 'a', function(ev){
                var target = ev.target;
                ev.preventDefault();
                that.clicked.x = $(target).parents('td').index();
                that.clicked.y = $(target).parents('tr').index();


                if($(target).hasClass('btn')) {
                    if(ev.which == 1) {
                        // todo refactor
                        $(target).css('z-index', '0');

                        // todo reuse code, Luke
                        if(that.isMine(that.clicked.x, that.clicked.y)) {
                            alert('Game Over');
                            $('.mine').find('.btn').css('z-index', '0');
                            $('table').off();
                            // todo refactor
                        } else if(that.isInArray(that.clicked.x, that.clicked.y, that.empty)) {
                            that.checkSiblings(that.clicked);
                        }
                        else if(that.isNumber(that.clicked)){
                            that.setOpened(that.clicked);
                        }
                    } else if(ev.which == 3) {
                        $(target).parent().find('.flag').css('z-index', '20');
                    }
                } else if($(target).hasClass('flag')) {
                    if(ev.which == 3) {
                        $(target).css('z-index', '0');
                        $(target).parent().find('.btn').css('z-index', '10');
                    }

                }
                if(that.isVictory()) {
                    alert('YOU WIN!!!');
                    $('table').off();
                }

            });
        },
        isNumber: function(clicked) {
            var result = false;
            for(var i in this.numbers) {
                if(this.isInArray(clicked.x, clicked.y, this.numbers[i])) {
                    result = true;
                }
            }
            return result;
        },
        isInArray: function(x, y, arr) {
            var i = 0, elementQuantity = arr.length,
                result = false;

            for(i; i < elementQuantity; i++) {
                if(arr[i].x == x && arr[i].y == y) {
                    result = true;
                }
            }
            return result;
        },
        // todo copy this without recursion
        checkSiblings: function(el) {

            var i = 0, checkingElement, tmpPosition = null,
                current, cell, element;
            var siblings = [
                { x: -1, y: -1 },
                { x: 0, y: -1 },
                { x: 1, y: -1 },
                { x: -1, y: 0 },
                { x: 1, y: 0 },
                { x: -1, y: 1 },
                { x: 0, y: 1 },
                { x: 1, y: 1 }
            ];
            do {
                element = el;
                if(this.tmpOpen.length > 0) {
                    tmpPosition = this.tmpOpen.splice(0, 1);
                    element = tmpPosition[0]
                }
                this.setChecked(element, this.empty);

                for(i = 0; i < 8; i++) {
                    checkingElement = {
                        x: element.x + siblings[i].x,
                        y: element.y + siblings[i].y
                    };
                    if(this.checkBorders(checkingElement.x, checkingElement.y) && !this.isMine(checkingElement.x, checkingElement.y)) {
                        cell = $('tr')[checkingElement.y];
                        current = $(cell).find('td')[checkingElement.x];
                        $(current).find('.btn').css('z-index', '0');

                        if(this.isInArray(checkingElement.x, checkingElement.y,this.empty)) {
                            if(this.checkUnique(checkingElement, this.tmpOpen) && !this.isChecked(checkingElement)) {
                                this.setChecked(checkingElement, this.empty);
                                this.tmpOpen.push({
                                    x: checkingElement.x,
                                    y: checkingElement.y
                                });
                            }
                        } else if(this.isNumber(checkingElement)) {
                            this.setOpened(checkingElement);
                        }
                    }
                }

            } while(this.tmpOpen.length > 0);

        },
        checkBorders: function(x, y) {
            var result;
            result = x >= 0 && y >= 0 && x < this.size.w && y < this.size.h;
            return result;
        },
        setChecked: function(element, array) {
            for(var i in array) {
                if(array[i].x == element.x && array[i].y == element.y) {
                    array[i].checked = true;
                }
            }
        },
        isChecked: function(element) {
            var result = true;
            for(var i in this.empty) {
                if(this.empty[i].x == element.x && this.empty[i].y == element.y) {
                    result = this.empty[i].checked;
                }
            }
            return result;
        },
        setOpened: function (element) {
            console.log(element);
            var current = {};

            for(var i in this.numbers) {
                for(var j in this.numbers[i]) {
                    if(this.numbers[i][j].x == element.x && this.numbers[i][j].y == element.y) {
                        this.numbers[i][j].opened = true;
                    }
                }
            }
        },
        isVictory: function() {
            var numberQuantity = 0, winPoints = 0, result = false;
            for(var i in this.numbers) {
                numberQuantity += this.numbers[i].length;
            }

            for(var i in this.numbers) {
                for(var j in this.numbers[i]) {
                    if(this.numbers[i][j].opened == true) {
                        winPoints++;
                    }
                }
            }
            if(numberQuantity == winPoints){
                result = true;
            }
            return result;
        }
    };

    function init() {
        var sizeX = 0, sizeY = 0, mines = 0,
            currentGame;
        $('#complexity').on('click', function(ev){
            var target = ev.target,
                keys = {
                    'beginner': {x: 9, y: 9, mines: 10},
                    'medium': {x: 16, y: 16, mines: 40},
                    'expert': {x: 30, y: 16, mines: 99}
                };
            ev.preventDefault();

            currentGame = keys[$(target).attr('id')];
            var myGame = new Game(currentGame.x, currentGame.y, currentGame.mines);
            myGame.start();
            $('#complexity').off();
        });
        $('#new').on('click', function (ev) {
            ev.preventDefault();
            location.reload();
        })
    }

});