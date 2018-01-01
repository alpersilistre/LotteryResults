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
                        console.log(res.sonuclar);
                        let results = res.sonuclar;
                        let sevenNumbers = _.filter(results, (item) => { return item.haneSayisi === 7; });
                        let sixNumbers = _.filter(results, (item) => { return item.haneSayisi === 6; });
                        let fiveNumbers = _.filter(results, (item) => { return item.haneSayisi === 5; });
                        let fourNumbers = _.filter(results, (item) => { return item.haneSayisi === 4; });
                        let threeNumbers = _.filter(results, (item) => { return item.haneSayisi === 3; });
                        let twoNumbers = _.filter(results, (item) => { return item.haneSayisi === 2; });
                        let oneNumbers = _.filter(results, (item) => { return item.haneSayisi === 1; });

                        let resultText;
                        sevenNumbers.forEach(x => {
                            x.numaralar.forEach(y => {
                                if(Number(y) === ticketNumber) {
                                    resultText = `${ticketNumber} numaralı biletiniz ${x.ikramiye.format()} TL ikramiye kazandı.`;
                                    // console.log(resultText);
                                    $('#priceInfo').text(resultText);
                                    priceAlert.removeClass('hidden');
                                    return;
                                }
                            })
                        });

                        resultText = `${ticketNumber} numaralı biletinize ikramiye isabet etmemiştir.`;
                        $('#failInfo').text(resultText);
                        failAlert.removeClass('hidden');

                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
        }

        
    });

    $('#resultList').on('changed.bs.select', function (e) {
        let selectedItem = $(this);
        selectedDate = selectedItem.val();
        selectedDate === '0' ? dateAlert.removeClass('hidden') : dateAlert.addClass('hidden');

        console.log(selectedItem.val());
    });

});