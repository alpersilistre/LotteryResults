$(document).ready(() => {

    Number.prototype.format = function(n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    };

    let selectedDate = undefined;
    let selectedNumber = $('#ticketNumber');
    let dateAlert = $('#dateAlert');
    let priceAlert = $('#priceAlert');
    let failAlert = $('#failAlert');

    $('.selectpicker').selectpicker({
        style: 'btn-info',
        size: 4
    });     

    $('#submitButton').click(function(e) {
        e.preventDefault();
        
        if(selectedDate === undefined || selectedDate === '0') {
            $('#alertError').text('Lütfen bir tarih seçiniz');
            dateAlert.removeClass('hidden');
        } else {
            dateAlert.addClass('hidden');
            if(selectedNumber.val() === '') {
                $('#alertError').text('Lütfen bilet numarası giriniz');
                dateAlert.removeClass('hidden');
            } else {
                let ticketNumber = Number(selectedNumber.val());
                $.ajax({
                    type: 'GET',
                    url: "/piyango",
                    dataType: 'json',
                    data: { "selectedDate": selectedDate },
                    success: function(res) {
                        let numbersArray = [];
                        console.log(res.sonuclar);
                        let results = res.sonuclar;
                        numbersArray = arrangeNumbers(results);
                        let resultText;
                        for(let i = 0; i < numbersArray.length; i++){
                            let arr = numbersArray[i];
                            for(let j = 0; j < arr.length; j++){
                                let numbers = arr[j].numaralar;
                                for(let k = 0; k < numbers.length; k++){
                                    if(results[0].haneSayisi === 7) {
                                        let subtractNumber = 7 - arr[j].haneSayisi;
                                        let ticket = ticketNumber.toString().substring(subtractNumber);
                                        if(Number(numbers[k]) === Number(ticket)) {
                                            resultText = `${ticketNumber} numaralı biletiniz ${arr[j].ikramiye.format()} TL ikramiye kazandı.`;
                                            $('#priceInfo').text(resultText);
                                            priceAlert.removeClass('hidden');
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                        resultText = `${ticketNumber} numaralı biletinize ikramiye isabet etmemiştir.`;
                        $('#failInfo').text(resultText);
                        failAlert.removeClass('hidden');
                        // numbersArray.forEach(arr => {
                        //     arr.forEach(x => {
                        //         x.numaralar.forEach(y => {
                        //             if(results[0].haneSayisi === 7) {
                        //                 let subtractNumber = 7 - x.haneSayisi;
                        //                 let ticket = ticketNumber.toString().substring(subtractNumber);
                        //                 if(Number(y) === Number(ticket)) {
                        //                     resultText = `${ticketNumber} numaralı biletiniz ${x.ikramiye.format()} TL ikramiye kazandı.`;
                        //                     // console.log(resultText);
                        //                     $('#priceInfo').text(resultText);
                        //                     priceAlert.removeClass('hidden');
                        //                     break;
                        //                 }
                        //             }                                    
                        //         })
                        //     });
                        // });
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
        }

        
    });

    function arrangeNumbers(results) {
        let numbersArray = [];
        let sevenNumbers = _.filter(results, (item) => { return item.haneSayisi === 7; });
        numbersArray.push(sevenNumbers);
        let sixNumbers = _.filter(results, (item) => { return item.haneSayisi === 6; });
        numbersArray.push(sixNumbers);
        let fiveNumbers = _.filter(results, (item) => { return item.haneSayisi === 5; });
        numbersArray.push(fiveNumbers);
        let fourNumbers = _.filter(results, (item) => { return item.haneSayisi === 4; });
        numbersArray.push(fourNumbers);
        let threeNumbers = _.filter(results, (item) => { return item.haneSayisi === 3; });
        numbersArray.push(threeNumbers);
        let twoNumbers = _.filter(results, (item) => { return item.haneSayisi === 2; });
        numbersArray.push(twoNumbers);
        let oneNumbers = _.filter(results, (item) => { return item.haneSayisi === 1; });
        numbersArray.push(oneNumbers);

        return numbersArray;
    }

    $('#resultList').on('changed.bs.select', function (e) {
        let selectedItem = $(this);
        selectedDate = selectedItem.val();
        selectedDate === '0' ? dateAlert.removeClass('hidden') : dateAlert.addClass('hidden');

        console.log(selectedItem.val());
    });

});