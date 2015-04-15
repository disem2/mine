/**
 * Created by dmitriy on 14.04.15.
 */
$(function(){

    var field = {
        mines: [],
        size: $('tr').length,
        numbers: {
            n0: [],
            n1: [],
            n2: [],
            n3: [],
            n4: [],
            n5: [],
            n6: [],
            n7: [],
            n8: []
        },
        rows: $('tr'),
        getRandom: function(){
            return Math.floor(Math.random() * 9);
        },
        checkUnique: function(element, arr){
            var i = 0;
            for(i; i <=field.size; i++){
                if(arr[i] && element[0] == arr[i][0] && element[1] == arr[i][1]){
                    return false;
                }
            }
            return true;
        },
        setMines: function(){
            var i = 0, mine;
            while(field.mines.length < 10){
                mine = [field.getRandom(), field.getRandom()];
                if(field.checkUnique(mine, field.mines)){
                    field.mines.push(mine);
                }
            }
        },
        setNumbers: function(){
            var i = 0, j, max = field.size,
                k, l, kMax, lMax;
            for(i; i < 1; i++){
                j = 0;
                for(j; j < max; j++){

                    k = i == 0 ? i : (i - 1);
                    l = j == 0 ? j : (j - 1);
                    kMax = i > (max - 1) ? i : i + 2;
                    lMax = l > (max -1 ) ? l : l + 2;
                    //for(k; k < kMax; k++){
                    //    l = j - 1;
                    //    for(l; l < lMax; l++){
                    //        if(k == i && l == j){
                    //
                    //        } else if(k < 0)
                    //    }
                    //}
                    console.log("k: " + k + " " + "l: " + l + " " + "kMax: " + kMax + " " + "lMax: " + lMax);
                }
            }
        },
        drawElements: function(elements){
            var i = 0, max =  elements.length,
                x, y,
                row, td, position;
            for(i; i < max; i++){
                x = elements[i][0];
                y = elements[i][1];
                row = $(field.rows[y]);
                td = row.find('td');
                position = td[x];
                $(position).find('a').text('*');
            }
        }
    };
    field.setMines();
    field.drawElements(field.mines);
    field.setNumbers();
});
